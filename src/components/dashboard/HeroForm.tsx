"use client";
import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

export function HeroForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Eyebrow text</label>
        <input name="heroEyebrow" defaultValue={values.heroEyebrow ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" placeholder="Cosmetic Dentist London" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Heading (H1)</label>
        <input name="heroHeading" defaultValue={values.heroHeading ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" placeholder="Dr. Firas" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Body text</label>
        <textarea name="heroBody" rows={4} defaultValue={values.heroBody ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 resize-none" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Button 1 text</label>
          <input name="heroCta1Text" defaultValue={values.heroCta1Text ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Button 1 link</label>
          <input name="heroCta1Link" defaultValue={values.heroCta1Link ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Button 2 text</label>
          <input name="heroCta2Text" defaultValue={values.heroCta2Text ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Button 2 link</label>
          <input name="heroCta2Link" defaultValue={values.heroCta2Link ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Portrait Image URL</label>
        <input name="heroImageUrl" type="url" defaultValue={values.heroImageUrl ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" placeholder="https://... (leave blank to show silhouette)" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Stat number</label>
          <input name="heroStatNumber" defaultValue={values.heroStatNumber ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" placeholder="500+" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Stat label</label>
          <input name="heroStatLabel" defaultValue={values.heroStatLabel ?? ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30" placeholder="Smile Transformations" />
        </div>
      </div>

      <button type="submit" disabled={pending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {pending ? "Saving…" : "Save Hero Content"}
      </button>
    </form>
  );
}
