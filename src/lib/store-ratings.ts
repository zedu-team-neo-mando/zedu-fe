/**
 * Store ratings shown on the marketing site (footer and home hero).
 *
 * There is no API to fetch these at build time, so they are copied by hand from the store
 * pages. Update `lastChecked` whenever you change a number.
 * - App Store: the iTunes lookup API for the app id from `appStoreAppId()` in `~/lib/env-urls`
 *   (`averageUserRating` and `userRatingCount`).
 * - Google Play: the store page itself; there is no official API.
 *
 * The store pages come from `appStoreUrl()` and `playStoreUrl()` in `~/lib/env-urls`, which
 * read NEXT_PUBLIC_APP_STORE_URL and NEXT_PUBLIC_PLAY_STORE_URL. The links people click come
 * from `storeLink()` in the same file.
 */
export type StoreKey = "app" | "play";

export type StoreRating = {
  /** The store's official name. */
  name: string;
  /** Average rating, as the store shows it. */
  rating: string;
  count: number;
  /** What the store calls a rating: "rating" on the App Store, "review" on Google Play. */
  countLabel: string;
  /** Date the numbers were last compared with the store page (YYYY-MM-DD). */
  lastChecked: string;
};

export const storeRatings: Record<StoreKey, StoreRating> = {
  app: {
    name: "App Store",
    rating: "5.0",
    count: 1,
    countLabel: "rating",
    lastChecked: "2026-10-31",
  },
  play: {
    name: "Google Play",
    rating: "4.9",
    count: 11,
    countLabel: "review",
    lastChecked: "2026-10-31",
  },
};

/** "4.9 · 11 reviews" or "5.0 · 1 rating". */
export function ratingSummary({
  rating,
  count,
  countLabel,
}: StoreRating): string {
  return `${rating} · ${count} ${countLabel}${count === 1 ? "" : "s"}`;
}
