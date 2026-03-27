export const revalidate = 60;

import type { Metadata } from "next";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ServicesGrid from "@/components/ServicesGrid";
import BeforeAfter from "@/components/BeforeAfter";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { FAQJsonLd, HomepageJsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  const title = s.seoHomeTitle || `${s.doctorName} | ${s.specialty} Dubai`;
  const description = s.seoHomeDesc || `${s.doctorName} is a ${s.specialty} in Dubai specialising in composite bonding, Invisalign, and veneers.`;
  return {
    title,
    description,
    keywords: s.seoHomeKeywords || "cosmetic dentist dubai, composite bonding dubai, invisalign dubai, veneers dubai",
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: SITE_URL,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function Home() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  let faqItems: { question: string; answer: string }[] = [];
  if (s.faqItems) {
    try { faqItems = JSON.parse(s.faqItems); } catch { /* keep empty */ }
  }
  return (
    <>
      <HomepageJsonLd />
      <FAQJsonLd items={faqItems} />
      <Navbar />
      <Hero />
      <ServicesGrid />
      <BeforeAfter />
      <ContactSection />
      <About />
      <FAQSection />
    </>
  );
}



