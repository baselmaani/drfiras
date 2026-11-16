import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { revalidatePath } from "next/cache";
import { MCP_PATH, MCP_SCOPE, mcpEnabled, publicOrigin, verifyAccessToken } from "@/lib/mcp/oauth";
import { mutatingTools, registerTools } from "@/lib/mcp/tools";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * The AI connector (Model Context Protocol) for ChatGPT and Claude: https://<site>/api/mcp.
 * Off unless MCP_ENABLED=true. Every call needs an OAuth token approved from the dashboard.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const handler = createMcpHandler(registerTools, {
  serverInfo: { name: "dr-firas-website", version: "1.0.0" },
});

/** Names of the tools a JSON-RPC body (one message or a batch) calls. */
async function calledTools(request: Request): Promise<string[]> {
  if (request.method !== "POST") return [];
  const body = await request.json().catch(() => null);
  const messages: { method?: string; params?: { name?: unknown } }[] = Array.isArray(body) ? body : [body];
  return messages
    .filter((m) => m?.method === "tools/call" && typeof m.params?.name === "string")
    .map((m) => String(m.params!.name));
}

async function guarded(request: Request) {
  if (!mcpEnabled()) return new Response(null, { status: 404 });
  if (!rateLimit(`mcp:${clientIp(request)}`, 240, 60)) return new Response(null, { status: 429 });
  const origin = publicOrigin(request);
  const authenticated = withMcpAuth(handler, (_req, token) => verifyAccessToken(token, origin), {
    required: true,
    requiredScopes: [MCP_SCOPE],
    // mcp-handler builds the 401's resource_metadata link as `${resourceUrl}${resourceMetadataPath}`,
    // so this is the origin plus the RFC 9728 path-suffixed document (served by .well-known/…/api/mcp).
    resourceUrl: origin,
    resourceMetadataPath: `/.well-known/oauth-protected-resource${MCP_PATH}`,
  });
  const called = calledTools(request.clone());
  // Read the whole body before returning: the handler answers with a stream, and the tool has to
  // finish before the public cache is refreshed.
  const response = await authenticated(request);
  const body = response.body ? await response.text() : null;
  // Tool callbacks run outside this request's scope, so a refresh made inside a tool is lost.
  // Refresh every public page here instead whenever a tool that changes the site ran.
  if (response.ok && (await called).some((name) => mutatingTools.has(name))) {
    revalidatePath("/", "layout");
  }
  return new Response(body, { status: response.status, headers: response.headers });
}

export { guarded as GET, guarded as POST, guarded as DELETE };
