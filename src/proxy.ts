import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get("admin-session")?.value === "1";
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
