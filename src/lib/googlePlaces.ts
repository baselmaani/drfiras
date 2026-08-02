export interface LiveReview {
  reviewId: string;
  name: string;
  rating: number;
  text: string;
  relativeTime: string;
  photoUrl?: string;
  profileUrl?: string;
  reviewUrl?: string;
}

export interface LiveGoogleReviewsData {
  rating: number;
  reviewCount: number;
  reviews: LiveReview[];
  mapsUri?: string;
}

interface PlacesApiAuthorAttribution {
  displayName?: string;
  photoUri?: string;
  uri?: string;
}

interface PlacesApiReview {
  name?: string;
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: PlacesApiAuthorAttribution;
  googleMapsUri?: string;
}

interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesApiReview[];
}

export async function getLiveGoogleReviews(
  placeId: string
): Promise<LiveGoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;

    const data: PlacesApiResponse = await res.json();
    if (typeof data.rating !== "number") return null;

    const reviews: LiveReview[] = (data.reviews ?? [])
      .filter((r) => r.name && r.authorAttribution?.displayName && r.text?.text)
      .map((r) => ({
        reviewId: r.name!,
        name: r.authorAttribution!.displayName!,
        rating: r.rating ?? 5,
        text: r.text!.text!,
        relativeTime: r.relativePublishTimeDescription ?? "",
        photoUrl: r.authorAttribution?.photoUri,
        profileUrl: r.authorAttribution?.uri,
        reviewUrl: r.googleMapsUri,
      }));

    return {
      rating: data.rating,
      reviewCount: data.userRatingCount ?? 0,
      reviews,
      mapsUri: data.googleMapsUri,
    };
  } catch {
    return null;
  }
}
