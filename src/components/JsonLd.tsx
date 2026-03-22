import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface DentistJsonLdProps {
  doctorName?: string;
  specialty?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  image?: string;
  rating?: string;
  reviewCount?: string;
  instagram?: string;
}

export function DentistJsonLd({
  doctorName = "Dr. Firas Zoghieb",
  specialty = "Cosmetic Dentist",
  phone,
  email,
  address,
  description,
  image,
  rating,
  reviewCount,
  instagram,
}: DentistJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Dentist", "LocalBusiness"],
        "@id": `${SITE_URL}/#dentist`,
        name: `${doctorName} | Composite Bonding - Dubai`,
        description:
          description ??
          `${doctorName} is a specialist ${specialty.toLowerCase()} in Dubai offering composite bonding, Invisalign, veneers, and smile makeovers.`,
        url: SITE_URL,
        ...(phone && { telephone: phone }),
        ...(email && { email }),
        address: {
          "@type": "PostalAddress",
          streetAddress: address ?? "Happiness St, Al Wasl",
          addressLocality: "Dubai",
          addressCountry: "AE",
        },
        ...(image && { image }),
        medicalSpecialty: "Dentistry",
        priceRange: "££",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "11:00",
            closes: "20:00",
          },
        ],
        sameAs: [
          instagram ?? "https://www.instagram.com/dr.firaszoghieb",
        ].filter(Boolean),
        ...(rating && reviewCount && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#dentist` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: doctorName,
        jobTitle: specialty,
        url: `${SITE_URL}/about`,
        worksFor: { "@id": `${SITE_URL}/#dentist` },
        sameAs: [
          instagram ?? "https://www.instagram.com/dr.firaszoghieb",
        ].filter(Boolean),
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
  slug,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  slug?: string;
}) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      name,
      description,
      url,
      ...(image && { image }),
      procedureType: "Noninvasive",
      followup: `Consultation with ${SITE_NAME}`,
      provider: { "@id": `${SITE_URL}/#dentist` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        { "@type": "ListItem", position: 3, name, item: url },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
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
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      ...(description && { description }),
      url,
      ...(image && { image }),
      ...(publishedAt && { datePublished: publishedAt.toISOString() }),
      dateModified: updatedAt.toISOString(),
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#dentist` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export function FAQJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  if (!items.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

