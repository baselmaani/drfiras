"use client";
import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

export function FooterForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}

      {/* CTA Banner */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">CTA Banner</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Eyebrow text</label>
            <input
              name="footerCtaEyebrow"
              defaultValue={values.footerCtaEyebrow ?? "Take the first step"}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
              placeholder="Take the first step"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Heading</label>
            <input
              name="footerCtaTitle"
              defaultValue={values.footerCtaTitle ?? "Start Your Smile Journey Today"}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
              placeholder="Start Your Smile Journey Today"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="footerCtaDesc"
              rows={3}
              defaultValue={values.footerCtaDesc ?? ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 resize-none"
              placeholder="Book a free, no-obligation consultation..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Button 1 text</label>
              <input
                name="footerCtaBtn1Text"
                defaultValue={values.footerCtaBtn1Text ?? "Book Free Consultation"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Button 2 text (WhatsApp)</label>
              <input
                name="footerCtaBtn2Text"
                defaultValue={values.footerCtaBtn2Text ?? "WhatsApp Us"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand & Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Brand Column</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline / description</label>
          <textarea
            name="footerTagline"
            rows={3}
            defaultValue={values.footerTagline ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 resize-none"
            placeholder="Helping patients achieve beautiful, natural-looking smiles..."
          />
        </div>
      </div>

      {/* Hours */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Contact Column</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Working hours</label>
          <input
            name="footerHours"
            defaultValue={values.footerHours ?? ""}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30"
            placeholder="Mon – Sat: 9:00 am – 7:00 pm"
          />
          <p className="text-xs text-gray-400 mt-1.5">Phone, email, and address are managed in Contact Section settings.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Footer Content"}
      </button>
    </form>
  );
}
