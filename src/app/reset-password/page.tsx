import { resetPasswordAction } from "@/app/actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const cookieStore = await cookies();
  const email = cookieStore.get("reset_email")?.value;

  if (!email && !success) redirect("/forgot-password");

  return (
    <div className="max-w-md mx-auto my-10 card">
      {success ? (
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">✅ Password Reset</h1>
          <p className="text-sm text-slate-500 mb-6">Your password has been updated.</p>
          <Link href="/login" className="btn-primary w-full inline-block">Login Now</Link>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold text-center mb-1">Reset Password</h1>
          <p className="text-sm text-slate-500 text-center mb-5">
            Enter the OTP sent to <strong>{email}</strong> and your new password.
          </p>
          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
          <form action={resetPasswordAction} className="space-y-3">
            <input name="otp" type="text" maxLength={6} required placeholder="OTP" className="input text-center tracking-widest" />
            <input name="new_password" type="password" minLength={6} required placeholder="New Password" className="input" />
            <input name="confirm_password" type="password" minLength={6} required placeholder="Confirm New Password" className="input" />
            <button type="submit" className="btn-primary w-full">Reset Password</button>
          </form>
        </>
      )}
    </div>
  );
}
