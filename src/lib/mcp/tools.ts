import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { BLOG_REDIRECTS } from "@/lib/blogRedirects";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { describeFields, ENTITIES, ENTITY_KEYS, entityDef, findRecord, type EntityDef } from "./entities";
import { ToolError } from "./errors";
import { deleteMediaFile, listFolders, listMedia, mediaUsage, updateMediaFile, uploadFromUrl } from "./media";
import { MCP_SCOPE } from "./oauth";
import { readSettings, SETTING_GROUPS, settingsGuide } from "./settings";
import {
  createRecord,
  deleteRecord,
  describeRecord,
  listRevisions,
  reorder,
  restoreRevision,
  setVisible,
  updateRecord,
  writeSettings,
  type Actor,
} from "./write";

type Access = "read" | "write" | "destructive";
type ToolContext = { http?: { authInfo?: { clientId?: string; extra?: Record<string, unknown> } } };

const RETIRED: Record<string, string> = BLOG_REDIRECTS;
const site = SITE_URL.replace(/\/$/, "");
const absolute = (path: string | null) => (path ? `${site}${path}` : null);

const contentType = z.enum(ENTITY_KEYS).describe(ENTITY_KEYS.join(" | "));
const idOrSlug = z.union([z.number().int().positive(), z.string().min(1).max(200)]).describe("Record id, or slug for posts and services");
const fields = z.record(z.string(), z.unknown());

const RULES = [
  `This is the website of ${SITE_NAME}, a cosmetic dentist in Dubai (${site}). Write in British English.`,
  "Never invent credentials, qualifications, patient reviews, case results, statistics or prices. Use only facts the user gives you or that are already on the site.",
  "Only set a post's `reviewed` to true when the user confirms Dr. Firas medically reviewed it.",
  "Medical wording: suitability is decided at a consultation; never promise or guarantee outcomes.",
  "Content fields are HTML. Use <h2> and <h3> for headings, never <h1> (the page already has one). Scripts, iframes, inline event handlers and javascript: links are rejected.",
  "Internal links are root-relative, e.g. /services/composite-bonding-dubai or /blog/<slug>. Check slugs with list_content before linking.",
  "Meta titles: about 50–60 characters; the site appends “| Dr. Firas Zoghieb” when there is room. Meta descriptions: 120–160 characters. Keep titles unique.",
  "Avoid keyword cannibalisation: before writing a new post, list existing posts and services on the topic and update or link to them instead of duplicating.",
  "New posts and services go live immediately unless you pass published: false. Tell the user the live URL after creating or changing something.",
  "Deleting needs `confirm` set to the record's slug/title/name. Every change is recorded; list_revisions + restore_revision undo it.",
];

const reply = (result: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] });

/**
 * Tools that change the site. The MCP route refreshes the public cache after any of them runs:
 * tool callbacks run outside the route's request scope, where a cache refresh would be lost.
 */
export const mutatingTools = new Set<string>();

function withUrls(def: EntityDef, row: Record<string, unknown> & { id: number }) {
  const info = describeRecord(def, row);
  return { ...info, liveUrl: absolute(info.liveUrl), adminUrl: absolute(info.adminUrl) };
}

