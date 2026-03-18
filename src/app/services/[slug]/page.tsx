import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ServiceJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  const services = await db.service.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

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

  return (
    <>
      <Navbar />
      <ServiceJsonLd
        name={service.title}
        description={service.description}
        url={`${SITE_URL}/services/${service.slug}`}
        image={service.ogImage ?? undefined}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#f7f9fc]">
        <div className="max-w-4xl mx-auto px-6">
          {service.icon && (
            <div className="text-4xl mb-4">{service.icon}</div>
          )}
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1b4f72] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {service.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">{service.description}</p>
        </div>
      </section>

      {/* Content */}
      {service.content && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="prose prose-lg prose-headings:font-semibold prose-headings:text-[#1b4f72] prose-a:text-[#c9a84c] max-w-none"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
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
            href="/#contact"
            className="bg-[#c9a84c] hover:bg-[#b8943d] text-white px-8 py-3 rounded-full font-semibold transition-colors inline-block"
          >
            Book a Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
