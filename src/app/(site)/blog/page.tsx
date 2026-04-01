export const revalidate = 60;

import { db } from "@/lib/db";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BeforeAfter from "@/components/BeforeAfter";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  const title = s.seoBlogTitle || `Dental Tips & Advice | ${SITE_NAME}`;
  const description = s.seoBlogDesc || `Expert dental tips, advice and patient stories from ${SITE_NAME}.`;
  const url = `${SITE_URL}/blog`;
  return {
    title,
    description,
    ...(s.seoBlogKeywords && { keywords: s.seoBlogKeywords }),
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

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  return (
    <>
      <Navbar />

      <main className="bg-[#0d0d0d] min-h-screen">
        {/* Header */}
        <section className="pt-[100px] pb-14 border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
              Latest Articles
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Dental Tips &amp; Advice
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
              Expert insights on cosmetic dentistry, oral health and smile transformation.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {posts.length === 0 ? (
              <p className="text-white/40 text-center py-20">No posts published yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article key={post.id} className="group bg-[#141414] border border-white/[0.06] hover:border-[#c9a84c]/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
                    {post.coverImage && (
                      <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {post.publishedAt && (
                        <time className="text-xs text-white/35 uppercase tracking-wide">
                          {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      )}
                      <h2
                        className="text-lg font-bold text-white mt-2 mb-2 group-hover:text-[#c9a84c] transition-colors leading-snug"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.excerpt && (
                        <p className="text-white/45 text-sm line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                      )}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block mt-4 text-[#c9a84c] text-sm font-medium hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
