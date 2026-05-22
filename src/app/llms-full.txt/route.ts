import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SITE_URL, GOOGLE_MAPS_CID } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const [settings, services, posts] = await Promise.all([
    getSettings(),
    db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: {
        title: true,
        slug: true,
        description: true,
        content: true,
        faqItems: true,
        metaKeywords: true,
      },
    }),
    db.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        faqItems: true,
        publishedAt: true,
        metaKeywords: true,
      },
    }),
  ]);

  const doctorName = settings.doctorName ?? "Dr. Firas Zoghieb";
  const specialty  = settings.specialty  ?? "Cosmetic Dentist";
  const phone      = settings.phone      ?? "";
  const email      = settings.email      ?? "";
  const address    = settings.address    ?? "";

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# ${doctorName} — ${specialty} Dubai (Full Content)`);
  lines.push(`> This is the complete content index for ${SITE_URL}`);
  lines.push(`> Short index: ${SITE_URL}/llms.txt`);
  lines.push("");

  // ── Clinic ──────────────────────────────────────────────────────────────────
  lines.push("## Clinic Identity");
  lines.push(`- Name: Dr. Firas | Composite Bonding - Dubai`);
  lines.push(`- Practitioner: ${doctorName}`);
  lines.push(`- Role: ${specialty}`);
  if (address)  lines.push(`- Address: ${address}, United Arab Emirates`);
  if (phone)    lines.push(`- Phone: ${phone}`);
  if (email)    lines.push(`- Email: ${email}`);
  if (settings.whatsapp) lines.push(`- WhatsApp: ${settings.whatsapp}`);
  lines.push(`- Hours: Tuesday–Sunday, 11:00–20:00 (closed Monday)`);
  if (GOOGLE_MAPS_CID) lines.push(`- Google Maps: https://maps.google.com/?cid=${GOOGLE_MAPS_CID}`);
  if (settings.googleRating && settings.googleReviewCount)
    lines.push(`- Google rating: ${settings.googleRating}/5 (${settings.googleReviewCount} verified reviews)`);
  lines.push("");

  // ── E-E-A-T Credentials ──────────────────────────────────────────────────────
  lines.push("## Credentials & Expertise");
  lines.push(`- BDS (Honours) — Bachelor of Dental Surgery with Honours`);
  lines.push(`- MSc Cosmetic Dentistry — Master of Science in Cosmetic Dentistry`);
  lines.push(`- Licensed by the Dubai Health Authority (DHA)`);
  lines.push(`- Certified Invisalign Provider — accredited by Align Technology`);
  lines.push(`- Advanced Composite Bonding Certification`);
  lines.push(`- Member of the British Dental Association (BDA)`);
  if (settings.heroStatNumber) lines.push(`- ${settings.heroStatNumber} smile transformations completed`);
  if (settings.aboutStat2Number && settings.aboutStat2Label)
    lines.push(`- ${settings.aboutStat2Number} ${settings.aboutStat2Label}`);
  lines.push(`- Specialises in minimally invasive cosmetic dentistry — no unnecessary drilling`);
  lines.push(`- Fluent in English and Arabic`);
  lines.push("");

  // ── About ───────────────────────────────────────────────────────────────────
  lines.push("## About");
  if (settings.aboutPara1) lines.push(settings.aboutPara1);
  if (settings.aboutPara2) lines.push("", settings.aboutPara2);
  if (settings.aboutPara3) lines.push("", settings.aboutPara3);
  if (settings.aboutPara4) lines.push("", settings.aboutPara4);
  lines.push("");

  // ── Services (full content) ──────────────────────────────────────────────────
  lines.push("## Services");
  lines.push("");
  for (const s of services) {
    lines.push(`### ${s.title}`);
    lines.push(`URL: ${SITE_URL}/services/${s.slug}`);
    lines.push(s.description);
    if (s.content) {
      lines.push("");
      // Strip HTML tags for clean plain text
      lines.push(s.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    }
    if (s.metaKeywords) lines.push(``, `Keywords: ${s.metaKeywords}`);
    // Per-service FAQs
    if (s.faqItems) {
      try {
        const faqs: { question: string; answer: string }[] = JSON.parse(s.faqItems);
        if (faqs.length > 0) {
          lines.push("");
          lines.push(`#### FAQs — ${s.title}`);
          for (const faq of faqs) {
            lines.push(`Q: ${faq.question}`);
            lines.push(`A: ${faq.answer}`);
            lines.push("");
          }
        }
      } catch { /* skip */ }
    }
    lines.push("");
  }

  // ── Blog Posts (full content) ────────────────────────────────────────────────
  if (posts.length > 0) {
    lines.push("## Blog Posts");
    lines.push("");
    for (const p of posts) {
      lines.push(`### ${p.title}`);
      lines.push(`URL: ${SITE_URL}/blog/${p.slug}`);
      if (p.publishedAt) lines.push(`Published: ${p.publishedAt.toISOString().slice(0, 10)}`);
      if (p.excerpt) lines.push("", p.excerpt);
      lines.push("");
      // Strip HTML for clean plain text
      lines.push(p.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
      if (p.metaKeywords) lines.push("", `Keywords: ${p.metaKeywords}`);
      // Per-post FAQs
      if (p.faqItems) {
        try {
          const faqs: { question: string; answer: string }[] = JSON.parse(p.faqItems);
          if (faqs.length > 0) {
            lines.push("");
            lines.push(`#### FAQs — ${p.title}`);
            for (const faq of faqs) {
              lines.push(`Q: ${faq.question}`);
              lines.push(`A: ${faq.answer}`);
              lines.push("");
            }
          }
        } catch { /* skip */ }
      }
      lines.push("");
    }
  }

  // ── Global FAQs ─────────────────────────────────────────────────────────────
  const faqRaw = settings.faqItems;
  if (faqRaw) {
    try {
      const faqs: { question: string; answer: string }[] = JSON.parse(faqRaw);
      if (faqs.length > 0) {
        lines.push("## General Frequently Asked Questions");
        for (const faq of faqs) {
          lines.push(`Q: ${faq.question}`);
          lines.push(`A: ${faq.answer}`);
          lines.push("");
        }
      }
    } catch { /* skip */ }
  }

  // ── Sitemap ──────────────────────────────────────────────────────────────────
  lines.push("## All Pages");
  lines.push(`- ${SITE_URL}`);
  lines.push(`- ${SITE_URL}/about`);
  lines.push(`- ${SITE_URL}/services`);
  for (const s of services) lines.push(`- ${SITE_URL}/services/${s.slug}`);
  lines.push(`- ${SITE_URL}/blog`);
  for (const p of posts) lines.push(`- ${SITE_URL}/blog/${p.slug}`);
  lines.push(`- ${SITE_URL}/contact`);
  lines.push(`- ${SITE_URL}/sitemap.xml`);

  const text = lines.join("\n");

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
