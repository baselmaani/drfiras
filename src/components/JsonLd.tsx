import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface DentistJsonLdProps {
  doctorName?: string;
  specialty?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  image?: string;
}

export function DentistJsonLd({
  doctorName = "Dr. Firas",
  specialty = "Cosmetic Dentist",
  phone,
  email,
  address,
  description,
  image,
}: DentistJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Dentist", "LocalBusiness"],
        "@id": `${SITE_URL}/#dentist`,
        name: doctorName,
        description:
          description ??
          `${doctorName} is a specialist ${specialty.toLowerCase()} offering composite bonding, Invisalign, veneers, and smile makeovers.`,
        url: SITE_URL,
        ...(phone && { telephone: phone }),
        ...(email && { email }),
        ...(address && {
          address: {
            "@type": "PostalAddress",
            streetAddress: address,
          },
        }),
        ...(image && { image }),
        medicalSpecialty: "Dentistry",
        priceRange: "££",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#dentist` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    description,
    url,
    ...(image && { image }),
    procedureType: "Noninvasive",
    followup: "Consultation with Dr. Firas",
    provider: { "@id": `${SITE_URL}/#dentist` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  updatedAt,
}: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt?: Date | null;
  updatedAt: Date;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description && { description }),
    url,
    ...(image && { image }),
    ...(publishedAt && { datePublished: publishedAt.toISOString() }),
    dateModified: updatedAt.toISOString(),
    author: { "@id": `${SITE_URL}/#dentist` },
    publisher: { "@id": `${SITE_URL}/#dentist` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
