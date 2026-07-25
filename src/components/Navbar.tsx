import Link from "next/link";
import { getSession } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

const LOGGED_IN_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/syllabus", label: "Syllabus" },
  { href: "/pyq", label: "PYQs" },
  { href: "/mock-tests", label: "Mock Tests" },
  { href: "/current-affairs", label: "Current Affairs" },
  { href: "/bihar-special", label: "Bihar Special" },
  { href: "/planner", label: "Planner" },
];

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="bg-gradient-to-r from-ink to-inksoft text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          📘 BPSC Saathi
        </Link>

        <div className="hidden md:flex items-center gap-4 text-sm">
          {session ? (
            <>
              {LOGGED_IN_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-teal transition-colors">
                  {l.label}
                </Link>
              ))}
              <Link href="/settings" className="hover:text-teal transition-colors">Settings</Link>
              <form action="/api/auth/logout" method="POST">
                <button className="hover:text-teal transition-colors">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/#features" className="hover:text-teal transition-colors">Features</Link>
              <Link href="/login" className="hover:text-teal transition-colors">Login</Link>
              <Link href="/register" className="btn-secondary">Sign Up Free</Link>
            </>
          )}
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <MobileNav isLoggedIn={!!session} links={LOGGED_IN_LINKS} />
        </div>
      </div>
    </nav>
  );
}
