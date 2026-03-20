export const revalidate = 3600;

import type { Metadata } from "next";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AtAGlance from "@/components/AtAGlance";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import BeforeAfter from "@/components/BeforeAfter";
import GoogleReviews from "@/components/GoogleReviews";
import InstagramFeed from "@/components/InstagramFeed";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  return {
    title: s.seoHomeTitle || `${s.doctorName} | ${s.specialty} Dubai`,
    description: s.seoHomeDesc || `${s.doctorName} is a ${s.specialty} in Dubai specialising in composite bonding, Invisalign, and veneers.`,
    keywords: s.seoHomeKeywords || undefined,
    openGraph: {
      title: s.seoHomeTitle || `${s.doctorName} | ${s.specialty} Dubai`,
      description: s.seoHomeDesc || "",
    },
  };
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AtAGlance />
      <About />
      <Expertise />
      <BeforeAfter />
      <GoogleReviews />
      <InstagramFeed />
      <FAQSection />
    </>
  );
}



