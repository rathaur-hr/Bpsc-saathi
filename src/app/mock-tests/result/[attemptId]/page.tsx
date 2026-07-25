import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface ReviewItem {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
}

export default async function MockTestResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { attemptId } = await params;
  const attempt = await prisma.mockAttempt.findFirst({
    where: { id: attemptId, userId: session.userId },
  });
  if (!attempt) redirect("/mock-tests");

  const review: ReviewItem[] = attempt.reviewJson ? JSON.parse(attempt.reviewJson) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Your Score: {attempt.score}%</h1>
        <p className="text-sm text-slate-500 mb-4">{attempt.correctAnswers} of {attempt.totalQuestions} correct</p>
        <Link href="/mock-tests" className="btn-primary inline-block">Back to Mock Tests</Link>
      </div>

      <h2 className="font-semibold mb-3">Review</h2>
      <div className="space-y-2">
        {review.map((r, i) => (
          <div key={i} className={`card ${r.isCorrect ? "" : "border-l-4 border-l-red-400"}`}>
            <p className="text-sm font-medium mb-1">{r.question}</p>
            <p className="text-xs text-slate-500">
              Your answer: <strong>{r.yourAnswer}</strong> · Correct answer: <strong>{r.correctAnswer}</strong>
            </p>
            {r.explanation && <p className="text-xs text-slate-400 mt-1">{r.explanation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
