"use client";
import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

export function PageSeoForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  const pages = [
    { label: "Homepage", titleKey: "seoHomeTitle", descKey: "seoHomeDesc", kwKey: "seoHomeKeywords" },
    { label: "Blog listing", titleKey: "seoBlogTitle", descKey: "seoBlogDesc", kwKey: "seoBlogKeywords" },
    { label: "Services listing", titleKey: "seoServicesTitle", descKey: "seoServicesDesc", kwKey: "seoServicesKeywords" },
  ] as const;

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}

      {pages.map((page) => (
        <div key={page.titleKey} className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{page.label}</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
            <input
              name={page.titleKey}
              defaultValue={values[page.titleKey] ?? ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
              placeholder="Leave blank to use default"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
            <textarea
              name={page.descKey}
              rows={2}
              defaultValue={values[page.descKey] ?? ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white resize-none"
              placeholder="120–160 characters recommended"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meta Keywords</label>
            <input
              name={page.kwKey}
              defaultValue={values[page.kwKey] ?? ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
              placeholder="e.g. composite bonding dubai, cosmetic dentist"
            />
          </div>
        </div>
      ))}

      <button type="submit" disabled={pending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {pending ? "Saving…" : "Save Page SEO"}
      </button>
    </form>
  );
}
