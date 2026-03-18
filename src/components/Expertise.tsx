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
    <section id="expertise" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1b4f72] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Areas of Expertise
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
            Dr. Firas offers a full range of cosmetic and restorative dental
            treatments tailored to help you achieve the smile you deserve.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((t) => {
            const inner = (
              <>
                <div className="w-12 h-12 rounded-full bg-[#1b4f72]/8 flex items-center justify-center mb-4 group-hover:bg-[#1b4f72] transition-colors">
                  <span className="text-[#1b4f72] text-xl group-hover:text-white transition-colors">
                    {t.icon}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold text-[#1b4f72] mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t.description}</p>
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
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2e86c1] hover:shadow-lg transition-all group block"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={t.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2e86c1] hover:shadow-lg transition-all group"
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
            className="inline-block bg-[#1b4f72] text-white px-10 py-4 rounded-full font-medium text-sm hover:bg-[#154460] transition-colors shadow-lg shadow-[#1b4f72]/20"
          >
            Book Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
