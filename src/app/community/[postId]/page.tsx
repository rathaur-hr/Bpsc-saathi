import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createCommentAction, deletePostAction } from "@/app/actions/community";

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { postId } = await params;

  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    include: {
      user: true,
      comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!post) redirect("/community");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/community" className="text-sm text-teal-dark">&larr; Back to Community</Link>

      <div className="card my-4">
        <p className="text-xs text-slate-400 mb-1">{post.category} · {post.user.name} · {post.createdAt.toISOString().split("T")[0]}</p>
        <h1 className="text-lg font-bold mb-2">{post.title}</h1>
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>

        {post.userId === session.userId && (
          <form action={deletePostAction} className="mt-3">
            <input type="hidden" name="postId" value={post.id} />
            <button type="submit" className="text-xs text-red-500 border border-red-300 rounded-lg px-2 py-1">Delete Post</button>
          </form>
        )}
      </div>

      <h2 className="font-semibold mb-2 text-sm">{post.comments.length} Replies</h2>
      <div className="space-y-2 mb-6">
        {post.comments.map((c) => (
          <div key={c.id} className="card">
            <p className="text-sm">{c.content}</p>
            <p className="text-xs text-slate-400 mt-1">{c.user.name} · {c.createdAt.toISOString().split("T")[0]}</p>
          </div>
        ))}
      </div>

      <form action={createCommentAction} className="card space-y-2">
        <input type="hidden" name="postId" value={post.id} />
        <textarea name="content" placeholder="Write a reply..." required rows={3} className="input" />
        <button type="submit" className="btn-primary">Reply</button>
      </form>
    </div>
  );
}
