import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Image from "next/image";

export default async function Hero() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <section className="relative min-h-screen bg-[#0d0d0d] overflow-hidden flex items-center pt-[76px] sm:pt-[108px]">

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
            <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.3em]">
              {s.heroEyebrow}
            </p>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.04] mb-7 whitespace-nowrap"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {s.heroHeading}
          </h1>

          {/* Subparagraph */}
          <p className="text-[15px] md:text-base text-white/50 leading-[1.8] mb-10 max-w-md">
            {s.heroBody}
          </p>

          {/* CTA Callout */}
          <div className="mb-8 border border-[#c9a84c]/20 rounded-2xl p-5 bg-[#c9a84c]/[0.04]">
            <p className="text-[#c9a84c] text-[10px] font-semibold uppercase tracking-[0.28em] mb-1.5">
              {s.footerCtaEyebrow}
            </p>
            <p className="text-white font-semibold text-base mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
              {s.footerCtaTitle}
            </p>
            <p className="text-white/40 text-[13px] leading-relaxed">
              {s.footerCtaDesc}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={s.heroCta1Link}
              className="bg-[#e85535] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#d44428] active:scale-[0.98] transition-all duration-200 text-center shadow-xl shadow-[#e85535]/20"
            >
              {s.heroCta1Text}
            </a>
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


            </div>


          </div>
        </div>

      </div>
    </section>
  );
}
