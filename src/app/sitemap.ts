import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";
import { LIVE_POSTS } from "@/lib/posts";
import { usableImage } from "@/lib/html";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([
    db.service.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, title: true, heroImage: true, ogImage: true },
    }),
    db.post.findMany({
      where: LIVE_POSTS,
      select: { slug: true, updatedAt: true, title: true, coverImage: true, ogImage: true },
    }),
  ]);

  // Real change dates only — a lastmod of "now" on every fetch teaches Google
  // to ignore lastmod for the whole sitemap. Pages without a tracked date omit it.
  const latest = (dates: Date[]) =>
    dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
  const servicesUpdated = latest(services.map((s) => s.updatedAt));
  const blogUpdated = latest(posts.map((p) => p.updatedAt));
  const homeUpdated = latest([servicesUpdated, blogUpdated].filter((d): d is Date => !!d));

  // First servable image of a page, in the sitemap's image extension format
  const imagesOf = (...urls: (string | null)[]) => {
    const img = urls.map(usableImage).find(Boolean);
    return img ? { images: [img] } : {};
  };

  return [
    { url: SITE_URL,                  lastModified: homeUpdated,     changeFrequency: "monthly" as const, priority: 1 },
    { url: `${SITE_URL}/about`,                                      changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/contact`,                                    changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/services`,    lastModified: servicesUpdated, changeFrequency: "weekly"  as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`,        lastModified: blogUpdated,     changeFrequency: "weekly"  as const, priority: 0.8 },
    { url: `${SITE_URL}/gallery`,                                    changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/prices`,                                     changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/services/invisalign-dubai`,                  changeFrequency: "monthly" as const, priority: 0.9 },
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      ...imagesOf(s.heroImage, s.ogImage),
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...imagesOf(p.coverImage, p.ogImage),
    })),
  ];
}
