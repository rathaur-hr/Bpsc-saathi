import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { submitMockTestAction } from "@/app/actions/mockTest";

export default async function TakeMockTestPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { subjectId } = await params;

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) redirect("/mock-tests");

  const questions = await prisma.question.findMany({
    where: { subjectId },
    take: 10,
  });
  // Shuffle client-independent, deterministic-enough for a phase-1 mock test
  const shuffled = [...questions].sort(() => Math.random() - 0.5);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">{subject.nameEn} Mock Test</h1>

      {shuffled.length === 0 ? (
        <p className="text-sm text-slate-500">No questions available for this subject yet.</p>
      ) : (
        <form action={submitMockTestAction} className="space-y-4">
          <input type="hidden" name="subjectId" value={subjectId} />
          {shuffled.map((q, i) => (
            <div key={q.id} className="card">
              <p className="font-medium mb-3">{i + 1}. {q.questionEn}</p>
              <input type="hidden" name="questionIds" value={q.id} />
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const text = { A: q.optionAEn, B: q.optionBEn, C: q.optionCEn, D: q.optionDEn }[opt];
                return (
                  <label key={opt} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                    <input type="radio" name={`answer_${q.id}`} value={opt} />
                    {opt}. {text}
                  </label>
                );
              })}
            </div>
          ))}
          <button type="submit" className="btn-primary w-full">Submit Test</button>
        </form>
      )}
    </div>
  );
}
