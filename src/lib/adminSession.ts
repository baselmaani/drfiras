// Deliberately not a "use server" file: exports there become public endpoints.
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value, process.env.ADMIN_SECRET);
}

// Every dashboard server action calls this first. Server actions are reachable
// by direct POST, so the proxy's page redirect alone does not protect them.
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
