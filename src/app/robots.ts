import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow everything except private routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/"],
      },
      // Explicitly allow major AI/LLM crawlers
      { userAgent: "GPTBot",         allow: "/" },
      { userAgent: "ChatGPT-User",   allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },  // Gemini / AI Overviews
      { userAgent: "PerplexityBot",  allow: "/" },
      { userAgent: "ClaudeBot",      allow: "/" },
      { userAgent: "anthropic-ai",   allow: "/" },
      { userAgent: "Applebot",       allow: "/" },
      { userAgent: "cohere-ai",      allow: "/" },
      { userAgent: "Bytespider",     allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
