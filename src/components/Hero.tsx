import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Image from "next/image";

export default async function Hero() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <section className="relative min-h-screen bg-[#0d0d0d] overflow-hidden flex items-center pt-[108px]">

      {/* ── Background: repeating pill-outline pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='180'%3E%3Crect x='10' y='8' width='80' height='164' rx='40' fill='none' stroke='%23ffffff' stroke-width='0.8' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 180px",
        }}
      />

      {/* ── Vignette overlay ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,#0d0d0d_100%)] pointer-events-none" />

      {/* ── Amber/orange portrait glow (right) ── */}
      <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(210,140,50,0.09)_0%,transparent_65%)] pointer-events-none" />

      {/* ── Gold tone glow (left) ── */}
      <div className="absolute left-[-200px] bottom-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

        {/* ── LEFT: Text ── */}
        <div className="order-2 md:order-1">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-8 bg-[#c9a84c] flex-shrink-0" />
            <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.3em]">
              {s.heroEyebrow}
            </p>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.04] mb-7"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {s.heroHeading}
          </h1>

          {/* Subparagraph */}
          <p className="text-[15px] md:text-base text-white/50 leading-[1.8] mb-10 max-w-md">
            {s.heroBody}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={s.heroCta1Link}
              className="bg-[#e85535] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#d44428] active:scale-[0.98] transition-all duration-200 text-center shadow-xl shadow-[#e85535]/20"
            >
              {s.heroCta1Text}
            </a>
            <a
              href={s.heroCta2Link}
              className="border border-[#c9a84c]/35 text-[#c9a84c]/80 px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#c9a84c]/8 hover:border-[#c9a84c]/60 transition-all duration-200 text-center"
            >
              {s.heroCta2Text}
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-11 flex flex-wrap gap-6 text-[12px] text-white/30 font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#c9a84c]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              5-Star Rated
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              GDC Registered
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Same Day Appointments
            </div>
          </div>

          {/* Dot accent */}
          <div className="mt-10 flex items-center gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full bg-[#c9a84c]"
                style={{
                  width: i === 4 || i === 5 ? "6px" : "4px",
                  height: i === 4 || i === 5 ? "6px" : "4px",
                  opacity: 0.08 + i * 0.04,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: Portrait ── */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative">
            {/* Outermost ambient ring */}
            <div className="absolute inset-[-24px] rounded-full border border-[#c9a84c]/06 pointer-events-none" />
            {/* Outer ring */}
            <div className="absolute inset-[-12px] rounded-full border border-[#c9a84c]/12 pointer-events-none" />
            {/* Inner ring */}
            <div className="absolute inset-[-3px] rounded-full border border-[#c9a84c]/22 pointer-events-none" />

            {/* Portrait circle */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full border border-[#c9a84c]/30 overflow-hidden bg-[#161616]">
              {/* Gradient background inside circle */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#222] via-[#1a1a1a] to-[#111]" />
              {/* Subtle amber inner glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(210,140,50,0.07),transparent_60%)]" />

              {s.heroImageUrl ? (
                <Image
                  src={s.heroImageUrl}
                  alt={s.heroHeading}
                  fill
                  className="object-cover object-top"
                  priority
                />
              ) : (
                /* Doctor silhouette placeholder */
                <div className="absolute inset-0 flex flex-col items-center justify-end">
                  <svg
                    className="w-[70%] text-[#2a2a2a]"
                    viewBox="0 0 200 230"
                    fill="currentColor"
                  >
                    <circle cx="100" cy="78" r="48" />
                    <ellipse cx="100" cy="200" rx="75" ry="65" />
                  </svg>
                </div>
              )}

              {/* Name overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-[#0d0d0d]/80 to-transparent text-center">
                <p className="text-white/80 font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                  {s.doctorName} Zoghieb
                </p>
                <p className="text-[#c9a84c]/60 text-[10px] tracking-[0.2em] uppercase mt-0.5">
                  BDS · MSc Cosmetic Dentistry
                </p>
              </div>
            </div>

            {/* Stat card */}
            <div className="absolute -bottom-4 -left-4 md:-left-8 bg-[#141414] border border-[#2a2a2a] rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-sm">
              <p className="text-[#c9a84c] font-bold text-xl leading-none" style={{ fontFamily: "var(--font-playfair)" }}>
                {s.heroStatNumber}
              </p>
              <p className="text-white/35 text-[11px] mt-1 tracking-wide">{s.heroStatLabel}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
