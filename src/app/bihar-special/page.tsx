import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function BiharSpecialPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [biharSubjects, districts] = await Promise.all([
    prisma.subject.findMany({
      where: { category: "bihar-special" },
      include: { topics: true },
      orderBy: { nameEn: "asc" },
    }),
    prisma.biharDistrict.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-1">Bihar Special</h1>
      <p className="text-sm text-slate-500 mb-6">History, Geography, Economy, Polity, Culture &amp; district-wise facts.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {biharSubjects.map((s) => (
          <div key={s.id} className="card">
            <h3 className="font-semibold mb-2">{s.nameEn}</h3>
            <ul className="text-sm text-slate-500 space-y-1">
              {s.topics.map((t) => <li key={t.id}>• {t.titleEn}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-3">Districts</h2>
      {districts.length === 0 ? (
        <p className="text-sm text-slate-500">District data coming soon — seed more via <code>prisma/seed.ts</code>.</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-3">
          {districts.map((d) => (
            <details key={d.id} className="card">
              <summary className="cursor-pointer font-medium text-sm">{d.name}</summary>
              <div className="text-xs text-slate-500 mt-2 space-y-1">
                <p>HQ: {d.headquarters}</p>
                {d.areaSqKm && <p>Area: {d.areaSqKm} km²</p>}
                {d.population && <p>Population: {d.population.toLocaleString()}</p>}
                {d.majorRivers && <p>Rivers: {d.majorRivers}</p>}
                <p>{d.keyFacts}</p>
              </div>
            </details>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-8">
        A fully interactive Bihar map (clickable districts) is on the roadmap — this list view covers
        the same data as a phase-1 version.
      </p>
    </div>
  );
}
