import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

const whyChoose = [
  "Hundreds of composite bonding smile makeovers completed",
  "Expert in minimally invasive and natural smile transformations",
  "Certified Invisalign provider with outstanding patient results",
  "Gentle approach — no unnecessary drilling or injections",
  "Personalised treatment plans tailored to your smile goals",
  "State-of-the-art clinic with the latest dental technology",
];

export default async function About() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <section id="about" className="py-20 bg-[#141414]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-start">
        {/* Bio */}
        <div>
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            About the Doctor
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About {s.doctorName}
          </h2>
          <div className="space-y-4 text-white/50 leading-[1.85] text-[15px]">
            {s.aboutPara1 && <p>{s.aboutPara1}</p>}
            {s.aboutPara2 && <p>{s.aboutPara2}</p>}
            {s.aboutPara3 && <p>{s.aboutPara3}</p>}
            {s.aboutPara4 && <p>{s.aboutPara4}</p>}
          </div>

          <a
            href={s.aboutCtaLink}
            className="inline-block mt-8 bg-[#e85535] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#d44428] transition-colors shadow-lg shadow-[#e85535]/15"
          >
            {s.aboutCtaText}
          </a>
        </div>

        {/* Why Choose */}
        <div>
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            Why {s.doctorName}?
          </p>
          <h3
            className="text-2xl md:text-3xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Why Patients Choose {s.doctorName}
          </h3>

          <ul className="space-y-4">
            {whyChoose.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#c9a84c]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-white/55 text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { number: s.aboutStat1Number, label: s.aboutStat1Label },
              { number: s.aboutStat2Number, label: s.aboutStat2Label },
              { number: s.aboutStat3Number, label: s.aboutStat3Label },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-[#1a1a1a] rounded-xl p-4 border border-white/[0.06]"
              >
                <p
                  className="text-2xl font-bold text-[#c9a84c]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {stat.number}
                </p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
