import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const CATEGORIES = ["Bihar", "National", "International", "Polity", "Economy", "Science & Technology", "Environment", "Government Schemes", "Awards", "Sports"];

export default async function CurrentAffairsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { category } = await searchParams;

  const items = await prisma.currentAffair.findMany({
    where: category ? { category } : {},
    orderBy: { publishedAt: "desc" },
    take: 40,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-1">Current Affairs</h1>
      <p className="text-sm text-slate-500 mb-5">Auto-updated from live feeds via a scheduled job — no manual admin uploads needed.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/current-affairs" className={`text-xs px-3 py-1.5 rounded-full border ${!category ? "bg-teal text-white border-teal" : "border-slate-300 dark:border-slate-600"}`}>All</a>
        {CATEGORIES.map((c) => (
          <a key={c} href={`/current-affairs?category=${encodeURIComponent(c)}`} className={`text-xs px-3 py-1.5 rounded-full border ${category === c ? "bg-teal text-white border-teal" : "border-slate-300 dark:border-slate-600"}`}>
            {c}
          </a>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card">
          <p className="text-sm text-slate-500">
            No current affairs yet. This page is populated by a daily scheduled job — once deployed on
            Vercel with the cron configured (see README), it fills in automatically. Until the first run,
            it&apos;s empty.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card border-l-4 border-l-amber">
              {item.sourceUrl ? (
                <a href={item.sourceUrl} target="_blank" rel="noopener" className="font-medium text-sm hover:text-teal-dark">{item.title}</a>
              ) : (
                <p className="font-medium text-sm">{item.title}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">{item.category} · {item.source ?? "BPSC Saathi"} · {item.publishedAt.toISOString().split("T")[0]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
