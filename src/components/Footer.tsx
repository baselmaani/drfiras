import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export default async function Footer() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  const phone = s.phone || "";
  const email = s.email || "";
  const address = s.address || "";
  const whatsapp = s.whatsapp || "";
  const instagram = s.instagram || "#";
  const facebook = s.facebook || "#";
  const footerCtaEyebrow = s.footerCtaEyebrow || "Take the first step";
  const footerCtaTitle = s.footerCtaTitle || "Start Your Smile Journey Today";
  const footerCtaDesc = s.footerCtaDesc || "";
  const footerCtaBtn1Text = s.footerCtaBtn1Text || "Book Free Consultation";
  const footerCtaBtn2Text = s.footerCtaBtn2Text || "WhatsApp Us";
  const footerHours = s.footerHours || "";
  const footerTagline = s.footerTagline || "";

  return (
    <footer id="contact" className="bg-[#080808] text-white">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-3 gap-8 md:gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DF</span>
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Dr. Firas
              </p>
              <p className="text-white/50 text-xs">Cosmetic Dentist</p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            {footerTagline}
          </p>
          <div className="flex gap-4 mt-6">
            {/* Instagram */}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* Facebook */}
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            className="font-bold text-white text-base mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              { label: "About Dr. Firas Zoghieb", href: "#about" },
              { label: "Treatments", href: "#expertise" },
              { label: "Before & After", href: "#before-after" },
              { label: "FAQ", href: "#faq" },
              { label: "Book Consultation", href: "#book" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-[#c9a84c]">›</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4
            className="font-bold text-white text-base mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Contact
          </h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 text-[#c9a84c] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{address || "Dubai"}</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={phone ? `tel:${phone.replace(/\s/g, "")}` : "#"} className="hover:text-white transition-colors">
                {phone || "—"}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={email ? `mailto:${email}` : "#"} className="hover:text-white transition-colors">
                {email || "—"}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#c9a84c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{footerHours}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 px-6 text-center text-white/40 text-xs">
        <p>© {new Date().getFullYear()} Dr. Firas Zoghieb. All rights reserved.</p>
      </div>
    </footer>
  );
}
