// Adds (or updates) the cosmetic dentist landing page.
//
// Dr. Firas must review this copy before it runs against production. When it
// does, set COSMETIC_PAGE_LIVE to true in src/lib/blogRedirects.js and deploy.
//
// Usage: node scripts/add-cosmetic-dentist-page.js [--dry-run]
"use strict";
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
const dryRun = process.argv.includes("--dry-run");

const content = `
<h2>What Does a Cosmetic Dentist Do?</h2>
<p>A cosmetic dentist improves how your teeth and smile look while protecting their health. That can mean changing the shape of a tooth, closing a small gap, lightening tooth colour or moving teeth into a better position. Dr. Firas Zoghieb is a cosmetic dentist in Al Wasl, Dubai, with a BDS and an MSc in Cosmetic Dentistry. His approach is minimally invasive, which means keeping as much of your natural tooth as possible.</p>
<p>Cosmetic dentistry starts with an assessment rather than a chosen treatment. The right option depends on your teeth, your bite, your oral health and the change you would like to see.</p>

<h2>Cosmetic Dental Treatments in Dubai</h2>
<h3>Composite Bonding</h3>
<p><a href="/services/composite-bonding-dubai">Composite bonding</a> uses tooth-coloured resin to improve chips, small gaps, uneven edges and discolouration. It often needs little or no enamel removal and is usually completed in a single visit, depending on the number of teeth being treated. Composite bonding starts from AED 400 per tooth.</p>
<h3>Porcelain Veneers</h3>
<p><a href="/services/porcelain-veneers-dubai">Porcelain veneers</a> are thin custom shells that cover the front of the teeth. They can suit patients who want a larger change to tooth shape, colour or symmetry. Veneers may need a small amount of enamel preparation, so they are planned carefully.</p>
<h3>Teeth Whitening</h3>
<p><a href="/services/teeth-whitening-dubai">Professional teeth whitening</a> can lighten natural teeth and reduce staining. It does not change the colour of existing crowns, veneers or tooth-coloured fillings, so these need to be considered before treatment.</p>
<h3>Invisalign</h3>
<p><a href="/services/invisalign-dubai">Invisalign</a> uses clear, removable aligners to move teeth gradually. It can be a treatment on its own, or the first stage of a wider smile plan.</p>
<h3>ABC Smile Makeover</h3>
<p>An <a href="/services/abc-smile-makeover-dubai">ABC smile makeover</a> plans alignment, whitening and composite bonding together, so tooth position, colour and shape are considered as one result.</p>

<h2>Which Cosmetic Treatment Is Right for You?</h2>
<p>This table is a starting point. A consultation is needed to confirm what is suitable for your teeth.</p>
<table>
<thead>
<tr><th>Your concern</th><th>Treatment often considered</th><th>What to know</th></tr>
</thead>
<tbody>
<tr><td>Small chips or uneven edges</td><td>Composite bonding</td><td>Often little or no enamel removal</td></tr>
<tr><td>Small gaps between teeth</td><td>Composite bonding</td><td>Larger gaps may need alignment first</td></tr>
<tr><td>Stained or yellowing natural teeth</td><td>Teeth whitening</td><td>Does not change crowns, veneers or fillings</td></tr>
<tr><td>Crooked or crowded teeth</td><td>Invisalign</td><td>Teeth move gradually over a course of treatment</td></tr>
<tr><td>A larger change to shape and colour</td><td>Porcelain veneers</td><td>May need some enamel preparation</td></tr>
<tr><td>Several concerns together</td><td>ABC smile makeover</td><td>Planned in stages</td></tr>
</tbody>
</table>

<h2>How Treatment Is Planned</h2>
<ol>
<li><strong>Consultation:</strong> Dr. Firas examines your teeth, checks your oral health and asks what you would like to change.</li>
<li><strong>Treatment options:</strong> You discuss which options are suitable, what each involves and any limitations.</li>
<li><strong>Personal plan:</strong> Your plan and your quote are based on the teeth involved and the complexity of your case.</li>
<li><strong>Treatment and review:</strong> Treatment is carried out in the agreed order, followed by advice on caring for your results.</li>
</ol>
<p>Any existing problems, such as decay or gum disease, may need treatment first. Cosmetic results also need maintenance: composite bonding commonly lasts around 3 to 7 years, and how long any result lasts depends on your oral hygiene, diet and habits.</p>

<h2>What to Look for in a Cosmetic Dentist in Dubai</h2>
<p>Choosing a cosmetic dentist is a personal decision, and it is worth comparing more than price. Useful questions to ask include:</p>
<ul>
<li>Is the dentist licensed by the Dubai Health Authority?</li>
<li>What training do they have in cosmetic dentistry?</li>
<li>Can you see real before and after photos of similar cases?</li>
<li>Will they explain more conservative options as well as larger ones?</li>
<li>Do you understand the cost, the risks and the maintenance before you agree to treatment?</li>
</ul>
<p>You can read more in our guide on <a href="/blog/how-to-choose-a-cosmetic-dentist-in-dubai">how to choose a cosmetic dentist in Dubai</a>, view real results in the <a href="/gallery">smile gallery</a>, or learn more <a href="/about">about Dr. Firas</a>.</p>

<h2>Visit Dr. Firas in Al Wasl, Dubai</h2>
<p>The clinic is on Happiness St in Al Wasl, Dubai, and is open Tuesday to Sunday from 11:00 to 20:00. Consultations are available in English and Arabic. See our <a href="/prices">prices</a> or <a href="/contact">book a consultation</a> to discuss your smile.</p>
`.trim();

