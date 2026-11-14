// De-stuff "composite bonding" repetition in homepage FAQ, service page copy/FAQ,
// and change the /services SEO title. Wording only — no facts changed.
// Usage: node scripts/destuff-composite-bonding.cjs "$PWD" [--apply]   (dry run without --apply)
"use strict";
const repo = process.argv[2];
const apply = process.argv.includes("--apply");
const { Client } = require(repo + "/node_modules/pg");
require(repo + "/node_modules/dotenv").config({ path: repo + "/.env", quiet: true });
const fs = require("fs");
const path = require("path");

function replaceExact(text, pairs, label) {
  let out = text;
  for (const [from, to] of pairs) {
    const n = out.split(from).length - 1;
    if (n !== 1) throw new Error(`${label}: expected 1 match, found ${n}: ${from.slice(0, 70)}`);
    out = out.replace(from, () => to);
  }
  return out;
}
const count = (t) => (t.match(/composite bonding/gi) || []).length;

const HOME_FAQ = [
  ["Composite bonding is a cosmetic dental procedure where a tooth-coloured resin material", "It is a cosmetic dental procedure where a tooth-coloured resin material"],
  ["Is the composite bonding procedure painful?", "Is the procedure painful?"],
  ["Composite bonding is generally painless.", "Bonding is generally painless."],
  ["Composite bonding can last around 5 years", "It can last around 5 years"],
  ["Composite bonding uses resin applied directly to the tooth", "Bonding uses resin applied directly to the tooth"],
  ["The cost of composite bonding in Dubai varies", "The cost varies"],
  ["Can I get composite bonding done on the same day", "Can I have bonding done on the same day"],
  ["often completes composite bonding in a single appointment", "often completes the treatment in a single appointment"],
  ["Is composite bonding reversible?", "Is bonding reversible?"],
  ["Yes, composite bonding is one of the most reversible", "Yes, it is one of the most reversible"],
  ["What should I avoid after composite bonding treatment?", "What should I avoid after bonding treatment?"],
  ["For the first 48 hours after composite bonding, avoid", "For the first 48 hours after treatment, avoid"],
];

const SVC_CONTENT = [
  ["<p>Composite bonding is one of the most popular", "<p>It is one of the most popular"],
  ["<p>Composite bonding can help improve:</p>", "<p>Bonding can help improve:</p>"],
  ["<h2>The Composite Bonding Process</h2>", "<h2>The Treatment Process</h2>"],
  ["<p>Composite bonding is usually completed in a single visit", "<p>Treatment is usually completed in a single visit"],
  ["<h2></h2><p>Patients choose Dr. Firas for composite bonding because", "<h2>Why Patients Choose Dr. Firas</h2><p>Patients choose Dr. Firas for bonding because"],
];

const SVC_FAQ = [
  ['"answer":"Composite bonding is a cosmetic dental treatment', '"answer":"It is a cosmetic dental treatment'],
  ['"answer":"Composite bonding can last for several years', '"answer":"Bonding can last for several years'],
  ['" Is composite bonding painful?"', '"Is the treatment painful?"'],
  ['"answer":"Composite bonding is usually a comfortable', '"answer":"It is usually a comfortable'],
  ['" How long does composite bonding take?"', '"How long does the appointment take?"'],
  ['"answer":"Composite bonding is often completed', '"answer":"Treatment is often completed'],
];

const NEW_SERVICES_TITLE = "Cosmetic Dentistry Services in Dubai | Dr. Firas Zoghieb";

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const settings = Object.fromEntries(
    (await c.query(`SELECT key, value FROM "SiteSetting" WHERE key IN ('faqItems','seoServicesTitle')`)).rows.map((r) => [r.key, r.value])
  );
  const svc = (await c.query(`SELECT id, content, "faqItems" FROM "Service" WHERE slug='composite-bonding-dubai'`)).rows[0];

  const backup = path.join(require("os").tmpdir(), `destuff-backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify({ settings, service: svc }, null, 1));

  const homeFaq = replaceExact(settings.faqItems, HOME_FAQ, "home faq");
  JSON.parse(homeFaq);
  const content = replaceExact(svc.content, SVC_CONTENT, "service content");
  const faq = replaceExact(svc.faqItems, SVC_FAQ, "service faq");
  JSON.parse(faq);

  console.log("backup:", backup);
  console.log(`home faq: ${count(settings.faqItems)} -> ${count(homeFaq)}`);
  console.log(`service content: ${count(svc.content)} -> ${count(content)}`);
  console.log(`service faq: ${count(svc.faqItems)} -> ${count(faq)}`);
  console.log(`seoServicesTitle: "${settings.seoServicesTitle}" -> "${NEW_SERVICES_TITLE}"`);

  if (!apply) { console.log("dry run — nothing written"); await c.end(); return; }
  await c.query("BEGIN");
  await c.query(`UPDATE "SiteSetting" SET value=$1, "updatedAt"=now() WHERE key='faqItems'`, [homeFaq]);
  await c.query(`UPDATE "SiteSetting" SET value=$1, "updatedAt"=now() WHERE key='seoServicesTitle'`, [NEW_SERVICES_TITLE]);
  await c.query(`UPDATE "Service" SET content=$1, "faqItems"=$2, "updatedAt"=now() WHERE id=$3`, [content, faq, svc.id]);
  await c.query("COMMIT");
  console.log("applied");
  await c.end();
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
