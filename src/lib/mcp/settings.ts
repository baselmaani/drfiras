import { z } from "zod";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { ToolError } from "./errors";

/**
 * Site settings the AI connector may read and write, grouped like the dashboard's content pages.
 * The dashboard's updateSettings saves any field it is sent; here only these keys are accepted.
 * SMTP keys (they hold the mail password) are deliberately absent: they can't be read or written.
 */
export const SETTING_GROUPS: Record<string, { page: string; keys: string[] }> = {
  general: {
    page: "/dashboard/settings",
    keys: [
      "logoUrl",
      "faviconUrl",
      "doctorName",
      "specialty",
      "doctorPhotoUrl",
      "doctorQualifications",
      "doctorLicense",
      "doctorBio",
      "aboutText",
      "metaTitle",
      "metaDescription",
      "ogImage",
    ],
  },
  contact_details: {
    page: "/dashboard/settings",
    keys: [
      "phone",
      "email",
      "address",
      "whatsapp",
      "bookingUrl",
      "formEmail",
      "mapUrl",
      "googleBusinessUrl",
      "instagram",
      "tiktok",
      "facebook",
    ],
  },
  hero: {
    page: "/dashboard/content/hero",
    keys: [
      "heroEyebrow",
      "heroHeading",
      "heroBody",
      "heroCta1Text",
      "heroCta1Link",
      "heroCta2Text",
      "heroCta2Link",
      "heroImageUrl",
      "heroStatNumber",
      "heroStatLabel",
    ],
  },
  about: {
    page: "/dashboard/content/about",
    keys: [
      "aboutPara1",
      "aboutPara2",
      "aboutPara3",
      "aboutPara4",
      "aboutCtaText",
      "aboutCtaLink",
      "aboutStat1Number",
      "aboutStat1Label",
      "aboutStat2Number",
      "aboutStat2Label",
      "aboutStat3Number",
      "aboutStat3Label",
    ],
  },
  section_headings: {
    page: "/dashboard/content",
    keys: [
      "servicesEyebrow",
      "servicesHeading",
      "servicesDesc",
      "beforeAfterEyebrow",
      "beforeAfterHeading",
      "beforeAfterDesc",
      "contactEyebrow",
      "contactHeading",
      "contactDesc",
    ],
  },
  footer: {
    page: "/dashboard/content/footer",
    keys: [
      "footerCtaEyebrow",
      "footerCtaTitle",
      "footerCtaDesc",
      "footerCtaBtn1Text",
      "footerCtaBtn2Text",
      "footerTagline",
      "footerHours",
    ],
  },
  faqs: {
    page: "/dashboard/content/faq",
    keys: ["faqItems", "aboutFaqItems", "servicesFaqItems", "contactFaqItems", "blogFaqItems"],
  },
  at_a_glance: { page: "/dashboard/content/at-a-glance", keys: ["glanceItems"] },
  page_seo: {
    page: "/dashboard/content/pages-seo",
    keys: ["Home", "About", "Contact", "Blog", "Services"].flatMap((p) => [
      `seo${p}Title`,
      `seo${p}Desc`,
      `seo${p}Keywords`,
    ]),
  },
  google_reviews: {
    page: "/dashboard/content/google-reviews",
    keys: [
      "googleReviewsEnabled",
      "googleRating",
      "googleReviewCount",
      "googleReviewsUrl",
      "googlePlaceId",
      "googleReviews",
    ],
  },
  instagram: {
    page: "/dashboard/content/instagram",
    keys: ["instagramEnabled", "instagramHandle", "instagramFollowers", "instagramBio", "instagramPosts"],
  },
};

/** Per-review photo overrides on the Google reviews page: reviewPhoto__<reviewId>. */
const REVIEW_PHOTO = /^reviewPhoto__[A-Za-z0-9_\-./]{1,200}$/;

const ALLOWED = new Set(Object.values(SETTING_GROUPS).flatMap((g) => g.keys));
const isAllowed = (key: string) => ALLOWED.has(key) || REVIEW_PHOTO.test(key);

const faqList = z
  .array(z.object({ question: z.string().trim().min(1).max(500), answer: z.string().trim().min(1).max(5000) }).strict())
  .max(50);

