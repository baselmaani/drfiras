// Adds (or updates) the ABC Smile Makeover service page.
//
// Usage: node scripts/add-abc-smile-makeover.js [--dry-run]
"use strict";
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({ connectionString: process.env.DATABASE_URL });
const dryRun = process.argv.includes("--dry-run");

const content = `
<h2>What is an ABC smile makeover?</h2>
<p>An ABC smile makeover combines <strong>A — Align</strong>, <strong>B — Bleach</strong> and <strong>C — Composite bonding</strong>. The approach brings teeth into a more suitable position, brightens natural tooth colour and refines selected teeth with tooth-coloured resin. Treatment is tailored to your dental health, bite and desired changes.</p>

<h2>A Smile Makeover That Starts With Your Natural Teeth</h2>
<p>Sometimes, the concern is not just the colour of your teeth or one uneven edge. It is the way several small details work together: a tooth that overlaps, a shade that feels too dark, or front teeth with different lengths.</p>
<p>ABC treatment considers those concerns as part of one plan. Instead of choosing bonding, whitening or alignment in isolation, the sequence is planned around the intended result.</p>
<p>For patients exploring cosmetic dentistry in Dubai, this can offer a way to enhance the existing smile while limiting unnecessary changes to healthy teeth. A consultation is needed to confirm whether the approach is appropriate.</p>

<h2>How the Three Stages Work</h2>
<h3>A — Align: Improve Tooth Position</h3>
<p>Alignment uses orthodontic treatment to move teeth. Depending on the case, this may involve clear aligners, such as <a href="/services/invisalign-dubai">Invisalign</a>, or braces.</p>
<p>The aim is to establish a more suitable position before deciding what cosmetic finishing is needed. For example, a rotated tooth may benefit from movement before changes are made to its shape.</p>
<p>Alignment requires an individual assessment and a commitment to the prescribed treatment and review schedule.</p>
<h3>B — Bleach: Brighten Natural Tooth Colour</h3>
<p>“Bleach” means teeth whitening. <a href="/services/teeth-whitening-dubai">Professional whitening</a> may help lighten natural teeth before the final composite shade is selected.</p>
<p>Whitening does not change the colour of existing crowns, veneers or tooth-coloured fillings. These restorations need to be considered during planning to avoid an unexpected colour mismatch.</p>
<p>The whitening method, timing and target shade depend on your teeth, sensitivity history and treatment plan.</p>
<h3>C — Composite: Refine Shape and Edges</h3>
<p><a href="/services/composite-bonding-dubai">Composite bonding</a> uses tooth-coloured resin to make selected changes to tooth shape. It may help improve small chips, uneven edges or remaining spaces where appropriate.</p>
<p>The resin is shaped, hardened and polished to blend with the smile. Some patients need only small additions rather than extensive changes across every visible tooth.</p>
<p>Bonding is the finishing stage of the ABC approach, rather than a substitute for necessary orthodontic treatment.</p>

<h2>Why Consider an ABC Smile Makeover?</h2>
<ul>
<li><strong>A coordinated plan:</strong> Position, colour and shape are considered together.</li>
<li><strong>A focus on existing teeth:</strong> Alignment and additive bonding may reduce the need for more extensive tooth preparation in suitable cases.</li>
<li><strong>Selective finishing:</strong> Changes can focus on the teeth and details that need attention.</li>
<li><strong>A personal aesthetic:</strong> Discuss tooth proportions, brightness and the level of change you prefer.</li>
<li><strong>Clear treatment decisions:</strong> Understand why each stage is recommended before proceeding.</li>
</ul>
<p>Not everyone needs all three stages. A simpler treatment may be appropriate if your concerns can be addressed with fewer steps.</p>

<h2>Who May Be Suitable?</h2>
<p>An ABC smile makeover may be worth discussing if you have overlapping or spaced teeth, discolouration, small chips or uneven front-tooth edges and want to explore a combined approach.</p>
<p>Suitability depends on more than appearance. Your teeth, gums, existing restorations and bite need to be assessed before cosmetic treatment is planned.</p>
<h3>When Another Approach May Be Needed</h3>
<p>Active decay or gum disease may need treatment first. Substantial tooth damage, complex bite concerns or expectations that cannot be achieved through ABC may call for a different plan.</p>
<p>Tell Dr. Firas about tooth sensitivity, grinding, previous orthodontic treatment and existing dental work. These details can affect the options discussed.</p>

<h2>Your ABC Treatment Journey</h2>
<h3>1. Discuss Your Goals</h3>
<p>Explain what you would like to change and what you would prefer to keep. You might want straighter front teeth, a brighter shade or a small adjustment to an uneven edge.</p>
<h3>2. Assess the Starting Point</h3>
<p>A dental assessment establishes what is clinically appropriate. Photographs, scans or X-rays may be recommended where needed.</p>
<h3>3. Agree on the Plan</h3>
<p>Discuss the recommended stages, alternatives, likely timeframe, maintenance and estimated fees. The plan should distinguish necessary dental care from optional cosmetic changes.</p>
<h3>4. Complete the Treatment Stages</h3>
<p>Where required, alignment comes first. Whitening and composite finishing are scheduled at suitable intervals, with the final shade and bonding details assessed before placement.</p>
<h3>5. Maintain Your Smile</h3>
<p>Follow the recommended review and home-care plan. Retainers are generally needed after orthodontic treatment to help maintain tooth position.</p>

<h2>ABC Smile Makeover or Porcelain Veneers?</h2>
<p>Neither option is right for every patient. The choice depends on your dental condition and the changes you want.</p>
<table>
<thead>
<tr><th>Consideration</th><th>ABC smile makeover</th><th><a href="/services/porcelain-veneers-dubai">Porcelain veneers</a></th></tr>
</thead>
<tbody>
<tr><td>Main approach</td><td>Combines tooth movement, whitening and composite finishing</td><td>Uses custom ceramic restorations on selected teeth</td></tr>
<tr><td>Tooth position</td><td>Orthodontics moves teeth where required</td><td>Veneers change appearance; they do not move teeth</td></tr>
<tr><td>Tooth preparation</td><td>May limit preparation in suitable cases</td><td>Often involves enamel preparation</td></tr>
<tr><td>Treatment time</td><td>Depends largely on the alignment required</td><td>Depends on assessment, preparation and fabrication</td></tr>
<tr><td>Maintenance</td><td>Retainers, whitening review and composite care as appropriate</td><td>Ongoing dental reviews and restoration care</td></tr>
</tbody>
</table>
<p>Ask Dr. Firas to explain the benefits and limitations of each option for your case.</p>

<h2>Expected Results and Ongoing Care</h2>
<p>ABC treatment aims to create a smile with improved alignment, a suitable tooth shade and more balanced shapes. The achievable outcome depends on your starting point and the treatment selected.</p>
<p>Composite can stain, wear or chip and may need polishing, repair or replacement. Whitening results also need review over time. No smile makeover removes the need for regular dental care.</p>
<p>Before and after smile transformations can help illustrate possible changes, but another patient’s result is not a prediction of your own.</p>

<h2>ABC Smile Makeover Cost in Dubai</h2>
<p>The cost depends on the treatment stages you need, the complexity of alignment, the number of teeth receiving bonding and the materials selected.</p>
<p>ABC is a combined treatment plan, so a per-tooth bonding price does not describe the cost of the entire makeover.</p>
<p>At your consultation, request an itemised estimate covering assessment, alignment, whitening, bonding, retainers and follow-up where applicable. This helps you understand what is included and what may involve a separate fee.</p>

<h2>Discuss Your Smile With Dr. Firas</h2>
<p>If you are comparing cosmetic dental treatments in Dubai, start with the changes that matter to you. Discuss whether your priorities are tooth position, colour, shape or a combination.</p>
<p>Your consultation with Dr. Firas is an opportunity to explore ABC alongside alternatives such as whitening alone, composite bonding, orthodontics or veneers. Ask about suitability, expected limitations and the care each option will require.</p>

<h2>Ready to Explore Your Options?</h2>
<p>Your smile does not need the same treatment as someone else’s. Start with a conversation about your teeth, your priorities and the changes you would like to make. <a href="/#book">Book your cosmetic dental consultation in Dubai with Dr. Firas</a>.</p>
`.trim().replace(/\n+/g, "");

