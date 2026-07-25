import { forgotPasswordAction } from "@/app/actions/auth";
import Link from "next/link";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="max-w-md mx-auto my-10 card">
      <h1 className="text-xl font-bold text-center mb-1">Forgot Password</h1>
      <p className="text-sm text-slate-500 text-center mb-6">Enter your account email — we&apos;ll send a reset OTP.</p>

      {sent && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">
          If that email is registered, a password reset OTP has been sent.
        </div>
      )}

      <form action={forgotPasswordAction} className="space-y-3">
        <input name="email" type="email" required autoFocus placeholder="Email Address" className="input" />
        <button type="submit" className="btn-primary w-full">Send Reset OTP</button>
      </form>

      {sent && (
        <Link href="/reset-password" className="btn-outline w-full block text-center mt-3">
          Enter OTP &amp; Reset Password
        </Link>
      )}

      <p className="text-center text-sm mt-4">
        <Link href="/login" className="text-teal-dark">Back to Login</Link>
      </p>
    </div>
  );
}
