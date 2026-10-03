// Retires the blog posts listed in src/lib/blogRedirects.js:
//   1. unpublishes them (removes them from /blog, the sitemap and llms.txt)
//   2. rewrites internal links to them so they point straight at the redirect target
// The 301s themselves live in next.config.ts.
//
// Usage: node scripts/consolidate-posts.js [--dry-run]
const { Client } = require("pg");
require("dotenv").config();
const { BLOG_REDIRECTS } = require("../src/lib/blogRedirects");

const client = new Client({ connectionString: process.env.DATABASE_URL });
const dryRun = process.argv.includes("--dry-run");

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches /blog/<slug> (relative or on our domain) only when the slug ends there,
// so "foo" never matches inside "foo-in-dubai".
const linkPatterns = Object.entries(BLOG_REDIRECTS).map(([slug, target]) => ({
  slug,
  target,
  re: new RegExp(
    `(https?://(?:www\\.)?drfiraszoghieb\\.com)?/blog/${escape(slug)}(?=$|[^a-z0-9-])`,
    "g",
  ),
}));

function rewrite(text) {
  if (!text) return { text, count: 0 };
  let count = 0;
  for (const { re, target } of linkPatterns) {
    text = text.replace(re, (_m, origin) => {
      count++;
      return origin ? `https://drfiraszoghieb.com${target}` : target;
    });
  }
  return { text, count };
}

// Rewrites the given text columns on every row of a table; returns how many links changed.
async function relink(table, label, fields, where = "TRUE", params = []) {
  const cols = fields.map((f) => `"${f}"`).join(", ");
  const { rows } = await client.query(`SELECT id, ${label}, ${cols} FROM "${table}" WHERE ${where}`, params);
  let total = 0;
  for (const row of rows) {
    const changed = {};
    let rowCount = 0;
    for (const f of fields) {
      const { text, count } = rewrite(row[f]);
      if (count) {
        changed[f] = text;
        rowCount += count;
      }
    }
    if (!rowCount) continue;
    total += rowCount;
    console.log(`  ${table} ${row[label.replace(/"/g, "")]}: ${rowCount} link(s)`);
    if (!dryRun) {
      const keys = Object.keys(changed);
      const set = keys.map((k, i) => `"${k}" = $${i + 2}`).join(", ");
      await client.query(`UPDATE "${table}" SET ${set} WHERE id = $1`, [row.id, ...keys.map((k) => changed[k])]);
    }
  }
  return total;
}

async function main() {
  await client.connect();
  const slugs = Object.keys(BLOG_REDIRECTS);
  console.log(dryRun ? "DRY RUN — nothing will be written\n" : "");
  if (!dryRun) await client.query("BEGIN");

  const { rows: found } = await client.query(
    `SELECT slug, published FROM "Post" WHERE slug = ANY($1)`,
    [slugs],
  );
  const missing = slugs.filter((s) => !found.some((p) => p.slug === s));
  const toUnpublish = found.filter((p) => p.published);

  console.log(`Posts to unpublish: ${toUnpublish.length} (already unpublished: ${found.length - toUnpublish.length})`);
  for (const p of toUnpublish) console.log(`  ${p.slug} → ${BLOG_REDIRECTS[p.slug]}`);
  if (missing.length) console.log(`Not found in DB (ignored): ${missing.join(", ")}`);

  if (!dryRun && toUnpublish.length) {
    await client.query(`UPDATE "Post" SET published = false, "updatedAt" = NOW() WHERE slug = ANY($1)`, [
      toUnpublish.map((p) => p.slug),
    ]);
  }

  console.log("\nRewriting internal links:");
  let links = 0;
  links += await relink("Post", "slug", ["content", "internalLinks", "excerpt", "faqItems"], `NOT (slug = ANY($1))`, [slugs]);
  links += await relink("Service", "slug", ["description", "content", "faqItems"]);
  links += await relink("MenuItem", "label", ["href"]);
  links += await relink("SiteSetting", "key", ["value"]);

  if (!dryRun) await client.query("COMMIT");
  console.log(`\n${dryRun ? "Would rewrite" : "Rewrote"} ${links} internal link(s).`);
}

main()
  .catch(async (e) => {
    if (!dryRun) await client.query("ROLLBACK").catch(() => {});
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => client.end());
