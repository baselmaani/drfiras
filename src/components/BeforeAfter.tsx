import { db } from "@/lib/db";

const FALLBACK = [
  { id: 1, title: "Composite Bonding", treatment: "Composite Bonding", beforeImage: null, afterImage: null },
  { id: 2, title: "Invisalign", treatment: "Invisalign", beforeImage: null, afterImage: null },
  { id: 3, title: "Veneers", treatment: "Porcelain Veneers", beforeImage: null, afterImage: null },
  { id: 4, title: "Smile Makeover", treatment: "Smile Makeover", beforeImage: null, afterImage: null },
];

function BeforeAfterCard({ title, treatment, beforeImage, afterImage }: {
  title: string;
  treatment: string;
  beforeImage: string | null;
  afterImage: string | null;
}) {
  const placeholder = (label: string, side: "before" | "after") => (
    <div className="relative">
      <div className={`aspect-[3/4] flex items-center justify-center ${side === "before" ? "bg-gradient-to-br from-gray-200 to-gray-300" : "bg-gradient-to-br from-[#2e86c1]/20 to-[#1b4f72]/30"}`}>
        <svg className={`w-10 h-10 ${side === "before" ? "text-gray-400" : "text-[#1b4f72]/40"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <span className={`absolute top-2 ${side === "before" ? "left-2 bg-black/60" : "right-2 bg-[#1b4f72]"} text-white text-xs px-2 py-0.5 rounded-full`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-2">
        {beforeImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeImage} alt={`Before - ${treatment}`} className="aspect-[3/4] w-full object-cover" />
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Before</span>
          </div>
        ) : placeholder("Before", "before")}
        {afterImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterImage} alt={`After - ${treatment}`} className="aspect-[3/4] w-full object-cover" />
            <span className="absolute top-2 right-2 bg-[#1b4f72] text-white text-xs px-2 py-0.5 rounded-full">After</span>
          </div>
        ) : placeholder("After", "after")}
      </div>
      <div className="p-4 bg-white">
        <p className="text-sm font-semibold text-[#1b4f72]" style={{ fontFamily: "var(--font-playfair)" }}>
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{treatment}</p>
      </div>
    </div>
  );
}

type BAItem = { id: number; title: string; treatment: string; beforeImage: string | null; afterImage: string | null };

export default async function BeforeAfter() {
  let items: BAItem[];
  try {
    const dbItems = await db.beforeAfter.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 4,
      select: { id: true, title: true, treatment: true, beforeImage: true, afterImage: true },
    });
    items = dbItems.length > 0 ? dbItems : FALLBACK;
  } catch {
    items = FALLBACK;
  }

  return (
    <section id="before-after" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
            Real Results
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1b4f72] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Before &amp; After
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
            See the life-changing smile transformations Dr. Firas has achieved for
            his patients.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <BeforeAfterCard
              key={item.id}
              title={item.title}
              treatment={item.treatment}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
