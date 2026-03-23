export const revalidate = 3600;

import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import ServicesGrid from "@/components/ServicesGrid";
import BeforeAfter from "@/components/BeforeAfter";

export const metadata: Metadata = {
  title: `Our Services | ${SITE_NAME}`,
  description: "Explore the full range of cosmetic dental treatments offered by Dr. Firas Zoghieb in Dubai.",
};

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