const faqItems = [
  {
    question: "Is ABC a single dental treatment?",
    answer: "No. ABC is a coordinated approach combining alignment, teeth whitening and composite bonding. Your plan may include all three stages or only those needed.",
  },
  {
    question: "Is ABC the same as Invisalign?",
    answer: "No. Invisalign is one clear aligner system that may be used during the alignment stage. ABC also considers whitening and composite finishing.",
  },
  {
    question: "Can I have bonding without straightening my teeth first?",
    answer: "Sometimes. Bonding alone may address small cosmetic concerns. If tooth position or your bite affects the proposed result, orthodontic treatment may be recommended first.",
  },
  {
    question: "Will my teeth need to be shaved?",
    answer: "Not necessarily. Composite bonding often requires little or no enamel removal, but the overall plan may involve preparation or adjustments. Ask what is proposed for each tooth before consenting.",
  },
  {
    question: "Can ABC be completed in one visit?",
    answer: "A full ABC plan involving orthodontic movement is a staged process. The timeframe depends on the alignment and finishing needed; a consultation is required to estimate it.",
  },
  {
    question: "Is an ABC smile makeover painful?",
    answer: "Comfort varies by treatment and patient. Aligners can cause pressure or temporary discomfort, and whitening can cause sensitivity or gum irritation. Discuss your concerns before treatment.",
  },
  {
    question: "How long do the results last?",
    answer: "There is no single lifespan for the whole plan. Maintaining alignment usually requires retainers, while whitening and composite bonding need ongoing review and maintenance.",
  },
  {
    question: "Can ABC whiten my existing veneers or crowns?",
    answer: "No. Whitening lightens natural teeth rather than existing veneers, crowns or fillings. Their colour and condition need to be considered when planning the final smile.",
  },
  {
    question: "Can I find ABC smile makeover treatment near me in Dubai?",
    answer: "If you are searching for an ABC smile makeover nearby, confirm the practice location, available appointment times and the stages offered. Contact Dr. Firas’s team to discuss consultation availability in Dubai.",
  },
];

const service = {
  title: "ABC Smile Makeover",
  slug: "abc-smile-makeover-dubai",
  description:
    "Improve the position, colour and shape of your teeth through a coordinated cosmetic dental plan. Explore the ABC approach with Dr. Firas in Dubai and find out which treatments fit your smile goals.",
  content,
  order: 1,
  metaTitle: "ABC Smile Makeover in Dubai",
  metaDesc:
    "Align, whiten and refine your smile with an ABC smile makeover in Dubai: orthodontics, teeth whitening and composite bonding planned together by Dr. Firas.",
  metaKeywords:
    "abc smile makeover dubai, smile makeover dubai, align bleach composite, invisalign and composite bonding",
  faqItems: JSON.stringify(faqItems),
};

async function main() {
  if (dryRun) {
    console.log({ ...service, content: `${content.length} chars`, faqItems: `${faqItems.length} items` });
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
