import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { XMLParser } from "fast-xml-parser";

/**
 * Auto-refreshes Current Affairs from public RSS feeds - no admin upload needed.
 * Triggered by a Vercel Cron Job (see vercel.json), protected by CRON_SECRET so
 * it can't be spammed by the public. Vercel's free Hobby tier allows daily cron
 * jobs; upgrade to Pro for more frequent runs if you need them.
 */

const FEEDS: { url: string; category: string }[] = [
  { url: "https://news.google.com/rss/search?q=Bihar+when:2d&hl=en-IN&gl=IN&ceid=IN:en", category: "Bihar" },
  { url: "https://news.google.com/rss/search?q=India+national+when:2d&hl=en-IN&gl=IN&ceid=IN:en", category: "National" },
  { url: "https://news.google.com/rss/search?q=India+government+scheme+when:3d&hl=en-IN&gl=IN&ceid=IN:en", category: "Government Schemes" },
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parser = new XMLParser();
  let inserted = 0;

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, { next: { revalidate: 0 } });
      if (!res.ok) continue;
      const xml = await res.text();
      const parsed = parser.parse(xml);
      const items = parsed?.rss?.channel?.item;
      const itemList = Array.isArray(items) ? items : items ? [items] : [];

      for (const item of itemList.slice(0, 10)) {
        const title = String(item.title ?? "").trim();
        const link = String(item.link ?? "").trim();
        if (!title || !link) continue;

        const exists = await prisma.currentAffair.findFirst({ where: { sourceUrl: link } });
        if (exists) continue;

        await prisma.currentAffair.create({
          data: {
            title,
            summary: title, // headline-only for now; can be expanded with full-article summarization later
            category: feed.category,
            source: "Google News",
            sourceUrl: link,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          },
        });
        inserted++;
      }
    } catch (err) {
      console.error(`Failed to refresh feed ${feed.url}:`, err);
    }
  }

  return NextResponse.json({ ok: true, inserted });
}
