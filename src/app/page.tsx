import Link from "next/link";
import {
  CalendarCheck, BookOpenCheck, ListChecks, PenLine, MapPinned,
  Newspaper, RotateCcw, BarChart3, Sparkles,
} from "lucide-react";

const FEATURES = [
  { icon: CalendarCheck, title: "Personalized Study Plan", desc: "Daily, weekly, and monthly plans built around your target year and available hours." },
  { icon: ListChecks, title: "Complete Syllabus Tracker", desc: "Every Prelims and Mains topic, trackable as Not Started / In Progress / Completed / Revised." },
  { icon: BookOpenCheck, title: "PYQ Analysis", desc: "Previous year questions with topic-frequency trends, so you know what actually matters." },
  { icon: PenLine, title: "Mock Tests", desc: "Full-length, subject-wise, and topic-wise tests with instant scoring and analysis." },
  { icon: MapPinned, title: "Bihar Special", desc: "Bihar History, Geography, Economy, Polity, Culture — the section most platforms skip." },
  { icon: Newspaper, title: "Current Affairs", desc: "Daily, weekly, and monthly current affairs written specifically for BPSC relevance." },
  { icon: RotateCcw, title: "Revision Engine", desc: "Spaced-repetition reminders so weak topics get revisited before you forget them." },
  { icon: BarChart3, title: "Performance Analytics", desc: "See your strong, average, and weak areas at a glance, backed by real attempt data." },
];

const JOURNEY = ["Understand", "Plan", "Learn", "Practice", "Revise", "Analyze", "Improve", "Succeed"];

const FAQS = [
  { q: "Is BPSC Saathi free to use?", a: "Yes, the core preparation tools — planner, syllabus tracker, mock tests, and current affairs — are free to use." },
  { q: "Does this cover both Prelims and Mains?", a: "Yes. The syllabus tracker, PYQ database, and study planner are all organized by exam phase, and you can set your target as Prelims, Mains, or both during onboarding." },
  { q: "How often is current affairs updated?", a: "Current affairs content is refreshed regularly and organized by Bihar, National, International, and subject-wise categories." },
  { q: "Is the syllabus and exam pattern official?", a: "We link every official detail back to the official BPSC website (bpsc.bih.nic.in) for verification, and clearly separate official information from platform-generated preparation content." },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink to-teal-dark text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Your Complete BPSC Preparation Platform</h1>
          <p className="text-slate-200 max-w-2xl mx-auto mb-8">
            Plan your preparation, master the syllabus, practice PYQs, take mock tests, revise smarter,
            and track your progress — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-secondary text-center">Start Your Preparation</Link>
            <Link href="/#features" className="border border-white/40 px-4 py-2 rounded-lg font-medium hover:bg-white/10 text-center">
              Explore BPSC Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Journey strip */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          {JOURNEY.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-teal/10 text-teal-dark dark:text-teal font-medium">{step}</span>
              {i < JOURNEY.length - 1 && <span className="text-slate-400">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Why BPSC Saathi */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Why BPSC Saathi?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card border-t-4 border-t-teal">
              <f.icon className="text-teal-dark mb-2" size={24} />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exam journey */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">BPSC Preparation Journey</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-medium">
          {["Prelims", "Mains", "Interview", "Final Selection"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <span className="card px-5 py-3">{s}</span>
              {i < arr.length - 1 && <span className="text-teal-dark text-lg">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Bihar special */}
      <section className="bg-white dark:bg-slate-800 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <MapPinned className="mx-auto text-amber mb-3" size={32} />
          <h2 className="text-2xl font-bold mb-3">Bihar Special</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-6">
            Bihar History, Geography, Economy, Polity, Culture, Government Schemes, and district-wise
            facts — the section that makes the real difference in BPSC scores.
          </p>
          <Link href="/register" className="btn-primary">Explore Bihar Special</Link>
        </div>
      </section>

      {/* AI Assistant teaser */}
      <section className="max-w-5xl mx-auto px-4 py-12 text-center">
        <Sparkles className="mx-auto text-teal-dark mb-3" size={32} />
        <h2 className="text-2xl font-bold mb-3">AI BPSC Assistant</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Coming soon: ask for explanations, revision notes, and practice MCQs on any BPSC topic,
          get a custom revision plan, or have a Mains answer reviewed.
        </p>
      </section>

      {/* Testimonials (placeholder) */}
      <section className="bg-white dark:bg-slate-800 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">What Aspirants Say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Sample Aspirant", text: "Placeholder testimonial — the syllabus tracker keeps my preparation organized." },
              { name: "Sample Aspirant", text: "Placeholder testimonial — Bihar Special content is hard to find elsewhere." },
              { name: "Sample Aspirant", text: "Placeholder testimonial — mock test analysis shows exactly where I'm weak." },
            ].map((t, i) => (
              <div key={i} className="card">
                <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-3">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">Sample/placeholder testimonials — not real user submissions yet.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card group">
              <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
                {f.q}
                <span className="text-teal-dark group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16 text-center">
        <div className="card py-10">
          <h2 className="text-xl font-bold mb-2">Ready to start your BPSC preparation?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-5">Create your free account in under a minute.</p>
          <Link href="/register" className="btn-primary">Sign Up Now</Link>
        </div>
      </section>
    </div>
  );
}
