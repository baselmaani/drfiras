import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { getLiveGoogleReviews } from "@/lib/googlePlaces";
import { ReviewAvatar } from "@/components/ReviewAvatar";
import Link from "next/link";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  photoUrl?: string;
  profileUrl?: string;
  reviewImageUrl?: string;
}

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

export default async function GoogleReviews() {
  const dbSettings = await getSettings();
  const settings = { ...DEFAULT_SETTINGS, ...dbSettings };

  if (settings.googleReviewsEnabled === "false") return null;

  const live = settings.googlePlaceId
    ? await getLiveGoogleReviews(settings.googlePlaceId)
    : null;

  let rating = parseFloat(settings.googleRating ?? "5.0");
  let reviewCount: string = settings.googleReviewCount ?? "100+";
  let reviews: Review[] = [];
  let isLive = false;

  if (live && live.reviews.length > 0) {
    rating = live.rating;
    reviewCount = String(live.reviewCount);
    reviews = live.reviews.map((r) => ({
      name: r.name,
      rating: r.rating,
      text: r.text,
      date: r.relativeTime,
      photoUrl: r.photoUrl,
      profileUrl: r.profileUrl,
      reviewImageUrl: settings[`reviewPhoto__${r.reviewId}`] || undefined,
    }));
    isLive = true;
  } else {
    const stored = settings.googleReviews;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Skip blank/test entries saved from the dashboard
        if (Array.isArray(parsed)) reviews = parsed.filter((r) => r?.name && r?.text?.trim());
      } catch {
        // fall back to defaults
      }
    }
  }

  // Only real reviews are shown — never placeholder testimonials
  if (reviews.length === 0) return null;

  const reviewsUrl = live?.mapsUri ?? settings.googleReviewsUrl ?? "#";
  const displayReviews = reviews.slice(0, 6);

  return (
    <section className="py-24 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[#c9a84c] text-[11px] font-semibold uppercase tracking-[0.28em] mb-3">
            Patient Reviews
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#f3e3bb] via-[#c9a84c] to-[#f3e3bb] bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Our Patients Say
          </h2>

          {/* Rating badge */}
          <div className="inline-flex items-center gap-4 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-md border border-[#c9a84c]/20 rounded-2xl px-7 py-5 shadow-[0_0_50px_-12px_rgba(201,168,76,0.4)]">
            <GoogleLogo />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">{rating.toFixed(1)}</span>
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
              <p className="text-sm text-white/35 mt-0.5">
                {reviewCount} Google reviews
                {isLive && <span className="text-[#34A853]"> · Live</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {displayReviews.map((review, i) => {
            const card = (
              <div className="relative overflow-hidden bg-[#141414] rounded-2xl p-6 flex flex-col gap-4 border border-[#1e1e1e] hover:border-[#c9a84c]/25 hover:-translate-y-1 hover:shadow-[0_20px_45px_-18px_rgba(201,168,76,0.3)] transition-all duration-300 h-full">
                {/* Decorative quote glyph */}
                <svg
                  className="absolute -top-3 right-4 w-16 h-16 text-white/[0.04]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>

                {/* Header: avatar + name + stars */}
                <div className="relative flex items-center gap-3">
                  <ReviewAvatar name={review.name} photoUrl={review.photoUrl} colorIndex={i} />
                  <div className="min-w-0">
                    <p className="font-semibold text-white/80 text-sm truncate">{review.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={review.rating} />
                      {isLive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-1.5 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <GoogleLogo />
                  </div>
                </div>

                {/* Photo the patient attached to their review */}
                {review.reviewImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.reviewImageUrl}
                    alt={`Photo shared by ${review.name}`}
                    className="relative w-full h-44 object-cover rounded-xl"
                  />
                )}

                {/* Review text */}
                <p className="relative text-white/45 text-sm leading-relaxed flex-1">&ldquo;{review.text}&rdquo;</p>

                {/* Date */}
                <p className="relative text-xs text-white/25">{review.date}</p>
              </div>
            );

            return review.profileUrl ? (
              <Link
                key={i}
                href={review.profileUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block"
              >
                {card}
              </Link>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>

        {/* CTA */}
        {reviewsUrl && reviewsUrl !== "#" && (
          <div className="text-center">
            <Link
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 border border-[#c9a84c]/40 text-[#c9a84c] px-7 py-3 rounded-full font-semibold text-sm hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 hover:shadow-[0_10px_35px_-12px_rgba(201,168,76,0.45)] transition-all duration-300"
            >
              <GoogleLogo />
              Read all {reviewCount} reviews on Google
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
