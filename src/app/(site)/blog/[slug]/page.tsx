export const revalidate = 60;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, withBrand } from "@/lib/constants";
import { ArticleJsonLd, FAQJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import FAQ from "@/components/FAQ";
import RelatedLinks from "@/components/RelatedLinks";
import { parseInternalLinks } from "@/lib/internalLinks";
import { serviceForPost } from "@/lib/serviceTopics";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { LIVE_POSTS } from "@/lib/posts";
import { stripEmptyHeadings, usableImage } from "@/lib/html";

// Share/schema image: the post's own OG image, then its cover, then the site hero photo.
async function postImage(post: { ogImage: string | null; coverImage: string | null }) {
  const own = usableImage(post.ogImage) ?? usableImage(post.coverImage);
  if (own) return own;
  const s = { ...DEFAULT_SETTINGS, ...(await getSettings()) };
  return s.heroImageUrl || undefined;
}

export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: LIVE_POSTS,
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post) return {};

  const title = post.metaTitle ?? post.title;
  const description = post.metaDesc ?? post.excerpt ?? "";
  const url = `${SITE_URL}/blog/${post.slug}`;
  const shareImage = await postImage(post);

  return {
    title: { absolute: withBrand(title) },
    description,
    ...(post.metaKeywords && { keywords: post.metaKeywords }),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      title: withBrand(title),
      description,
      url,
      type: "article",
      ...(shareImage && { images: [{ url: shareImage }] }),
      ...(post.publishedAt && { publishedTime: post.publishedAt.toISOString() }),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: withBrand(title),
      description,
      ...(shareImage && { images: [shareImage] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug, published: true } });
  if (!post) notFound();

  let faqItems: { question: string; answer: string }[] = [];
  if (post.faqItems) {
    try { faqItems = JSON.parse(post.faqItems); } catch { /* keep empty */ }
  }
  // Every post links back to the treatment page it supports (hub → spoke).
  const service = serviceForPost(post);
  const internalLinks = parseInternalLinks(post.internalLinks);
  const shareImage = await postImage(post);
  const coverImage = usableImage(post.coverImage);
  if (service && !internalLinks.some((l) => l.url === service.url)) {
    internalLinks.unshift({ anchor: service.anchor, url: service.url });
  }
  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <Navbar />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt ?? undefined}
        url={`${SITE_URL}/blog/${post.slug}`}
        image={shareImage}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
      />
      {faqItems.length > 0 && <FAQJsonLd items={faqItems} />}

      {/* Hero — two-column: image | title */}
      <section className="pt-28 pb-12 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`flex flex-col ${coverImage ? "lg:flex-row" : ""} items-center gap-10 lg:gap-16`}>

            {/* Title column — first in DOM so it renders above image on mobile */}
            <div className={`w-full ${coverImage ? "lg:w-1/2 lg:order-2" : "max-w-3xl mx-auto text-center"} flex flex-col justify-center`}>
              {post.publishedAt && (
                <time className="text-xs text-white/40 uppercase tracking-widest mb-4 block">
                  {formatDate(post.publishedAt)}
                </time>
              )}
              <h1
                data-speakable
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p data-speakable className="text-lg text-white/55 leading-relaxed">{post.excerpt}</p>
              )}
              <p className="mt-6 text-sm text-white/45">
                By{" "}
                <Link href="/about" className="text-white/75 hover:text-[#c9a84c] font-medium transition-colors">
                  {SITE_NAME}
                </Link>
                , Cosmetic Dentist in Dubai · Updated <time dateTime={post.updatedAt.toISOString()}>{formatDate(post.updatedAt)}</time>
              </p>
            </div>

            {/* Image column — order-1 on desktop so it sits on the left */}
            {coverImage && (
              <div className="w-full lg:w-1/2 lg:order-1 flex-shrink-0 relative aspect-[4/3]">
                <Image
                  src={coverImage}
                  alt={post.title}
                  fill
                  className="rounded-2xl object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 pb-24 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {service && (
            <Link
              href={service.url}
              className="group mb-10 flex items-center justify-between gap-4 rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.05] px-5 py-4 hover:border-[#c9a84c]/50 transition-colors"
            >
              <span className="text-white/70 text-[15px] leading-snug">
                Considering <strong className="text-white font-semibold">{service.anchor.toLowerCase()}</strong>? See the
                treatment, price and results.
              </span>
              <span className="flex-shrink-0 text-[#c9a84c] group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          )}
          <div
            className="[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white/90 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-white/55 [&_p]:text-[16px] [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:text-white/55 [&_li]:mb-1 [&_strong]:text-white/80 [&_strong]:font-semibold [&_a]:text-[#c9a84c] [&_a]:font-medium [&_a]:underline [&_a]:decoration-[#c9a84c]/40 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-[#e2c264] [&_a:hover]:decoration-[#e2c264] [&_blockquote]:border-l-4 [&_blockquote]:border-[#c9a84c] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/45 [&_hr]:border-white/10 [&_hr]:my-8"
            dangerouslySetInnerHTML={{ __html: stripEmptyHeadings(post.content) }}
          />

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link
              href="/blog"
              className="text-white/50 hover:text-[#c9a84c] font-medium transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </article>

      {/* Related internal links */}
      <RelatedLinks links={internalLinks} />

      {/* FAQ */}
      {faqItems.length > 0 && <FAQ items={faqItems} />}
      <ContactSection />
    </div>
  );
}
