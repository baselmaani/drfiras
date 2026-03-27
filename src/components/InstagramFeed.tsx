import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Link from "next/link";

interface InstaPost {
  image: string;
  caption?: string;
  url?: string;
}

const PLACEHOLDER_POSTS: InstaPost[] = [
  {
    image: "https://placehold.co/600x600/1b4f72/ffffff?text=Post+1",
    caption: "Smile transformation ✨ Composite bonding in a single visit.",
    url: "https://www.instagram.com/dr.firaszoghieb",
  },
  {
    image: "https://placehold.co/600x600/c9a84c/ffffff?text=Post+2",
    caption: "Before & after — Invisalign results 🦷",
    url: "https://www.instagram.com/dr.firaszoghieb",
  },
  {
    image: "https://placehold.co/600x600/154460/ffffff?text=Post+3",
    caption: "Natural-looking veneers for this beautiful patient.",
    url: "https://www.instagram.com/dr.firaszoghieb",
  },
  {
    image: "https://placehold.co/600x600/1b4f72/ffffff?text=Post+4",
    caption: "Every smile tells a story 💫",
    url: "https://www.instagram.com/dr.firaszoghieb",
  },
  {
    image: "https://placehold.co/600x600/c9a84c/ffffff?text=Post+5",
    caption: "Consultation day — the first step to your dream smile.",
    url: "https://www.instagram.com/dr.firaszoghieb",
  },
  {
    image: "https://placehold.co/600x600/154460/ffffff?text=Post+6",
    caption: "Teeth whitening results — patients love it! ⭐",
    url: "https://www.instagram.com/dr.firaszoghieb",
  },
];

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default async function InstagramFeed() {
  const dbSettings = await getSettings();
  const settings = { ...DEFAULT_SETTINGS, ...dbSettings };

  if (settings.instagramEnabled === "false") return null;

  const handle = settings.instagramHandle || "dr.firaszoghieb";
  const profileUrl = `https://www.instagram.com/${handle}`;
  const followers = settings.instagramFollowers || "";
  const bio = settings.instagramBio || "Cosmetic Dentist · Composite Bonding · Invisalign · Veneers ✨";

  let posts: InstaPost[] = PLACEHOLDER_POSTS;
  const stored = settings.instagramPosts;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) posts = parsed;
    } catch {
      // fall back to placeholders
    }
  }

  const displayPosts = posts.slice(0, 6);

  return (
    <section className="py-20 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            Follow Along
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Instagram
          </h2>

          {/* Profile card */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-5 bg-[#141414] border border-[#232323] rounded-2xl px-8 py-5">
            {/* Avatar with gradient ring */}
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-full p-[2px] bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]"
              >
                <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DF</span>
                </div>
              </div>
            </div>

            {/* Profile info */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span
                  className="font-bold text-white text-lg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  @{handle}
                </span>
                {/* Verified badge */}
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
                </svg>
              </div>
              <p className="text-sm text-white/40 max-w-xs">{bio}</p>
              {followers && (
                <p className="text-sm font-semibold text-[#c9a84c] mt-1">{followers} followers</p>
              )}
            </div>

            {/* Follow button */}
            <Link
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]"
            >
              <InstagramIcon className="w-4 h-4" />
              Follow
            </Link>
          </div>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {displayPosts.map((post, i) => (
            <Link
              key={i}
              href={post.url || profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#1a1a1a] block"
              aria-label={post.caption || `Instagram post ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.caption || `Instagram post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-xs leading-snug line-clamp-3">
                  {post.caption}
                </p>
              </div>

              {/* Instagram icon badge */}
              <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <InstagramIcon className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-opacity hover:opacity-90 shadow-lg bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]"
          >
            <InstagramIcon className="w-5 h-5" />
            Follow @{handle} on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
