import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, safeNext, verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const isLoggedIn = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
    process.env.ADMIN_SECRET
  );
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/dashboard/login";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !isLoginPage && !isLoggedIn) {
    const login = new URL("/dashboard/login", request.url);
    // Return to the page that was asked for (e.g. the AI connector's consent screen) after signing in.
    if (pathname !== "/dashboard") login.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get("next")), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
