import { SITE_NAME, SITE_URL, GEO_LAT, GEO_LNG, GOOGLE_MAPS_CID } from "@/lib/constants";

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
        "@type": "Dentist",
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
          addressRegion: "Dubai",
          addressCountry: "AE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO_LAT,
          longitude: GEO_LNG,
        },
        hasMap: `https://maps.google.com/?cid=${GOOGLE_MAPS_CID}`,
        ...(image && { image }),
        ...(image && { logo: { "@type": "ImageObject", url: image } }),
        medicalSpecialty: "Dentistry",
        priceRange: "££",
        currenciesAccepted: "AED",
        paymentAccepted: "Cash, Credit Card, Insurance",
        knowsLanguage: ["en", "ar"],
        areaServed: [
          { "@type": "City", name: "Dubai", sameAs: "https://www.wikidata.org/wiki/Q612" },
          { "@type": "AdministrativeArea", name: "United Arab Emirates" },
        ],
        serviceArea: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: GEO_LAT,
            longitude: GEO_LNG,
          },
          geoRadius: "30000",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          ...(phone && { telephone: phone }),
          availableLanguage: ["English", "Arabic"],
          areaServed: "AE",
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "11:00",
            closes: "20:00",
          },
        },
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
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#dentist` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: doctorName,
        givenName: "Firas",
        familyName: "Zoghieb",
        jobTitle: specialty,
        url: `${SITE_URL}/about`,
        worksFor: { "@id": `${SITE_URL}/#dentist` },
        knowsAbout: ["Composite Bonding", "Invisalign", "Dental Veneers", "Cosmetic Dentistry", "Smile Makeovers", "Teeth Whitening"],
        alumniOf: [
          { "@type": "EducationalOrganization", name: "University Dental School", description: "BDS (Honours)" },
          { "@type": "EducationalOrganization", name: "MSc Cosmetic Dentistry Programme", description: "MSc Cosmetic Dentistry" },
        ],
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
      "@type": "MedicalWebPage",
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      about: { "@id": `${url}#procedure` },
      mentions: { "@id": `${SITE_URL}/#dentist` },
      audience: { "@type": "Patient" },
      ...(image && { primaryImageOfPage: { "@type": "ImageObject", url: image } }),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "[data-speakable]"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "@id": `${url}#procedure`,
      name,
      description,
      url,
      ...(image && { image }),
      procedureType: "https://schema.org/Noninvasive",
      followup: `Consultation with ${SITE_NAME}`,
      provider: { "@id": `${SITE_URL}/#dentist` },
      recognizingAuthority: { "@type": "Organization", name: "Dubai Health Authority" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
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
      "@type": ["Article", "BlogPosting"],
      headline: title,
      ...(description && { description }),
      url,
      ...(image && { image: { "@type": "ImageObject", url: image } }),
      ...(publishedAt && { datePublished: publishedAt.toISOString() }),
      dateModified: updatedAt.toISOString(),
      inLanguage: "en",
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#dentist` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      about: { "@id": `${SITE_URL}/#dentist` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "[data-speakable]"],
      },
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

// ── SpeakableJsonLd ──────────────────────────────────────────────────────────
// Marks page content suitable for AI voice assistants and AI Overviews.
export function SpeakableJsonLd({ url, cssSelector = ["h1", "h2", "[data-speakable]"] }: { url: string; cssSelector?: string[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── HomepageJsonLd ───────────────────────────────────────────────────────────
// Standalone WebPage schema for the homepage with speakable + entity links.
export function HomepageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#homepage`,
    url: SITE_URL,
    name: `${SITE_NAME} | Cosmetic Dentist Dubai`,
    description:
      "Dr. Firas Zoghieb is a specialist cosmetic dentist in Dubai offering composite bonding, Invisalign, veneers, and complete smile makeovers.",
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#dentist` },
    mentions: { "@id": `${SITE_URL}/#person` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-speakable]"],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
