import { loginAction } from "@/app/actions/auth";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-md mx-auto my-10 card">
      <h1 className="text-xl font-bold text-center mb-6">Welcome Back</h1>

      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <form action={loginAction} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <input name="email" type="email" required autoFocus className="input mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input name="password" type="password" required className="input mt-1" />
        </div>
        <button type="submit" className="btn-primary w-full">Login</button>
      </form>

      <p className="text-center text-sm mt-2">
        <Link href="/forgot-password" className="text-teal-dark">Forgot password?</Link>
      </p>
      <p className="text-center text-sm mt-3">
        New here? <Link href="/register" className="text-teal-dark font-medium">Create an account</Link>
      </p>
    </div>
  );
}
