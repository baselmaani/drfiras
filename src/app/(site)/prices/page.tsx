export const revalidate = 60;

import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `Prices & Fees | ${SITE_NAME}`,
  description: `Transparent pricing for cosmetic dentistry treatments at ${SITE_NAME}. View our price list for composite bonding, Invisalign, veneers, and more.`,
  alternates: { canonical: `${SITE_URL}/prices` },
  openGraph: {
    title: `Prices & Fees | ${SITE_NAME}`,
    description: `Transparent pricing for cosmetic dentistry treatments at ${SITE_NAME}.`,
    url: `${SITE_URL}/prices`,
    type: "website",
  },
};

export default async function PricesPage() {
  const prices = await db.servicePrice.findMany({
    where: { published: true },
    orderBy: [{ category: "asc" }, { order: "asc" }, { title: "asc" }],
  });

  // Group by category
  const grouped: Record<string, typeof prices> = {};
  for (const item of prices) {
    const cat = item.category?.trim() || "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }
  const categories = Object.keys(grouped).sort();

  return (
    <>
      <Navbar />
      <main className="bg-[#0d0d0d] min-h-screen pt-[68px]">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-full px-5 py-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.22em]">
                Transparent Pricing
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Prices &amp; Fees
            </h1>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              We believe in straightforward, transparent pricing. All treatments are
              tailored to your individual needs — book a consultation for a personalised
              quote.
            </p>
          </div>
        </section>

        {/* Price List */}
        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {prices.length === 0 ? (
              <div className="text-center text-white/30 py-24">
                <p className="text-lg">Price list coming soon.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {categories.map((cat) => (
                  <div key={cat}>
                    {/* Category heading */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-8 h-[2px] bg-[#c9a84c]" />
                      <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em]">
                        {cat}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
                      {grouped[cat].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-6 px-6 py-5 bg-[#111] hover:bg-[#161616] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-[15px] leading-snug">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-white/40 text-[13px] mt-0.5 leading-snug">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[#c9a84c] font-semibold text-base whitespace-nowrap">
                              {item.price}
                            </p>
                            {item.priceNote && (
                              <p className="text-white/30 text-[11px] mt-0.5">
                                {item.priceNote}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-white/25 text-xs text-center mt-12 leading-relaxed">
              Prices are indicative and may vary based on individual treatment needs.
              A full assessment will be carried out at your consultation.
            </p>
          </div>
        </section>
      </main>
      <ContactSection />
    </>
  );
}
