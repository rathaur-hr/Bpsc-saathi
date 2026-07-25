"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  hashPassword, verifyPassword, createSession, destroySession,
  generateOtp, isDisposableEmail,
} from "@/lib/auth";
import { sendOtpEmail } from "@/lib/mailer";

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

function err(base: string, message: string): never {
  redirect(`${base}?error=${encodeURIComponent(message)}`);
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (name.length < 2) err("/register", "Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err("/register", "Please enter a valid email address.");
  if (password.length < 6) err("/register", "Password must be at least 6 characters.");
  if (password !== confirm) err("/register", "Passwords do not match.");
  if (isDisposableEmail(email)) err("/register", "Disposable email addresses are not allowed.");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.isVerified) err("/register", "An account with this email already exists. Please login instead.");

  const passwordHash = await hashPassword(password);

  if (existing) {
    await prisma.user.update({ where: { email }, data: { name, passwordHash } });
  } else {
    await prisma.user.create({ data: { name, email, passwordHash, isVerified: false } });
  }

  const otp = generateOtp();
  await prisma.otpVerification.create({
    data: {
      email, otp, purpose: "REGISTER",
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });

  await sendOtpEmail(email, name, otp, "register");

  const cookieStore = await cookies();
  cookieStore.set("pending_email", email, { httpOnly: true, path: "/", maxAge: 600 });
  cookieStore.set("pending_name", name, { httpOnly: true, path: "/", maxAge: 600 });

  redirect("/verify-otp");
}

export async function verifyOtpAction(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;
  if (!email) redirect("/register");

  const enteredOtp = String(formData.get("otp") ?? "").trim();

  const record = await prisma.otpVerification.findFirst({
    where: { email, purpose: "REGISTER" },
    orderBy: { createdAt: "desc" },
  });

  if (!record) err("/verify-otp", "No OTP request found. Please register again.");
  if (record.attempts >= OTP_MAX_ATTEMPTS) err("/verify-otp", "Too many incorrect attempts. Please request a new OTP.");
  if (record.expiresAt.getTime() < Date.now()) err("/verify-otp", "This OTP has expired. Please request a new one.");
  if (enteredOtp !== record.otp) {
    await prisma.otpVerification.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    err("/verify-otp", "Incorrect OTP. Please try again.");
  }

  await prisma.user.update({ where: { email }, data: { isVerified: true } });
  await prisma.otpVerification.deleteMany({ where: { email, purpose: "REGISTER" } });

  cookieStore.delete("pending_email");
  cookieStore.delete("pending_name");

  redirect("/verify-otp?success=1");
}

export async function resendOtpAction() {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;
  const name = cookieStore.get("pending_name")?.value ?? "";
  if (!email) redirect("/register");

  const last = await prisma.otpVerification.findFirst({
    where: { email, purpose: "REGISTER" },
    orderBy: { createdAt: "desc" },
  });

  if (last && Date.now() - last.createdAt.getTime() < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    err("/verify-otp", "Please wait a bit before requesting another OTP.");
  }

  const otp = generateOtp();
  await prisma.otpVerification.create({
    data: { email, otp, purpose: "REGISTER", expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000) },
  });
  await sendOtpEmail(email, name, otp, "register");

  redirect("/verify-otp?resent=1");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    err("/login", "Invalid email or password.");
  }

  if (!user.isVerified) {
    const cookieStore = await cookies();
    cookieStore.set("pending_email", email, { httpOnly: true, path: "/", maxAge: 600 });
    cookieStore.set("pending_name", user.name, { httpOnly: true, path: "/", maxAge: 600 });
    redirect("/verify-otp");
  }

  await createSession({ userId: user.id, name: user.name, email: user.email });

  redirect(user.onboardingCompleted ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.isVerified) {
    const otp = generateOtp();
    await prisma.otpVerification.create({
      data: { email, otp, purpose: "RESET_PASSWORD", expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000) },
    });
    await sendOtpEmail(email, user.name, otp, "reset_password");

    const cookieStore = await cookies();
    cookieStore.set("reset_email", email, { httpOnly: true, path: "/", maxAge: 600 });
  }

  // Always show the same outcome, whether or not the account exists,
  // so this endpoint can't be used to discover registered emails.
  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get("reset_email")?.value;
  if (!email) redirect("/forgot-password");

  const otp = String(formData.get("otp") ?? "").trim();
  const newPassword = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (newPassword.length < 6) err("/reset-password", "Password must be at least 6 characters.");
  if (newPassword !== confirm) err("/reset-password", "Passwords do not match.");

  const record = await prisma.otpVerification.findFirst({
    where: { email, purpose: "RESET_PASSWORD" },
    orderBy: { createdAt: "desc" },
  });

  if (!record) err("/reset-password", "No reset request found. Please start again.");
  if (record.attempts >= OTP_MAX_ATTEMPTS) err("/reset-password", "Too many incorrect attempts. Please request a new OTP.");
  if (record.expiresAt.getTime() < Date.now()) err("/reset-password", "This OTP has expired. Please request a new one.");
  if (otp !== record.otp) {
    await prisma.otpVerification.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    err("/reset-password", "Incorrect OTP.");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { email }, data: { passwordHash } });
  await prisma.otpVerification.deleteMany({ where: { email, purpose: "RESET_PASSWORD" } });

  cookieStore.delete("reset_email");

  redirect("/reset-password?success=1");
}
