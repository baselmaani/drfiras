import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { GoogleReviewsForm } from "@/components/dashboard/GoogleReviewsForm";

export default async function GoogleReviewsPage() {
  const raw = await getSettings();
  const values = { ...DEFAULT_SETTINGS, ...raw };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Google Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the Google Reviews section — show/hide it, set the rating, and add custom review cards.</p>
      </div>
      <GoogleReviewsForm values={values} />
    </div>
  );
}
