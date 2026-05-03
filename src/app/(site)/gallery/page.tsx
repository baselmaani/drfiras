export const revalidate = 60;

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import GalleryGrid from "./GalleryGrid";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  const title = `Gallery | ${s.doctorName}`;
  const description = `Browse real patient results from ${s.doctorName} — composite bonding, veneers, Invisalign & smile makeovers in Dubai.`;
  const url = `${SITE_URL}/gallery`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function GalleryPage() {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };

  const [items, services] = await Promise.all([
    db.galleryImage.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { service: { select: { id: true, title: true, slug: true } } },
    }),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, title: true, slug: true },
    }),
  ]);

  // Build grouped structure: service → subcategories (ordered by min image order)
  const grouped = services
    .filter((sv) => items.some((i) => i.service.id === sv.id))
    .map((sv) => {
      const serviceItems = items.filter((i) => i.service.id === sv.id);

      // Collect subcategory groups preserving insertion order (already sorted by `order`)
      const subcatMap = new Map<string, typeof serviceItems>();
      for (const item of serviceItems) {
        const key = item.subcategory?.trim() || "__none__";
        if (!subcatMap.has(key)) subcatMap.set(key, []);
        subcatMap.get(key)!.push(item);
      }

      const subcats = Array.from(subcatMap.entries()).map(([key, imgs]) => ({
        subcategory: key === "__none__" ? null : key,
        items: imgs,
      }));

      return { service: sv, subcats };
    });

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0d0d0d] pt-[100px] pb-12 sm:pb-20 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-4">
            Patient Results
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Gallery
          </h1>
          <p className="text-white/50 text-base max-w-2xl mx-auto leading-relaxed">
            Real results from real patients of {s.doctorName} — browse by treatment to see what&apos;s possible for your smile.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[#0f0f0f] py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <GalleryGrid grouped={grouped} />
        </div>
      </section>
    </>
  );
}
