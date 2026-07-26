import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createPostAction } from "@/app/actions/community";

const CATEGORIES = ["History", "Polity", "Geography", "Economy", "Current Affairs", "Bihar Special", "Mains Answer Writing", "Study Planning", "General Discussion"];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { category } = await searchParams;

  const posts = await prisma.communityPost.findMany({
    where: category ? { category } : {},
    include: { user: true, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-1">Community</h1>
      <p className="text-sm text-slate-500 mb-5">Discuss topics, share notes, ask for help — with fellow BPSC aspirants.</p>

      <details className="card mb-6">
        <summary className="cursor-pointer font-medium text-sm">+ Create a new post</summary>
        <form action={createPostAction} className="space-y-2 mt-3">
          <select name="category" className="input">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input name="title" placeholder="Post title" required className="input" />
          <textarea name="content" placeholder="What's on your mind?" required rows={4} className="input" />
          <button type="submit" className="btn-primary">Post</button>
        </form>
      </details>

      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/community" className={`text-xs px-3 py-1.5 rounded-full border ${!category ? "bg-teal text-white border-teal" : "border-slate-300 dark:border-slate-600"}`}>All</a>
        {CATEGORIES.map((c) => (
          <a key={c} href={`/community?category=${encodeURIComponent(c)}`} className={`text-xs px-3 py-1.5 rounded-full border ${category === c ? "bg-teal text-white border-teal" : "border-slate-300 dark:border-slate-600"}`}>
            {c}
          </a>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-500">No posts yet — be the first to start a discussion.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <Link key={p.id} href={`/community/${p.id}`} className="card block hover:border-teal border border-transparent">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{p.category} · {p.user.name} · {p.createdAt.toISOString().split("T")[0]}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{p._count.comments} replies</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
