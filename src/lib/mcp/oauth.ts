import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

/**
 * OAuth 2.1 authorization server for the AI connector (ChatGPT and Claude).
 *
 * Both reach a remote MCP server through OAuth (Authorization Code + PKCE S256) with dynamic
 * client registration. The human step is the existing dashboard login (ADMIN_SECRET) plus a
 * consent click. Tokens are opaque random strings stored as SHA-256 hashes and can be revoked in
 * Dashboard → AI connections. Every grant records a fingerprint of ADMIN_SECRET, so changing the
 * password disconnects every assistant, just as it logs out every dashboard session.
 */
export const MCP_SCOPE = "mcp:admin";
export const MCP_PATH = "/api/mcp";

const CODE_TTL_MS = 5 * 60 * 1000;
const ACCESS_TTL_MS = 60 * 60 * 1000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** ChatGPT, plus Claude, which calls back to claude.ai or claude.com. */
const DEFAULT_REDIRECT_HOSTS = ["chatgpt.com", "chat.openai.com", "claude.ai", "claude.com"];

/** The whole connector answers 404 unless this is switched on. */
export const mcpEnabled = () => process.env.MCP_ENABLED === "true";

/**
 * The issuer must not follow the request's Host header in production. Local and preview
 * deployments have no fixed URL, so they use the request's origin.
 */
export function publicOrigin(request: Request): string {
  if (process.env.MCP_PUBLIC_URL) return process.env.MCP_PUBLIC_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return SITE_URL.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export const mcpResourceUrl = (origin: string) => `${origin}${MCP_PATH}`;
export const hashSecret = (secret: string) => createHash("sha256").update(secret).digest("hex");
const newSecret = () => randomBytes(32).toString("base64url");

/** Identifies the current dashboard password without storing it. Null when no password is set. */
export function secretFingerprint(): string | null {
  const secret = process.env.ADMIN_SECRET;
  return secret ? hashSecret(`mcp:${secret}`) : null;
}

const fingerprintMatches = (stored: string) => {
  const current = secretFingerprint();
  return current !== null && current === stored;
};

export const pkceChallenge = (verifier: string) => createHash("sha256").update(verifier).digest("base64url");

export function verifyPkce(verifier: string, challenge: string): boolean {
  // RFC 7636 §4.1 bounds and alphabet.
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) return false;
  const a = Buffer.from(pkceChallenge(verifier));
  const b = Buffer.from(challenge);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isAllowedRedirectUri(uri: string): boolean {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  if (url.hash || url.username || url.password) return false;
  const isLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLoopback) return process.env.NODE_ENV !== "production" || process.env.MCP_ALLOW_LOOPBACK === "true";
  const extra = (process.env.MCP_ALLOWED_REDIRECT_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return url.protocol === "https:" && [...DEFAULT_REDIRECT_HOSTS, ...extra].includes(url.hostname);
}

export class OAuthError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400
  ) {
    super(message);
  }
}

export async function registerClient(input: { client_name?: unknown; redirect_uris?: unknown }) {
  const uris = input.redirect_uris;
  if (!Array.isArray(uris) || uris.length === 0 || uris.length > 5)
    throw new OAuthError("invalid_redirect_uri", "redirect_uris must list 1-5 URIs");
  if (!uris.every((u) => typeof u === "string" && u.length <= 2000 && isAllowedRedirectUri(u)))
    throw new OAuthError("invalid_redirect_uri", "redirect_uri host is not allowed");
  const name = typeof input.client_name === "string" ? input.client_name.trim().slice(0, 100) : "";
  return db.mcpClient.create({
    data: { name: name || "AI assistant", redirectUris: uris as string[] },
  });
}

export type AuthorizeParams = {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state: string | null;
  resource: string;
  scope: string;
  clientName: string;
};

/** Checks an authorization request. Throws before any redirect when the client or redirect URI is bad. */
export async function validateAuthorizeRequest(params: URLSearchParams, origin: string): Promise<AuthorizeParams> {
  const clientId = params.get("client_id");
  const redirectUri = params.get("redirect_uri");
  const client = clientId ? await db.mcpClient.findUnique({ where: { id: clientId } }) : null;
  if (!client) throw new OAuthError("invalid_client", "Unknown client");
  if (!redirectUri || !client.redirectUris.includes(redirectUri))
    throw new OAuthError("invalid_request", "redirect_uri does not match the registered value");
  if (params.get("response_type") !== "code")
    throw new OAuthError("unsupported_response_type", "Only response_type=code is supported");
  const challenge = params.get("code_challenge");
  if (!challenge || params.get("code_challenge_method") !== "S256")
    throw new OAuthError("invalid_request", "PKCE with S256 is required");
  const expected = mcpResourceUrl(origin);
  const resource = params.get("resource");
  if (resource && resource.replace(/\/$/, "") !== expected)
    throw new OAuthError("invalid_target", "resource must be this server");
  return {
    clientId: client.id,
    redirectUri,
    codeChallenge: challenge,
    state: params.get("state"),
    resource: expected,
    scope: MCP_SCOPE,
    clientName: client.name,
  };
}

/** The redirect back to the client. `iss` is included on success and error (RFC 9207). */
export function clientRedirect(
  redirectUri: string,
  origin: string,
  state: string | null,
  result: { code: string } | { error: string }
) {
  const url = new URL(redirectUri);
  for (const [k, v] of Object.entries(result)) url.searchParams.set(k, v);
  if (state) url.searchParams.set("state", state);
  url.searchParams.set("iss", origin);
  return url.toString();
}

