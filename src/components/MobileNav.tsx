"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav({
  isLoggedIn,
  links,
}: {
  isLoggedIn: boolean;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2">
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-72 bg-ink p-5 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setOpen(false)} className="self-end p-2 mb-2">
              <X size={20} />
            </button>
            {isLoggedIn ? (
              <>
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="py-2 text-slate-200" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ))}
                <Link href="/settings" className="py-2 text-slate-200" onClick={() => setOpen(false)}>Settings</Link>
                <form action="/api/auth/logout" method="POST">
                  <button className="py-2 text-slate-200 text-left w-full">Logout</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/#features" className="py-2 text-slate-200" onClick={() => setOpen(false)}>Features</Link>
                <Link href="/login" className="py-2 text-slate-200" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" className="btn-secondary mt-2 text-center" onClick={() => setOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
