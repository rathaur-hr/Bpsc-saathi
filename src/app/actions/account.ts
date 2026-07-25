"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession, verifyPassword, destroySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateNotificationsAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const emailNotifications = formData.get("emailNotifications") === "on";

  await prisma.user.update({
    where: { id: session.userId },
    data: { emailNotifications },
  });

  revalidatePath("/settings");
}

export async function deleteAccountAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const confirmText = String(formData.get("confirmText") ?? "");
  const password = String(formData.get("password") ?? "");

  if (confirmText !== "DELETE") {
    redirect("/settings?error=" + encodeURIComponent("Please type DELETE exactly to confirm."));
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect("/settings?error=" + encodeURIComponent("Incorrect password."));
  }

  // Cascading relations (tasks, mock attempts, syllabus progress, bookmarks,
  // reminder log) are removed automatically via onDelete: Cascade in the schema.
  // otp_verifications isn't a foreign-key relation (by design - see schema
  // comment), so clean it up explicitly.
  await prisma.otpVerification.deleteMany({ where: { email: user.email } });
  await prisma.user.delete({ where: { id: session.userId } });
  await destroySession();

  redirect("/?deleted=1");
}
