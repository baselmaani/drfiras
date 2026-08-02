import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([
    db.service.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, title: true, heroImage: true, ogImage: true },
    }),
    db.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, title: true, coverImage: true, ogImage: true },
    }),
  ]);

  const now = new Date();
  return [
    { url: SITE_URL,                  lastModified: now, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${SITE_URL}/about`,       lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/contact`,     lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/services`,    lastModified: now, changeFrequency: "weekly"  as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`,        lastModified: now, changeFrequency: "weekly"  as const, priority: 0.8 },
    { url: `${SITE_URL}/gallery`,     lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/prices`,      lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      ...(s.heroImage || s.ogImage
        ? { images: [(s.heroImage ?? s.ogImage) as string] }
        : {}),
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(p.coverImage || p.ogImage
        ? { images: [(p.coverImage ?? p.ogImage) as string] }
        : {}),
    })),
  ];
}
