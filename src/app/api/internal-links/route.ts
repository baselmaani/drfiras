import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 60;

export type InternalLink = {
  label: string;
  href: string;
  group: "Pages" | "Services" | "Posts";
};

const STATIC_PAGES: InternalLink[] = [
  { label: "Home", href: "/", group: "Pages" },
  { label: "About", href: "/about", group: "Pages" },
  { label: "Blog", href: "/blog", group: "Pages" },
  { label: "Gallery", href: "/gallery", group: "Pages" },
  { label: "Prices", href: "/prices", group: "Pages" },
  { label: "Services", href: "/services", group: "Pages" },
  { label: "Contact", href: "/contact", group: "Pages" },
];

export async function GET() {
  const [services, posts] = await Promise.all([
    db.service.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" } }),
    db.post.findMany({
      where: { published: true },
      select: { title: true, slug: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const links: InternalLink[] = [
    ...STATIC_PAGES,
    ...services.map((s) => ({ label: s.title, href: `/services/${s.slug}`, group: "Services" as const })),
    ...posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}`, group: "Posts" as const })),
  ];

  return NextResponse.json(links);
}
