import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_PREFIXES = [
  "/dashboard", "/planner", "/syllabus", "/pyq", "/mock-tests",
  "/current-affairs", "/bihar-special", "/settings", "/onboarding",
];

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get("bpsc_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*", "/planner/:path*", "/syllabus/:path*", "/pyq/:path*",
    "/mock-tests/:path*", "/current-affairs/:path*", "/bihar-special/:path*",
    "/settings/:path*", "/onboarding/:path*",
  ],
};
