import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

const FALLBACK = [
  { id: 0, title: "Composite Bonding", description: "A quick, pain-free procedure to reshape, repair, or improve the colour of your teeth using tooth-coloured resin.", heroImage: null, icon: "✦", slug: "composite-bonding" },
  { id: 1, title: "Invisalign", description: "Clear, removable aligners that straighten your teeth discreetly and comfortably — no metal braces needed.", heroImage: null, icon: "⬦", slug: "invisalign" },
  { id: 2, title: "Porcelain Veneers", description: "Ultra-thin, custom-made porcelain shells bonded to the front of your teeth for a dramatically improved smile.", heroImage: null, icon: "◈", slug: "porcelain-veneers" },
  { id: 3, title: "Teeth Whitening", description: "Professional-grade whitening treatments that safely lighten your teeth by several shades in a single session.", heroImage: null, icon: "◈", slug: "teeth-whitening" },
  { id: 4, title: "Smile Makeover", description: "A comprehensive, personalised combination of cosmetic treatments designed to completely transform your smile.", heroImage: null, icon: "✦", slug: "smile-makeover" },
  { id: 5, title: "Dental Hygiene", description: "Professional cleaning and preventive care to keep your teeth and gums healthy, fresh, and looking their best.", heroImage: null, icon: "⬦", slug: "dental-hygiene" },
];

export default async function ServicesGrid({ showHeading = true }: { showHeading?: boolean }) {
  let services: { id: number; title: string; slug: string; description: string; heroImage: string | null; icon: string | null }[] = [];
  try {
    const dbServices = await db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, title: true, slug: true, description: true, heroImage: true, icon: true },
    });
    services = dbServices.length > 0 ? dbServices : FALLBACK;
  } catch {
    services = FALLBACK;
  }

  return (
    <section id="expertise" className="py-20 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {showHeading && (
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
              What We Offer
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Services
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-[15px] leading-relaxed">
              Dr. Firas offers a full range of cosmetic and restorative dental treatments tailored to help you achieve the smile you deserve.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group rounded-2xl overflow-hidden border border-[#1e1e1e] hover:border-[#c9a84c]/50 transition-all duration-300 bg-[#141414]"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] bg-[#111] overflow-hidden">
                {service.heroImage ? (
                  <Image
                    src={service.heroImage}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#222]">
                    {service.icon ? (
                      <span className="text-4xl">{service.icon}</span>
                    ) : (
                      <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="text-base font-semibold text-white/90 mb-2 group-hover:text-[#c9a84c] transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {service.title}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed line-clamp-2">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-[#c9a84c] text-xs font-medium">
                  Learn more
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
