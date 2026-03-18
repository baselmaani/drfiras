"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings } from "@/lib/actions/settings";

type Settings = Record<string, string>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#1b4f72] text-white px-8 py-2.5 rounded-xl font-medium hover:bg-[#163f5a] transition-colors disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Settings"}
    </button>
  );
}

export function SettingsForm({ initialData }: { initialData: Settings }) {
  const [state, formAction] = useActionState(updateSettings, null);

  const field = (
    key: string,
    label: string,
    type: "text" | "email" | "tel" | "url" | "textarea" = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={key}
          defaultValue={initialData[key] ?? ""}
          placeholder={placeholder}
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/20 focus:border-[#1b4f72] resize-none"
        />
      ) : (
        <input
          type={type}
          name={key}
          defaultValue={initialData[key] ?? ""}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/20 focus:border-[#1b4f72]"
        />
      )}
    </div>
  );

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          Settings saved successfully.
        </div>
      )}

      {/* Clinic Info */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Clinic Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("doctorName", "Doctor Name", "text", "Dr. Firas")}
          {field("specialty", "Specialty / Title", "text", "Cosmetic Dentist")}
          {field("phone", "Phone", "tel", "+44 7700 000000")}
          {field("email", "Email", "email", "hello@drfiras.com")}
        </div>
        <div className="mt-4">
          {field("address", "Address", "textarea", "123 Harley St, London W1G 6BA")}
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          About Text
        </h2>
        {field(
          "aboutText",
          "Short Bio (shown on homepage)",
          "textarea",
          "Dr. Firas is a specialist in cosmetic and restorative dentistry…"
        )}
      </section>

      {/* Social & Booking */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Social & Booking Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("instagram", "Instagram URL", "url", "https://instagram.com/drfiras")}
          {field("facebook", "Facebook URL", "url", "https://facebook.com/drfiras")}
          {field("whatsapp", "WhatsApp Link", "url", "https://wa.me/447700000000")}
          {field("bookingUrl", "Online Booking URL", "url", "https://calendly.com/drfiras")}
        </div>
      </section>

      {/* SEO */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Site SEO Defaults
        </h2>
        <div className="space-y-4">
          {field("metaTitle", "Default Meta Title", "text", "Dr. Firas | Cosmetic Dentist")}
          {field(
            "metaDescription",
            "Default Meta Description",
            "textarea",
            "Dr. Firas is a specialist cosmetic dentist…"
          )}
          {field("ogImage", "Default OG Image URL", "url", "https://…/og-image.jpg")}
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
