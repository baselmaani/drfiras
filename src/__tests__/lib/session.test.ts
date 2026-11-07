import { describe, it, expect } from "vitest";
import {
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";

const SECRET = "test-secret";

describe("admin session tokens", () => {
  it("accepts a token it signed", async () => {
    const token = await createSessionToken(SECRET);
    expect(await verifySessionToken(token, SECRET)).toBe(true);
  });

  it("rejects the old forgeable cookie value", async () => {
    expect(await verifySessionToken("1", SECRET)).toBe(false);
  });

  it("rejects a missing token or missing secret", async () => {
    const token = await createSessionToken(SECRET);
    expect(await verifySessionToken(undefined, SECRET)).toBe(false);
    expect(await verifySessionToken(token, undefined)).toBe(false);
  });

  it("rejects a token signed with another secret", async () => {
    const token = await createSessionToken("other-secret");
    expect(await verifySessionToken(token, SECRET)).toBe(false);
  });

  it("rejects an extended expiry on a real signature", async () => {
    const token = await createSessionToken(SECRET);
    const [expiry, signature] = token.split(".");
    const forged = `${Number(expiry) + 1000}.${signature}`;
    expect(await verifySessionToken(forged, SECRET)).toBe(false);
  });

  it("rejects an expired token", async () => {
    const now = 1_000_000;
    const token = await createSessionToken(SECRET, now);
    const afterExpiry = now + SESSION_MAX_AGE_SECONDS * 1000 + 1;
    expect(await verifySessionToken(token, SECRET, afterExpiry)).toBe(false);
  });

  it("rejects malformed tokens", async () => {
    for (const token of ["", ".", "abc.def", "123", "123.abc.def"]) {
      expect(await verifySessionToken(token, SECRET)).toBe(false);
    }
  });
});
