import { db } from "@/lib/db";
import Link from "next/link";

const FALLBACK_TREATMENTS = [
  { id: 0, title: "Composite Bonding", description: "A quick, pain-free procedure to reshape, repair, or improve the colour of your teeth using tooth-coloured resin. No drilling required.", icon: "✦", slug: null },
  { id: 0, title: "Invisalign", description: "Clear, removable aligners that straighten your teeth discreetly and comfortably — no metal braces needed.", icon: "⬦", slug: null },
  { id: 0, title: "Porcelain Veneers", description: "Ultra-thin, custom-made porcelain shells bonded to the front of your teeth for a dramatically improved smile with minimal preparation.", icon: "◈", slug: null },
  { id: 0, title: "Teeth Whitening", description: "Professional-grade whitening treatments that safely lighten your teeth by several shades in a single session.", icon: "◈", slug: null },
  { id: 0, title: "Smile Makeover", description: "A comprehensive, personalised combination of cosmetic treatments designed to completely transform your smile.", icon: "✦", slug: null },
  { id: 0, title: "Dental Hygiene", description: "Professional cleaning and preventive care to keep your teeth and gums healthy, fresh, and looking their best.", icon: "⬦", slug: null },
];

type Treatment = { id: number; title: string; description: string; icon: string; slug: string | null };

export default async function Expertise() {
  let treatments: Treatment[];
  try {
    const dbServices = await db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, title: true, description: true, icon: true, slug: true },
    });
    treatments = dbServices.length > 0
      ? dbServices.map((s) => ({ ...s, icon: s.icon ?? "✦" }))
      : FALLBACK_TREATMENTS;
  } catch {
    treatments = FALLBACK_TREATMENTS;
  }

  return (
    <section id="expertise" className="py-20 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            What We Offer
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Areas of Expertise
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-[15px] leading-relaxed">
            Dr. Firas Zoghieb offers a full range of cosmetic and restorative dental
            treatments tailored to help you achieve the smile you deserve.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((t) => {
            const inner = (
              <>
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/8 flex items-center justify-center mb-4 group-hover:bg-[#c9a84c]/20 transition-colors">
                  <span className="text-[#c9a84c] text-xl">
                    {t.icon}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{t.description}</p>
                {t.slug && (
                  <span className="inline-block mt-3 text-[#c9a84c] text-xs font-medium">
                    Learn more →
                  </span>
                )}
              </>
            );
            return t.slug ? (
              <Link
                key={t.title}
                href={`/services/${t.slug}`}
                className="bg-[#141414] rounded-2xl p-6 border border-[#1e1e1e] hover:border-[#c9a84c]/40 hover:bg-[#171717] transition-all group block"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={t.title}
                className="bg-[#141414] rounded-2xl p-6 border border-[#1e1e1e] hover:border-[#c9a84c]/40 hover:bg-[#171717] transition-all group"
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* Book CTA */}
        <div className="mt-14 text-center">
          <a
            href="#book"
            id="book"
            className="inline-block bg-[#e85535] text-white px-10 py-4 rounded-full font-semibold text-sm hover:bg-[#d44428] transition-colors shadow-lg shadow-[#e85535]/15"
          >
            Book Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
