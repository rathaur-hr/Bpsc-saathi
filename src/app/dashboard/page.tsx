import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { maybeSendDailyReminder } from "@/lib/reminders";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await maybeSendDailyReminder(session.userId);

  const [pendingTasks, totalTopics, completedTopics, attempts, recentTasks, subjects] = await Promise.all([
    prisma.studyTask.count({ where: { userId: session.userId, status: "PENDING" } }),
    prisma.topic.count(),
    prisma.userSyllabusProgress.count({ where: { userId: session.userId, status: "COMPLETED" } }),
    prisma.mockAttempt.findMany({ where: { userId: session.userId } }),
    prisma.studyTask.findMany({
      where: { userId: session.userId, status: "PENDING" },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.subject.findMany({ include: { topics: { include: { progress: { where: { userId: session.userId } } } } } }),
  ]);

  const syllabusPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const avgScore = attempts.length > 0 ? attempts.reduce((s, a) => s + a.score, 0) / attempts.length : 0;

  const subjectProgress = subjects.map((s) => {
    const total = s.topics.length;
    const done = s.topics.filter((t) => t.progress[0]?.status === "COMPLETED").length;
    return { name: s.nameEn, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Welcome back, {session.name} 👋</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Pending Tasks" value={pendingTasks} />
        <StatCard label="Syllabus Complete" value={`${syllabusPct}%`} />
        <StatCard label="Mock Tests Taken" value={attempts.length} />
        <StatCard label="Avg. Score" value={`${avgScore.toFixed(1)}%`} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Upcoming Tasks</h2>
              <Link href="/planner" className="btn-primary text-sm py-1.5 px-3">Manage Planner</Link>
            </div>
            {recentTasks.length === 0 ? (
              <p className="text-sm text-slate-500">No pending tasks. <Link href="/planner" className="text-teal-dark">Add one</Link>.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentTasks.map((t) => (
                  <li key={t.id} className="py-2 flex justify-between items-center text-sm">
                    <div>
                      <p>{t.title}</p>
                      <p className="text-xs text-slate-400">{t.dueDate ? `Due ${t.dueDate.toISOString().split("T")[0]}` : "No due date"}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h2 className="font-semibold mb-3">Subject Progress</h2>
            <div className="space-y-2">
              {subjectProgress.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{s.name}</span><span>{s.pct}%</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100 dark:bg-slate-700">
                    <div className="h-2 rounded bg-teal" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <QuickLink href="/mock-tests" title="Practice Now" desc="Take a subject-wise mock test." cta="Start a Mock Test" />
          <QuickLink href="/current-affairs" title="Current Affairs" desc="Bihar & national headlines relevant to BPSC." cta="View Current Affairs" />
          <QuickLink href="/syllabus" title="Syllabus Tracker" desc="See what's left and mark topics done." cta="Open Syllabus" />
          <QuickLink href="/bihar-special" title="Bihar Special" desc="History, geography, polity & more." cta="Explore Bihar Special" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card text-center">
      <div className="text-2xl font-bold text-teal-dark">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function QuickLink({ href, title, desc, cta }: { href: string; title: string; desc: string; cta: string }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-3">{desc}</p>
      <Link href={href} className="btn-outline text-sm inline-block">{cta}</Link>
    </div>
  );
}
