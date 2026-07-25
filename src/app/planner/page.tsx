import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createTaskAction, updateTaskAction, toggleTaskAction, deleteTaskAction } from "@/app/actions/planner";

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; edit?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { filter = "pending", edit } = await searchParams;

  const [subjects, tasks] = await Promise.all([
    prisma.subject.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.studyTask.findMany({
      where: {
        userId: session.userId,
        ...(filter === "completed" ? { status: "COMPLETED" } : filter === "all" ? {} : { status: "PENDING" }),
      },
      include: { subject: true },
      orderBy: [{ dueDate: "asc" }],
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-5">
        <div className="card h-fit">
          <h2 className="font-semibold mb-3">Add Task</h2>
          <form action={createTaskAction} className="space-y-2">
            <input name="title" placeholder="Task title" required className="input" />
            <select name="subjectId" className="input">
              <option value="">General</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
            </select>
            <select name="priority" defaultValue="MEDIUM" className="input">
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <input name="dueDate" type="date" className="input" />
            <button type="submit" className="btn-primary w-full">Add Task</button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h2 className="font-semibold">Your Tasks</h2>
            <div className="flex gap-1 text-xs">
              {["pending", "completed", "all"].map((f) => (
                <a key={f} href={`/planner?filter=${f}`} className={`px-3 py-1.5 rounded-full border capitalize ${filter === f ? "bg-teal text-white border-teal" : "border-slate-300 dark:border-slate-600"}`}>
                  {f}
                </a>
              ))}
            </div>
          </div>

          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks here yet.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) =>
                edit === t.id ? (
                  <form key={t.id} action={updateTaskAction} className="card flex flex-wrap gap-2 items-center">
                    <input type="hidden" name="taskId" value={t.id} />
                    <input name="title" defaultValue={t.title} required className="input flex-1 min-w-[140px]" />
                    <select name="subjectId" defaultValue={t.subjectId ?? ""} className="input w-auto">
                      <option value="">General</option>
                      {subjects.map((s) => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                    </select>
                    <select name="priority" defaultValue={t.priority} className="input w-auto">
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                    <input name="dueDate" type="date" defaultValue={t.dueDate?.toISOString().split("T")[0]} className="input w-auto" />
                    <button type="submit" className="btn-primary text-sm">Save</button>
                    <a href={`/planner?filter=${filter}`} className="btn-outline text-sm">Cancel</a>
                  </form>
                ) : (
                  <div key={t.id} className={`card flex items-center justify-between gap-2 flex-wrap ${t.status === "COMPLETED" ? "opacity-60" : ""}`} style={{ borderLeft: `4px solid ${t.priority === "HIGH" ? "#dc2626" : t.priority === "MEDIUM" ? "#f59e0b" : "#16a34a"}` }}>
                    <div className="flex items-center gap-3">
                      <form action={toggleTaskAction}>
                        <input type="hidden" name="taskId" value={t.id} />
                        <input type="hidden" name="nextStatus" value={t.status === "PENDING" ? "COMPLETED" : "PENDING"} />
                        <button type="submit" aria-label="Toggle complete">
                          <input type="checkbox" readOnly checked={t.status === "COMPLETED"} className="w-5 h-5 accent-teal pointer-events-none" />
                        </button>
                      </form>
                      <div>
                        <p className={t.status === "COMPLETED" ? "line-through text-slate-400" : ""}>{t.title}</p>
                        <p className="text-xs text-slate-400">{t.subject?.nameEn ?? "General"}{t.dueDate ? ` · Due ${t.dueDate.toISOString().split("T")[0]}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                      <a href={`/planner?filter=${filter}&edit=${t.id}`} className="btn-outline text-xs">Edit</a>
                      <form action={deleteTaskAction}>
                        <input type="hidden" name="taskId" value={t.id} />
                        <button type="submit" className="text-xs text-red-500 border border-red-300 rounded-lg px-2 py-1">Delete</button>
                      </form>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
