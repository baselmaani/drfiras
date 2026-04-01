export const revalidate = 60;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArticleJsonLd, FAQJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";

export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { published: true },
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

  return {
    title,
    description,
    ...(post.metaKeywords && { keywords: post.metaKeywords }),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "article",
      ...(post.ogImage && { images: [{ url: post.ogImage }] }),
      ...(post.publishedAt && { publishedTime: post.publishedAt.toISOString() }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(post.ogImage && { images: [post.ogImage] }),
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

  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      <Navbar />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt ?? undefined}
        url={`${SITE_URL}/blog/${post.slug}`}
        image={post.ogImage ?? undefined}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
      />
      {faqItems.length > 0 && <FAQJsonLd items={faqItems} />}

      {/* Article Header */}
      <section className="pt-32 pb-12 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-5">
            {post.publishedAt && (
              <time className="text-xs text-white/40 uppercase tracking-widest">
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
          </div>
          <h1
            data-speakable
            className="text-4xl md:text-5xl font-bold text-white mt-2 mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p data-speakable className="text-lg text-white/55 leading-relaxed">{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-2xl object-cover max-h-[480px]"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="py-12 pb-24 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white/90 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-white/55 [&_p]:text-[16px] [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:text-white/55 [&_li]:mb-1 [&_strong]:text-white/80 [&_strong]:font-semibold [&_a]:text-[#c9a84c] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#c9a84c] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/45 [&_hr]:border-white/10 [&_hr]:my-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
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

      {/* FAQ */}
      {faqItems.length > 0 && <FAQ items={faqItems} />}
    </div>
  );
}
