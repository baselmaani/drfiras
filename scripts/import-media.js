"use strict";
/**
 * import-media.js
 * Scans every image/video URL already stored in the database and registers
 * them in the MediaFile table so they appear in the Media Library.
 *
 * Run once:  node scripts/import-media.js
 */

const { Client } = require("pg");
require("dotenv").config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

// ─── helpers ────────────────────────────────────────────────────────────────

/** Extract a filename from a URL (last path segment, decoded). */
function nameFromUrl(url) {
  try {
    const p = new URL(url).pathname;
    const seg = p.split("/").filter(Boolean).pop() || "file";
    return decodeURIComponent(seg);
  } catch {
    return "file";
  }
}

/** Guess MIME type from URL extension. */
function mimeFromUrl(url) {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
  };
  return map[ext] || "application/octet-stream";
}

/** Fetch Content-Length & Content-Type via HEAD. Returns null on failure. */
async function headRequest(url) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type")?.split(";")[0].trim() || null;
    const contentLength = parseInt(res.headers.get("content-length") || "0", 10);
    return { contentType, contentLength };
  } catch {
    return null;
  }
}

/** Collect all image/video URL strings from a value (string or JSON array). */
function extractUrls(value) {
  if (!value) return [];
  const urls = [];
  // Try JSON array first
  if (value.trim().startsWith("[")) {
    try {
      const arr = JSON.parse(value);
      if (Array.isArray(arr)) {
        for (const item of arr) {
          if (typeof item === "string" && item.startsWith("http")) urls.push(item);
          else if (typeof item === "object" && item?.url?.startsWith("http")) urls.push(item.url);
          else if (typeof item === "object" && item?.src?.startsWith("http")) urls.push(item.src);
        }
        return urls;
      }
    } catch { /* not JSON */ }
  }
  // Plain URL
  if (value.startsWith("http")) urls.push(value);
  return urls;
}

/** Upsert a single URL into MediaFile. */
async function upsertMedia(url) {
  const name = nameFromUrl(url);
  const head = await headRequest(url);
  const mimeType = (head?.contentType && head.contentType !== "application/octet-stream")
    ? head.contentType
    : mimeFromUrl(url);
  const size = head?.contentLength || 0;

  await client.query(
    `INSERT INTO "MediaFile" (url, name, size, "mimeType", "createdAt")
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (url) DO UPDATE SET name = EXCLUDED.name`,
    [url, name, size, mimeType]
  );
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  await client.connect();
  console.log("Connected to database.\n");

  const allUrls = new Set();

  // 1. GalleryImage.image
  {
    const { rows } = await client.query(`SELECT image FROM "GalleryImage" WHERE image IS NOT NULL`);
    for (const r of rows) extractUrls(r.image).forEach((u) => allUrls.add(u));
    console.log(`GalleryImage: ${rows.length} rows`);
  }

  // 2. Service images: heroImage, ogImage, icon (if URL)
  {
    const { rows } = await client.query(
      `SELECT "heroImage", "ogImage", icon, "caseImages" FROM "Service"`
    );
    for (const r of rows) {
      extractUrls(r.heroImage).forEach((u) => allUrls.add(u));
      extractUrls(r.ogImage).forEach((u) => allUrls.add(u));
      extractUrls(r.icon).forEach((u) => allUrls.add(u));
      extractUrls(r.caseImages).forEach((u) => allUrls.add(u));
    }
    console.log(`Service: ${rows.length} rows`);
  }

  // 3. BeforeAfter images
  {
    const { rows } = await client.query(
      `SELECT "beforeImage", "afterImage" FROM "BeforeAfter"`
    );
    for (const r of rows) {
      extractUrls(r.beforeImage).forEach((u) => allUrls.add(u));
      extractUrls(r.afterImage).forEach((u) => allUrls.add(u));
    }
    console.log(`BeforeAfter: ${rows.length} rows`);
  }

  // 4. Post images: coverImage, ogImage
  {
    const { rows } = await client.query(
      `SELECT "coverImage", "ogImage" FROM "Post"`
    );
    for (const r of rows) {
      extractUrls(r.coverImage).forEach((u) => allUrls.add(u));
      extractUrls(r.ogImage).forEach((u) => allUrls.add(u));
    }
    console.log(`Post: ${rows.length} rows`);
  }

  // 5. SiteSettings – values that look like image/video URLs
  {
    const { rows } = await client.query(`SELECT value FROM "SiteSetting"`);
    for (const r of rows) {
      extractUrls(r.value).forEach((u) => allUrls.add(u));
    }
    console.log(`SiteSetting: ${rows.length} rows`);
  }

  console.log(`\nFound ${allUrls.size} unique media URL(s). Importing…\n`);

  let done = 0;
  let skipped = 0;

  for (const url of allUrls) {
    try {
      await upsertMedia(url);
      done++;
      console.log(`  ✓ ${nameFromUrl(url)}`);
    } catch (err) {
      skipped++;
      console.warn(`  ✗ ${url} — ${err.message}`);
    }
  }

  console.log(`\nDone. Imported: ${done}  Skipped: ${skipped}`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
