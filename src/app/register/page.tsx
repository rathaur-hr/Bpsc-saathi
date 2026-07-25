import { registerAction } from "@/app/actions/auth";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-md mx-auto my-10 card">
      <h1 className="text-xl font-bold text-center mb-1">Create Your Account</h1>
      <p className="text-sm text-slate-500 text-center mb-6">Free forever. Email verification required.</p>

      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <form action={registerAction} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input name="name" type="text" required className="input mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <input name="email" type="email" required className="input mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input name="password" type="password" minLength={6} required className="input mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Confirm Password</label>
          <input name="confirm_password" type="password" minLength={6} required className="input mt-1" />
        </div>
        <button type="submit" className="btn-primary w-full">Send OTP &amp; Continue</button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account? <Link href="/login" className="text-teal-dark font-medium">Login</Link>
      </p>
    </div>
  );
}
