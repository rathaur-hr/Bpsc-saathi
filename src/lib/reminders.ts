import { prisma } from "@/lib/db";
import { sendTaskReminderEmail } from "@/lib/mailer";

/**
 * Sends a once-daily "tasks due soon" digest email. Called from the
 * dashboard page on every visit; the reminder_logs table gates it so
 * it only actually sends once per calendar day per user (Vercel has
 * no built-in cron on the hobby tier by default, so this "on-visit"
 * trigger is the simplest reliable substitute - swap for a Vercel
 * Cron Job later if you want it to fire even without a visit).
 */
export async function maybeSendDailyReminder(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.emailNotifications) return;

  const log = await prisma.reminderLog.findUnique({ where: { userId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (log && log.lastSentDate.getTime() >= today.getTime()) return;

  const soon = new Date();
  soon.setDate(soon.getDate() + 2);

  const dueSoonTasks = await prisma.studyTask.findMany({
    where: {
      userId,
      status: "PENDING",
      OR: [{ dueDate: null }, { dueDate: { lte: soon } }],
    },
    orderBy: { dueDate: "asc" },
    take: 10,
  });

  if (dueSoonTasks.length > 0) {
    await sendTaskReminderEmail(user.email, user.name, dueSoonTasks);
  }

  await prisma.reminderLog.upsert({
    where: { userId },
    update: { lastSentDate: today },
    create: { userId, lastSentDate: today },
  });
}
