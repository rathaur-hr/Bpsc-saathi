import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import type { ExamPhase } from "@prisma/client";

const EXAM_PHASES: ExamPhase[] = ["PRELIMS", "MAINS"];

export default async function PyqPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; year?: string; phase?: string; q?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { subject, year, phase, q } = await searchParams;

  const [subjects, years] = await Promise.all([
    prisma.subject.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.question.findMany({
      where: { isPYQ: true, pyqYear: { not: null } },
      distinct: ["pyqYear"],
      select: { pyqYear: true },
      orderBy: { pyqYear: "desc" },
    }),
  ]);

  const questions = await prisma.question.findMany({
    where: {
      isPYQ: true,
      ...(subject ? { subjectId: subject } : {}),
      ...(year ? { pyqYear: Number(year) } : {}),
      ...(phase && EXAM_PHASES.includes(phase as ExamPhase) ? { examPhase: phase as ExamPhase } : {}),
      ...(q ? { questionEn: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { subject: true },
    orderBy: { pyqYear: "desc" },
    take: 50,
  });

  // Topic frequency trend: questions per subject per year
  const trend: Record<string, Record<number, number>> = {};
  const allPyqs = await prisma.question.findMany({
    where: { isPYQ: true, pyqYear: { not: null } },
    include: { subject: true },
  });
  for (const p of allPyqs) {
    if (!p.pyqYear) continue;
    trend[p.subject.nameEn] ??= {};
    trend[p.subject.nameEn][p.pyqYear] = (trend[p.subject.nameEn][p.pyqYear] ?? 0) + 1;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-1">Previous Year Questions</h1>
      <p className="text-sm text-slate-500 mb-6">Filter by subject, year, or exam phase. Search by keyword.</p>

      <form className="card mb-6 grid sm:grid-cols-4 gap-3">
        <input name="q" defaultValue={q} placeholder="Search keyword..." className="input sm:col-span-1" />
        <select name="subject" defaultValue={subject ?? ""} className="input">
          <option value="">All Subjects</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
        </select>
        <select name="year" defaultValue={year ?? ""} className="input">
          <option value="">All Years</option>
          {years.map((y) => y.pyqYear && <option key={y.pyqYear} value={y.pyqYear}>{y.pyqYear}</option>)}
        </select>
        <select name="phase" defaultValue={phase ?? ""} className="input">
          <option value="">Prelims + Mains</option>
          <option value="PRELIMS">Prelims</option>
          <option value="MAINS">Mains</option>
        </select>
        <button type="submit" className="btn-primary sm:col-span-4">Apply Filters</button>
      </form>

      {Object.keys(trend).length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-3">Topic Frequency Trend</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {Object.entries(trend).map(([subjectName, years]) => (
              <div key={subjectName}>
                <p className="font-medium mb-1">{subjectName}</p>
                <p className="text-slate-500 text-xs">
                  {Object.entries(years).sort((a, b) => Number(b[0]) - Number(a[0])).map(([yr, count]) => `${yr} → ${count}`).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {questions.length === 0 ? (
          <p className="text-sm text-slate-500">No PYQs match your filters yet — the question bank grows over time.</p>
        ) : (
          questions.map((qn) => (
            <div key={qn.id} className="card">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{qn.subject.nameEn} · {qn.examPhase}{qn.pyqYear ? ` · ${qn.pyqYear}` : ""}</span>
                {qn.difficulty && <span className="capitalize">{qn.difficulty}</span>}
              </div>
              <p className="font-medium text-sm mb-2">{qn.questionEn}</p>
              <ul className="text-sm text-slate-500 space-y-0.5">
                <li>A. {qn.optionAEn}</li>
                <li>B. {qn.optionBEn}</li>
                <li>C. {qn.optionCEn}</li>
                <li>D. {qn.optionDEn}</li>
              </ul>
              <p className="text-xs text-teal-dark mt-2">Correct: {qn.correctOption}</p>
              {qn.explanationEn && <p className="text-xs text-slate-400 mt-1">{qn.explanationEn}</p>}
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Link href="/mock-tests" className="btn-outline">Practice these as a Mock Test →</Link>
      </div>
    </div>
  );
}
