"use client";
import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

export function AboutForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}

      {(["aboutPara1", "aboutPara2", "aboutPara3", "aboutPara4"] as const).map((key, i) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Paragraph {i + 1}</label>
          <textarea name={key} rows={3} defaultValue={values[key] ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 resize-none" />
        </div>
      ))}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA button text</label>
          <input name="aboutCtaText" defaultValue={values.aboutCtaText ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA link</label>
          <input name="aboutCtaLink" defaultValue={values.aboutCtaLink ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" />
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Stats</h3>
        {([
          ["aboutStat1Number", "aboutStat1Label"],
          ["aboutStat2Number", "aboutStat2Label"],
          ["aboutStat3Number", "aboutStat3Label"],
        ] as const).map(([numKey, labelKey], i) => (
          <div key={numKey} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stat {i + 1} number</label>
              <input name={numKey} defaultValue={values[numKey] ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white" placeholder="500+" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stat {i + 1} label</label>
              <input name={labelKey} defaultValue={values[labelKey] ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white" placeholder="Smiles Transformed" />
            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={pending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {pending ? "Saving…" : "Save About Content"}
      </button>
    </form>
  );
}
