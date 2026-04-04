export const revalidate = 60;

import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import ServicesGrid from "@/components/ServicesGrid";
import BeforeAfter from "@/components/BeforeAfter";
import FAQ from "@/components/FAQ";

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
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  let servicesFaqItems: {question:string;answer:string}[] = [];
  try { if (s.servicesFaqItems) servicesFaqItems = JSON.parse(s.servicesFaqItems); } catch {}

  return (
    <>
      <Navbar />
      <main className="bg-[#0d0d0d] min-h-screen pt-[68px]">
        <ServicesGrid showHeading={true} />
      </main>

      <BeforeAfter />
      {servicesFaqItems.length > 0 && <FAQ items={servicesFaqItems} />}
      <ContactSection />
    </>
  );
}

