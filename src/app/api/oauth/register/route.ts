import { NextResponse } from "next/server";
import { MCP_SCOPE, mcpEnabled, OAuthError, registerClient } from "@/lib/mcp/oauth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * Dynamic client registration (RFC 7591). Open by design (that is how ChatGPT and Claude
 * connect); the redirect host allowlist and the admin's consent stand between a client and access.
 */
export async function POST(request: Request) {
  if (!mcpEnabled()) return new NextResponse(null, { status: 404 });
  if (!rateLimit(`mcp-register:${clientIp(request)}`, 10, 3600))
    return NextResponse.json({ error: "slow_down" }, { status: 429 });
  try {
    const client = await registerClient(await request.json().catch(() => ({})));
    return NextResponse.json(
      {
        client_id: client.id,
        client_id_issued_at: Math.floor(client.createdAt.getTime() / 1000),
        client_name: client.name,
        redirect_uris: client.redirectUris,
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: "none",
        scope: MCP_SCOPE,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof OAuthError)
      return NextResponse.json({ error: error.code, error_description: error.message }, { status: error.status });
    console.error("MCP client registration failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
