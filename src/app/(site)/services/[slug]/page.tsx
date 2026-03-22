export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ServiceJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

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
      <section className="relative pt-24 bg-[#0d0d0d] overflow-hidden">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 pt-8 pb-0 text-sm text-white/40">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#c9a84c] transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/70 truncate max-w-[160px]">{service.title}</span>
          </nav>

          <div
            className={`grid items-center gap-12 py-16 ${
              service.heroImage ? "md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_480px]" : ""
            }`}
          >
            {/* Left — text */}
            <div>
              {service.icon && (
                <div className="text-5xl mb-5">{service.icon}</div>
              )}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {service.title}
              </h1>
              <p className="text-lg text-white/65 leading-relaxed mb-8 max-w-xl">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#book"
                  className="inline-block border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-block border border-[#c9a84c]/50 text-[#c9a84c]/80 hover:border-[#c9a84c] hover:text-[#c9a84c] px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  ← All Treatments
                </Link>
              </div>
            </div>

            {/* Right — image */}
            {service.heroImage && (
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#1a1a1a]"
                style={{ aspectRatio: "4/5", minHeight: "360px" }}
              >
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
                {/* Bottom gradient overlay */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/4"
                  style={{
                    background: "linear-gradient(to top, rgba(13,13,13,0.5) 0%, transparent 100%)",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom fade into white content section */}
        <div
          aria-hidden
          className="h-10 bg-gradient-to-b from-transparent to-white"
        />
      </section>

      {/* Content */}
      {service.content && (
        <section className="py-16 bg-white text-gray-800">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-2">
                About This Treatment
              </p>
              <div className="w-12 h-[2px] bg-[#c9a84c]" />
            </div>
            <div
              className="prose prose-lg prose-headings:font-semibold prose-headings:text-[#1b4f72] prose-a:text-[#c9a84c] prose-li:text-gray-700 prose-p:text-gray-700 max-w-none"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
        </section>
      )}

      {/* Case Images Gallery */}
      {caseImages.length > 0 && (
        <section className="py-20 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
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
              className={`grid gap-5 ${
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
                  className="relative rounded-2xl overflow-hidden shadow-xl bg-[#1a1a1a] group"
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
                      background:
                        "linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 100%)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10 max-w-[80px]" />
            <div className="w-2 h-2 rounded-full bg-[#c9a84c]" />
            <div className="flex-1 h-px bg-white/10 max-w-[80px]" />
          </div>
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-4">
            Take the First Step
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Transform Your Smile?
          </h2>
          <p className="text-white/60 mb-10 text-lg leading-relaxed">
            Book a consultation with Dr. Firas and discover if{" "}
            <span className="text-white/85">{service.title}</span> is right for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#book"
              className="inline-block border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white px-10 py-4 rounded-full font-semibold transition-colors text-base"
            >
              Book a Consultation
            </Link>
            <Link
              href="/services"
              className="inline-block border border-[#c9a84c]/50 text-[#c9a84c]/80 hover:border-[#c9a84c] hover:text-[#c9a84c] px-10 py-4 rounded-full font-semibold transition-colors text-base"
            >
              Explore Other Treatments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
