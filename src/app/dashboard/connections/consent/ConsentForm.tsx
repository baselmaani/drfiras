"use client";
import { useState } from "react";

/** Allow / Deny. Posts to /api/oauth/authorize and follows the redirect back to the assistant. */
export function ConsentForm({ query }: { query: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approve" | "deny") {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/oauth/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, decision }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => null) : null;
    if (res?.ok && data?.redirect) {
      window.location.href = data.redirect;
      return;
    }
    setBusy(false);
    setError(data?.error_description ?? "Something went wrong. Start the connection again from the assistant.");
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => decide("approve")}
          className="bg-[#1b4f72] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#163f5a] transition-colors disabled:opacity-60"
        >
          Allow
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => decide("deny")}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-400 disabled:opacity-60"
        >
          Deny
        </button>
      </div>
    </div>
  );
}
