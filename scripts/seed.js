"use strict";
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();

  const services = [
    {
      title: "Composite Bonding",
      slug: "composite-bonding",
      description:
        "Transform your smile in a single visit with tooth-coloured composite resin — a minimally invasive, affordable alternative to veneers.",
      content:
        "<h2>What is Composite Bonding?</h2><p>Composite bonding uses a tooth-coloured resin material applied directly to the tooth surface to reshape, repair, or improve your smile. It is quick, painless, and highly effective.</p><h2>Benefits</h2><ul><li>Single-visit transformation</li><li>No drilling or injections needed in most cases</li><li>Fully reversible</li><li>Natural-looking results</li><li>Affordable compared to porcelain veneers</li></ul>",
      icon: "🦷",
      order: 1,
      metaTitle: "Composite Bonding Dubai | Dr. Firas Zoghieb",
      metaDesc:
        "Transform your smile in a single visit with composite bonding by Dr. Firas, Dubai cosmetic dentist.",
    },
    {
      title: "Invisalign",
      slug: "invisalign",
      description:
        "Straighten your teeth discreetly with clear, removable aligners. Certified Invisalign provider with outstanding patient results.",
      content:
        "<h2>Invisalign Clear Aligners</h2><p>Invisalign uses a series of custom-made, clear removable aligners to gradually straighten your teeth. Unlike traditional braces, there are no metal brackets or wires — just a virtually invisible solution to a straighter smile.</p><h2>Why Choose Invisalign?</h2><p>As a certified Invisalign provider, Dr. Firas has helped hundreds of patients achieve straighter smiles comfortably and discreetly. Aligners are removable, so you can eat and maintain oral hygiene as normal.</p>",
      icon: "😁",
      order: 2,
      metaTitle: "Invisalign Dubai | Certified Provider Dr. Firas",
      metaDesc:
        "Straighten your teeth discreetly with Invisalign clear aligners. Certified provider Dr. Firas Zoghieb, Dubai.",
    },
    {
      title: "Porcelain Veneers",
      slug: "porcelain-veneers",
      description:
        "Achieve a flawless Hollywood smile with ultra-thin custom porcelain shells that cover the front surface of your teeth.",
      content:
        "<h2>Porcelain Veneers</h2><p>Porcelain veneers are wafer-thin shells of dental porcelain custom-crafted to bond to the front surface of your teeth. They are the gold standard for a complete smile makeover, offering unmatched aesthetics and durability lasting 10-20 years.</p><h2>What Can Veneers Fix?</h2><ul><li>Severe discolouration or staining</li><li>Chips, cracks, and worn edges</li><li>Gaps between teeth</li><li>Uneven tooth size or shape</li></ul>",
      icon: "✨",
      order: 3,
      metaTitle: "Porcelain Veneers Dubai | Dr. Firas Zoghieb",
      metaDesc:
        "Get a flawless Hollywood smile with custom porcelain veneers by Dr. Firas, cosmetic dentist Dubai.",
    },
    {
      title: "Teeth Whitening",
      slug: "teeth-whitening",
      description:
        "Professional-grade whitening that delivers dramatically brighter results safely and effectively in just one session.",
      content:
        "<h2>Professional Teeth Whitening</h2><p>Professional teeth whitening achieves results far superior to any over-the-counter product. We use the latest whitening technology to safely lighten teeth by several shades in a single appointment.</p><h2>In-Chair vs Take-Home</h2><p>We offer both in-chair whitening for immediate results, and custom take-home trays for patients who prefer the convenience of whitening at home.</p>",
      icon: "⚡",
      order: 4,
      metaTitle: "Teeth Whitening Dubai | Professional Results | Dr. Firas",
      metaDesc:
        "Professional teeth whitening in Dubai. Safely brighten your smile by several shades with Dr. Firas Zoghieb.",
    },
    {
      title: "Smile Makeover",
      slug: "smile-makeover",
      description:
        "A personalised combination of cosmetic treatments designed to completely transform your smile to its full potential.",
      content:
        "<h2>What is a Smile Makeover?</h2><p>A smile makeover is a comprehensive plan combining two or more cosmetic dental treatments to achieve the smile you have always dreamed of. Every makeover is completely bespoke — tailored to your facial features, skin tone, and personal goals.</p><h2>Treatments Often Combined</h2><ul><li>Composite bonding or porcelain veneers</li><li>Teeth whitening</li><li>Invisalign for alignment</li><li>Gum contouring</li></ul>",
      icon: "🌟",
      order: 5,
      metaTitle: "Smile Makeover Dubai | Dr. Firas Zoghieb",
      metaDesc:
        "Transform your smile completely with a bespoke smile makeover by Dr. Firas, Dubai cosmetic dentist.",
    },
  ];

  for (const s of services) {
    await client.query(
      `INSERT INTO "Service" (title, slug, description, content, icon, "order", published, "metaTitle", "metaDesc", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,true,$7,$8,NOW(),NOW())
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title, description=EXCLUDED.description, content=EXCLUDED.content,
         icon=EXCLUDED.icon, "order"=EXCLUDED."order", "metaTitle"=EXCLUDED."metaTitle",
         "metaDesc"=EXCLUDED."metaDesc", "updatedAt"=NOW()`,
      [s.title, s.slug, s.description, s.content, s.icon, s.order, s.metaTitle, s.metaDesc]
    );
    console.log("✓ Service:", s.title);
  }

  const now = Date.now();
  const daysAgo = (d) => new Date(now - d * 86400000).toISOString();

  const posts = [
    {
      title: "5 Signs You Could Benefit From Composite Bonding",
      slug: "5-signs-composite-bonding",
      excerpt:
        "Not sure if composite bonding is right for you? Here are five tell-tale signs this popular cosmetic treatment could transform your smile.",
      content:
        "<p>Composite bonding has become one of the most popular cosmetic dental treatments in Dubai. But how do you know if it is right for you?</p><h2>1. You Have a Chipped or Cracked Tooth</h2><p>Even a small chip can make you self-conscious. Composite bonding repairs chips seamlessly, blending with your natural tooth colour.</p><h2>2. You Have Gaps Between Your Teeth</h2><p>Small gaps can be closed with bonding without lengthy orthodontic treatment.</p><h2>3. Your Teeth Are Discoloured</h2><p>Bonding can cover stubborn stains that whitening has not fixed.</p><h2>4. Your Teeth Are Uneven or Misshapen</h2><p>Bonding can reshape teeth for a more balanced, symmetrical smile.</p><h2>5. You Want a Quick Result</h2><p>Composite bonding can be completed in a single appointment.</p>",
      publishedAt: daysAgo(7),
      metaTitle: "5 Signs You Could Benefit From Composite Bonding | Dr. Firas",
      metaDesc:
        "Chipped teeth, gaps, or discolouration? Discover if composite bonding is the right cosmetic treatment for you.",
    },
    {
      title: "Invisalign vs Traditional Braces: Which is Right for You?",
      slug: "invisalign-vs-traditional-braces",
      excerpt:
        "Both Invisalign and traditional braces can give you a straighter smile — but they are very different experiences.",
      content:
        "<p>Choosing between Invisalign and traditional braces is one of the most common questions Dr. Firas gets asked.</p><h2>Invisalign: The Clear Choice for Adults</h2><p>Invisalign uses clear removable aligners that are virtually invisible. They are removable, so you can eat what you like and maintain your oral hygiene normally.</p><h2>Traditional Braces: Tried and Tested</h2><p>Metal braces are fixed to the teeth and work continuously. They handle complex cases and larger tooth movements more predictably.</p><h2>Which Should You Choose?</h2><p>For most adults, Invisalign is the preferred choice. For complex alignment issues, traditional braces may be more appropriate.</p>",
      publishedAt: daysAgo(14),
      metaTitle: "Invisalign vs Braces: Which is Right for You? | Dr. Firas",
      metaDesc:
        "Compare Invisalign and traditional braces to find the best teeth straightening option for your lifestyle and budget.",
    },
    {
      title: "How Long Does Teeth Whitening Last? The Honest Answer",
      slug: "how-long-does-teeth-whitening-last",
      excerpt:
        "Professional teeth whitening can give you a dramatically brighter smile — but how long will the results actually last?",
      content:
        "<p>Teeth whitening is one of the simplest ways to refresh your smile. But how long will it last?</p><h2>On Average: 1-3 Years</h2><p>Most patients enjoy results for one to three years. Teeth can pick up surface staining within months if habits are not adjusted.</p><h2>Factors That Affect Longevity</h2><ul><li>Coffee and tea</li><li>Red wine</li><li>Smoking</li><li>Oral hygiene</li></ul><h2>Making Results Last Longer</h2><p>Avoid staining foods in the 48 hours after treatment. A touch-up session every 6-12 months keeps your smile looking its best.</p>",
      publishedAt: daysAgo(21),
      metaTitle: "How Long Does Teeth Whitening Last? | Dr. Firas Zoghieb",
      metaDesc:
        "Find out how long professional teeth whitening results last and how to maintain your bright smile for longer.",
    },
    {
      title: "Porcelain Veneers vs Composite Bonding: Which Wins?",
      slug: "porcelain-veneers-vs-composite-bonding",
      excerpt:
        "Two of the most popular cosmetic dental treatments go head to head. Which is the better choice for your smile goals and budget?",
      content:
        "<p>When patients want to improve their smile, the choice often comes down to porcelain veneers or composite bonding.</p><h2>Cost</h2><p>Composite bonding is considerably more affordable than porcelain veneers.</p><h2>Durability</h2><p>Porcelain veneers typically last 10-20 years. Composite bonding lasts 5-7 years but is easier and cheaper to repair.</p><h2>Invasiveness</h2><p>Composite bonding requires little to no tooth preparation. Porcelain veneers require enamel removal, making the procedure irreversible.</p><h2>Verdict</h2><p>There is no universal winner — consult Dr. Firas for a personalised recommendation.</p>",
      publishedAt: daysAgo(28),
      metaTitle: "Porcelain Veneers vs Composite Bonding | Dr. Firas Dubai",
      metaDesc:
        "Compare porcelain veneers and composite bonding to find the best cosmetic dental treatment for your smile goals.",
    },
  ];

  for (const p of posts) {
    await client.query(
      `INSERT INTO "Post" (title, slug, excerpt, content, published, "publishedAt", "metaTitle", "metaDesc", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,true,$5,$6,$7,NOW(),NOW())
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content,
         "publishedAt"=EXCLUDED."publishedAt", "metaTitle"=EXCLUDED."metaTitle",
         "metaDesc"=EXCLUDED."metaDesc", "updatedAt"=NOW()`,
      [p.title, p.slug, p.excerpt, p.content, p.publishedAt, p.metaTitle, p.metaDesc]
    );
    console.log("✓ Post:", p.title);
  }

  console.log("\nSeed complete!");
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  client.end().catch(() => {});
  process.exit(1);
});