/** Settings stored as JSON text, with the shape the site's components parse. */
const JSON_SETTINGS: Record<string, z.ZodType> = {
  faqItems: faqList,
  aboutFaqItems: faqList,
  servicesFaqItems: faqList,
  contactFaqItems: faqList,
  blogFaqItems: faqList,
  glanceItems: z.array(z.object({ label: z.string().max(200), value: z.string().max(500) }).strict()).max(30),
  googleReviews: z
    .array(
      z
        .object({
          name: z.string().max(200),
          rating: z.number().min(1).max(5),
          text: z.string().max(5000),
          date: z.string().max(100).optional(),
        })
        .passthrough()
    )
    .max(100),
  instagramPosts: z
    .array(
      z
        .object({
          image: z.string().max(2000),
          caption: z.string().max(2000).optional(),
          url: z.string().max(2000).optional(),
        })
        .strict()
    )
    .max(60),
};

const BOOLEAN_SETTINGS = new Set(["googleReviewsEnabled", "instagramEnabled"]);

export function settingsGuide() {
  return {
    groups: Object.fromEntries(Object.entries(SETTING_GROUPS).map(([k, g]) => [k, g.keys])),
    jsonKeys: {
      faqItems: "[{question, answer}] — homepage FAQ (aboutFaqItems, servicesFaqItems, contactFaqItems, blogFaqItems: same shape, per page)",
      glanceItems: "[{label, value}] — 'At a glance' facts",
      googleReviews: "[{name, rating 1-5, text, date}] — manual reviews shown when live Google reviews are unavailable",
      instagramPosts: "[{image, caption?, url?}]",
    },
    booleanKeys: [...BOOLEAN_SETTINGS],
    dynamicKeys: "reviewPhoto__<reviewId>: photo URL override for one live Google review",
    notEditable: "SMTP mail settings are not available to the connector.",
  };
}

/** Reads settings (defaults filled in), JSON keys parsed. `keys` narrows the result. */
export async function readSettings(opts: { group?: string; keys?: string[] }) {
  let keys: string[] | null = null;
  if (opts.group) {
    const group = SETTING_GROUPS[opts.group];
    if (!group) throw new ToolError(`Unknown group "${opts.group}". Groups: ${Object.keys(SETTING_GROUPS).join(", ")}.`);
    keys = group.keys;
  }
  if (opts.keys?.length) {
    const bad = opts.keys.filter((k) => !isAllowed(k));
    if (bad.length) throw new ToolError(`Not readable: ${bad.join(", ")}.`);
    keys = opts.keys;
  }
  const rows = await db.siteSetting.findMany(keys ? { where: { key: { in: keys } } } : undefined);
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const wanted = keys ?? [...ALLOWED, ...Object.keys(stored).filter((k) => REVIEW_PHOTO.test(k))];
  return Object.fromEntries(
    wanted.map((key) => {
      const raw = stored[key] ?? DEFAULT_SETTINGS[key] ?? "";
      if (key in JSON_SETTINGS) {
        try {
          return [key, raw ? JSON.parse(raw) : []];
        } catch {
          return [key, raw];
        }
      }
      return [key, raw];
    })
  );
}

/** Validates new values and turns them into the strings the settings table stores. */
export function normaliseSettings(values: Record<string, unknown>): Record<string, string> {
  const entries = Object.entries(values);
  if (!entries.length) throw new ToolError("No settings given.");
  if (entries.length > 80) throw new ToolError("Too many settings in one call (max 80).");
  const errors: string[] = [];
  const out: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (!isAllowed(key)) {
      errors.push(`${key}: not an editable setting${/^smtp/i.test(key) ? " (mail settings are dashboard-only)" : ""}`);
      continue;
    }
    if (key in JSON_SETTINGS) {
      let parsed = value;
      if (typeof value === "string") {
        try {
          parsed = value ? JSON.parse(value) : [];
        } catch {
          errors.push(`${key}: must be a JSON array`);
          continue;
        }
      }
      const result = JSON_SETTINGS[key].safeParse(parsed);
      if (!result.success) {
        errors.push(`${key}: ${result.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
        continue;
      }
      out[key] = Array.isArray(result.data) && result.data.length ? JSON.stringify(result.data) : "";
      continue;
    }
    if (BOOLEAN_SETTINGS.has(key)) {
      if (typeof value !== "boolean" && value !== "true" && value !== "false") {
        errors.push(`${key}: must be true or false`);
        continue;
      }
      out[key] = String(value);
      continue;
    }
    if (typeof value !== "string" && typeof value !== "number") {
      errors.push(`${key}: must be text`);
      continue;
    }
    const text = String(value);
    if (text.length > 20_000) {
      errors.push(`${key}: too long (max 20000 characters)`);
      continue;
    }
    if (/<\s*script\b|\son[a-z]+\s*=|javascript:/i.test(text)) {
      errors.push(`${key}: scripts and javascript: links are not allowed`);
      continue;
    }
    out[key] = text;
  }
  if (errors.length) throw new ToolError(`Not saved:\n${errors.join("\n")}`);
  return out;
}
