import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeDb } from "./fakeDb";

const fake = vi.hoisted(() => ({ db: null as unknown as ReturnType<typeof createFakeDb> }));
vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("./fakeDb");
  fake.db = createFakeDb();
  return { db: fake.db };
});

import {
  exchangeCode,
  isAllowedRedirectUri,
  issueAuthCode,
  pkceChallenge,
  refreshTokens,
  registerClient,
  validateAuthorizeRequest,
  verifyAccessToken,
  verifyPkce,
} from "@/lib/mcp/oauth";
import { isPrivateAddress } from "@/lib/mcp/media";
import { safeNext } from "@/lib/session";

const ORIGIN = "https://drfiraszoghieb.com";
const REDIRECT = "https://chatgpt.com/connector_platform_oauth_redirect";
const VERIFIER = "a".repeat(43);

async function authorize() {
  const client = await registerClient({ client_name: "ChatGPT", redirect_uris: [REDIRECT] });
  const params = await validateAuthorizeRequest(
    new URLSearchParams({
      client_id: String(client.id),
      redirect_uri: REDIRECT,
      response_type: "code",
      code_challenge: pkceChallenge(VERIFIER),
      code_challenge_method: "S256",
      resource: `${ORIGIN}/api/mcp`,
    }),
    ORIGIN
  );
  const code = await issueAuthCode(params);
  return { clientId: String(client.id), code };
}

describe("MCP OAuth", () => {
  beforeEach(() => {
    fake.db.reset();
    process.env.ADMIN_SECRET = "first-secret";
  });

  it("allows only ChatGPT/Claude https redirect hosts", () => {
    expect(isAllowedRedirectUri(REDIRECT)).toBe(true);
    expect(isAllowedRedirectUri("https://claude.ai/api/mcp/auth_callback")).toBe(true);
    expect(isAllowedRedirectUri("https://evil.example/cb")).toBe(false);
    expect(isAllowedRedirectUri("http://chatgpt.com/cb")).toBe(false);
  });

  it("checks PKCE S256", () => {
    expect(verifyPkce(VERIFIER, pkceChallenge(VERIFIER))).toBe(true);
    expect(verifyPkce("b".repeat(43), pkceChallenge(VERIFIER))).toBe(false);
    expect(verifyPkce("short", pkceChallenge("short"))).toBe(false);
  });

  it("issues tokens for a valid code and accepts the access token", async () => {
    const { clientId, code } = await authorize();
    const tokens = await exchangeCode({ code, clientId, redirectUri: REDIRECT, codeVerifier: VERIFIER });
    const verified = await verifyAccessToken(tokens.access_token, ORIGIN);
    expect(verified?.extra.clientName).toBe("Test client");
    expect(await verifyAccessToken(tokens.access_token, "https://other.example")).toBeUndefined();
  });

  it("revokes everything issued from a code that is replayed", async () => {
    const { clientId, code } = await authorize();
    const tokens = await exchangeCode({ code, clientId, redirectUri: REDIRECT, codeVerifier: VERIFIER });
    await expect(exchangeCode({ code, clientId, redirectUri: REDIRECT, codeVerifier: VERIFIER })).rejects.toThrow();
    expect(await verifyAccessToken(tokens.access_token, ORIGIN)).toBeUndefined();
  });

  it("rotates refresh tokens and treats reuse as a leak", async () => {
    const { clientId, code } = await authorize();
    const first = await exchangeCode({ code, clientId, redirectUri: REDIRECT, codeVerifier: VERIFIER });
    const second = await refreshTokens({ refreshToken: first.refresh_token, clientId });
    expect(await verifyAccessToken(second.access_token, ORIGIN)).toBeDefined();
    await expect(refreshTokens({ refreshToken: first.refresh_token, clientId })).rejects.toThrow();
    expect(await verifyAccessToken(second.access_token, ORIGIN)).toBeUndefined();
  });

  it("disconnects every assistant when ADMIN_SECRET changes", async () => {
    const { clientId, code } = await authorize();
    const tokens = await exchangeCode({ code, clientId, redirectUri: REDIRECT, codeVerifier: VERIFIER });
    process.env.ADMIN_SECRET = "rotated-secret";
    expect(await verifyAccessToken(tokens.access_token, ORIGIN)).toBeUndefined();
    await expect(refreshTokens({ refreshToken: tokens.refresh_token, clientId })).rejects.toThrow();
  });

  it("rejects a resource other than this server", async () => {
    const client = await registerClient({ redirect_uris: [REDIRECT] });
    await expect(
      validateAuthorizeRequest(
        new URLSearchParams({
          client_id: String(client.id),
          redirect_uri: REDIRECT,
          response_type: "code",
          code_challenge: "x",
          code_challenge_method: "S256",
          resource: "https://evil.example/api/mcp",
        }),
        ORIGIN
      )
    ).rejects.toThrow(/resource/);
  });
});

describe("login return path", () => {
  it("only returns to dashboard paths on this site", () => {
    expect(safeNext("/dashboard/connections/consent?client_id=1")).toBe("/dashboard/connections/consent?client_id=1");
    expect(safeNext("//evil.example")).toBe("/dashboard");
    expect(safeNext("https://evil.example/dashboard")).toBe("/dashboard");
    expect(safeNext("/dashboardevil")).toBe("/dashboard");
    expect(safeNext("/dashboard//evil.example")).toBe("/dashboard");
    expect(safeNext(null)).toBe("/dashboard");
  });
});

describe("SSRF guard", () => {
  it("flags private and loopback addresses", () => {
    for (const a of ["127.0.0.1", "10.0.0.5", "192.168.1.1", "172.16.0.1", "169.254.169.254", "100.64.0.1", "::1", "fd00::1", "::ffff:127.0.0.1"])
      expect(isPrivateAddress(a), a).toBe(true);
    for (const a of ["8.8.8.8", "151.101.1.69", "2606:4700::1111"]) expect(isPrivateAddress(a), a).toBe(false);
  });
});
