// Maps each treatment page to the blog topics it owns, so service pages can
// list their guides and blog posts can link back to the treatment page.
import { BLOG_REDIRECTS } from "@/lib/blogRedirects";

type ServiceTopic = { url: string; anchor: string; keywords: string[] };

export const SERVICE_TOPICS: Record<string, ServiceTopic> = {
  "composite-bonding-dubai": {
    url: "/services/composite-bonding-dubai",
    anchor: "Composite bonding in Dubai",
    keywords: ["composite"],
  },
  "porcelain-veneers-dubai": {
    url: "/services/porcelain-veneers-dubai",
    anchor: "Porcelain veneers in Dubai",
    keywords: ["veneer"],
  },
  "teeth-whitening-dubai": {
    url: "/services/teeth-whitening-dubai",
    anchor: "Teeth whitening in Dubai",
    keywords: ["whitening"],
  },
  "invisalign-dubai": {
    url: "/services/invisalign-dubai",
    anchor: "Invisalign in Dubai",
    keywords: ["invisalign"],
  },
};

function matches(topic: ServiceTopic, post: { slug: string; title: string }) {
  const text = `${post.slug} ${post.title}`.toLowerCase();
  return topic.keywords.some((k) => text.includes(k));
}

// The treatment a post is about — the first topic it mentions, so a
// "composite bonding vs veneers" post links to composite bonding.
export function serviceForPost(post: { slug: string; title: string }) {
  const text = `${post.slug} ${post.title}`.toLowerCase();
  let best: { topic: ServiceTopic; at: number } | null = null;
  for (const topic of Object.values(SERVICE_TOPICS)) {
    for (const k of topic.keywords) {
      const at = text.indexOf(k);
      if (at !== -1 && (!best || at < best.at)) best = { topic, at };
    }
  }
  return best ? { url: best.topic.url, anchor: best.topic.anchor } : null;
}

export function postMatchesService(serviceSlug: string, post: { slug: string; title: string }) {
  const topic = SERVICE_TOPICS[serviceSlug];
  if (!topic || post.slug in BLOG_REDIRECTS) return false;
  return matches(topic, post);
}
