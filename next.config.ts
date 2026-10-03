import type { NextConfig } from "next";
import path from "path";
import { BLOG_REDIRECTS } from "./src/lib/blogRedirects.js";

const securityHeaders = [
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control",    value: "on" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Consolidate www onto the apex domain so Google sees one host
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.drfiraszoghieb.com" }],
        destination: "https://drfiraszoghieb.com/:path*",
        permanent: true,
      },
      ...Object.entries(BLOG_REDIRECTS).map(([slug, destination]) => ({
        source: `/blog/${slug}`,
        destination,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