const faqItems = [
  {
    question: "What is the difference between a cosmetic dentist and a general dentist?",
    answer: "A general dentist focuses on keeping teeth and gums healthy. A cosmetic dentist focuses on improving how teeth look, using treatments such as composite bonding, veneers and whitening. Your oral health still needs to be assessed before cosmetic treatment.",
  },
  {
    question: "How much does cosmetic dentistry cost in Dubai?",
    answer: "The cost depends on the treatment, the number of teeth involved and the complexity of your case. Composite bonding with Dr. Firas starts from AED 400 per tooth. A consultation is needed for a personal quote.",
  },
  {
    question: "Is cosmetic dentistry painful?",
    answer: "Comfort varies by treatment and patient. Composite bonding is usually comfortable and in many cases does not need an injection. Whitening can cause temporary sensitivity, and aligners can cause pressure. Discuss any concerns before treatment.",
  },
  {
    question: "Which cosmetic treatment is most conservative?",
    answer: "Composite bonding and teeth whitening are often more conservative than veneers because they usually need little or no enamel removal. The most suitable option depends on your teeth and your goals.",
  },
  {
    question: "Where is Dr. Firas's clinic in Dubai?",
    answer: "The clinic is on Happiness St in Al Wasl, Dubai. It is open Tuesday to Sunday from 11:00 to 20:00 and closed on Mondays.",
  },
];

const service = {
  title: "Cosmetic Dentistry in Dubai",
  slug: "cosmetic-dentist-dubai",
  description:
    "Cosmetic dentistry by Dr. Firas Zoghieb in Al Wasl, Dubai. Explore composite bonding, veneers, teeth whitening and Invisalign, planned around your natural smile.",
  content,
  order: 10,
  metaTitle: "Cosmetic Dentist in Dubai",
  metaDesc:
    "See cosmetic dentist Dr. Firas Zoghieb in Al Wasl, Dubai for composite bonding, veneers, teeth whitening and Invisalign. Book a consultation.",
  metaKeywords:
    "cosmetic dentist dubai, best cosmetic dentist dubai, cosmetic dentistry dubai, cosmetic dental clinic dubai",
  faqItems: JSON.stringify(faqItems),
};

async function main() {
  if (dryRun) {
    const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    console.log({ ...service, content: `${words} words`, faqItems: `${faqItems.length} items` });
    return;
  }
  await client.connect();
  const { rows } = await client.query(
    `INSERT INTO "Service" (title, slug, description, content, "order", published, "metaTitle", "metaDesc", "metaKeywords", "faqItems", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,true,$6,$7,$8,$9,NOW(),NOW())
     ON CONFLICT (slug) DO UPDATE SET
       title=EXCLUDED.title, description=EXCLUDED.description, content=EXCLUDED.content,
       "order"=EXCLUDED."order", "metaTitle"=EXCLUDED."metaTitle", "metaDesc"=EXCLUDED."metaDesc",
       "metaKeywords"=EXCLUDED."metaKeywords", "faqItems"=EXCLUDED."faqItems", "updatedAt"=NOW()
     RETURNING id`,
    [
      service.title, service.slug, service.description, service.content, service.order,
      service.metaTitle, service.metaDesc, service.metaKeywords, service.faqItems,
    ],
  );
  console.log(`✓ Service: ${service.title} (id ${rows[0].id}) → /services/${service.slug}`);
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
