export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ServiceJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BeforeAfter from "@/components/BeforeAfter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) return {};

  const title = service.metaTitle ?? service.title;
  const description = service.metaDesc ?? service.description;
  const url = `${SITE_URL}/services/${service.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
      ...(service.ogImage && { images: [{ url: service.ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(service.ogImage && { images: [service.ogImage] }),
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug, published: true } });
  if (!service) notFound();

  let caseImages: string[] = [];
  if (service.caseImages) {
    try { caseImages = JSON.parse(service.caseImages); } catch { /* keep empty */ }
  }

  return (
    <>
      <Navbar />
      <ServiceJsonLd
        name={service.title}
        description={service.description}
        url={`${SITE_URL}/services/${service.slug}`}
        image={service.heroImage ?? service.ogImage ?? undefined}
      />

      {/* Hero */}
      <section className="relative bg-[#0d0d0d] pt-[68px] overflow-hidden">
        {/* Gold radial glow top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 75% 40%, rgba(201,168,76,0.07) 0%, transparent 65%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 pt-8 text-[13px] text-white/35">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span className="text-white/15">/</span>
            <Link href="/services" className="hover:text-[#c9a84c] transition-colors">Services</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/60 truncate max-w-[180px]">{service.title}</span>
          </nav>

          <div
            className={`grid items-center gap-12 pt-10 pb-20 ${
              service.heroImage ? "md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_500px]" : "max-w-3xl"
            }`}
          >
            {/* Left — text */}
            <div>
              {service.icon && (
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-3xl mb-6">
                  {service.icon}
                </div>
              )}
              <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
                Treatment
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 leading-[1.1]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {service.title}
              </h1>
              <p className="text-base md:text-lg text-white/55 leading-relaxed mb-10 max-w-lg">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#book"
                  className="inline-flex items-center gap-2 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 px-8 py-3.5 rounded-full font-semibold text-sm transition-colors"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 border border-[#c9a84c]/40 text-[#c9a84c]/70 hover:border-[#c9a84c] hover:text-[#c9a84c] px-8 py-3.5 rounded-full font-medium text-sm transition-colors"
                >
                  ← All Treatments
                </Link>
              </div>
            </div>

            {/* Right — image */}
            {service.heroImage && (
              <div
                className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#141414] border border-white/[0.06]"
                style={{ aspectRatio: "4/5", minHeight: "360px" }}
              >
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background: "linear-gradient(to top, rgba(13,13,13,0.6) 0%, transparent 100%)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      {service.content && (
        <section className="bg-[#111] border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[2px] bg-[#c9a84c]" />
              <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em]">
                About This Treatment
              </p>
            </div>
            <div
              className="
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:leading-snug
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white/90 [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:text-white/55 [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-[15px]
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-4
                [&_li]:text-white/55 [&_li]:text-[15px]
                [&_strong]:text-white/80 [&_strong]:font-semibold
                [&_a]:text-[#c9a84c] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#b8943e]
                [&_hr]:border-white/10 [&_hr]:my-8
                [&_blockquote]:border-l-2 [&_blockquote]:border-[#c9a84c] [&_blockquote]:pl-4 [&_blockquote]:text-white/45 [&_blockquote]:italic [&_blockquote]:my-4
              "
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
        </section>
      )}

      {/* Case Images Gallery */}
      {caseImages.length > 0 && (
        <section className="py-20 bg-[#0d0d0d] border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
                Real Results
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Case Gallery
              </h2>
            </div>
            <div
              className={`grid gap-4 ${
                caseImages.length === 1
                  ? "max-w-sm mx-auto"
                  : caseImages.length === 2
                  ? "grid-cols-2 max-w-2xl mx-auto"
                  : "grid-cols-2 md:grid-cols-3"
              }`}
            >
              {caseImages.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden bg-[#141414] border border-white/[0.06] group"
                  style={{ aspectRatio: "4/5" }}
                >
                  <Image
                    src={img}
                    alt={`${service.title} — case ${i + 1}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 100%)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <BeforeAfter />

      {/* CTA */}
      <section className="py-24 bg-[#0d0d0d] border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-full px-5 py-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.22em]">
              Take the First Step
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Transform Your Smile?
          </h2>
          <p className="text-white/45 mb-10 text-base leading-relaxed">
            Book a consultation with Dr. Firas and discover if{" "}
            <span className="text-white/70 font-medium">{service.title}</span> is right for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#book"
              className="inline-flex items-center gap-2 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 px-10 py-4 rounded-full font-semibold transition-colors text-sm"
            >
              Book a Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-[#c9a84c]/40 text-[#c9a84c]/70 hover:border-[#c9a84c] hover:text-[#c9a84c] px-10 py-4 rounded-full font-medium text-sm transition-colors"
            >
              Explore Other Treatments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
