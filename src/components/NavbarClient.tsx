"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </svg>
  );
}

function WAIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IGIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z" />
    </svg>
  );
}

export type MenuItem = {
  id: number;
  label: string;
  href: string;
  position: string;
  order: number;
  parentId: number | null;
  enabled: boolean;
  children: MenuItem[];
};

function DropdownItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className="text-[13px] font-medium text-white hover:text-[#c9a84c] transition-colors duration-200 tracking-wide"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[13px] font-medium text-white hover:text-[#c9a84c] transition-colors duration-200 tracking-wide"
      >
        {item.label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#111] border border-white/[0.08] rounded-xl shadow-xl z-50 py-1">
          {item.children.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[13px] text-white/55 hover:text-[#c9a84c] hover:bg-white/[0.04] transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface NavbarClientProps {
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok?: string;
  logoUrl?: string;
  menuItems: MenuItem[];
}

export default function NavbarClient({ phone, whatsapp, instagram, tiktok, logoUrl, menuItems }: NavbarClientProps) {
  const [open, setOpen] = useState(false);

  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "#";
  const waHref = whatsapp || "#";
  const igHref = instagram || "#";
  const ttHref = tiktok || "#";

  const leftItems = menuItems.filter((i) => i.position === "left" && i.enabled && !i.parentId);
  const rightItems = menuItems.filter((i) => i.position === "right" && i.enabled && !i.parentId);
  const allEnabled = menuItems.filter((i) => i.enabled && !i.parentId);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Main Navbar ──────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center">

          {/* Left nav – desktop */}
          <nav className="hidden lg:flex items-center gap-8 flex-1" aria-label="Primary navigation">
            {leftItems.map((item) => (
              <DropdownItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Center: Logo */}
          <Link href="/" className="flex flex-row items-center gap-3 mx-auto lg:mx-0 group" aria-label="Dr. Firas Zoghieb – Home">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Dr. Firas Zoghieb logo"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-[-4px] rounded-full border border-[#c9a84c]/10 group-hover:border-[#c9a84c]/22 transition-colors duration-300" />
                  <div className="w-10 h-10 rounded-full border border-[#c9a84c]/40 group-hover:border-[#c9a84c]/70 flex items-center justify-center transition-colors duration-300 bg-[#c9a84c]/[0.03]">
                    <span className="text-[#c9a84c] font-bold text-[13px] tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>DF</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-[13px] leading-none whitespace-nowrap" style={{ fontFamily: "var(--font-playfair)" }}>Dr. Firas Zoghieb</p>
                  <p className="text-[#c9a84c]/70 text-[10px] tracking-[0.15em] uppercase leading-none mt-1">Cosmetic Dentist</p>
                </div>
              </>
            )}
          </Link>

          {/* Right nav – desktop */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-end" aria-label="Secondary navigation">
            {rightItems.map((item) => (
              <DropdownItem key={item.id} item={item} />
            ))}
            <a href="/contact" className="flex items-center gap-1.5 border border-[#c9a84c]/45 text-[#c9a84c] text-[12px] font-medium px-5 py-2 rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200 tracking-wide">
              <CalendarIcon />
              Book Now
            </a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" data-gtm-whatsapp="true" onClick={() => { (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'whatsapp_click', click_location: 'navbar' }); }} className="flex items-center justify-center w-8 h-8 border border-[#c9a84c]/45 text-[#c9a84c] rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200">
              <WAIcon className="w-3.5 h-3.5" />
            </a>
            <a href={igHref} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-8 h-8 border border-[#c9a84c]/45 text-[#c9a84c] rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200">
              <IGIcon className="w-3.5 h-3.5" />
            </a>
            {tiktok && (
              <a href={ttHref} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex items-center justify-center w-8 h-8 border border-[#c9a84c]/45 text-[#c9a84c] rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200">
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 text-white/50 hover:text-white transition-colors ml-auto" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────── */}
      {open && (
        <div className="lg:hidden bg-[#0d0d0d] border-b border-white/[0.06] px-6 py-6 flex flex-col gap-1">
          {allEnabled.map((item) => (
            <div key={item.id}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block text-white/55 hover:text-[#c9a84c] text-sm font-medium transition-colors tracking-wide py-2.5 border-b border-white/[0.04]"
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.id}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="block pl-5 text-white/40 hover:text-[#c9a84c] text-sm transition-colors tracking-wide py-2 border-b border-white/[0.03]"
                >
                  ↳ {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <a href={phoneHref} className="flex items-center justify-center gap-2 border border-[#c9a84c]/45 text-[#c9a84c] text-[12px] font-medium px-5 py-2 rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200 tracking-wide">
              <PhoneIcon />
              Call Us
            </a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" data-gtm-whatsapp="true" onClick={() => { (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'whatsapp_click', click_location: 'navbar_mobile' }); }} className="flex items-center justify-center w-10 h-10 border border-[#c9a84c]/45 text-[#c9a84c] rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200 mx-auto">
              <WAIcon className="w-4 h-4" />
            </a>
            <a href={igHref} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 border border-[#c9a84c]/45 text-[#c9a84c] rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200 mx-auto">
              <IGIcon className="w-4 h-4" />
            </a>
            {tiktok && (
              <a href={ttHref} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex items-center justify-center w-10 h-10 border border-[#c9a84c]/45 text-[#c9a84c] rounded-full hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/80 transition-all duration-200 mx-auto">
                <TikTokIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
