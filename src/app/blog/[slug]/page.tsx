import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArticleJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  return (
    <>
      <Navbar />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt ?? undefined}
        url={`${SITE_URL}/blog/${post.slug}`}
        image={post.ogImage ?? undefined}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
      />

      {/* Article Header */}
      <section className="pt-32 pb-10 bg-[#f7f9fc]">
        <div className="max-w-3xl mx-auto px-6">
          {post.publishedAt && (
            <time className="text-sm text-gray-400 uppercase tracking-wide">
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1b4f72] mt-3 mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-2xl object-cover max-h-[480px]"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="py-10 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="prose prose-lg prose-headings:font-semibold prose-headings:text-[#1b4f72] prose-a:text-[#c9a84c] prose-strong:text-gray-800 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/blog"
              className="text-[#1b4f72] hover:text-[#c9a84c] font-medium transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
