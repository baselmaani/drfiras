import { db } from "@/lib/db";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

const FALLBACK = [
  { id: 1, title: "Composite Bonding", treatment: "Composite Bonding", beforeImage: null },
  { id: 2, title: "Invisalign", treatment: "Invisalign", beforeImage: null },
  { id: 3, title: "Veneers", treatment: "Porcelain Veneers", beforeImage: null },
  { id: 4, title: "Smile Makeover", treatment: "Smile Makeover", beforeImage: null },
];

function BeforeAfterCard({ title, treatment, beforeImage }: {
  title: string;
  treatment: string;
  beforeImage: string | null;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#c9a84c] transition-all">
      <div className="bg-[#111]">
        {beforeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={beforeImage} alt={`Before & After - ${treatment}`} className="w-full h-auto block" />
        ) : (
          <div className="aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#222]">
            <svg className="w-10 h-10 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#141414]">
        <p className="text-sm font-semibold text-white/80" style={{ fontFamily: "var(--font-playfair)" }}>
          {title}
        </p>
        <p className="text-xs text-white/30 mt-0.5">{treatment}</p>
      </div>
    </div>
  );
}

type BAItem = { id: number; title: string; treatment: string; beforeImage: string | null };

export default async function BeforeAfter() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  let items: BAItem[];
  try {
    const dbItems = await db.beforeAfter.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 4,
      select: { id: true, title: true, treatment: true, beforeImage: true },
    });
    items = dbItems.length > 0 ? dbItems : FALLBACK;
  } catch {
    items = FALLBACK;
  }

  return (
    <section id="before-after" className="py-20 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            {s.beforeAfterEyebrow}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {s.beforeAfterHeading}
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-[15px] leading-relaxed">
            {s.beforeAfterDesc}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <BeforeAfterCard
              key={item.id}
              title={item.title}
              treatment={item.treatment}
              beforeImage={item.beforeImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
