"use client";
import { useActionState, useState } from "react";
import { updateSettings } from "@/lib/actions/settings";

type Values = Record<string, string>;

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
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

export function GoogleReviewsForm({ values }: { values: Values }) {
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Review Count</label>
            <input name="googleReviewCount" defaultValue={values.googleReviewCount ?? ""} className={cls} placeholder="248" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Reviews URL</label>
            <input name="googleReviewsUrl" defaultValue={values.googleReviewsUrl ?? ""} className={cls} placeholder="https://g.page/r/.../review" />
            <p className="text-xs text-gray-400 mt-1">Link users to leave or read reviews on Google.</p>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Custom Reviews</h3>
          <button
            type="button"
            onClick={addReview}
            className="text-xs font-semibold text-[#1b4f72] border border-[#1b4f72]/30 px-3 py-1.5 rounded-lg hover:bg-[#1b4f72]/5 transition-colors"
          >
            + Add Review
          </button>
        </div>
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
