import { z } from "zod";
import { db } from "@/lib/db";
import { stripEmptyHeadings } from "@/lib/html";
import { validateInternalLinks } from "@/lib/internalLinks";
import { ToolError } from "./errors";

/**
 * Every record type the AI connector can read and write, with a strict schema of the fields it
 * may set. The schemas mirror the dashboard forms (src/components/dashboard/*Form.tsx) so a record
 * saved here looks exactly like one saved by hand. Array fields that the database stores as JSON
 * text (FAQs, internal links, case images) are accepted and returned as real arrays.
 */

export type Row = Record<string, unknown> & { id: number };
type Where = Record<string, unknown>;

/** The part of a Prisma model delegate the connector uses, typed loosely so one code path serves every model. */
export interface Delegate {
  findUnique(args: { where: Where; include?: Where }): Promise<Row | null>;
  findFirst(args: { where: Where }): Promise<Row | null>;
  findMany(args: { where?: Where; orderBy?: unknown; skip?: number; take?: number; select?: Where }): Promise<Row[]>;
  count(args?: { where?: Where }): Promise<number>;
  create(args: { data: Where }): Promise<Row>;
  update(args: { where: Where; data: Where }): Promise<Row>;
  delete(args: { where: Where }): Promise<Row>;
}

const faqItems = z
  .array(z.object({ question: z.string().trim().min(1).max(500), answer: z.string().trim().min(1).max(5000) }).strict())
  .max(50)
  .describe("FAQ list shown on the page and in FAQ schema: [{question, answer}]");
const internalLinks = z
  .array(z.object({ anchor: z.string().trim().min(1).max(200), url: z.string().trim().min(1).max(500) }).strict())
  .max(30)
  .describe('Related links shown under the post: [{anchor, url}], url root-relative e.g. "/services/composite-bonding-dubai"');
const slug = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, digits and single hyphens only");
const text = (max: number) => z.string().max(max);
const optionalText = (max: number) => z.string().max(max).nullable().optional();
const html = z.string().max(200_000).describe("HTML (h2/h3/p/ul/ol/li/strong/em/a/blockquote/table). No h1, no scripts.");
const imageUrl = z.string().trim().max(2000).describe("Image URL (use list_media or upload_media_from_url to get one)");
const order = z.number().int().min(0).max(100_000);

