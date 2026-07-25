import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div className="col-span-2 md:col-span-1">
          <p className="font-bold text-white mb-2">📘 BPSC Saathi</p>
          <p className="text-slate-400">Your complete BPSC preparation platform.</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Platform</p>
          <ul className="space-y-1">
            <li><Link href="/#features" className="hover:text-teal">Features</Link></li>
            <li><Link href="/syllabus" className="hover:text-teal">Syllabus</Link></li>
            <li><Link href="/mock-tests" className="hover:text-teal">Mock Tests</Link></li>
            <li><Link href="/current-affairs" className="hover:text-teal">Current Affairs</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Legal</p>
          <ul className="space-y-1">
            <li><Link href="/privacy" className="hover:text-teal">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-teal">Terms</Link></li>
            <li><Link href="/disclaimer" className="hover:text-teal">Disclaimer</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Official</p>
          <ul className="space-y-1">
            <li><a href="https://bpsc.bih.nic.in" target="_blank" rel="noopener" className="hover:text-teal">Official BPSC Website</a></li>
            <li><Link href="/contact" className="hover:text-teal">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} BPSC Saathi &middot; Owned &amp; maintained by Harshit Rathaur
      </div>
    </footer>
  );
}
