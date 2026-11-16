import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/adminSession";
import {
  clientRedirect,
  issueAuthCode,
  mcpEnabled,
  OAuthError,
  publicOrigin,
  validateAuthorizeRequest,
} from "@/lib/mcp/oauth";

function oauthError(error: unknown) {
  if (error instanceof OAuthError)
    return NextResponse.json({ error: error.code, error_description: error.message }, { status: error.status });
  console.error("MCP authorize failed", error);
  return NextResponse.json({ error: "server_error" }, { status: 500 });
}

/** Start of the flow: checks the request, then hands it to the consent page (which asks for the dashboard login first). */
export async function GET(request: NextRequest) {
  if (!mcpEnabled()) return new NextResponse(null, { status: 404 });
  try {
    const origin = publicOrigin(request);
    await validateAuthorizeRequest(request.nextUrl.searchParams, origin);
    return NextResponse.redirect(`${origin}/dashboard/connections/consent?${request.nextUrl.searchParams.toString()}`);
  } catch (error) {
    return oauthError(error);
  }
}

/** The consent page's Allow / Deny. Returns the redirect as JSON for the page to follow. */
export async function POST(request: NextRequest) {
  if (!mcpEnabled()) return new NextResponse(null, { status: 404 });
  const origin = publicOrigin(request);
  const sentFrom = request.headers.get("origin");
  if (sentFrom !== new URL(request.url).origin && sentFrom !== origin) {
    return NextResponse.json({ error: "access_denied" }, { status: 403 });
  }
  if (!(await isAdmin()))
    return NextResponse.json(
      { error: "access_denied", error_description: "Sign in to the dashboard first." },
      { status: 403 }
    );
  try {
    const body = await request.json();
    const params = await validateAuthorizeRequest(new URLSearchParams(String(body.query ?? "")), origin);
    const result = body.decision === "approve" ? { code: await issueAuthCode(params) } : { error: "access_denied" };
    return NextResponse.json({ redirect: clientRedirect(params.redirectUri, origin, params.state, result) });
  } catch (error) {
    return oauthError(error);
  }
}