export async function issueAuthCode(params: AuthorizeParams) {
  const fingerprint = secretFingerprint();
  if (!fingerprint) throw new OAuthError("server_error", "ADMIN_SECRET is not set", 500);
  const code = newSecret();
  await db.mcpAuthCode.create({
    data: {
      codeHash: hashSecret(code),
      clientId: params.clientId,
      redirectUri: params.redirectUri,
      codeChallenge: params.codeChallenge,
      resource: params.resource,
      scope: params.scope,
      familyId: randomUUID(),
      secretFingerprint: fingerprint,
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    },
  });
  return code;
}

async function createTokenPair(input: {
  familyId: string;
  clientId: string;
  resource: string;
  scope: string;
  secretFingerprint: string;
}) {
  const accessToken = newSecret();
  const refreshToken = newSecret();
  const now = Date.now();
  await db.mcpToken.create({
    data: {
      ...input,
      accessHash: hashSecret(accessToken),
      refreshHash: hashSecret(refreshToken),
      accessExpiresAt: new Date(now + ACCESS_TTL_MS),
      refreshExpiresAt: new Date(now + REFRESH_TTL_MS),
    },
  });
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: ACCESS_TTL_MS / 1000,
    scope: input.scope,
  };
}

export async function revokeFamily(familyId: string) {
  await db.mcpToken.updateMany({
    where: { familyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function exchangeCode(input: { code: string; clientId: string; redirectUri: string; codeVerifier: string }) {
  const row = await db.mcpAuthCode.findUnique({ where: { codeHash: hashSecret(input.code) } });
  const invalid = new OAuthError("invalid_grant", "Authorization code is invalid or expired");
  if (!row) throw invalid;
  if (row.usedAt) {
    // OAuth 2.1 §4.1.3: a replayed code means it leaked, so distrust what it issued.
    await revokeFamily(row.familyId);
    throw invalid;
  }
  if (
    row.expiresAt.getTime() <= Date.now() ||
    row.clientId !== input.clientId ||
    row.redirectUri !== input.redirectUri ||
    !verifyPkce(input.codeVerifier, row.codeChallenge) ||
    !fingerprintMatches(row.secretFingerprint)
  )
    throw invalid;
  // The conditional update makes the code single-use under concurrent requests.
  const claimed = await db.mcpAuthCode.updateMany({
    where: { id: row.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  if (claimed.count !== 1) throw invalid;
  return createTokenPair({
    familyId: row.familyId,
    clientId: row.clientId,
    resource: row.resource,
    scope: row.scope,
    secretFingerprint: row.secretFingerprint,
  });
}

export async function refreshTokens(input: { refreshToken: string; clientId: string }) {
  const row = await db.mcpToken.findUnique({ where: { refreshHash: hashSecret(input.refreshToken) } });
  const invalid = new OAuthError("invalid_grant", "Refresh token is invalid or expired");
  if (!row || row.clientId !== input.clientId) throw invalid;
  if (row.rotatedAt) {
    await revokeFamily(row.familyId); // a reused refresh token means it leaked
    throw invalid;
  }
  if (row.revokedAt || row.refreshExpiresAt.getTime() <= Date.now() || !fingerprintMatches(row.secretFingerprint))
    throw invalid;
  const claimed = await db.mcpToken.updateMany({
    where: { id: row.id, rotatedAt: null },
    data: { rotatedAt: new Date() },
  });
  if (claimed.count !== 1) {
    await revokeFamily(row.familyId);
    throw invalid;
  }
  return createTokenPair({
    familyId: row.familyId,
    clientId: row.clientId,
    resource: row.resource,
    scope: row.scope,
    secretFingerprint: row.secretFingerprint,
  });
}

export type VerifiedToken = {
  token: string;
  clientId: string;
  scopes: string[];
  expiresAt: number;
  extra: { clientName: string };
};

export async function verifyAccessToken(token: string | undefined, origin: string): Promise<VerifiedToken | undefined> {
  if (!token) return undefined;
  const row = await db.mcpToken.findUnique({
    where: { accessHash: hashSecret(token) },
    include: { client: { select: { name: true } } },
  });
  if (
    !row ||
    row.revokedAt ||
    row.rotatedAt ||
    row.accessExpiresAt.getTime() <= Date.now() ||
    row.resource !== mcpResourceUrl(origin) ||
    !fingerprintMatches(row.secretFingerprint)
  ) {
    return undefined;
  }
  // Best effort: a failed timestamp must not fail the tool call.
  db.mcpToken.update({ where: { id: row.id }, data: { lastUsedAt: new Date() } }).catch(() => {});
  return {
    token,
    clientId: row.clientId,
    scopes: row.scope.split(" "),
    expiresAt: Math.floor(row.accessExpiresAt.getTime() / 1000),
    extra: { clientName: row.client.name },
  };
}

/** Live connections for Dashboard → AI connections: the newest usable token of each family. */
export async function listConnections() {
  const fingerprint = secretFingerprint();
  const rows = await db.mcpToken.findMany({
    where: {
      revokedAt: null,
      rotatedAt: null,
      refreshExpiresAt: { gt: new Date() },
      secretFingerprint: fingerprint ?? "",
    },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } },
  });
  return rows.map((r) => ({
    familyId: r.familyId,
    clientName: r.client.name,
    connectedAt: r.createdAt,
    lastUsedAt: r.lastUsedAt,
    expiresAt: r.refreshExpiresAt,
  }));
}
