import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BPSC Saathi - Your Complete BPSC Preparation Platform",
  description:
    "Plan your preparation, master the syllabus, practice PYQs, take mock tests, revise smarter, and track your progress — all in one place.",
  openGraph: {
    title: "BPSC Saathi",
    description: "Your Complete BPSC Preparation Platform",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
