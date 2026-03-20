import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

type GlanceItem = { label: string; value: string };

const DEFAULT_ITEMS: GlanceItem[] = [
  { label: "GDC Number", value: "123456" },
  { label: "Qualifications", value: "BDS, MSc Cosmetic Dentistry" },
  { label: "Languages Spoken", value: "English, Arabic" },
  { label: "Clinic Location", value: "Dubai & Online" },
  { label: "Specialisation", value: "Composite Bonding, Invisalign, Veneers" },
  { label: "Experience", value: "10+ Years" },
];

export default async function AtAGlance() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  let items: GlanceItem[] = DEFAULT_ITEMS;
  if (s.glanceItems) {
    try {
      items = JSON.parse(s.glanceItems) as GlanceItem[];
    } catch {
      // keep defaults
    }
  }

  return (
    <section className="bg-white py-16 border-b border-gray-100" id="glance">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-2">
            Quick Overview
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1b4f72]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            At a Glance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] hover:border-[#c9a84c]/30 hover:bg-white/[0.02] transition-all duration-200 bg-[#141414]"
            >
              <div className="w-11 h-11 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-0.5">
                  {item.label}
                </p>
                <p className="text-white/75 font-semibold text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
