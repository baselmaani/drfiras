export const revalidate = 3600;

import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import ServicesGrid from "@/components/ServicesGrid";
import BeforeAfter from "@/components/BeforeAfter";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  const title = s.seoServicesTitle || `Cosmetic Dentistry Services | ${SITE_NAME}`;
  const description = s.seoServicesDesc || `Explore composite bonding, Invisalign, veneers, and smile makeovers by ${s.doctorName} in Dubai.`;
  const url = `${SITE_URL}/services`;
  return {
    title,
    description,
    ...(s.seoServicesKeywords && { keywords: s.seoServicesKeywords }),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#0d0d0d] min-h-screen pt-[68px]">
        {/* Header */}
        <section className="py-20 text-center border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
              What We Offer
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Services
            </h1>
            <p className="text-white/40 text-[15px] leading-relaxed">
              From subtle enhancements to complete smile makeovers — discover how Dr. Firas can transform your smile.
            </p>
          </div>
        </section>

        <ServicesGrid showHeading={false} />
        <BeforeAfter />
      </main>
      <ContactSection />
    </>
  );
}

