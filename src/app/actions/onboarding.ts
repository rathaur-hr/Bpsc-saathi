"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { ExamStage, PrepLevel } from "@prisma/client";

const EXAM_STAGES: ExamStage[] = ["PRELIMS", "MAINS", "PRELIMS_MAINS", "INTERVIEW"];
const PREP_LEVELS: PrepLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export async function completeOnboardingAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const stageInput = String(formData.get("targetExamStage") ?? "PRELIMS_MAINS");
  const levelInput = String(formData.get("prepLevel") ?? "BEGINNER");
  const targetExamStage: ExamStage = EXAM_STAGES.includes(stageInput as ExamStage)
    ? (stageInput as ExamStage) : "PRELIMS_MAINS";
  const prepLevel: PrepLevel = PREP_LEVELS.includes(levelInput as PrepLevel)
    ? (levelInput as PrepLevel) : "BEGINNER";

  const targetYear = Number(formData.get("targetYear")) || null;
  const dailyStudyHours = String(formData.get("dailyStudyHours") ?? "");
  const optionalSubject = String(formData.get("optionalSubject") ?? "");
  const preferredLanguage = String(formData.get("preferredLanguage") ?? "en");

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      targetExamStage,
      targetYear,
      prepLevel,
      dailyStudyHours,
      optionalSubject,
      preferredLanguage,
      onboardingCompleted: true,
    },
  });

  redirect("/dashboard");
}
