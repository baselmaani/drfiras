import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { getLiveGoogleReviews } from "@/lib/googlePlaces";
import { GoogleReviewsForm } from "@/components/dashboard/GoogleReviewsForm";

export default async function GoogleReviewsPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  const live = values.googlePlaceId ? await getLiveGoogleReviews(values.googlePlaceId) : null;
  const liveReviews = (live?.reviews ?? []).map((r) => ({
    reviewId: r.reviewId,
    name: r.name,
    snippet: r.text.length > 80 ? `${r.text.slice(0, 80)}…` : r.text,
    reviewUrl: r.reviewUrl,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Google Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the Google Reviews section — connect your real Google Business Profile for live reviews, or show/hide the section and add custom fallback cards.</p>
      </div>
      <GoogleReviewsForm values={values} liveReviews={liveReviews} />
    </div>
  );
}
