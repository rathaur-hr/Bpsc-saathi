import nodemailer from "nodemailer";

const SITE_NAME = "BPSC Saathi";
const SITE_OWNER = "Harshit Rathaur";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false, // STARTTLS on 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function emailShell(bodyHtml: string): string {
  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(90deg,#0f172a,#0f766e);padding:20px 28px">
        <h2 style="color:#fff;margin:0;font-size:20px">📘 ${SITE_NAME}</h2>
      </div>
      <div style="padding:28px">${bodyHtml}</div>
      <div style="background:#f1f5f9;padding:14px 28px;color:#64748b;font-size:12px">
        &copy; ${new Date().getFullYear()} ${SITE_NAME} &middot; Owned by ${SITE_OWNER}
      </div>
    </div>`;
}

export async function sendOtpEmail(toEmail: string, toName: string, otp: string, purpose: "register" | "reset_password"): Promise<boolean> {
  const heading = purpose === "register" ? "Verify your email" : "Reset your password";
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${SITE_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: toEmail,
      subject: `${heading} - ${SITE_NAME}`,
      html: emailShell(`
        <p style="margin-top:0">Hi ${toName},</p>
        <p>${purpose === "register" ? "Your One-Time Password (OTP) is:" : "Use this OTP to reset your password:"}</p>
        <p style="font-size:30px;font-weight:bold;letter-spacing:6px;color:#0f766e;background:#f1f5f9;padding:14px 0;text-align:center;border-radius:10px;margin:16px 0">${otp}</p>
        <p style="color:#475569">This code is valid for 10 minutes. Do not share it with anyone.</p>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("OTP email failed:", err);
    return false;
  }
}

export async function sendTaskReminderEmail(
  toEmail: string,
  toName: string,
  tasks: { title: string; priority: string; dueDate: Date | null }[]
): Promise<boolean> {
  try {
    const transporter = getTransporter();
    const rows = tasks
      .map(
        (t) =>
          `<li style="margin-bottom:6px"><strong>${t.title}</strong> — ${
            t.dueDate ? t.dueDate.toISOString().split("T")[0] : "No due date"
          } (${t.priority} priority)</li>`
      )
      .join("");

    await transporter.sendMail({
      from: `"${SITE_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: toEmail,
      subject: `Tasks due soon - ${SITE_NAME}`,
      html: emailShell(`
        <p style="margin-top:0">Hi ${toName},</p>
        <p>Here are your pending study tasks:</p>
        <ul style="padding-left:18px;color:#334155">${rows}</ul>
        <p style="margin-top:20px"><a href="${process.env.NEXT_PUBLIC_SITE_URL}/planner" style="background:#0d9488;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Open Planner</a></p>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">You can turn these emails off anytime in Settings.</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("Reminder email failed:", err);
    return false;
  }
}
