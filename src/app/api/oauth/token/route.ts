import { NextResponse } from "next/server";
import { exchangeCode, mcpEnabled, OAuthError, refreshTokens } from "@/lib/mcp/oauth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const NO_STORE = { "Cache-Control": "no-store", Pragma: "no-cache" };

/** Token endpoint: authorization code (with PKCE) and refresh token grants. */
export async function POST(request: Request) {
  if (!mcpEnabled()) return new NextResponse(null, { status: 404 });
  if (!rateLimit(`mcp-token:${clientIp(request)}`, 30, 60))
    return NextResponse.json({ error: "slow_down" }, { status: 429 });
  try {
    const form = await request.formData().catch(() => null);
    const field = (name: string) => {
      const v = form?.get(name);
      return typeof v === "string" ? v : "";
    };
    const clientId = field("client_id");
    if (!clientId) throw new OAuthError("invalid_client", "client_id is required", 401);
    const grant = field("grant_type");
    let tokens;
    if (grant === "authorization_code") {
      tokens = await exchangeCode({
        code: field("code"),
        clientId,
        redirectUri: field("redirect_uri"),
        codeVerifier: field("code_verifier"),
      });
    } else if (grant === "refresh_token") {
      tokens = await refreshTokens({ refreshToken: field("refresh_token"), clientId });
    } else {
      throw new OAuthError("unsupported_grant_type", "Unsupported grant_type");
    }
    return NextResponse.json(tokens, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof OAuthError)
      return NextResponse.json(
        { error: error.code, error_description: error.message },
        { status: error.status, headers: NO_STORE }
      );
    console.error("MCP token exchange failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500, headers: NO_STORE });
  }
}
