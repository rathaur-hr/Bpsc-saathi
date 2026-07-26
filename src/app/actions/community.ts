"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function createPostAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "General Discussion");

  if (!title || !content) return;

  const post = await prisma.communityPost.create({
    data: { userId: session.userId, title, content, category },
  });

  revalidatePath("/community");
  redirect(`/community/${post.id}`);
}

export async function deletePostAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const postId = String(formData.get("postId"));
  await prisma.communityPost.deleteMany({ where: { id: postId, userId: session.userId } });

  revalidatePath("/community");
  redirect("/community");
}

export async function createCommentAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const postId = String(formData.get("postId"));
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await prisma.comment.create({
    data: { postId, userId: session.userId, content },
  });

  revalidatePath(`/community/${postId}`);
}
