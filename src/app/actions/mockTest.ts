"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function submitMockTestAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const subjectId = String(formData.get("subjectId") ?? "");
  const questionIds = formData.getAll("questionIds") as string[];
  if (questionIds.length === 0) redirect("/mock-tests");

  const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } });
  const byId = new Map(questions.map((q) => [q.id, q]));

  let correctCount = 0;
  const review = questionIds.map((qid) => {
    const question = byId.get(qid)!;
    const yourAnswer = (formData.get(`answer_${qid}`) as string | null) ?? null;
    const isCorrect = yourAnswer === question.correctOption;
    if (isCorrect) correctCount++;
    return {
      question: question.questionEn,
      yourAnswer: yourAnswer ?? "—",
      correctAnswer: question.correctOption,
      isCorrect,
      explanation: question.explanationEn,
    };
  });

  const total = questionIds.length;
  const score = total > 0 ? Math.round((correctCount / total) * 10000) / 100 : 0;

  const attempt = await prisma.mockAttempt.create({
    data: {
      userId: session.userId,
      subjectId: subjectId || null,
      totalQuestions: total,
      correctAnswers: correctCount,
      score,
      reviewJson: JSON.stringify(review),
    },
  });

  redirect(`/mock-tests/result/${attempt.id}`);
}
