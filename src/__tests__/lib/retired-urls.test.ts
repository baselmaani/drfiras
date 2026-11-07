import { describe, it, expect } from "vitest";
import {
  BLOG_REDIRECTS,
  COSMETIC_PAGE_LIVE,
  COSMETIC_TARGET,
  RECRAWL_SLUGS,
} from "@/lib/blogRedirects";
import { SERVICE_TOPICS } from "@/lib/serviceTopics";
import { GET } from "@/app/sitemap-retired.xml/route";

const LANDING_PAGE = "/services/cosmetic-dentist-dubai";

describe("retired blog URLs", () => {
  it("never redirects to the landing page before it is live", () => {
    const toLanding = Object.values(BLOG_REDIRECTS).filter((to) => to === LANDING_PAGE);
    expect(toLanding).toHaveLength(COSMETIC_PAGE_LIVE ? 5 : 0);
    expect("cosmetic-dentist-dubai" in SERVICE_TOPICS).toBe(COSMETIC_PAGE_LIVE);
  });

  it("holds commercial URLs back from recrawl until the landing page is live", () => {
    if (COSMETIC_PAGE_LIVE) {
      expect(RECRAWL_SLUGS).toHaveLength(Object.keys(BLOG_REDIRECTS).length);
    } else {
      const redirects: Record<string, string> = BLOG_REDIRECTS;
      expect(RECRAWL_SLUGS.some((slug) => redirects[slug] === COSMETIC_TARGET)).toBe(false);
      expect(RECRAWL_SLUGS).not.toContain("best-cosmetic-dentistry-in-dubai");
    }
  });

  it("serves the recrawl list as a valid sitemap", async () => {
    const response = GET();
    const xml = await response.text();
    expect(response.headers.get("Content-Type")).toBe("application/xml");
    expect(xml.match(/<loc>/g)).toHaveLength(RECRAWL_SLUGS.length);
    expect(xml).toContain("/blog/best-doctor-for-composite-bonding-in-dubai</loc>");
  });
});
