import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateNotificationsAction, deleteAccountAction } from "@/app/actions/account";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { error } = await searchParams;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Account Settings</h1>

      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="card">
            <h2 className="font-semibold mb-2">Profile</h2>
            <p className="text-sm"><strong>Name:</strong> {user.name}</p>
            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
            <p className="text-sm"><strong>Target:</strong> {user.targetExamStage ?? "Not set"} {user.targetYear ? `(${user.targetYear})` : ""}</p>
            <p className="text-sm"><strong>Level:</strong> {user.prepLevel ?? "Not set"}</p>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-3">Notifications</h2>
            <form action={updateNotificationsAction} className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="emailNotifications" defaultChecked={user.emailNotifications} className="w-4 h-4 accent-teal" />
                Email me reminders for tasks due soon
              </label>
              <button type="submit" className="btn-primary text-sm">Save Preference</button>
            </form>
            <p className="text-xs text-slate-400 mt-3">
              WhatsApp notifications need a paid provider (Twilio / Meta Cloud API) and aren&apos;t wired up yet —
              email reminders work today.
            </p>
          </div>
        </div>

        <div className="card border border-red-200">
          <h2 className="font-semibold text-red-600 mb-2">Delete Account</h2>
          <p className="text-sm text-slate-500 mb-3">
            This permanently deletes your account, tasks, mock test history, bookmarks, and syllabus progress.
            This cannot be undone.
          </p>
          <form action={deleteAccountAction} className="space-y-2">
            <div>
              <label className="text-xs font-medium">Type DELETE to confirm</label>
              <input name="confirmText" required className="input" />
            </div>
            <div>
              <label className="text-xs font-medium">Enter your password</label>
              <input name="password" type="password" required className="input" />
            </div>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
              Delete My Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
