export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://drfiraszoghieb.com";

export const SITE_NAME = "Dr. Firas Zoghieb";
export const SITE_DESCRIPTION =
  "Transform your smile with Dr. Firas Zoghieb — Dubai's composite bonding specialist. Expert in Invisalign & veneers. Minimally invasive. Free consultation. Al Wasl, Dubai.";
export const SITE_LOCALE = "en_AE";

// Dubai geo coordinates (Happiness St, Al Wasl)
export const GEO_LAT  = 25.2021489;
export const GEO_LNG  = 55.2604608;
export const GEO_REGION    = "AE-DU"; // ISO 3166-2
export const GEO_PLACENAME = "Dubai, United Arab Emirates";
export const GOOGLE_MAPS_CID = "13874945196486405235";

// Appends the brand to a page title. Titles entered in the dashboard often
// already end with a full or partial brand ("| Dr. Firas"), which is stripped
// first so it never doubles. Long titles skip the brand so the keyword isn't
// cut off in search results.
const BRAND_SUFFIX = /\s*[|—–-]\s*Dr\.?\s*Firas(\s+Zoghieb)?\s*$/i;
const MAX_TITLE_LENGTH = 65;

export function withBrand(title: string): string {
  let base = title.trim();
  while (BRAND_SUFFIX.test(base)) base = base.replace(BRAND_SUFFIX, "");
  if (base.includes(SITE_NAME)) return base;
  const branded = `${base} | ${SITE_NAME}`;
  return branded.length <= MAX_TITLE_LENGTH ? branded : base;
}
