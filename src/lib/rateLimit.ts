// Fixed-window rate limit kept in memory. Each serverless instance has its own
// counters, so this slows abuse down rather than enforcing an exact global cap.
const windows = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowSeconds: number, now = Date.now()): boolean {
  const entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    if (windows.size > 10_000) {
      for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k);
    }
    windows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
