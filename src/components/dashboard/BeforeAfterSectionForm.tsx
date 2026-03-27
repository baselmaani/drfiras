"use client";
import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

export function BeforeAfterSectionForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow label</label>
        <input
          name="beforeAfterEyebrow"
          defaultValue={values.beforeAfterEyebrow}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
          placeholder="e.g. Real Results"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
        <input
          name="beforeAfterHeading"
          defaultValue={values.beforeAfterHeading}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
          placeholder="e.g. Before & After"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="beforeAfterDesc"
          defaultValue={values.beforeAfterDesc}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-[#1b4f72] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
