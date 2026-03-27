"use client";
import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

const cls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30";

export function ContactSectionForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}

      {/* Section heading */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Section Heading</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Eyebrow label</label>
          <input name="contactEyebrow" defaultValue={values.contactEyebrow ?? "Get in Touch"} className={cls} placeholder="e.g. Get in Touch" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Heading</label>
          <input name="contactHeading" defaultValue={values.contactHeading ?? "Book a Consultation"} className={cls} placeholder="e.g. Book a Consultation" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea name="contactDesc" rows={2} defaultValue={values.contactDesc ?? ""} className={`${cls} resize-none`} />
        </div>
      </div>

      {/* Clinic contact details */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Clinic Contact Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Name</label>
            <input name="doctorName" defaultValue={values.doctorName ?? ""} className={cls} placeholder="Dr. Firas Zoghieb" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialty</label>
            <input name="specialty" defaultValue={values.specialty ?? ""} className={cls} placeholder="Cosmetic Dentist" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input name="phone" type="tel" defaultValue={values.phone ?? ""} className={cls} placeholder="+971 50 000 0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
            <input name="whatsapp" type="tel" defaultValue={values.whatsapp ?? ""} className={cls} placeholder="+971500000000 (digits only)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (public)</label>
            <input name="email" type="email" defaultValue={values.email ?? ""} className={cls} placeholder="info@drfiras.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Form Submission Email</label>
            <input name="formEmail" type="email" defaultValue={values.formEmail ?? ""} className={cls} placeholder="Same as public email if blank" />
            <p className="text-xs text-gray-400 mt-1">Contact form submissions are sent to this address.</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <textarea name="address" rows={2} defaultValue={values.address ?? ""} className={`${cls} resize-none`} placeholder="Happiness St, Al Wasl, Dubai" />
        </div>
      </div>

      {/* Map */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Google Maps Embed</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Maps Embed URL</label>
          <textarea name="mapUrl" rows={3} defaultValue={values.mapUrl ?? ""} className={`${cls} resize-none`} placeholder="https://www.google.com/maps/embed?pb=..." />
          <p className="text-xs text-gray-400 mt-1">
            Go to Google Maps → Share → Embed a map → copy the <code className="bg-gray-100 px-1 rounded">src</code> URL from the iframe code.
          </p>
        </div>
      </div>

      <button type="submit" disabled={pending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {pending ? "Saving…" : "Save Contact Info"}
      </button>
    </form>
  );
}
