"use client";
import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

const cls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30";

export function NavbarForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}

      {/* Action buttons */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Action Buttons</h3>
        <p className="text-xs text-gray-400">These buttons appear on the right side of the navigation bar.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input name="phone" type="tel" defaultValue={values.phone ?? ""} className={cls} placeholder="+971 50 000 0000" />
            <p className="text-xs text-gray-400 mt-1">Shows &ldquo;Call Us&rdquo; button</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
            <input name="whatsapp" type="tel" defaultValue={values.whatsapp ?? ""} className={cls} placeholder="+971500000000" />
            <p className="text-xs text-gray-400 mt-1">Shows WhatsApp button (digits only)</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram Profile URL</label>
          <input name="instagram" defaultValue={values.instagram ?? ""} className={cls} placeholder="https://www.instagram.com/dr.firaszoghieb" />
          <p className="text-xs text-gray-400 mt-1">Shows Instagram button</p>
        </div>
      </div>

      {/* Booking link */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Booking Link</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Book Consultation URL</label>
          <input name="bookingUrl" defaultValue={values.bookingUrl ?? "#book"} className={cls} placeholder="#book or https://calendly.com/..." />
          <p className="text-xs text-gray-400 mt-1">Where CTA buttons link to. Use <code className="bg-gray-100 px-1 rounded">#book</code> to scroll to the contact form.</p>
        </div>
      </div>

      {/* Social links */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Social Links (Footer)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook URL</label>
            <input name="facebook" defaultValue={values.facebook ?? ""} className={cls} placeholder="https://facebook.com/..." />
          </div>
        </div>
      </div>

      <button type="submit" disabled={pending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {pending ? "Saving…" : "Save Navbar Settings"}
      </button>
    </form>
  );
}
