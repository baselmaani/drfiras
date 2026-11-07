// Adds price, suitability, lifespan, risk and comparison sections to the
// composite bonding page. Keeps the existing copy, URL and title. Safe to rerun.
//
// Dr. Firas must review this copy before it runs against production.
//
// Usage: node scripts/expand-composite-bonding.js [--dry-run]
"use strict";
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
const dryRun = process.argv.includes("--dry-run");

const SLUG = "composite-bonding-dubai";
const MARKER = "How Much Does Composite Bonding Cost in Dubai?";

const addition = `
<h2>${MARKER}</h2>
<p>Composite bonding in Dubai with Dr. Firas starts from <strong>AED 400 per tooth</strong>. Your final cost depends on the number of teeth involved, the complexity of your case and the result you would like. You will receive a personal quote after your consultation, and you can also read our guide to <a href="/blog/composite-bonding-price-in-dubai">composite bonding prices in Dubai</a>.</p>

<h2>Who Is Composite Bonding Suitable For?</h2>
<p>Composite bonding can suit patients who have healthy teeth and gums and want to improve small cosmetic concerns. It is often considered for chips, small gaps, worn edges and uneven tooth shapes.</p>
<p>It may not be the most suitable option for every case. Dr. Firas may recommend treating decay or gum problems first, or moving the teeth before bonding if their position affects the result. Teeth grinding, biting nails or chewing hard objects can also place extra stress on bonded teeth, so tell your dentist about these habits at your consultation.</p>

<h2>How Long Does Composite Bonding Last?</h2>
<p>Composite bonding commonly lasts around 3 to 7 years, although this varies from patient to patient. It is not permanent, and it may need polishing, repair or replacement over time. Its lifespan depends on your oral hygiene, bite, diet and habits. Read more about <a href="/blog/how-long-does-composite-bonding-last">how long composite bonding lasts</a>.</p>

<h2>Risks and Limitations</h2>
<p>Composite bonding is a minimally invasive treatment, but it does have limitations that are worth understanding first:</p>
<ul>
<li><strong>Chipping:</strong> Composite resin can chip, particularly if you bite on hard objects.</li>
<li><strong>Staining:</strong> Composite can pick up stains over time from coffee, tea and similar foods and drinks.</li>
<li><strong>Colour:</strong> Teeth whitening does not change the colour of composite. If you would like whiter teeth, whitening is usually planned before bonding.</li>
<li><strong>Anaesthesia:</strong> In many cosmetic cases it is not needed, but it may be recommended if a tooth has decay, deep damage or sensitivity.</li>
<li><strong>Maintenance:</strong> Regular dental check-ups help to keep bonded teeth in good condition.</li>
</ul>

<h2>Composite Bonding vs Porcelain Veneers</h2>
<p>Both treatments can improve the look of your teeth. The better choice depends on your teeth and on how much change you would like.</p>
<table>
<thead>
<tr><th></th><th>Composite bonding</th><th><a href="/services/porcelain-veneers-dubai">Porcelain veneers</a></th></tr>
</thead>
<tbody>
<tr><td>Material</td><td>Tooth-coloured resin</td><td>Custom porcelain shells</td></tr>
<tr><td>Tooth preparation</td><td>Often little or no enamel removal</td><td>May need a small amount of enamel preparation</td></tr>
<tr><td>Treatment time</td><td>Usually a single visit, depending on the number of teeth</td><td>Usually more than one visit</td></tr>
<tr><td>Often chosen for</td><td>Chips, small gaps and uneven edges</td><td>Larger changes to shape, colour and symmetry</td></tr>
<tr><td>Repairs</td><td>Can often be polished or repaired</td><td>A damaged veneer may need replacing</td></tr>
</tbody>
</table>
<p>See our full comparison of <a href="/blog/composite-bonding-vs-veneers-which-is-better">composite bonding and veneers</a>, or view results in the <a href="/gallery">smile gallery</a>.</p>

<h2>Caring for Bonded Teeth</h2>
<p>Good daily care helps your bonding look its best for longer. Brush and clean between your teeth, attend regular check-ups, and avoid biting nails, pens or other hard objects. Our guide explains <a href="/blog/how-to-maintain-composite-bonding-after-treatment">how to maintain composite bonding after treatment</a>.</p>
`.trim();

const newFaqs = [
  {
    question: "How much does composite bonding cost in Dubai?",
    answer: "Composite bonding with Dr. Firas starts from AED 400 per tooth. The final cost depends on the number of teeth involved and the complexity of your case, and you will receive a personal quote after your consultation.",
  },
  {
    question: "Is composite bonding permanent?",
    answer: "No. Composite bonding commonly lasts around 3 to 7 years and may need polishing, repair or replacement over time. Its lifespan depends on your oral hygiene, bite, diet and habits.",
  },
  {
    question: "Can composite bonding be whitened?",
    answer: "No. Teeth whitening does not change the colour of composite resin. If you would like whiter teeth, whitening is usually planned before bonding so the composite can be matched to your new shade.",
  },
];

const countWords = (html) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

async function main() {
  await client.connect();
  const { rows } = await client.query(
    `SELECT id, content, "faqItems" FROM "Service" WHERE slug = $1`,
    [SLUG],
  );
  if (!rows.length) throw new Error(`No service found with slug ${SLUG}`);

  const [service] = rows;
  if ((service.content ?? "").includes(MARKER)) {
    console.log("Already expanded, nothing to do.");
    await client.end();
    return;
  }

  const content = `${(service.content ?? "").trim()}\n\n${addition}`;
  const faqs = service.faqItems ? JSON.parse(service.faqItems) : [];
  const asked = new Set(faqs.map((f) => f.question.toLowerCase()));
  const faqItems = [...faqs, ...newFaqs.filter((f) => !asked.has(f.question.toLowerCase()))];

  console.log(`Content: ${countWords(service.content ?? "")} → ${countWords(content)} words`);
  console.log(`FAQs: ${faqs.length} → ${faqItems.length}`);

  if (dryRun) {
    console.log("Dry run: no changes written.");
  } else {
    await client.query(
      `UPDATE "Service" SET content = $1, "faqItems" = $2, "updatedAt" = NOW() WHERE id = $3`,
      [content, JSON.stringify(faqItems), service.id],
    );
    console.log(`✓ Updated /services/${SLUG}`);
  }
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
