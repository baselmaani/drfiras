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
      <section className="relative pt-24 pb-0 bg-[#0d0d0d] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`grid gap-10 items-center py-16 ${service.heroImage ? "md:grid-cols-2" : ""}`}>
            <div>
              {service.icon && <div className="text-4xl mb-4">{service.icon}</div>}
              <h1
                className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {service.title}
              </h1>
              <p className="text-lg text-white/70 leading-relaxed mb-8">{service.description}</p>
              <Link
                href="/#book"
                className="inline-block bg-[#c9a84c] hover:bg-[#b8943d] text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Book a Consultation
              </Link>
            </div>
            {service.heroImage && (
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      {service.content && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="prose prose-lg prose-headings:font-semibold prose-headings:text-[#1b4f72] prose-a:text-[#c9a84c] max-w-none"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
        </section>
      )}

      {/* Case Images Gallery */}
      {caseImages.length > 0 && (
        <section className="py-16 bg-[#f7f9fc]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-2">Real Results</p>
              <h2
                className="text-3xl font-bold text-[#1b4f72]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Case Gallery
              </h2>
            </div>
            <div className={`grid gap-4 ${caseImages.length === 1 ? "max-w-lg mx-auto" : "grid-cols-2 md:grid-cols-3"}`}>
              {caseImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-100">
                  <Image
                    src={img}
                    alt={`${service.title} case ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#1b4f72]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Transform Your Smile?
          </h2>
          <p className="text-blue-100 mb-8">
            Book a consultation with Dr. Firas and find out if {service.title} is right for you.
          </p>
          <Link
            href="/#book"
            className="bg-[#c9a84c] hover:bg-[#b8943d] text-white px-8 py-3 rounded-full font-semibold transition-colors inline-block"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
