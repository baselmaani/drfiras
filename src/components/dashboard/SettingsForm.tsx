"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings } from "@/lib/actions/settings";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

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
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <ImageUpload
            name="logoUrl"
            defaultValue={initialData["logoUrl"] ?? ""}
            label="Upload Logo"
          />
          <p className="text-xs text-gray-400 mt-1.5">Recommended: transparent PNG or SVG, at least 200px tall. Leave empty to use the default text logo.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("doctorName", "Doctor Name", "text", "Dr. Firas")}
          {field("specialty", "Specialty / Title", "text", "Cosmetic Dentist")}
          {field("phone", "Phone", "tel", "+44 7700 000000")}
          {field("email", "Email", "email", "hello@drfiras.com")}
        </div>
        <div className="mt-4">
          {field("address", "Address", "textarea", "123 Street, Dubai")}
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

      {/* Contact Form & Map */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-1 pb-2 border-b border-gray-100">
          Contact Form &amp; Map
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          The contact form sends to your clinic email above. Paste a Google Maps embed URL to show the map on the contact section.
        </p>
        <div className="space-y-4">
          {field("formEmail", "Form Destination Email", "email", "hello@drfiras.com")}
          {field("mapUrl", "Google Maps Embed URL", "url", "https://maps.google.com/maps?q=...&output=embed")}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          To get the embed URL: open Google Maps → search your clinic → Share → Embed a map → copy the <code className="bg-gray-100 px-1 rounded">src</code> value from the iframe code.
        </p>
      </section>

      {/* SMTP */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-1 pb-2 border-b border-gray-100">
          SMTP Email Settings
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Configure your outgoing mail server so contact form submissions are sent as real emails.
          Common providers: Gmail (smtp.gmail.com, port 587), Outlook (smtp.office365.com, port 587), custom hosting.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("smtpHost", "SMTP Host", "text", "smtp.gmail.com")}
          {field("smtpPort", "SMTP Port", "text", "587")}
          {field("smtpUser", "SMTP Username / Email", "email", "you@gmail.com")}
          {field("smtpPass", "SMTP Password / App Password", "text", "")}
          {field("smtpFrom", "From Name & Address", "text", "Dr. Firas <hello@drfiras.com>")}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          For Gmail, use an <strong>App Password</strong> (not your main password): Google Account → Security → 2-Step Verification → App passwords.
        </p>
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

      {/* Google Reviews */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Google Reviews
        </h2>
        <div className="space-y-4">
          {/* hidden fallback so unchecked sends "false"; checkbox "true" follows to override when checked */}
          <input type="hidden" name="googleReviewsEnabled" value="false" />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="googleReviewsEnabled"
              name="googleReviewsEnabled"
              defaultChecked={initialData["googleReviewsEnabled"] !== "false"}
              value="true"
              className="w-4 h-4 rounded border-gray-300 text-[#1b4f72] focus:ring-[#1b4f72]/20"
            />
            <label htmlFor="googleReviewsEnabled" className="text-sm font-medium text-gray-700">
              Show Google Reviews section on homepage
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {field("googleRating", "Overall Rating", "text", "4.9")}
            {field("googleReviewCount", "Review Count Label", "text", "127 reviews")}
            {field("googleReviewsUrl", "Google Reviews URL", "url", "https://g.page/r/…/review")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Individual Reviews (JSON)
            </label>
            <textarea
              name="googleReviews"
              defaultValue={initialData["googleReviews"] ?? ""}
              rows={8}
              placeholder={`[\n  {\n    "name": "Sarah M.",\n    "rating": 5,\n    "text": "Amazing results!",\n    "date": "February 2025"\n  }\n]`}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/20 focus:border-[#1b4f72] resize-y"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Paste a JSON array of reviews. Each review needs: <code className="bg-gray-100 px-1 py-0.5 rounded">name</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">rating</code> (1–5), <code className="bg-gray-100 px-1 py-0.5 rounded">text</code>, and <code className="bg-gray-100 px-1 py-0.5 rounded">date</code>. Leave empty to use built-in sample reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Instagram Feed
        </h2>
        <div className="space-y-4">
          <input type="hidden" name="instagramEnabled" value="false" />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="instagramEnabled"
              name="instagramEnabled"
              defaultChecked={initialData["instagramEnabled"] !== "false"}
              value="true"
              className="w-4 h-4 rounded border-gray-300 text-[#1b4f72] focus:ring-[#1b4f72]/20"
            />
            <label htmlFor="instagramEnabled" className="text-sm font-medium text-gray-700">
              Show Instagram section on homepage
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field("instagramHandle", "Instagram Handle (without @)", "text", "dr.firaszoghieb")}
            {field("instagramFollowers", "Followers Label", "text", "e.g. 12.4k")}
          </div>
          <div>
            {field("instagramBio", "Profile Bio (shown under handle)", "text", "Cosmetic Dentist · Composite Bonding · Invisalign")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last 6 Posts (JSON)
            </label>
            <textarea
              name="instagramPosts"
              defaultValue={initialData["instagramPosts"] ?? ""}
              rows={10}
              placeholder={`[\n  {\n    "image": "https://…/photo.jpg",\n    "caption": "Smile transformation ✨",\n    "url": "https://www.instagram.com/p/ABC123"\n  }\n]`}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/20 focus:border-[#1b4f72] resize-y"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Paste a JSON array with up to 6 posts. Each post needs:{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">image</code> (URL),{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">caption</code>, and optionally{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">url</code> (direct link to the post). Leave empty to show placeholders.
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
