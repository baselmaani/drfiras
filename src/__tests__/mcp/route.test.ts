import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeDb } from "./fakeDb";

const fake = vi.hoisted(() => ({ db: null as unknown as ReturnType<typeof createFakeDb> }));
vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("./fakeDb");
  fake.db = createFakeDb();
  return { db: fake.db };
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { revalidatePath } from "next/cache";
import { POST } from "@/app/api/mcp/route";
import { exchangeCode, issueAuthCode, pkceChallenge, registerClient, validateAuthorizeRequest } from "@/lib/mcp/oauth";

const ORIGIN = "http://localhost:3000";
const REDIRECT = "https://chatgpt.com/cb";
const VERIFIER = "v".repeat(50);

async function accessToken() {
  const client = await registerClient({ client_name: "ChatGPT", redirect_uris: [REDIRECT] });
  const params = await validateAuthorizeRequest(
    new URLSearchParams({
      client_id: String(client.id),
      redirect_uri: REDIRECT,
      response_type: "code",
      code_challenge: pkceChallenge(VERIFIER),
      code_challenge_method: "S256",
    }),
    ORIGIN
  );
  const code = await issueAuthCode(params);
  const tokens = await exchangeCode({ code, clientId: String(client.id), redirectUri: REDIRECT, codeVerifier: VERIFIER });
  return tokens.access_token;
}

let rpcId = 0;
async function rpc(method: string, params: unknown, token?: string) {
  const res = await POST(
    new Request(`${ORIGIN}/api/mcp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }),
    })
  );
  const text = await res.text();
  // Streamable HTTP may answer as an SSE stream: take the JSON from the data: line.
  const json = text.startsWith("{") ? text : text.split("\n").find((l) => l.startsWith("data:"))?.slice(5);
  return { status: res.status, headers: res.headers, body: json ? JSON.parse(json) : null };
}

describe("/api/mcp", () => {
  beforeEach(() => {
    fake.db.reset();
    process.env.ADMIN_SECRET = "secret";
    process.env.MCP_ENABLED = "true";
  });

  it("is invisible when switched off", async () => {
    process.env.MCP_ENABLED = "false";
    expect((await rpc("tools/list", {})).status).toBe(404);
  });

  it("asks for OAuth without a token", async () => {
    const res = await rpc("tools/list", {});
    expect(res.status).toBe(401);
    expect(res.headers.get("www-authenticate")).toContain(
      `resource_metadata="${ORIGIN}/.well-known/oauth-protected-resource/api/mcp"`
    );
  });

  it("lists tools and runs a write, refreshing the public cache", async () => {
    const token = await accessToken();
    await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "1" } }, token);

    const list = await rpc("tools/list", {}, token);
    const names = list.body.result.tools.map((t: { name: string }) => t.name);
    expect(names).toEqual(
      expect.arrayContaining(["get_site_overview", "create_content", "update_settings", "delete_media", "restore_revision"])
    );

    const created = await rpc(
      "tools/call",
      { name: "create_content", arguments: { type: "post", fields: { title: "Hello", content: "<p>Hi</p>" } } },
      token
    );
    expect(created.body.result.isError).toBeFalsy();
    expect(JSON.parse(created.body.result.content[0].text).liveUrl).toBe("https://drfiraszoghieb.com/blog/hello");
    expect(fake.db.post.rows()).toHaveLength(1);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("does not refresh the cache for read-only tools", async () => {
    const token = await accessToken();
    const res = await rpc("tools/call", { name: "list_content", arguments: { type: "post" } }, token);
    expect(res.body.result.isError).toBeFalsy();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
