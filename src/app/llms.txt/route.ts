import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SITE_URL, GOOGLE_MAPS_CID } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const [settings, services, posts, cases] = await Promise.all([
    getSettings(),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { title: true, slug: true, description: true, metaKeywords: true },
    }),
    db.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: { title: true, slug: true, excerpt: true, metaKeywords: true },
    }),
    db.beforeAfter.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { title: true, treatment: true, description: true },
    }),
  ]);

  const doctorName = settings.doctorName ?? "Dr. Firas Zoghieb";
  const specialty  = settings.specialty  ?? "Cosmetic Dentist";
  const phone      = settings.phone      ?? "";
  const email      = settings.email      ?? "";
  const address    = settings.address    ?? "";
  const instagram  = settings.instagram  ?? "";

  const lines: string[] = [];

  // Header
  lines.push(`# ${doctorName} — ${specialty} Dubai`, "");

  // Hero intro (short, AI-friendly summary)
  if (settings.heroBody) {
    lines.push("## Summary");
    lines.push(settings.heroBody);
    lines.push("");
  }

  // About
  lines.push("## About");
  if (settings.aboutPara1) lines.push(settings.aboutPara1);
  if (settings.aboutPara2) lines.push("", settings.aboutPara2);
  if (settings.aboutPara3) lines.push("", settings.aboutPara3);
  if (settings.aboutPara4) lines.push("", settings.aboutPara4);
  lines.push("");

  // Key Stats
  const stats: string[] = [];
  if (settings.aboutStat1Number && settings.aboutStat1Label)
    stats.push(`${settings.aboutStat1Number} ${settings.aboutStat1Label}`);
  if (settings.aboutStat2Number && settings.aboutStat2Label)
    stats.push(`${settings.aboutStat2Number} ${settings.aboutStat2Label}`);
  if (settings.aboutStat3Number && settings.aboutStat3Label)
    stats.push(`${settings.aboutStat3Number} ${settings.aboutStat3Label}`);
  if (settings.heroStatNumber && settings.heroStatLabel)
    stats.push(`${settings.heroStatNumber} ${settings.heroStatLabel}`);
  if (stats.length > 0) {
    lines.push("## Key Stats");
    for (const stat of stats) lines.push(`- ${stat}`);
    lines.push("");
  }

  // At a Glance
  const glanceRaw = settings.glanceItems;
  if (glanceRaw) {
    try {
      const items: { label: string; value: string }[] = JSON.parse(glanceRaw);
      if (items.length > 0) {
        lines.push("## At a Glance");
        for (const item of items) lines.push(`- ${item.label}: ${item.value}`);
        lines.push("");
      }
    } catch { /* skip if malformed */ }
  }

  // Clinic
  lines.push("## Clinic");
  lines.push("- Name: Dr. Firas | Composite Bonding - Dubai");
  if (address)  lines.push(`- Address: ${address}, United Arab Emirates`);
  if (phone)    lines.push(`- Phone: ${phone}`);
  if (email)    lines.push(`- Email: ${email}`);
  if (settings.whatsapp) lines.push(`- WhatsApp: ${settings.whatsapp}`);
  if (settings.bookingUrl && settings.bookingUrl !== "#book")
    lines.push(`- Book consultation: ${settings.bookingUrl}`);
  lines.push("- Working hours: Tuesday–Sunday, 11:00–20:00 (closed Monday)");
  if (GOOGLE_MAPS_CID) lines.push(`- Google Maps: https://maps.google.com/?cid=${GOOGLE_MAPS_CID}`);
  if (settings.googleRating && settings.googleReviewCount)
    lines.push(`- Google rating: ${settings.googleRating} stars (${settings.googleReviewCount} reviews)`);
  lines.push("");

  // Services
  lines.push("## Services");
  if (services.length > 0) {
    for (const s of services) {
      lines.push(`- ${s.title}: ${s.description}`);
      if (s.metaKeywords) lines.push(`  Keywords: ${s.metaKeywords}`);
    }
  } else {
    lines.push("- Composite Bonding, Invisalign, Porcelain Veneers, Teeth Whitening, Smile Makeovers");
  }
  lines.push("");

  // Credentials
  lines.push("## Credentials");
  lines.push("- BDS (Honours) — Bachelor of Dental Surgery with Honours");
  lines.push("- MSc Cosmetic Dentistry — Master of Science in Cosmetic Dentistry");
  lines.push("- Certified Invisalign Provider");
  lines.push("- Advanced Composite Bonding Certification");
  if (settings.heroStatNumber) lines.push(`- ${settings.heroStatNumber} smile transformations completed`);
  lines.push("");

  // Before & After Cases
  if (cases.length > 0) {
    lines.push("## Before & After Cases");
    for (const c of cases) {
      const desc = c.description ? ` — ${c.description}` : "";
      lines.push(`- ${c.title} (${c.treatment})${desc}`);
    }
    lines.push("");
  }

  // Content Pages
  lines.push("## Content Pages");
  lines.push(`- Home: ${SITE_URL}`);
  lines.push(`- About ${doctorName}: ${SITE_URL}/about`);
  lines.push(`- Services: ${SITE_URL}/services`);
  for (const s of services) {
    lines.push(`- ${s.title}: ${SITE_URL}/services/${s.slug}`);
  }
  lines.push(`- Blog: ${SITE_URL}/blog`);
  lines.push(`- Contact: ${SITE_URL}/contact`);
  lines.push("");

  // Blog Posts
  if (posts.length > 0) {
    lines.push("## Blog Posts");
    for (const p of posts) {
      const excerpt = p.excerpt ? ` — ${p.excerpt}` : "";
      lines.push(`- ${p.title}${excerpt}: ${SITE_URL}/blog/${p.slug}`);
    }
    lines.push("");
  }

  // FAQs — key in DB is "faqItems"
  const faqRaw = settings.faqItems;
  if (faqRaw) {
    try {
      const faqs: { question: string; answer: string }[] = JSON.parse(faqRaw);
      if (faqs.length > 0) {
        lines.push("## Frequently Asked Questions");
        for (const faq of faqs) {
          lines.push(`Q: ${faq.question}`);
          lines.push(`A: ${faq.answer}`);
          lines.push("");
        }
      }
    } catch { /* skip if malformed */ }
  }

  // Social
  lines.push("## Social");
  if (instagram) lines.push(`- Instagram: ${instagram}`);
  if (settings.facebook) lines.push(`- Facebook: ${settings.facebook}`);
  if (settings.whatsapp) lines.push(`- WhatsApp: ${settings.whatsapp}`);
  lines.push("");

  // Sitemap
  lines.push("## Sitemap");
  lines.push(`${SITE_URL}/sitemap.xml`);

  const text = lines.join("\n");

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
