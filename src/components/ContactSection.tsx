import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export default async function ContactSection() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  const mapUrl = s.mapUrl || "";
  const phone = s.phone || "";
  const email = s.email || "";
  const formEmail = s.formEmail || email;
  const address = s.address || "";
  const whatsapp = s.whatsapp || "";

  return (
    <section id="book" className="bg-[#0d0d0d] border-t border-white/[0.06] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            Get in Touch
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Book a Consultation
          </h2>
          <p className="text-white/45 text-sm mt-3 max-w-md mx-auto">
            Fill in the form and Dr. Firas&apos; team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* ── Left: Contact Form ───────────────────── */}
          <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            <form
              action={`mailto:${formEmail}`}
              method="GET"
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#c9a84c] mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Jane Smith"
                    className="w-full bg-[#1c1c1c] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#c9a84c] mb-1.5 uppercase tracking-wide">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+971 50 000 0000"
                    className="w-full bg-[#1c1c1c] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c9a84c] mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full bg-[#1c1c1c] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c9a84c] mb-1.5 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us a little about what you're looking for…"
                  className="w-full bg-[#1c1c1c] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full border border-[#c9a84c]/50 text-[#c9a84c] font-semibold py-3 rounded-xl text-sm hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-200"
              >
                Send Message
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
                    {address}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* ── Right: Google Map ─────────────────────── */}
          <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden min-h-[400px] md:min-h-0">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[400px]"
                style={{ border: 0, filter: "grayscale(30%) invert(92%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-white/30 px-8 text-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white/40">No map configured</p>
                  <p className="text-xs mt-1">Add a Google Maps embed URL in Dashboard → Settings</p>
                </div>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 text-[#c9a84c] hover:text-[#b8943d] transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.529 5.845L.057 23.43l5.736-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.664-.507-5.193-1.394l-.371-.221-3.405.894.907-3.308-.243-.381A9.941 9.941 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
