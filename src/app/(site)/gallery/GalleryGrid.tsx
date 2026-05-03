import Image from "next/image";

type Service = { id: number; title: string; slug: string };
type GalleryItem = {
  id: number;
  title: string;
  image: string;
  description: string | null;
  subcategory: string | null;
  service: Service;
};
type SubcatGroup = { subcategory: string | null; items: GalleryItem[] };
type ServiceGroup = { service: Service; subcats: SubcatGroup[] };

export default function GalleryGrid({ grouped }: { grouped: ServiceGroup[] }) {
  if (grouped.length === 0) {
    return (
      <p className="text-center text-white/30 py-20">No images yet.</p>
    );
  }

  return (
    <div className="space-y-20 sm:space-y-28">
      {grouped.map(({ service, subcats }) => (
        <div key={service.id}>
          {/* ── Service heading ── */}
          <div className="flex items-center gap-4 mb-10 sm:mb-14">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <h2
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight px-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {service.title}
            </h2>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          {/* ── Subcategory sections stacked ── */}
          <div className="space-y-14 sm:space-y-20">
            {subcats.map(({ subcategory, items }) => (
              <div key={subcategory ?? "__none__"}>
                {/* Subcategory label */}
                {subcategory && (
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <span className="w-1 h-5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                    <h3
                      className="text-base sm:text-lg font-semibold text-white/80 uppercase tracking-[0.18em]"
                    >
                      {subcategory}
                    </h3>
                  </div>
                )}

                {/* Masonry image grid */}
                <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-x-3 sm:gap-x-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="break-inside-avoid mb-3 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.07] group hover:border-[#c9a84c]/60 transition-colors duration-300"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={600}
                          height={800}
                          className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p
                            className="text-white text-xs sm:text-sm font-semibold leading-snug"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-white/60 text-xs mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
