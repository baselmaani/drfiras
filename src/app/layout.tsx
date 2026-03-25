import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { DentistJsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_LOCALE, GEO_LAT, GEO_LNG, GEO_REGION, GEO_PLACENAME } from "@/lib/constants";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

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

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d0d0d",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Cosmetic Dentist Dubai`,
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
    title: `${SITE_NAME} | Cosmetic Dentist Dubai`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Cosmetic Dentist Dubai`,
    description: SITE_DESCRIPTION,
    creator: "@dr.firaszoghieb",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "en-AE": SITE_URL,
      "x-default": SITE_URL,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const raw = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...raw };
  return (
    <html lang="en-AE">
      <head>
        {/* Geo meta tags — picked up by Bing, Yahoo, Apple Maps */}
        <meta name="geo.region"    content={GEO_REGION} />
        <meta name="geo.placename" content={GEO_PLACENAME} />
        <meta name="geo.position"  content={`${GEO_LAT};${GEO_LNG}`} />
        <meta name="ICBM"          content={`${GEO_LAT}, ${GEO_LNG}`} />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PRHXJHHC');`,
          }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${manrope.variable} antialiased`}>
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
          rating={s.googleRating}
          reviewCount={s.googleReviewCount}
        />
        {children}
      </body>
    </html>
  );
}
