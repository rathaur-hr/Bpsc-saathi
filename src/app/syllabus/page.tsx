import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateTopicStatusAction } from "@/app/actions/syllabus";
import TopicStatusSelect from "@/components/TopicStatusSelect";

export default async function SyllabusPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const subjects = await prisma.subject.findMany({
    include: {
      topics: {
        include: { progress: { where: { userId: session.userId } } },
        orderBy: { titleEn: "asc" },
      },
    },
    orderBy: { nameEn: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-1">Syllabus Tracker</h1>
      <p className="text-sm text-slate-500 mb-6">Prelims &amp; Mains topics, trackable by status.</p>

      {subjects.map((subject) => {
        const total = subject.topics.length;
        const done = subject.topics.filter((t) => t.progress[0]?.status === "COMPLETED").length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <div key={subject.id} className="card mb-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="font-semibold">{subject.nameEn} <span className="text-slate-400 text-sm font-normal">({subject.nameHi})</span></h2>
                <p className="text-xs text-slate-400">{done}/{total} topics completed</p>
              </div>
              <div className="w-24 h-2 rounded bg-slate-100 dark:bg-slate-700 shrink-0">
                <div className="h-2 rounded bg-teal" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {subject.topics.map((topic) => {
              const status = topic.progress[0]?.status ?? "NOT_STARTED";
              return (
                <form
                  action={updateTopicStatusAction}
                  key={topic.id}
                  className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 py-2 text-sm gap-2"
                >
                  <input type="hidden" name="topicId" value={topic.id} />
                  <div>
                    <p>{topic.titleEn}</p>
                    <p className="text-xs text-slate-400">{topic.titleHi} · {topic.examPhase}</p>
                  </div>
                  <TopicStatusSelect defaultValue={status} />
                </form>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
