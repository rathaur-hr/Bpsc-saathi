import { verifyOtpAction, resendOtpAction } from "@/app/actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; resent?: string }>;
}) {
  const { error, success, resent } = await searchParams;
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;

  if (!email && !success) redirect("/register");

  return (
    <div className="max-w-md mx-auto my-10 card text-center">
      {success ? (
        <>
          <h1 className="text-xl font-bold mb-2">✅ Email Verified!</h1>
          <p className="text-sm text-slate-500 mb-6">Your account is ready. You can now log in.</p>
          <Link href="/login" className="btn-primary w-full inline-block">Go to Login</Link>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-1">Verify Your Email</h1>
          <p className="text-sm text-slate-500 mb-5">
            We sent a 6-digit OTP to <strong>{email}</strong>
          </p>

          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4 text-left">{error}</div>}
          {resent && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4 text-left">A new OTP has been sent.</div>}

          <form action={verifyOtpAction} className="space-y-3">
            <input
              name="otp" type="text" maxLength={6} required autoFocus
              className="input text-center text-2xl tracking-[0.5em]"
              placeholder="------"
            />
            <button type="submit" className="btn-primary w-full">Verify OTP</button>
          </form>
          <form action={resendOtpAction} className="mt-2">
            <button type="submit" className="btn-outline w-full">Resend OTP</button>
          </form>
        </>
      )}
    </div>
  );
}
