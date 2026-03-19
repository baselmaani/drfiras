"use client";
import { useState } from "react";

export type FAQItem = { question: string; answer: string };

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "What is composite bonding and how does it work?",
    answer:
      "Composite bonding is a cosmetic dental procedure where a tooth-coloured resin material is applied directly to the tooth surface, sculpted into shape, and hardened with a special light. It can repair chips, cracks, gaps, and discolouration in a single visit — with no drilling or injections required in most cases.",
  },
  {
    question: "Is the composite bonding procedure painful?",
    answer:
      "Composite bonding is generally painless. In most cases, no anaesthesia is needed since the procedure is non-invasive and does not involve removing significant amounts of tooth structure. Patients are comfortable throughout the appointment.",
  },
  {
    question: "How long does composite bonding last?",
    answer:
      "With proper care, composite bonding typically lasts between 5 and 10 years. Regular dental check-ups, avoiding habits like nail-biting or chewing hard objects, and wearing a night guard if you grind your teeth will help extend the longevity of your bonding.",
  },
  {
    question: "What is Invisalign and how long does treatment take?",
    answer:
      "Invisalign uses a series of clear, custom-made removable aligners to gradually shift your teeth into the desired position. Treatment duration varies depending on complexity — minor corrections can take as little as 3–6 months, while more complex cases may take 12–18 months.",
  },
  {
    question: "How many visits does Invisalign require?",
    answer:
      "You'll typically have a check-up every 6–8 weeks to monitor progress and receive your next set of aligners. Most patients complete their treatment smoothly with minimal disruption to their daily schedule.",
  },
  {
    question: "What is the difference between composite bonding and veneers?",
    answer:
      "Composite bonding uses resin applied directly to the tooth — no preparation of the natural tooth is usually needed, and it is reversible. Veneers are thin porcelain or composite shells that are attached to the front surface of teeth. Porcelain veneers require a small amount of enamel removal and are more durable and stain-resistant long-term.",
  },
  {
    question: "How do I book a free consultation?",
    answer:
      "You can book a free consultation by clicking the 'Book Free Consultation' button anywhere on this page, calling our clinic directly, or messaging us on WhatsApp. We will confirm your appointment quickly and answer any questions you may have beforehand.",
  },
];

export default function FAQ({ items }: { items?: FAQItem[] }) {
  const faqs = items && items.length > 0 ? items : DEFAULT_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-[#0d0d0d]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            Got Questions?
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#141414] rounded-2xl border border-[#1e1e1e] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-white/85 text-[15px] leading-snug">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                  <svg
                    className={`w-4 h-4 text-[#c9a84c] transition-transform duration-200 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 text-white/45 text-[15px] leading-relaxed border-t border-[#1e1e1e] pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
