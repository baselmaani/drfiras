import { db } from "@/lib/db";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dental Tips & Advice",
  description: `Expert dental tips, advice and patient stories from ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Dental Tips & Advice | ${SITE_NAME}`,
    description: `Expert dental tips, advice and patient stories from ${SITE_NAME}.`,
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

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

      {/* Header */}
      <section className="pt-32 pb-12 bg-[#f7f9fc]">
        <div className="max-w-5xl mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1b4f72] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Dental Tips &amp; Advice
          </h1>
          <p className="text-xl text-gray-600">
            Expert insights on cosmetic dentistry, oral health and smile transformation.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No  published yet. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  {post.coverImage && (
                    <Link href={`/blog/${post.slug}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  )}
                  <div>
                    {post.publishedAt && (
                      <time className="text-xs text-gray-400 uppercase tracking-wide">
                        {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    <h2
                      className="text-xl font-bold text-[#1b4f72] mt-2 mb-2 group-hover:text-[#c9a84c] transition-colors"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block mt-3 text-[#c9a84c] text-sm font-medium hover:underline"
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

      <Footer />
    </>
  );
}
