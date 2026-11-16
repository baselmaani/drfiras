import { connection, NextResponse } from "next/server";
import { MCP_SCOPE, mcpEnabled, mcpResourceUrl, publicOrigin } from "@/lib/mcp/oauth";

/** Protected resource metadata (RFC 9728). /api/mcp re-exports this for clients that append the resource path. */
export async function GET(request: Request) {
  await connection();
  if (!mcpEnabled()) return new NextResponse(null, { status: 404 });
  const origin = publicOrigin(request);
  return NextResponse.json({
    resource: mcpResourceUrl(origin),
    authorization_servers: [origin],
    scopes_supported: [MCP_SCOPE],
    bearer_methods_supported: ["header"],
  });
}
