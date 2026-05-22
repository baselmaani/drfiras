import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ServiceJsonLd, FAQJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";

const SLUG = "invisalign-dubai";
const SERVICE_URL = `${SITE_URL}/services/${SLUG}`;

const title = "Invisalign Dubai";
const description =
  "Straighten your teeth discreetly with Invisalign in Dubai by Dr. Firas Zoghieb. Clear, removable aligners. No metal braces. Free consultation at our Al Wasl clinic.";

const faqs = [
  {
    question: "What is Invisalign and how does it work?",
    answer:
      "Invisalign uses a series of custom-made, clear plastic aligners to gradually shift your teeth into the correct position. Each set of aligners is worn for about one to two weeks before moving to the next set. The aligners are nearly invisible and can be removed for eating, drinking, and cleaning.",
  },
  {
    question: "How long does Invisalign treatment take in Dubai?",
    answer:
      "Treatment length depends on the complexity of your case. Minor corrections can take as little as 3–6 months, while moderate to complex cases may take 12–18 months. Dr. Firas will give you a personalised timeline estimate during your free consultation.",
  },
  {
    question: "Is Invisalign painful?",
    answer:
      "Most patients experience mild pressure or discomfort for a few days when switching to a new set of aligners — this is normal and a sign the aligners are working. The discomfort is generally much less than with traditional metal braces and typically resolves within 2–3 days.",
  },
  {
    question: "Can I eat and drink with Invisalign aligners in?",
    answer:
      "You should remove your aligners before eating or drinking anything other than plain water. This prevents staining and damage to the aligners, and protects your teeth from decay caused by food trapped under the trays. Aligners should be worn for 20–22 hours per day for best results.",
  },
  {
    question: "Am I a good candidate for Invisalign?",
    answer:
      "Invisalign is suitable for correcting mild to moderate crowding, spacing, overbite, underbite, and crossbite issues. Severe orthodontic cases may require traditional braces. Dr. Firas will assess your teeth at your consultation and advise whether Invisalign is the right option for you.",
  },
  {
    question: "How much does Invisalign cost in Dubai?",
    answer:
      "Invisalign costs vary depending on the length and complexity of treatment. During your free consultation at our Al Wasl clinic, Dr. Firas Zoghieb will provide a detailed, transparent quote with no hidden fees. Flexible payment options may be available.",
  },
  {
    question: "Is Invisalign covered by dental insurance in the UAE?",
    answer:
      "Some UAE dental insurance plans cover a portion of orthodontic treatment, which may include Invisalign. We recommend checking your specific policy. Our team can provide the necessary documentation to help you submit a claim.",
  },
  {
    question: "How often do I need appointments during Invisalign treatment?",
    answer:
      "You will typically have progress check-ups every 6–8 weeks so Dr. Firas can monitor your tooth movement and provide the next sets of aligners. These appointments are usually brief and straightforward.",
  },
  {
    question: "Will I need retainers after Invisalign?",
    answer:
      "Yes. Retainers are an essential part of any orthodontic treatment. After completing Invisalign, you will be provided with retainers to wear at night to maintain your new smile. Without retainers, teeth can gradually shift back over time.",
  },
  {
    question: "What is the difference between Invisalign and traditional braces?",
    answer:
      "Invisalign aligners are clear, removable, and more comfortable than metal braces. They have no wires or brackets that can irritate the cheeks or gums. Traditional braces are fixed and may be more effective for very complex cases, but Invisalign is suitable for the vast majority of patients who prefer a discreet option.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "invisalign dubai, invisalign al wasl, clear aligners dubai, teeth straightening dubai, invisible braces dubai, invisalign provider dubai, dr firas zoghieb invisalign",
  alternates: { canonical: SERVICE_URL },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: SERVICE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
  },
};

export default function InvisalignPage() {
  return (
    <>
      <Navbar />
      <ServiceJsonLd name={title} description={description} url={SERVICE_URL} />
      <FAQJsonLd items={faqs} />

      {/* Hero */}
      <section className="relative bg-[#0d0d0d] pt-[68px] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 75% 40%, rgba(201,168,76,0.07) 0%, transparent 65%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 pt-8 text-[13px] text-white/35">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">
              Home
            </Link>
            <span className="text-white/15">/</span>
            <Link href="/services" className="hover:text-[#c9a84c] transition-colors">
              Services
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-white/60">Invisalign Dubai</span>
          </nav>

          <div className="max-w-3xl pt-10 pb-20">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-3xl mb-6">
              ✦
            </div>
            <h1
              data-speakable
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 leading-[1.1]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Invisalign Dubai
            </h1>
            <p
              data-speakable
              className="text-base md:text-lg text-white/55 leading-relaxed mb-10 max-w-lg"
            >
              {description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 px-8 py-3.5 rounded-full font-semibold text-sm transition-colors"
              >
                Book a Consultation
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-[#c9a84c]/40 text-[#c9a84c]/70 hover:border-[#c9a84c] hover:text-[#c9a84c] px-8 py-3.5 rounded-full font-medium text-sm transition-colors"
              >
                ← All Treatments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#111] border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-[2px] bg-[#c9a84c]" />
            <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em]">
              About This Treatment
            </p>
          </div>

          <div className="space-y-10 text-white/55 text-[15px] leading-relaxed">
            <div>
              <h2
                className="text-2xl font-bold text-white mb-3 leading-snug"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                What is Invisalign?
              </h2>
              <p>
                Invisalign is the world&apos;s most trusted clear aligner system, used to straighten
                teeth without metal wires or brackets. Using a series of custom-made, removable
                plastic aligners, Invisalign gradually moves your teeth into their ideal position
                — giving you a straighter, more confident smile.
              </p>
              <p className="mt-4">
                Dr. Firas Zoghieb is a certified Invisalign provider at his clinic in Al Wasl,
                Dubai. He combines clinical precision with an aesthetic eye to ensure your results
                are not only straighter — but beautifully proportioned.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-3 leading-snug"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                What Can Invisalign Treat?
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Crowded or overlapping teeth</li>
                <li>Gaps between teeth</li>
                <li>Overbite and underbite</li>
                <li>Crossbite and open bite</li>
                <li>Mild to moderate misalignment</li>
                <li>Relapse after previous orthodontic treatment</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-3 leading-snug"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                The Invisalign Process
              </h2>
              <p>
                Your Invisalign journey begins with a detailed consultation and digital scan of
                your teeth — no messy impressions. Dr. Firas will show you a 3D simulation of your
                expected results before treatment begins. Your custom aligners are then produced
                and delivered to the clinic, and you will receive new sets approximately every one
                to two weeks as your smile gradually transforms.
              </p>
              <p className="mt-4">
                Progress check-ups every 6–8 weeks ensure your treatment stays on track. Once
                complete, retainers are provided to preserve your beautiful new smile.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-3 leading-snug"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Why Choose Dr. Firas for Invisalign in Dubai?
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Certified Invisalign Provider — accredited by Align Technology</li>
                <li>
                  Experienced in combining Invisalign with cosmetic treatments for complete smile
                  transformations
                </li>
                <li>
                  Gentle, minimally invasive approach with a focus on natural-looking results
                </li>
                <li>
                  Conveniently located in Al Wasl, Dubai with flexible appointment times
                </li>
                <li>Free initial consultation — no obligation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqs} />

      {/* Contact */}
      <ContactSection />
    </>
  );
}
