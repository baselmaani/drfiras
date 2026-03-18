const whyChoose = [
  "Hundreds of composite bonding smile makeovers completed",
  "Expert in minimally invasive and natural smile transformations",
  "Certified Invisalign provider with outstanding patient results",
  "Gentle approach — no unnecessary drilling or injections",
  "Personalised treatment plans tailored to your smile goals",
  "State-of-the-art clinic with the latest dental technology",
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        {/* Bio */}
        <div>
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
            About the Doctor
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1b4f72] mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About Dr. Firas
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
            <p>
              Dr. Firas graduated with Honours in Dentistry (BDS) and subsequently
              completed a Master of Science in Cosmetic Dentistry, giving him an
              exceptional foundation in both the art and science of creating
              beautiful smiles.
            </p>
            <p>
              With a special interest in restorative and cosmetic dentistry, Dr.
              Firas has completed extensive postgraduate training including
              certifications in Composite Bonding, Aesthetic Restorative Dentistry,
              and Invisalign. He focuses on minimally invasive treatments that
              preserve natural tooth structure while delivering outstanding aesthetic
              results.
            </p>
            <p>
              Dr. Firas is dedicated to providing gentle, high-quality care. His
              greatest satisfaction comes from transforming patients&apos; confidence
              in their smiles. He takes the time to listen to each patient&apos;s
              concerns and works collaboratively to create a treatment plan aligned
              with their desires and budget.
            </p>
            <p>
              Outside of dentistry, Dr. Firas enjoys travelling, fitness, and
              spending time with family.
            </p>
          </div>

          <a
            href="#book"
            className="inline-block mt-8 bg-[#1b4f72] text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#154460] transition-colors"
          >
            Book Free Consultation
          </a>
        </div>

        {/* Why Choose */}
        <div>
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
            Why Dr. Firas?
          </p>
          <h3
            className="text-2xl md:text-3xl font-bold text-[#1b4f72] mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Why Patients Choose Dr. Firas
          </h3>

          <ul className="space-y-4">
            {whyChoose.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#c9a84c]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { number: "500+", label: "Smiles Transformed" },
              { number: "10+", label: "Years Experience" },
              { number: "99%", label: "Patient Satisfaction" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-[#f7f9fc] rounded-xl p-4 border border-gray-100"
              >
                <p
                  className="text-2xl font-bold text-[#1b4f72]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {stat.number}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
