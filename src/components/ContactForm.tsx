"use client";

import { useState } from "react";

type Props = {
  phone: string;
  email: string;
  address: string;
  googleBusinessUrl?: string;
};

export default function ContactForm({ phone, email, address, googleBusinessUrl }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      message: fd.get("message") as string,
      website: fd.get("website") as string, // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-[#1c1c1c] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white [&::placeholder]:text-white/20 [&::placeholder]:italic focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors";

  const labelClass = "block text-xs font-medium text-[#c9a84c] mb-1.5 uppercase tracking-wide";

  return (
    <div className="contact-form-dark">
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "success" && (
        <div className="bg-green-900/30 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm">
          ✓ Message sent! We&apos;ll get back to you within 24 hours.
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Honeypot anti-spam: hidden from real users, bots fill it in */}
      <div aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
        <input type="text" name="website" autoComplete="off" tabIndex={-1} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name <span className="text-[#c9a84c]">*</span></label>
          <input type="text" name="name" required placeholder="Jane Smith" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone <span className="text-[#c9a84c]">*</span></label>
          <input type="tel" name="phone" required placeholder="+971 50 000 0000" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email <span className="text-[#c9a84c]">*</span></label>
        <input type="email" name="email" required placeholder="jane@example.com" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Message <span className="text-[#c9a84c]">*</span></label>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Tell us a little about what you're looking for…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full border border-[#c9a84c]/50 text-[#c9a84c] font-semibold py-3 rounded-xl text-sm hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {/* Contact info below button */}
      <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/40">
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-white/70 transition-colors">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white/70 transition-colors truncate">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {email}
          </a>
        )}
        {address && (
          <span className="flex items-start gap-2 sm:col-span-2">
            <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {googleBusinessUrl ? (
              <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a84c] transition-colors">{address}</a>
            ) : (
              address
            )}
          </span>
        )}
      </div>
    </form>
    </div>
  );
}
