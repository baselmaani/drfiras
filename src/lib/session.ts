// Signed admin session tokens. Uses Web Crypto so the same code runs in the
// proxy and in server actions. Token format: "<expiry ms>.<base64url HMAC>".
// Changing ADMIN_SECRET invalidates every existing session.
export const SESSION_COOKIE = "admin-session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

function importKey(secret: string, usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

function payloadFor(expiry: string) {
  return encoder.encode(`${SESSION_COOKIE}:${expiry}`);
}

export async function createSessionToken(secret: string, now = Date.now()): Promise<string> {
  const expiry = String(now + SESSION_MAX_AGE_SECONDS * 1000);
  const key = await importKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, payloadFor(expiry));
  return `${expiry}.${Buffer.from(signature).toString("base64url")}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
  now = Date.now()
): Promise<boolean> {
  if (!token || !secret) return false;

  const [expiry, signature, ...rest] = token.split(".");
  if (!expiry || !signature || rest.length > 0) return false;
  if (!/^\d+$/.test(expiry) || Number(expiry) <= now) return false;

  const key = await importKey(secret, "verify");
  // crypto.subtle.verify compares in constant time
  return crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(signature, "base64url"),
    payloadFor(expiry)
  );
}
