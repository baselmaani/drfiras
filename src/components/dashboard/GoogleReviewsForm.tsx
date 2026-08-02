"use client";
import { useActionState, useState } from "react";
import { updateSettings } from "@/lib/actions/settings";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

type Values = Record<string, string>;

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface LiveReviewSummary {
  reviewId: string;
  name: string;
  snippet: string;
  reviewUrl?: string;
}

const cls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 bg-white";

function ReviewCard({
  review, index, onRemove, onChange,
}: {
  review: Review;
  index: number;
  onRemove: () => void;
  onChange: (r: Review) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Review #{index + 1}</span>
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input value={review.name} onChange={e => onChange({ ...review, name: e.target.value })} className={cls} placeholder="Sarah M." />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
          <input value={review.date} onChange={e => onChange({ ...review, date: e.target.value })} className={cls} placeholder="February 2025" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Rating (1–5)</label>
          <select value={review.rating} onChange={e => onChange({ ...review, rating: Number(e.target.value) })} className={cls}>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Review text</label>
        <textarea value={review.text} onChange={e => onChange({ ...review, text: e.target.value })} rows={3} className={`${cls} resize-none`} placeholder="Write the review text…" />
      </div>
    </div>
  );
}

export function GoogleReviewsForm({ values, liveReviews = [] }: { values: Values; liveReviews?: LiveReviewSummary[] }) {
  const [state, formAction, pending] = useActionState(updateSettings, null);

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      return values.googleReviews ? JSON.parse(values.googleReviews) : [];
    } catch { return []; }
  });

  const addReview = () =>
    setReviews(r => [...r, { name: "", rating: 5, text: "", date: "" }]);

  const removeReview = (i: number) =>
    setReviews(r => r.filter((_, idx) => idx !== i));

  const updateReview = (i: number, updated: Review) =>
    setReviews(r => r.map((rev, idx) => (idx === i ? updated : rev)));

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Saved successfully.</div>
      )}
      <input type="hidden" name="googleReviews" value={JSON.stringify(reviews)} />

      {/* Toggle + summary */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Display Settings</h3>
        <div className="flex items-center gap-3">
          <input
            type="hidden"
            name="googleReviewsEnabled"
            value={values.googleReviewsEnabled === "false" ? "false" : "true"}
          />
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              name="googleReviewsEnabled"
              value="true"
              defaultChecked={values.googleReviewsEnabled !== "false"}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#1b4f72]/30 rounded-full peer peer-checked:bg-[#1b4f72] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
            <span className="ml-3 text-sm font-medium text-gray-700">Show Google Reviews section</span>
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Overall Rating</label>
            <input name="googleRating" defaultValue={values.googleRating ?? "5.0"} className={cls} placeholder="5.0" />
            <p className="text-xs text-gray-400 mt-1">Ignored once live reviews are connected below.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Review Count</label>
            <input name="googleReviewCount" defaultValue={values.googleReviewCount ?? ""} className={cls} placeholder="248" />
            <p className="text-xs text-gray-400 mt-1">Ignored once live reviews are connected below.</p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Reviews URL</label>
            <input name="googleReviewsUrl" defaultValue={values.googleReviewsUrl ?? ""} className={cls} placeholder="https://g.page/r/.../review" />
            <p className="text-xs text-gray-400 mt-1">Link users to leave or read reviews on Google. Overridden by the live Google Maps link once connected.</p>
          </div>
        </div>
      </div>

      {/* Live Google connection */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Live Google Reviews (Recommended)</h3>
        <p className="text-sm text-gray-500">
          Connect your real Google Business Profile so the 5 most relevant real reviews (with real names, photos, and ratings) show automatically — refreshed hourly. Google&apos;s API caps this at 5 reviews per business; the rating badge above will still show your true total.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Place ID</label>
          <input name="googlePlaceId" defaultValue={values.googlePlaceId ?? ""} className={cls} placeholder="ChIJ..." />
          <p className="text-xs text-gray-400 mt-1">
            Find it with Google&apos;s{" "}
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/place-id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1b4f72] underline"
            >
              Place ID Finder tool
            </a>
            {" "}— search for the clinic and copy the ID shown.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">One more step (done by a developer, not here):</p>
          <p>
            A <code className="bg-amber-100 px-1 rounded">GOOGLE_PLACES_API_KEY</code> must be set in the server environment. Create it in the{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Cloud Console
            </a>
            : create/select a project, enable &ldquo;Places API (New)&rdquo;, create an API key restricted to that API, and add it to the site&apos;s <code className="bg-amber-100 px-1 rounded">.env</code> file. Until this key is set, the custom reviews below (or default placeholders) are shown instead.
          </p>
        </div>
      </div>

      {/* Attach review photos */}
      {liveReviews.length > 0 && (
        <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Attach Review Photos</h3>
          <p className="text-sm text-gray-500">
            Google doesn&apos;t give us access to photos a customer attaches inside their review — only their profile picture. To feature one anyway: open the review on Google Maps, save the photo the patient posted, then upload it here against that exact review.
          </p>
          <div className="space-y-4">
            {liveReviews.map((r) => (
              <div key={r.reviewId} className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">&ldquo;{r.snippet}&rdquo;</p>
                  </div>
                  {r.reviewUrl && (
                    <a
                      href={r.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#1b4f72] underline whitespace-nowrap"
                    >
                      View on Google Maps ↗
                    </a>
                  )}
                </div>
                <ImageUpload
                  name={`reviewPhoto__${r.reviewId}`}
                  defaultValue={values[`reviewPhoto__${r.reviewId}`] ?? ""}
                  label="Attached photo (optional)"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">If a review later drops out of Google&apos;s top 5, its photo simply goes unused — attach a new one to whichever review replaces it.</p>
        </div>
      )}

      {/* Reviews list */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Fallback Reviews</h3>
          <button
            type="button"
            onClick={addReview}
            className="text-xs font-semibold text-[#1b4f72] border border-[#1b4f72]/30 px-3 py-1.5 rounded-lg hover:bg-[#1b4f72]/5 transition-colors"
          >
            + Add Review
          </button>
        </div>
        <p className="text-xs text-gray-400">Used only when a live Google Place ID above isn&apos;t connected or the live fetch fails.</p>
        {reviews.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No custom reviews yet — default placeholders will be shown.</p>
        )}
        {reviews.map((r, i) => (
          <ReviewCard key={i} review={r} index={i} onRemove={() => removeReview(i)} onChange={u => updateReview(i, u)} />
        ))}
      </div>

      <button type="submit" disabled={pending} className="bg-[#1b4f72] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60">
        {pending ? "Saving…" : "Save Google Reviews"}
      </button>
    </form>
  );
}
