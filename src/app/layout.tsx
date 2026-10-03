import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GTMScript } from "@/components/GTMScript";
import "./globals.css";
import { DentistJsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_LOCALE, GEO_LAT, GEO_LNG, GEO_REGION, GEO_PLACENAME } from "@/lib/constants";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { db } from "@/lib/db";
import { getServicePrices } from "@/lib/prices";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d0d0d",
};

// Default share image is the hero photo from the dashboard (there is no static /og.jpg).
export async function generateMetadata(): Promise<Metadata> {
  const s = { ...DEFAULT_SETTINGS, ...(await getSettings()) };
  const ogImage = s.heroImageUrl || undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} | Composite Bonding & Cosmetic Dentist Dubai`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
      "cosmetic dentist dubai",
      "composite bonding dubai",
      "composite bonding al wasl",
      "invisalign dubai",
      "veneers dubai",
      "smile makeover dubai",
      "teeth whitening dubai",
      "dental bonding dubai",
      "cosmetic dentistry uae",
      "dr firas zoghieb",
      "dr firas dentist dubai",
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} | Composite Bonding & Cosmetic Dentist Dubai`,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      locale: SITE_LOCALE,
      ...(ogImage && { images: [{ url: ogImage, alt: `${SITE_NAME} | Composite Bonding & Cosmetic Dentist Dubai` }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} | Composite Bonding & Cosmetic Dentist Dubai`,
      description: SITE_DESCRIPTION,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  const [services, prices] = await Promise.all([
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { title: true, slug: true },
    }),
    getServicePrices(),
  ]);
  return (
    <html lang="en-AE">
      <head>
        {/* Geo meta tags — picked up by Bing, Yahoo, Apple Maps */}
        <meta name="geo.region"    content={GEO_REGION} />
        <meta name="geo.placename" content={GEO_PLACENAME} />
        <meta name="geo.position"  content={`${GEO_LAT};${GEO_LNG}`} />
        <meta name="geo.country"   content="AE" />
        <meta name="ICBM"          content={`${GEO_LAT}, ${GEO_LNG}`} />
        {/* Facebook OG place tags — used for geo-discovery and map pins */}
        <meta property="place:location:latitude"  content={String(GEO_LAT)} />
        <meta property="place:location:longitude" content={String(GEO_LNG)} />
        {s.faviconUrl && (
          <>
            <link rel="icon" href={s.faviconUrl} />
            <link rel="shortcut icon" href={s.faviconUrl} />
            <link rel="apple-touch-icon" href={s.faviconUrl} />
          </>
        )}
      </head>
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <GTMScript />
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PRHXJHHC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <DentistJsonLd
          doctorName={s.doctorName}
          specialty={s.specialty}
          phone={s.phone}
          email={s.email}
          address={s.address}
          instagram={s.instagram}
          services={services.map((svc) => ({ name: svc.title, slug: svc.slug, price: prices.get(svc.title.trim().toLowerCase()) }))}
        />
        {children}
      </body>
    </html>
  );
}
