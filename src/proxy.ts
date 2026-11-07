import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const isLoggedIn = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
    process.env.ADMIN_SECRET
  );
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/dashboard/login";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