export function registerTools(server: McpServer) {
  /** Annotations drive ChatGPT's and Claude's confirmation prompts; the server enforces its own rules regardless. */
  const tool = <S extends z.ZodObject>(
    name: string,
    def: { title: string; description: string; input: S; access: Access; external?: boolean },
    run: (args: z.output<S>, actor: Actor) => Promise<unknown>
  ) => {
    if (def.access !== "read") mutatingTools.add(name);
    server.registerTool(
      name,
      {
        title: def.title,
        description: def.description,
        inputSchema: def.input,
        annotations: {
          readOnlyHint: def.access === "read",
          destructiveHint: def.access === "destructive",
          openWorldHint: def.external ?? false,
        },
        _meta: { securitySchemes: [{ type: "oauth2", scopes: [MCP_SCOPE] }] },
      } as never,
      (async (args: z.output<S>, ctx: ToolContext) => {
        const auth = ctx.http?.authInfo;
        if (!auth) return { isError: true, content: [{ type: "text", text: "Not authenticated." }] };
        try {
          const result = await run(args, {
            tool: name,
            clientName: String(auth.extra?.clientName ?? auth.clientId ?? "AI"),
          });
          return reply(result);
        } catch (error) {
          if (error instanceof ToolError) return { isError: true, content: [{ type: "text", text: error.message }] };
          console.error(`MCP tool ${name} failed:`, error);
          return {
            isError: true,
            content: [{ type: "text", text: "The server hit an error. Nothing may have been saved; check with get_content." }],
          };
        }
      }) as never
    );
  };

  // ── Guidance ─────────────────────────────────────────────────────────────
  tool(
    "get_site_overview",
    {
      title: "Get site overview",
      description:
        "Read this first: the editing rules, every content type with its writable fields and record counts, and the editable settings groups.",
      input: z.object({}),
      access: "read",
    },
    async () => {
      const counts = Object.fromEntries(
        await Promise.all(ENTITY_KEYS.map(async (k) => [k, await ENTITIES[k].delegate().count()] as const))
      );
      return {
        site: { name: SITE_NAME, url: site },
        rules: RULES,
        contentTypes: Object.fromEntries(
          ENTITY_KEYS.map((k) => {
            const def = ENTITIES[k];
            return [
              k,
              {
                label: def.label,
                description: def.description,
                records: counts[k],
                required: def.required,
                fields: describeFields(def),
                deleteConfirmField: def.confirmField,
              },
            ];
          })
        ),
        settings: settingsGuide(),
        media: "list_media / upload_media_from_url / update_media / delete_media. Use the file's url in image fields.",
        retiredBlogSlugs: Object.keys(RETIRED).length,
      };
    }
  );

  // ── Content ──────────────────────────────────────────────────────────────
  tool(
    "list_content",
    {
      title: "List content",
      description: "List or search records of one content type. Returns summary fields; use get_content for the full record.",
      input: z.object({
        type: contentType,
        query: z.string().max(200).optional().describe("Case-insensitive text search over titles/slugs/names"),
        visible: z.boolean().optional().describe("Only published (true) or only hidden/draft (false) records"),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }),
      access: "read",
    },
    async ({ type, query, visible, limit, offset }) => {
      const def = entityDef(type);
      const where: Record<string, unknown> = {};
      if (query) where.OR = def.searchFields.map((f) => ({ [f]: { contains: query, mode: "insensitive" } }));
      if (visible !== undefined && def.visibleField) where[def.visibleField] = visible;
      const orderBy = def.hasOrder ? [{ order: "asc" }, { id: "asc" }] : [{ createdAt: "desc" }];
      const [total, rows] = await Promise.all([
        def.delegate().count({ where }),
        def.delegate().findMany({ where, orderBy, skip: offset, take: limit }),
      ]);
      return {
        type,
        total,
        offset,
        items: rows.map((r) => ({
          ...Object.fromEntries(def.listFields.map((f) => [f, r[f]])),
          liveUrl: absolute(def.publicUrl(r)),
          ...(type === "post" && RETIRED[String(r.slug)] ? { retiredRedirectsTo: RETIRED[String(r.slug)] } : {}),
        })),
      };
    }
  );

  tool(
    "get_content",
    {
      title: "Get content",
      description: "Read one full record (drafts included) by id, or by slug for posts and services.",
      input: z.object({ type: contentType, id: idOrSlug }),
      access: "read",
    },
    async ({ type, id }) => {
      const def = entityDef(type);
      const row = await findRecord(def, id);
      const extra: Record<string, unknown> = {};
      if (type === "post" && RETIRED[String(row.slug)])
        extra.retired = `This slug permanently redirects to ${RETIRED[String(row.slug)]}; the post is not shown on the site.`;
      if (type === "service")
        extra.galleryImages = await db.galleryImage.findMany({
          where: { serviceId: row.id },
          select: { id: true, title: true, published: true },
          orderBy: { order: "asc" },
        });
      return { ...withUrls(def, row), ...extra, record: def.present(row) };
    }
  );

  tool(
    "create_content",
    {
      title: "Create content",
      description:
        "Create a record. Posts, services and other visible items go LIVE immediately unless fields.published (menu items: fields.enabled) is false. See get_site_overview for each type's fields.",
      input: z.object({ type: contentType, fields: fields.describe("Field values, per get_site_overview") }),
      access: "write",
    },
    async ({ type, fields: values }, actor) => {
      const result = await createRecord(actor, type, values);
      return { ...result, liveUrl: absolute(result.liveUrl), adminUrl: absolute(result.adminUrl) };
    }
  );

  tool(
    "update_content",
    {
      title: "Update content",
      description:
        "Change some fields of a record; fields left out stay as they are. Changes to a live record show on the site immediately.",
      input: z.object({ type: contentType, id: idOrSlug, fields: fields.describe("Only the fields to change") }),
      access: "destructive",
    },
    async ({ type, id, fields: values }, actor) => {
      const result = await updateRecord(actor, type, id, values);
      return { ...result, liveUrl: absolute(result.liveUrl), adminUrl: absolute(result.adminUrl) };
    }
  );

  tool(
    "set_published",
    {
      title: "Publish or hide",
      description: "Make a record visible on the site (true) or hide it as a draft (false). For menu items this enables/disables the link.",
      input: z.object({ type: contentType, id: idOrSlug, published: z.boolean() }),
      access: "destructive",
    },
    async ({ type, id, published }, actor) => {
      const result = await setVisible(actor, type, id, published);
      return { ...result, liveUrl: absolute(result.liveUrl), adminUrl: absolute(result.adminUrl) };
    }
  );

  tool(
    "delete_content",
    {
      title: "Delete content",
      description:
        "Permanently delete a record. confirm must equal its slug (posts, services), title, label (menu) or name (folders). Deleting a service also deletes its gallery images; deleting a menu item deletes its sub-items. Can be undone with restore_revision.",
      input: z.object({ type: contentType, id: idOrSlug, confirm: z.string().max(300) }),
      access: "destructive",
    },
    async ({ type, id, confirm }, actor) => deleteRecord(actor, type, id, confirm)
  );

  tool(
    "reorder_content",
    {
      title: "Reorder content",
      description:
        "Set the display order of services, prices, before & after cases, gallery images or menu items: pass ids in the order they should appear.",
      input: z.object({
        type: z.enum(["service", "price", "before_after", "gallery_image", "menu_item"]),
        ids: z.array(z.number().int().positive()).min(1).max(200),
      }),
      access: "destructive",
    },
    async ({ type, ids }, actor) => reorder(actor, type, ids)
  );

  // ── Settings ─────────────────────────────────────────────────────────────
  tool(
    "get_settings",
    {
      title: "Get settings",
      description: `Read site settings: page text (hero, about, footer, section headings), contact details, FAQs, page SEO, Google reviews and Instagram. Groups: ${Object.keys(SETTING_GROUPS).join(", ")}.`,
      input: z.object({
        group: z.string().max(50).optional(),
        keys: z.array(z.string().max(100)).max(100).optional().describe("Specific keys instead of a group"),
      }),
      access: "read",
    },
    async ({ group, keys }) => readSettings({ group, keys })
  );

  tool(
    "update_settings",
    {
      title: "Update settings",
      description:
        "Change site settings by key (see get_site_overview → settings). JSON keys (faqItems, glanceItems, googleReviews, instagramPosts…) take arrays and replace the whole list, so read them first. Changes are live immediately.",
      input: z.object({ values: fields.describe("{ key: newValue }") }),
      access: "destructive",
    },
    async ({ values }, actor) => writeSettings(actor, values)
  );

  // ── Media ────────────────────────────────────────────────────────────────
  tool(
    "list_media",
    {
      title: "List media",
      description: "Search the media library (images and videos in Vercel Blob). Use a file's url in image fields.",
      input: z.object({
        query: z.string().max(200).optional().describe("Search file names"),
        folderId: z.number().int().positive().nullable().optional().describe("Only this folder; null = root"),
        limit: z.number().int().min(1).max(100).default(30),
        offset: z.number().int().min(0).default(0),
      }),
      access: "read",
    },
    async (args) => listMedia(args)
  );

  tool(
    "list_media_folders",
    { title: "List media folders", description: "Media library folders with file counts.", input: z.object({}), access: "read" },
    async () => listFolders()
  );

  tool(
    "get_media_usage",
    {
      title: "Get media usage",
      description: "Where a media file is used on the site (posts, services, cases, gallery, settings).",
      input: z.object({ id: z.number().int().positive() }),
      access: "read",
    },
    async ({ id }) => {
      const file = await db.mediaFile.findUnique({ where: { id } });
      if (!file) throw new ToolError(`No media file with id ${id}.`);
      return { file, usedBy: await mediaUsage(file.url) };
    }
  );

  tool(
    "upload_media_from_url",
    {
      title: "Upload image from URL",
      description:
        "Copy a public https image (JPEG, PNG, WebP, AVIF, GIF, max 10 MB) into the site's media library and return its url. Only use images the user has the right to use.",
      input: z.object({
        url: z.string().url().max(2000),
        name: z.string().max(120).optional().describe("Descriptive file name, e.g. composite-bonding-before-after"),
        folderId: z.number().int().positive().nullable().optional(),
      }),
      access: "write",
      external: true,
    },
    async (args, actor) => uploadFromUrl(actor, args)
  );

  tool(
    "update_media",
    {
      title: "Rename or move media",
      description: "Rename a media file or move it to another folder (folderId null = root). The file's url doesn't change.",
      input: z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(200).optional(),
        folderId: z.number().int().positive().nullable().optional(),
      }),
      access: "destructive",
    },
    async ({ id, ...data }, actor) => updateMediaFile(actor, id, data)
  );

  tool(
    "delete_media",
    {
      title: "Delete media",
      description:
        "Permanently delete a media file from storage. Refused while the image is still used on the site. confirm must equal the file name. Can't be undone.",
      input: z.object({ id: z.number().int().positive(), confirm: z.string().max(300) }),
      access: "destructive",
    },
    async ({ id, confirm }, actor) => deleteMediaFile(actor, id, confirm)
  );

  // ── History ──────────────────────────────────────────────────────────────
  tool(
    "list_revisions",
    {
      title: "List changes",
      description: "Changes made through this connector, newest first. Filter by type (a content type, settings or media_file) and record id.",
      input: z.object({
        type: z.string().max(50).optional(),
        id: z.union([z.number(), z.string()]).optional(),
        limit: z.number().int().min(1).max(100).default(30),
      }),
      access: "read",
    },
    async ({ type, id, limit }) => listRevisions({ entity: type, entityId: id === undefined ? undefined : String(id), limit })
  );

  tool(
    "restore_revision",
    {
      title: "Restore a change",
      description:
        'Undo a change (which: "before", the default) or re-apply it (which: "after"). Recreates deleted records, including gallery images or sub-menu items deleted with them.',
      input: z.object({ revisionId: z.string().min(1).max(100), which: z.enum(["before", "after"]).default("before") }),
      access: "destructive",
    },
    async ({ revisionId, which }, actor) => restoreRevision(actor, revisionId, which)
  );

  // ── SEO ──────────────────────────────────────────────────────────────────
  tool(
    "audit_content_seo",
    {
      title: "Audit content SEO",
      description:
        "Find SEO gaps across live posts and services: missing or badly sized meta titles/descriptions, duplicate titles, missing FAQs, cover images, internal links or medical review.",
      input: z.object({}),
      access: "read",
    },
    async () => {
      const [posts, services] = await Promise.all([
        db.post.findMany({ where: { published: true } }),
        db.service.findMany({ where: { published: true } }),
      ]);
      const titles = new Map<string, string[]>();
      const issues: { type: string; id: number; title: string; url: string | null; problems: string[] }[] = [];
      const check = (
        type: "post" | "service",
        r: { id: number; title: string; slug: string; metaTitle: string | null; metaDesc: string | null; faqItems: string | null; content: string | null },
        extra: string[]
      ) => {
        const problems = [...extra];
        const t = (r.metaTitle || r.title).trim();
        if (!r.metaTitle) problems.push("no meta title (falls back to the page title)");
        else if (r.metaTitle.length > 65) problems.push(`meta title ${r.metaTitle.length} chars (aim for 50–60)`);
        if (!r.metaDesc) problems.push("no meta description");
        else if (r.metaDesc.length < 110 || r.metaDesc.length > 165)
          problems.push(`meta description ${r.metaDesc.length} chars (aim for 120–160)`);
        if (!r.faqItems || r.faqItems === "[]") problems.push("no FAQs");
        if (r.content && !/<h2\b/i.test(r.content)) problems.push("no <h2> headings in content");
        if (r.content && /<h1\b/i.test(r.content)) problems.push("content contains an <h1>");
        titles.set(t.toLowerCase(), [...(titles.get(t.toLowerCase()) ?? []), `${type} #${r.id}`]);
        const path = type === "post" ? `/blog/${r.slug}` : `/services/${r.slug}`;
        if (problems.length) issues.push({ type, id: r.id, title: r.title, url: absolute(path), problems });
      };
      for (const p of posts) {
        if (RETIRED[p.slug]) continue;
        check("post", p, [
          ...(p.coverImage ? [] : ["no cover image"]),
          ...(p.internalLinks && p.internalLinks !== "[]" ? [] : ["no related internal links"]),
          ...(p.reviewedAt ? [] : ["not marked medically reviewed"]),
          ...(p.excerpt ? [] : ["no excerpt"]),
        ]);
      }
      for (const s of services) check("service", s, s.content ? [] : ["no page content"]);
      const duplicates = [...titles.entries()].filter(([, v]) => v.length > 1).map(([title, where]) => ({ title, where }));
      return {
        checked: { posts: posts.filter((p) => !RETIRED[p.slug]).length, services: services.length },
        duplicateTitles: duplicates,
        issues,
      };
    }
  );
}
