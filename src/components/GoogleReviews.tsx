import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import Link from "next/link";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Absolutely amazing experience. Dr. Firas transformed my smile with composite bonding in a single visit. The results are beyond what I imagined — completely natural-looking. I couldn't be happier.",
    date: "February 2025",
  },
  {
    name: "James T.",
    rating: 5,
    text: "I had Invisalign treatment over 10 months and the whole process was seamless. Dr. Firas is incredibly professional and attentive. My teeth are perfectly aligned now and I feel so much more confident.",
    date: "January 2025",
  },
  {
    name: "Layla K.",
    rating: 5,
    text: "I was nervous about getting veneers but Dr. Firas put me completely at ease. The consultation was thorough, the procedure was painless, and the final result is stunning. Highly recommend!",
    date: "December 2024",
  },
  {
    name: "Omar H.",
    rating: 5,
    text: "Best dental experience I've ever had. The clinic is spotless, the team is warm, and Dr. Firas genuinely cares about getting the best outcome for each patient. My bonding looks perfect.",
    date: "November 2024",
  },
  {
    name: "Priya S.",
    rating: 5,
    text: "Dr. Firas is a true artist. I came in feeling self-conscious about a gap in my front teeth — left with a beautiful, confident smile. The whole appointment took just over an hour. Worth every penny.",
    date: "October 2024",
  },
  {
    name: "Daniel R.",
    rating: 5,
    text: "Exceptional care from start to finish. Dr. Firas took time to explain every step and made sure I was comfortable throughout. The results speak for themselves — completely life-changing.",
    date: "September 2024",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= rating ? "text-[#fbbc04]" : "text-white/10"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export default async function GoogleReviews() {
  const dbSettings = await getSettings();
  const settings = { ...DEFAULT_SETTINGS, ...dbSettings };

  if (settings.googleReviewsEnabled === "false") return null;

  const rating = parseFloat(settings.googleRating ?? "5.0");
  const reviewCount = settings.googleReviewCount ?? "100+";
  const reviewsUrl = settings.googleReviewsUrl ?? "#";

  let reviews: Review[] = DEFAULT_REVIEWS;
  const stored = settings.googleReviews;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) reviews = parsed;
    } catch {
      // fall back to defaults
    }
  }

  const displayReviews = reviews.slice(0, 6);

  return (
    <section className="py-20 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            Patient Reviews
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Our Patients Say
          </h2>

          {/* Rating badge */}
          <div className="inline-flex items-center gap-4 bg-[#141414] border border-[#232323] rounded-2xl px-6 py-4">
            <GoogleLogo />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{rating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className={`w-5 h-5 ${s <= Math.round(rating) ? "text-[#fbbc04]" : "text-white/10"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/35 mt-0.5">{reviewCount} Google reviews</p>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {displayReviews.map((review, i) => (
            <div
              key={i}
              className="bg-[#141414] rounded-2xl p-6 flex flex-col gap-4 border border-[#1e1e1e] hover:border-[#232323] transition-colors"
            >
              {/* Header: avatar + name + stars */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  }`}
                >
                  {getInitials(review.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white/80 text-sm truncate">{review.name}</p>
                  <StarRating rating={review.rating} />
                </div>
                <div className="ml-auto flex-shrink-0">
                  <GoogleLogo />
                </div>
              </div>

              {/* Review text */}
              <p className="text-white/45 text-sm leading-relaxed flex-1">&ldquo;{review.text}&rdquo;</p>

              {/* Date */}
              <p className="text-xs text-white/25">{review.date}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {reviewsUrl && reviewsUrl !== "#" && (
          <div className="text-center">
            <Link
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-[#c9a84c]/40 text-[#c9a84c] px-7 py-3 rounded-full font-semibold text-sm hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors"
            >
              <GoogleLogo />
              Read all {reviewCount} reviews on Google
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
