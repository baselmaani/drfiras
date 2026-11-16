import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { disconnectAssistant, undoAiChange } from "@/lib/actions/connections";
import { listConnections, mcpEnabled } from "@/lib/mcp/oauth";
import { changedFields } from "@/lib/mcp/write";
import { ActionButton } from "./ActionButton";

const card = "bg-white rounded-2xl border border-gray-100 p-6";
const fmt = (d: Date) =>
  d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function ConnectionsPage() {
  const enabled = mcpEnabled();
  const [connections, changes] = await Promise.all([
    listConnections(),
    db.mcpAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  const endpoint = `${SITE_URL.replace(/\/$/, "")}/api/mcp`;

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400 text-sm">Dashboard / AI connections</p>
        <h1 className="text-2xl font-bold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
          AI connections
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Let ChatGPT or Claude read, add, edit and delete website content for you. Every change is listed below and can be undone.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card}>
          <h2 className="font-semibold text-gray-800">Status</h2>
          {enabled ? (
            <p className="mt-2 text-sm text-green-700">Switched on.</p>
          ) : (
            <p className="mt-2 text-sm text-yellow-700">
              Switched off. Set <code>MCP_ENABLED=true</code> in the Vercel project&rsquo;s environment variables and redeploy.
            </p>
          )}
          <p className="mt-4 text-sm text-gray-600">Connector URL:</p>
          <p className="mt-1 select-all break-all rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm">{endpoint}</p>
        </section>
        <section className={card}>
          <h2 className="font-semibold text-gray-800">How to connect</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-gray-600">
            <li>
              <strong>ChatGPT</strong>: Settings → Apps &amp; Connectors → Advanced settings → turn on Developer mode → Create → paste the
              URL, authentication OAuth.
            </li>
            <li>
              <strong>Claude</strong>: Settings → Connectors → Add custom connector → paste the URL.
            </li>
            <li>Sign in here with the dashboard password when asked, then click Allow.</li>
          </ol>
          <p className="mt-3 text-xs text-gray-400">
            Changing the dashboard password (ADMIN_SECRET) disconnects every assistant. Mail (SMTP) settings are never shared.
          </p>
        </section>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold text-gray-800">Connected assistants</h2>
      {connections.length === 0 ? (
        <p className="text-sm text-gray-400">None yet.</p>
      ) : (
        <ul className="divide-y divide-gray-50 bg-white rounded-2xl border border-gray-100">
          {connections.map((c) => (
            <li key={c.familyId} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm">
              <span>
                <span className="font-medium text-gray-800">{c.clientName}</span>
                <span className="block text-xs text-gray-400 mt-0.5">
                  Connected {fmt(c.connectedAt)} · last used {c.lastUsedAt ? fmt(c.lastUsedAt) : "never"}
                </span>
              </span>
              <ActionButton
                action={disconnectAssistant}
                arg={c.familyId}
                label="Disconnect"
                confirmText={`Disconnect ${c.clientName}? It will need to be approved again.`}
              />
            </li>
          ))}
        </ul>
      )}

      <h2 className="mb-3 mt-10 text-lg font-semibold text-gray-800">Recent changes by AI</h2>
      {changes.length === 0 ? (
        <p className="text-sm text-gray-400">No changes yet.</p>
      ) : (
        <ul className="divide-y divide-gray-50 bg-white rounded-2xl border border-gray-100">
          {changes.map((r) => {
            const before = r.before as Record<string, unknown> | null;
            const after = r.after as Record<string, unknown> | null;
            const kind = before == null ? "Created" : after == null ? "Deleted" : "Changed";
            const canUndo = r.entity !== "media_file" || after !== null;
            return (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm">
                <span className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {kind} · {r.entity.replace("_", " ")}
                  </span>{" "}
                  <span className="font-medium text-gray-800">{r.label}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {fmt(r.createdAt)} · {r.clientName ?? "AI"} · {r.tool}
                    {kind === "Changed" ? ` · ${changedFields(before, after).slice(0, 8).join(", ")}` : ""}
                  </span>
                </span>
                {canUndo && (
                  <ActionButton
                    action={undoAiChange}
                    arg={r.id}
                    label="Undo"
                    confirmText="Put this back to how it was before this change?"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
