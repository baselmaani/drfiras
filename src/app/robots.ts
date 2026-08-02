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
      // Explicitly allow major AI/LLM crawlers (still block dashboard & API)
      { userAgent: "GPTBot",             allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "ChatGPT-User",       allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "OAI-SearchBot",      allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "Google-Extended",    allow: "/", disallow: ["/dashboard/", "/api/"] },  // Gemini / AI Overviews
      { userAgent: "PerplexityBot",      allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "ClaudeBot",          allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "anthropic-ai",       allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "Applebot",           allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "cohere-ai",          allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "Bytespider",         allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "Meta-ExternalAgent", allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "FacebookBot",        allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "Amazonbot",          allow: "/", disallow: ["/dashboard/", "/api/"] },
      { userAgent: "AI2Bot",             allow: "/", disallow: ["/dashboard/", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
