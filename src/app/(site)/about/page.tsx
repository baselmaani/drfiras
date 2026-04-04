export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import BeforeAfter from "@/components/BeforeAfter";
import ContactSection from "@/components/ContactSection";
import { SpeakableJsonLd } from "@/components/JsonLd";
import FAQ from "@/components/FAQ";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  const title = s.seoAboutTitle || `About ${s.doctorName} | ${s.specialty} Dubai`;
  const description = s.seoAboutDesc || s.aboutPara1;
  const url = `${SITE_URL}/about`;
  return {
    title,
    description,
    ...(s.seoAboutKeywords && { keywords: s.seoAboutKeywords }),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

const whyChoose = [
  "Hundreds of composite bonding smile makeovers completed",
  "Expert in minimally invasive, natural smile transformations",
  "Certified Invisalign provider with outstanding patient results",
  "Gentle approach — no unnecessary drilling or injections",
  "Personalised treatment plans tailored to your smile goals",
  "State-of-the-art clinic with the latest dental technology",
];

export default async function AboutPage() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <>
      <SpeakableJsonLd url={`${SITE_URL}/about`} cssSelector={["h1", "h2", "[data-speakable]"]} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0d0d0d] pt-[100px] pb-20 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-4">
            About the Doctor
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About {s.doctorName}
          </h1>
          <p className="text-white/50 text-base max-w-2xl mx-auto leading-relaxed">
            {s.specialty} in Dubai — dedicated to creating beautiful, natural-looking smiles through minimally invasive care.
          </p>
        </div>
      </section>

      {/* Bio */}
      <section className="bg-[#0d0d0d] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Portrait */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-[-24px] rounded-full border border-[#c9a84c]/06 pointer-events-none" />
              <div className="absolute inset-[-12px] rounded-full border border-[#c9a84c]/12 pointer-events-none" />
              <div className="absolute inset-[-3px] rounded-full border border-[#c9a84c]/22 pointer-events-none" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] rounded-full border border-[#c9a84c]/30 overflow-hidden bg-[#161616]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#222] via-[#1a1a1a] to-[#111]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(210,140,50,0.07),transparent_60%)]" />
                {s.heroImageUrl ? (
                  <Image
                    src={s.heroImageUrl}
                    alt={s.doctorName}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-end">
                    <svg className="w-[70%] text-[#2a2a2a]" viewBox="0 0 200 230" fill="currentColor">
                      <circle cx="100" cy="78" r="48" />
                      <ellipse cx="100" cy="200" rx="75" ry="65" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-[#0d0d0d]/80 to-transparent text-center">
                  <p className="text-white/80 font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                    {s.doctorName}
                  </p>
                  <p className="text-[#c9a84c]/60 text-[10px] tracking-[0.2em] uppercase mt-0.5">
                    BDS · MSc Cosmetic Dentistry
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="space-y-5 text-white/50 leading-[1.85] text-[15px]">
              {s.aboutPara1 && <p>{s.aboutPara1}</p>}
              {s.aboutPara2 && <p>{s.aboutPara2}</p>}
              {s.aboutPara3 && <p>{s.aboutPara3}</p>}
              {s.aboutPara4 && <p>{s.aboutPara4}</p>}
            </div>
            <Link
              href="/#book"
              className="inline-block mt-8 border border-[#c9a84c]/50 text-[#c9a84c] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-200"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-[#141414] border-t border-white/[0.06] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">Why Choose Us</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Why Patients Choose {s.doctorName}
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-4">
            {whyChoose.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-[#0d0d0d] border border-white/[0.06] rounded-xl px-5 py-4">
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#c9a84c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/55 text-[14px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BeforeAfter />

      {/* FAQ */}
      {(() => { let items: {question:string;answer:string}[] = []; try { if (s.aboutFaqItems) items = JSON.parse(s.aboutFaqItems); } catch {} return items.length > 0 ? <FAQ items={items} /> : null; })()}

      {/* CTA */}
      <section className="bg-[#0d0d0d] border-t border-white/[0.06] py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Transform Your Smile?
          </h2>
          <p className="text-white/45 text-sm mb-8">
            Book a free consultation and discover what&apos;s possible for your smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#book"
              className="border border-[#c9a84c]/50 text-[#c9a84c] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-200"
            >
              Book Free Consultation
            </Link>
            <Link
              href="/contact"
              className="border border-white/10 text-white/60 px-8 py-3.5 rounded-full font-medium text-sm hover:border-white/30 hover:text-white/80 transition-all duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
