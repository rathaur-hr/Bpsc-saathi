"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { TopicStatus } from "@prisma/client";

const STATUSES: TopicStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "REVISED"];

export async function updateTopicStatusAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const topicId = String(formData.get("topicId"));
  const statusInput = String(formData.get("status"));
  const status: TopicStatus = STATUSES.includes(statusInput as TopicStatus)
    ? (statusInput as TopicStatus) : "NOT_STARTED";

  await prisma.userSyllabusProgress.upsert({
    where: { userId_topicId: { userId: session.userId, topicId } },
    update: { status },
    create: { userId: session.userId, topicId, status },
  });

  revalidatePath("/syllabus");
  revalidatePath("/dashboard");
}
