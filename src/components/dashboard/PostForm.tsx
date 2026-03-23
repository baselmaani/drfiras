"use client";
import { useActionState, useState, useCallback } from "react";
import type { Post } from "@/generated/prisma/client";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";

type ActionState = { error: string } | null;
type PostAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

type ContentBlock =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "hr" };

function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h2": return `<h2>${block.text}</h2>`;
        case "h3": return `<h3>${block.text}</h3>`;
        case "p":  return `<p>${block.text}</p>`;
        case "ul": return `<ul>${block.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
        case "ol": return `<ol>${block.items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
        case "blockquote": return `<blockquote><p>${block.text}</p></blockquote>`;
        case "hr": return `<hr />`;
        default: return "";
      }
    })
    .join("\n");
}

function generateSlug(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const EXAMPLE_JSON = `{
  "title": "Post Title Here",
  "slug": "post-title-here",
  "excerpt": "Short summary shown in the blog listing (1–2 sentences).",
  "coverImage": "https://example.com/cover.jpg",
  "published": false,
  "metaTitle": "SEO Page Title",
  "metaDesc": "SEO meta description (120–160 chars).",
  "metaKeywords": "keyword1, keyword2, keyword3",
  "ogImage": "https://example.com/og.jpg",
  "content": [
    { "type": "h2", "text": "Main Section Heading" },
    { "type": "p",  "text": "Paragraph text goes here." },
    { "type": "h3", "text": "Sub-section Heading" },
    { "type": "p",  "text": "Another paragraph." },
    { "type": "ul", "items": ["Bullet one", "Bullet two", "Bullet three"] },
    { "type": "blockquote", "text": "A highlighted quote or tip." }
  ]
}`;

export function PostForm({
  action,
  post,
}: {
  action: PostAction;
  post?: Post;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  // ── controlled field state ──────────────────────────────────────────────
  const [title, setTitle]               = useState(post?.title ?? "");
  const [slug, setSlug]                 = useState(post?.slug ?? "");
  const [slugModified, setSlugModified] = useState(!!post);
  const [excerpt, setExcerpt]           = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage]     = useState(post?.coverImage ?? "");
  const [published, setPublished]       = useState(post?.published ?? false);
  const [metaTitle, setMetaTitle]       = useState(post?.metaTitle ?? "");
  const [metaDesc, setMetaDesc]         = useState(post?.metaDesc ?? "");
  const [metaKeywords, setMetaKeywords] = useState(post?.metaKeywords ?? "");
  const [ogImage, setOgImage]           = useState(post?.ogImage ?? "");
  // content is driven by RichTextEditor key re-mount
  const [contentDefault, setContentDefault] = useState(post?.content ?? "");
  const [contentKey, setContentKey]         = useState(0);

  // ── JSON import panel ───────────────────────────────────────────────────
  const [showJson, setShowJson]   = useState(false);
  const [jsonText, setJsonText]   = useState("");
  const [jsonError, setJsonError] = useState("");

  const importJson = useCallback(() => {
    setJsonError("");
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setJsonError("Invalid JSON — check for missing commas or quotes.");
      return;
    }

    // ── content: string (HTML) or block array ──
    let html = "";
    if (typeof parsed.content === "string") {
      html = parsed.content;
    } else if (Array.isArray(parsed.content)) {
      html = blocksToHtml(parsed.content as ContentBlock[]);
    }

    // ── nested seo object or flat keys ──
    const seo = (parsed.seo as Record<string, string> | undefined) ?? {};
    const get = (key: string) =>
      (parsed[key] as string | undefined) ?? (seo[key] as string | undefined) ?? "";

    const newTitle = get("title");
    const newSlug  = get("slug") || generateSlug(newTitle);

    setTitle(newTitle);
    setSlug(newSlug);
    setSlugModified(true);
    setExcerpt(get("excerpt"));
    setCoverImage(get("coverImage"));
    setPublished(parsed.published === true);
    setMetaTitle(get("metaTitle"));
    setMetaDesc(get("metaDesc"));
    setMetaKeywords(get("metaKeywords"));
    setOgImage(get("ogImage"));

    if (html) {
      setContentDefault(html);
      setContentKey((k) => k + 1); // force RichTextEditor remount
    }

    setShowJson(false);
    setJsonText("");
  }, [jsonText]);

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}

      {/* ── JSON Import Panel ─────────────────────────────────────────── */}
      <div className="border border-dashed border-[#1b4f72]/40 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowJson((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-[#1b4f72]/5 hover:bg-[#1b4f72]/10 transition-colors text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-[#1b4f72]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h7" />
            </svg>
            Import from JSON
          </span>
          <span className="text-[#1b4f72]/60 text-xs">{showJson ? "▲ Hide" : "▼ Expand"}</span>
        </button>

        {showJson && (
          <div className="p-5 space-y-3 bg-white">
            <p className="text-xs text-gray-500 leading-relaxed">
              Paste a JSON object to auto-fill all fields. Content can be a raw HTML string <em>or</em> an array of blocks.{" "}
              <button
                type="button"
                onClick={() => setJsonText(EXAMPLE_JSON)}
                className="text-[#1b4f72] underline hover:text-[#c9a84c]"
              >
                Load example
              </button>
            </p>

            <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-500 leading-relaxed">
              {`{ "title", "slug", "excerpt", "coverImage", "published",`}<br />
              {`  "metaTitle", "metaDesc", "metaKeywords", "ogImage",`}<br />
              {`  "content": "<h2>…</h2><p>…</p>"  // HTML string`}<br />
              {`  "content": [{ "type": "h2", "text": "…" }, …]  // or block array`}
            </div>

            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={12}
              placeholder={EXAMPLE_JSON}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] resize-y bg-white"
            />

            {jsonError && (
              <p className="text-red-600 text-xs font-medium">{jsonError}</p>
            )}

            <button
              type="button"
              onClick={importJson}
              disabled={!jsonText.trim()}
              className="bg-[#1b4f72] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#154460] transition-colors disabled:opacity-40"
            >
              Apply JSON → Fill Form
            </button>
          </div>
        )}
      </div>

      {/* ── Core fields ──────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugModified) setSlug(generateSlug(e.target.value));
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugModified(true); }}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72] resize-none"
          placeholder="Short summary shown in post listings"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Content <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          key={contentKey}
          name="content"
          defaultValue={contentDefault}
          placeholder="Start writing your post… Use H2 for main sections and H3 for sub-points."
        />
      </div>

      <ImageUpload
        key={`cover-${contentKey}`}
        name="coverImage"
        label="Cover Image"
        defaultValue={coverImage}
      />

      {/* SEO */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          SEO Settings
        </h3>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Meta Title
          </label>
          <input
            name="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="Leave blank to use post title"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Meta Description
          </label>
          <textarea
            name="metaDesc"
            rows={2}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white resize-none"
            placeholder="Recommended: 120–160 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Meta Keywords
          </label>
          <input
            name="metaKeywords"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white"
            placeholder="e.g. composite bonding, cosmetic dentist dubai"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            OG Image
          </label>
          <ImageUpload
            key={`og-${contentKey}`}
            name="ogImage"
            defaultValue={ogImage}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 accent-[#1b4f72]"
        />
        <span className="text-sm font-medium text-gray-700">
          Published (visible on site)
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : post ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}
