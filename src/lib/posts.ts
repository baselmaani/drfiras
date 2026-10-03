import type { Prisma } from "@/generated/prisma/client";
import { BLOG_REDIRECTS } from "@/lib/blogRedirects";

// Published posts that are still live — excludes posts retired by a redirect,
// so lists, the sitemap and llms.txt never link into a redirect.
export const LIVE_POSTS = {
  published: true,
  slug: { notIn: Object.keys(BLOG_REDIRECTS) },
} satisfies Prisma.PostWhereInput;