export const toSlug = (str: string) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Blocks markup that would run code on the public site. The dashboard is trusted; an assistant can be prompt-injected. */
export function assertSafeHtml(field: string, value: string) {
  if (/<\s*(script|iframe|object|embed|style|form|input|meta|link|base)\b/i.test(value))
    throw new ToolError(`${field}: script, iframe, style, form and similar tags are not allowed.`);
  if (/\son[a-z]+\s*=/i.test(value)) throw new ToolError(`${field}: inline event handlers (onclick=…) are not allowed.`);
  if (/(href|src)\s*=\s*["']?\s*(javascript|vbscript|data):/i.test(value))
    throw new ToolError(`${field}: javascript:, vbscript: and data: links are not allowed.`);
}

const jsonText = (value: unknown) => (Array.isArray(value) && value.length ? JSON.stringify(value) : null);
const parseJsonArray = (value: unknown) => {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export type EntityDef = {
  label: string;
  description: string;
  delegate: () => Delegate;
  /** Fields accepted on create; update accepts any subset. */
  schema: z.ZodObject;
  required: string[];
  /** Field that holds the "is visible on the site" flag. */
  visibleField?: "published" | "enabled";
  /** Has an `order` column (reorder_content works on it). */
  hasOrder: boolean;
  slugField?: "slug";
  /** Columns searched by list_content's `query`. */
  searchFields: string[];
  /** What delete_content's `confirm` must equal. */
  confirmField: string;
  labelOf: (row: Row) => string;
  publicUrl: (row: Row) => string | null;
  adminUrl: (row: Row) => string;
  /** Fields returned by list_content (the rest come from get_content). */
  listFields: string[];
  /** Turns validated tool input into database columns. `existing` is set on update. */
  toData: (input: Record<string, unknown>, existing: Row | null) => Promise<Record<string, unknown>> | Record<string, unknown>;
  /** Database row → what the assistant sees (JSON text columns become arrays). */
  present: (row: Row) => Record<string, unknown>;
};

const copyDefined = (input: Record<string, unknown>, keys: string[]) =>
  Object.fromEntries(keys.filter((k) => input[k] !== undefined).map((k) => [k, input[k] === "" ? null : input[k]]));

function htmlField(input: Record<string, unknown>, key: string): Record<string, unknown> {
  if (input[key] === undefined) return {};
  const value = input[key];
  if (value === null || value === "") return { [key]: null };
  assertSafeHtml(key, String(value));
  return { [key]: stripEmptyHeadings(String(value)) };
}

const post: EntityDef = {
  label: "Blog post",
  description: "Articles at /blog/{slug}. Content is HTML.",
  delegate: () => db.post as unknown as Delegate,
  schema: z
    .object({
      title: text(300),
      slug: slug.optional().describe("URL slug; generated from the title when left out on create"),
      excerpt: optionalText(1000),
      content: html,
      coverImage: imageUrl.nullable().optional(),
      published: z.boolean().optional().describe("Defaults to true on create (goes live immediately)"),
      reviewed: z
        .boolean()
        .optional()
        .describe("Medically reviewed by Dr. Firas. Only set true when the user confirms he reviewed this post."),
      metaTitle: optionalText(200),
      metaDesc: optionalText(400),
      metaKeywords: optionalText(500),
      ogImage: imageUrl.nullable().optional(),
      faqItems: faqItems.optional(),
      internalLinks: internalLinks.optional(),
    })
    .strict(),
  required: ["title", "content"],
  visibleField: "published",
  hasOrder: false,
  slugField: "slug",
  searchFields: ["title", "slug", "excerpt"],
  confirmField: "slug",
  labelOf: (r) => String(r.title),
  publicUrl: (r) => `/blog/${r.slug}`,
  adminUrl: (r) => `/dashboard/posts/${r.id}/edit`,
  listFields: ["id", "title", "slug", "published", "publishedAt", "reviewedAt", "updatedAt"],
  toData(input, existing) {
    const data: Record<string, unknown> = {
      ...copyDefined(input, ["title", "slug", "excerpt", "coverImage", "metaTitle", "metaDesc", "metaKeywords", "ogImage"]),
      ...htmlField(input, "content"),
    };
    if (data.content === null) throw new ToolError("content can't be empty.");
    if (!existing && !data.slug && input.title) data.slug = toSlug(String(input.title));
    if (input.published !== undefined) {
      data.published = input.published;
      if (input.published && !existing?.publishedAt) data.publishedAt = new Date();
    }
    if (input.reviewed !== undefined) data.reviewedAt = input.reviewed ? existing?.reviewedAt ?? new Date() : null;
    if (input.faqItems !== undefined) data.faqItems = jsonText(input.faqItems);
    if (input.internalLinks !== undefined) {
      const { valid, errors } = validateInternalLinks(input.internalLinks as { anchor: string; url: string }[]);
      if (errors.length) throw new ToolError(errors.join("\n"));
      data.internalLinks = jsonText(valid);
    }
    return data;
  },
  present: (r) => {
    const { faqItems: f, internalLinks: l, ...rest } = r;
    return { ...rest, reviewed: r.reviewedAt != null, faqItems: parseJsonArray(f), internalLinks: parseJsonArray(l) };
  },
};

const service: EntityDef = {
  label: "Service",
  description: "Treatment pages at /services/{slug}, also listed on the homepage. Content is HTML.",
  delegate: () => db.service as unknown as Delegate,
  schema: z
    .object({
      title: text(300),
      slug: slug.optional().describe("URL slug; generated from the title when left out on create"),
      description: text(2000).describe("Short summary shown on cards and the services list"),
      content: html.nullable().optional(),
      icon: optionalText(2000),
      heroImage: imageUrl.nullable().optional(),
      caseImages: z.array(imageUrl).max(40).optional().describe("Case photo URLs shown on the service page"),
      order: order.optional(),
      published: z.boolean().optional().describe("Defaults to true on create (goes live immediately)"),
      metaTitle: optionalText(200),
      metaDesc: optionalText(400),
      metaKeywords: optionalText(500),
      ogImage: imageUrl.nullable().optional(),
      faqItems: faqItems.optional(),
    })
    .strict(),
  required: ["title", "description"],
  visibleField: "published",
  hasOrder: true,
  slugField: "slug",
  searchFields: ["title", "slug", "description"],
  confirmField: "slug",
  labelOf: (r) => String(r.title),
  publicUrl: (r) => `/services/${r.slug}`,
  adminUrl: (r) => `/dashboard/services/${r.id}/edit`,
  listFields: ["id", "title", "slug", "order", "published", "updatedAt"],
  toData(input, existing) {
    const data: Record<string, unknown> = {
      ...copyDefined(input, [
        "title",
        "slug",
        "description",
        "icon",
        "heroImage",
        "order",
        "published",
        "metaTitle",
        "metaDesc",
        "metaKeywords",
        "ogImage",
      ]),
      ...htmlField(input, "content"),
    };
    if (!existing && !data.slug && input.title) data.slug = toSlug(String(input.title));
    if (input.caseImages !== undefined) data.caseImages = jsonText(input.caseImages);
    if (input.faqItems !== undefined) data.faqItems = jsonText(input.faqItems);
    return data;
  },
  present: (r) => ({ ...r, caseImages: parseJsonArray(r.caseImages), faqItems: parseJsonArray(r.faqItems) }),
};

const price: EntityDef = {
  label: "Price",
  description:
    "Treatment prices. A price shows on the service page whose title matches the price title (case-insensitive), and in the site's structured data.",
  delegate: () => db.servicePrice as unknown as Delegate,
  schema: z
    .object({
      title: text(300).describe("Must match the service title for the price to appear on that service page"),
      description: optionalText(2000),
      price: text(200).describe('Free text, e.g. "AED 1,500" or "From AED 900"'),
      priceNote: optionalText(300).describe('e.g. "per tooth"'),
      category: optionalText(200),
      order: order.optional(),
      published: z.boolean().optional(),
    })
    .strict(),
  required: ["title", "price"],
  visibleField: "published",
  hasOrder: true,
  searchFields: ["title", "category", "price"],
  confirmField: "title",
  labelOf: (r) => `${r.title} — ${r.price}`,
  publicUrl: () => null,
  adminUrl: (r) => `/dashboard/prices/${r.id}/edit`,
  listFields: ["id", "title", "price", "priceNote", "category", "order", "published"],
  toData: (input) => copyDefined(input, ["title", "description", "price", "priceNote", "category", "order", "published"]),
  present: (r) => r,
};

const beforeAfter: EntityDef = {
  label: "Before & after case",
  description: "Smile transformation cards in the homepage Before & After section. One combined before/after image.",
  delegate: () => db.beforeAfter as unknown as Delegate,
  schema: z
    .object({
      title: text(300),
      treatment: text(300).describe('Treatment name, e.g. "Composite Bonding"'),
      beforeImage: imageUrl.describe("The combined before/after image"),
      description: optionalText(2000),
      order: order.optional(),
      published: z.boolean().optional(),
    })
    .strict(),
  required: ["title", "treatment", "beforeImage"],
  visibleField: "published",
  hasOrder: true,
  searchFields: ["title", "treatment"],
  confirmField: "title",
  labelOf: (r) => String(r.title),
  publicUrl: () => "/#before-after",
  adminUrl: (r) => `/dashboard/before-after/${r.id}/edit`,
  listFields: ["id", "title", "treatment", "beforeImage", "order", "published"],
  toData: (input) => copyDefined(input, ["title", "treatment", "beforeImage", "description", "order", "published"]),
  present: (r) => r,
};

const galleryImage: EntityDef = {
  label: "Gallery image",
  description: "Photos on /gallery, grouped by service.",
  delegate: () => db.galleryImage as unknown as Delegate,
  schema: z
    .object({
      title: text(300),
      image: imageUrl,
      serviceId: z.number().int().positive().describe("id of the service this photo belongs to (list_content type=service)"),
      subcategory: optionalText(200),
      description: optionalText(2000),
      order: order.optional(),
      published: z.boolean().optional(),
    })
    .strict(),
  required: ["title", "image", "serviceId"],
  visibleField: "published",
  hasOrder: true,
  searchFields: ["title", "subcategory"],
  confirmField: "title",
  labelOf: (r) => String(r.title),
  publicUrl: () => "/gallery",
  adminUrl: (r) => `/dashboard/gallery/${r.id}/edit`,
  listFields: ["id", "title", "image", "serviceId", "subcategory", "order", "published"],
  async toData(input) {
    if (input.serviceId !== undefined) {
      const exists = await db.service.findUnique({ where: { id: Number(input.serviceId) }, select: { id: true } });
      if (!exists) throw new ToolError(`No service with id ${input.serviceId}.`);
    }
    return copyDefined(input, ["title", "image", "serviceId", "subcategory", "description", "order", "published"]);
  },
  present: (r) => r,
};

const menuItem: EntityDef = {
  label: "Menu item",
  description:
    "Navigation bar links. position left|right; a parentId makes it a dropdown child. When the table is empty the site shows a built-in default menu.",
  delegate: () => db.menuItem as unknown as Delegate,
  schema: z
    .object({
      label: text(100),
      href: text(500).describe('Root-relative path ("/blog"), an anchor ("/#faq") or a full https URL'),
      position: z.enum(["left", "right"]).optional(),
      order: order.optional(),
      parentId: z.number().int().positive().nullable().optional(),
      enabled: z.boolean().optional(),
    })
    .strict(),
  required: ["label", "href"],
  visibleField: "enabled",
  hasOrder: true,
  searchFields: ["label", "href"],
  confirmField: "label",
  labelOf: (r) => `${r.label} → ${r.href}`,
  publicUrl: () => "/",
  adminUrl: () => "/dashboard/content/menu",
  listFields: ["id", "label", "href", "position", "order", "parentId", "enabled"],
  async toData(input, existing) {
    if (input.href !== undefined && !/^(\/|#|https:\/\/|mailto:|tel:)/.test(String(input.href)))
      throw new ToolError('href must start with "/", "#", "https://", "mailto:" or "tel:".');
    if (input.parentId != null) {
      if (existing && input.parentId === existing.id) throw new ToolError("A menu item can't be its own parent.");
      const parent = await db.menuItem.findUnique({ where: { id: Number(input.parentId) }, select: { id: true } });
      if (!parent) throw new ToolError(`No menu item with id ${input.parentId}.`);
    }
    return copyDefined(input, ["label", "href", "position", "order", "parentId", "enabled"]);
  },
  present: (r) => r,
};

const mediaFolder: EntityDef = {
  label: "Media folder",
  description: "Folders in the media library. Deleting one moves its files to the root.",
  delegate: () => db.mediaFolder as unknown as Delegate,
  schema: z
    .object({
      name: text(200),
      parentId: z.number().int().positive().nullable().optional(),
    })
    .strict(),
  required: ["name"],
  hasOrder: false,
  searchFields: ["name"],
  confirmField: "name",
  labelOf: (r) => String(r.name),
  publicUrl: () => null,
  adminUrl: () => "/dashboard/media",
  listFields: ["id", "name", "parentId", "createdAt"],
  async toData(input, existing) {
    if (input.parentId != null) {
      if (existing && input.parentId === existing.id) throw new ToolError("A folder can't be its own parent.");
      const parent = await db.mediaFolder.findUnique({ where: { id: Number(input.parentId) }, select: { id: true } });
      if (!parent) throw new ToolError(`No media folder with id ${input.parentId}.`);
    }
    return copyDefined(input, ["name", "parentId"]);
  },
  present: (r) => r,
};

export const ENTITIES = {
  post,
  service,
  price,
  before_after: beforeAfter,
  gallery_image: galleryImage,
  menu_item: menuItem,
  media_folder: mediaFolder,
} satisfies Record<string, EntityDef>;

export type EntityKey = keyof typeof ENTITIES;
export const ENTITY_KEYS = Object.keys(ENTITIES) as [EntityKey, ...EntityKey[]];

export function entityDef(key: string): EntityDef {
  const def = (ENTITIES as Record<string, EntityDef>)[key];
  if (!def) throw new ToolError(`Unknown content type "${key}". Use one of: ${ENTITY_KEYS.join(", ")}.`);
  return def;
}

/** Finds a record by numeric id, or by slug for types that have one. */
export async function findRecord(def: EntityDef, idOrSlug: string | number): Promise<Row> {
  const asNumber = typeof idOrSlug === "number" ? idOrSlug : /^\d+$/.test(idOrSlug) ? Number(idOrSlug) : null;
  let row: Row | null = null;
  if (asNumber !== null) row = await def.delegate().findUnique({ where: { id: asNumber } });
  if (!row && def.slugField && typeof idOrSlug === "string")
    row = await def.delegate().findUnique({ where: { [def.slugField]: idOrSlug } });
  if (!row) throw new ToolError(`${def.label} "${idOrSlug}" not found.`);
  return row;
}

/** Short field-by-field description used by get_site_overview. */
export function describeFields(def: EntityDef) {
  return Object.fromEntries(
    Object.entries(def.schema.shape).map(([name, schema]) => {
      // .optional()/.nullable() wrappers don't carry the inner schema's description in zod 4.
      let s = schema as z.ZodType & { unwrap?: () => z.ZodType };
      while (!s.description && typeof s.unwrap === "function") s = s.unwrap() as typeof s;
      const required = def.required.includes(name);
      return [name, `${required ? "required" : "optional"}${s.description ? ` — ${s.description}` : ""}`];
    })
  );
}
