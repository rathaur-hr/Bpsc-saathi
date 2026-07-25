import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function MockTestsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const subjects = await prisma.subject.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { nameEn: "asc" },
  });

  const history = await prisma.mockAttempt.findMany({
    where: { userId: session.userId },
    include: { subject: true },
    orderBy: { takenAt: "desc" },
    take: 10,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">Mock Tests</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {subjects.map((s) => (
          <div key={s.id} className="card">
            <h3 className="font-semibold">{s.nameEn}</h3>
            <p className="text-xs text-slate-400 mb-2">{s.nameHi}</p>
            <p className="text-sm text-slate-500 mb-3">{s._count.questions} questions available</p>
            {s._count.questions > 0 ? (
              <Link href={`/mock-tests/${s.id}`} className="btn-secondary text-sm inline-block">Start Test</Link>
            ) : (
              <span className="text-xs text-slate-400">Coming soon</span>
            )}
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-3">Recent Attempts</h2>
      {history.length === 0 ? (
        <p className="text-sm text-slate-500">You haven&apos;t taken any tests yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th className="py-2">Subject</th><th>Score</th><th>Correct</th><th>Date</th><th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-slate-50 dark:border-slate-700/50">
                  <td className="py-2">{h.subject?.nameEn ?? "General"}</td>
                  <td>{h.score}%</td>
                  <td>{h.correctAnswers}/{h.totalQuestions}</td>
                  <td>{h.takenAt.toISOString().split("T")[0]}</td>
                  <td><Link href={`/mock-tests/result/${h.id}`} className="text-teal-dark text-xs">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
