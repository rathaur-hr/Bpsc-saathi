"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Priority } from "@prisma/client";

const PRIORITIES: Priority[] = ["HIGH", "MEDIUM", "LOW"];

export async function createTaskAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const priorityInput = String(formData.get("priority") ?? "MEDIUM");
  const priority: Priority = PRIORITIES.includes(priorityInput as Priority) ? (priorityInput as Priority) : "MEDIUM";
  const dueDateStr = String(formData.get("dueDate") ?? "");
  const subjectId = String(formData.get("subjectId") ?? "") || null;

  await prisma.studyTask.create({
    data: {
      userId: session.userId,
      title,
      priority,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      subjectId,
    },
  });

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}

export async function updateTaskAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const taskId = String(formData.get("taskId"));
  const title = String(formData.get("title") ?? "").trim();
  const priorityInput = String(formData.get("priority") ?? "MEDIUM");
  const priority: Priority = PRIORITIES.includes(priorityInput as Priority) ? (priorityInput as Priority) : "MEDIUM";
  const dueDateStr = String(formData.get("dueDate") ?? "");
  const subjectId = String(formData.get("subjectId") ?? "") || null;

  if (title) {
    await prisma.studyTask.updateMany({
      where: { id: taskId, userId: session.userId },
      data: { title, priority, dueDate: dueDateStr ? new Date(dueDateStr) : null, subjectId },
    });
  }

  revalidatePath("/planner");
}

export async function toggleTaskAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const taskId = String(formData.get("taskId"));
  const nextStatus = String(formData.get("nextStatus")) === "COMPLETED" ? "COMPLETED" : "PENDING";

  await prisma.studyTask.updateMany({
    where: { id: taskId, userId: session.userId },
    data: { status: nextStatus },
  });

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}

export async function deleteTaskAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const taskId = String(formData.get("taskId"));
  await prisma.studyTask.deleteMany({ where: { id: taskId, userId: session.userId } });

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}
