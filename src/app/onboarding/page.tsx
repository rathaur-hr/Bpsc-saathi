import { completeOnboardingAction } from "@/app/actions/onboarding";

export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto my-10 card">
      <h1 className="text-xl font-bold mb-1">Let&apos;s personalize your preparation</h1>
      <p className="text-sm text-slate-500 mb-6">This takes under a minute and shapes your dashboard, planner, and recommendations.</p>

      <form action={completeOnboardingAction} className="space-y-5">
        <div>
          <label className="text-sm font-medium block mb-2">What are you preparing for?</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: "PRELIMS", l: "Prelims" },
              { v: "MAINS", l: "Mains" },
              { v: "PRELIMS_MAINS", l: "Prelims + Mains" },
              { v: "INTERVIEW", l: "Interview" },
            ].map((o) => (
              <label key={o.v} className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer border-slate-300 dark:border-slate-600 has-[:checked]:border-teal has-[:checked]:bg-teal/5">
                <input type="radio" name="targetExamStage" value={o.v} defaultChecked={o.v === "PRELIMS_MAINS"} />
                {o.l}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Target Year</label>
          <input name="targetYear" type="number" min={2026} max={2035} defaultValue={2027} className="input" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Preparation Level</label>
          <div className="grid grid-cols-3 gap-2">
            {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((l) => (
              <label key={l} className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer border-slate-300 dark:border-slate-600 has-[:checked]:border-teal has-[:checked]:bg-teal/5">
                <input type="radio" name="prepLevel" value={l} defaultChecked={l === "BEGINNER"} />
                {l.charAt(0) + l.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Daily available study hours</label>
          <div className="grid grid-cols-4 gap-2">
            {["1-2 hours", "2-4 hours", "4-6 hours", "6+ hours"].map((h) => (
              <label key={h} className="flex items-center gap-2 border rounded-lg px-2 py-2 text-xs cursor-pointer border-slate-300 dark:border-slate-600 has-[:checked]:border-teal has-[:checked]:bg-teal/5">
                <input type="radio" name="dailyStudyHours" value={h} defaultChecked={h === "2-4 hours"} />
                {h}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Optional Subject (if any)</label>
          <input name="optionalSubject" type="text" placeholder="e.g. Hindi Literature" className="input" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Preferred Language</label>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer border-slate-300 dark:border-slate-600 has-[:checked]:border-teal has-[:checked]:bg-teal/5">
              <input type="radio" name="preferredLanguage" value="en" defaultChecked /> English
            </label>
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer border-slate-300 dark:border-slate-600 has-[:checked]:border-teal has-[:checked]:bg-teal/5">
              <input type="radio" name="preferredLanguage" value="hi" /> हिन्दी
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">Generate My Dashboard</button>
      </form>
    </div>
  );
}
