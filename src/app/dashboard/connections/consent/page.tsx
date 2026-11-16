import { headers } from "next/headers";
import { mcpEnabled, OAuthError, publicOrigin, validateAuthorizeRequest } from "@/lib/mcp/oauth";
import { ConsentForm } from "./ConsentForm";

const CAN = [
  "Read, add, edit and delete blog posts, services, prices, before & after cases, gallery images and menu items",
  "Edit page text, FAQs, page SEO, contact details, Google reviews and Instagram settings",
  "Upload, rename, move and delete media",
  "Publish or hide content — new content goes live immediately",
];

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // The proxy already sends signed-out visitors to the login page and back here.
  const sp = await searchParams;
  const query = new URLSearchParams(
    Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string")
  );
  const h = await headers();
  const origin = publicOrigin(new Request(`${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}/`));

  let clientName: string;
  let returnHost: string;
  try {
    if (!mcpEnabled()) throw new OAuthError("disabled", "The AI connector is switched off.");
    const params = await validateAuthorizeRequest(query, origin);
    clientName = params.clientName;
    returnHost = new URL(params.redirectUri).hostname;
  } catch (error) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
          Connection request rejected
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {error instanceof OAuthError ? error.message : "This request could not be checked."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
        Connect {clientName}?
      </h1>
      <p className="text-gray-500 text-sm mt-2 mb-4">
        After you allow it, you&rsquo;ll return to {returnHost}. It will be able to:
      </p>
      <ul className="mb-6 list-disc space-y-1.5 pl-5 text-sm text-gray-700">
        {CAN.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p className="mb-6 text-sm text-gray-500">
        It can&rsquo;t see mail (SMTP) settings. Every change is recorded and can be undone, and you can disconnect it any time
        under AI connections.
      </p>
      <ConsentForm query={query.toString()} />
    </div>
  );
}
