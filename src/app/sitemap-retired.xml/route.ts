import { RECRAWL_SLUGS } from "@/lib/blogRedirects";
import { SITE_URL } from "@/lib/constants";

// Temporary: retired posts left the main sitemap, so Google has no prompt to
// recrawl them and see their redirects. Remove around Jan 2027 with the entry in
// robots.ts, once Search Console reports them as "Page with redirect".
export const dynamic = "force-static";

export function GET() {
  const urls = RECRAWL_SLUGS.map(
    (slug: string) => `<url><loc>${SITE_URL}/blog/${slug}</loc></url>`,
  ).join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
