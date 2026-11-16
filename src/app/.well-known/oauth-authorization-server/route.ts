import { connection, NextResponse } from "next/server";
import { MCP_SCOPE, mcpEnabled, publicOrigin } from "@/lib/mcp/oauth";

/** OAuth authorization server metadata (RFC 8414) for the AI connector. */
export async function GET(request: Request) {
  await connection();
  if (!mcpEnabled()) return new NextResponse(null, { status: 404 });
  const origin = publicOrigin(request);
  return NextResponse.json({
    issuer: origin,
    authorization_endpoint: `${origin}/api/oauth/authorize`,
    token_endpoint: `${origin}/api/oauth/token`,
    registration_endpoint: `${origin}/api/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: [MCP_SCOPE],
    authorization_response_iss_parameter_supported: true,
  });
}
