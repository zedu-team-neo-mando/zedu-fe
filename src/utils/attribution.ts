export const ATTRIBUTION_STORAGE_KEY = "zedu_utm_attribution";

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
] as const;

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number];
export type Attribution = Partial<Record<AttributionParam, string>>;

// Long enough for any real campaign name, short enough to keep a crafted link
// from stuffing the registration webhook.
const MAX_VALUE_LENGTH = 200;

const ATTRIBUTION_LABELS: Record<AttributionParam, string> = {
  utm_source: "UTM Source",
  utm_medium: "UTM Medium",
  utm_campaign: "UTM Campaign",
  utm_content: "UTM Content",
  utm_term: "UTM Term",
  ref: "Referral",
};

/**
 * Reads the campaign parameters from a query string such as
 * `?utm_source=twitter&utm_campaign=october_cohort`. Returns null when the
 * query string has none, so a visit without a campaign link never replaces an
 * earlier one.
 */
export const readAttributionParams = (search: string): Attribution | null => {
  const params = new URLSearchParams(search);
  const attribution: Attribution = {};

  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key)?.trim();
    if (value) {
      attribution[key] = value.slice(0, MAX_VALUE_LENGTH);
    }
  }

  return Object.keys(attribution).length > 0 ? attribution : null;
};

/**
 * Parses a saved attribution value. Anything that is not a JSON object of
 * known string parameters falls back to null, so a corrupt sessionStorage
 * value can never break sign-up.
 */
export const parseStoredAttribution = (
  saved: string | null | undefined
): Attribution | null => {
  if (!saved) return null;
  try {
    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const attribution: Attribution = {};
    for (const key of ATTRIBUTION_PARAMS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string" && value) {
        attribution[key] = value.slice(0, MAX_VALUE_LENGTH);
      }
    }
    return Object.keys(attribution).length > 0 ? attribution : null;
  } catch {
    return null;
  }
};

/**
 * Formats the attribution as extra lines for a webhook message, using the
 * same `\n` separators as the rest of the message. Returns an empty string
 * when there is nothing to add, leaving the message unchanged.
 */
export const formatAttributionMessage = (
  attribution: Attribution | null
): string => {
  if (!attribution) return "";
  return ATTRIBUTION_PARAMS.filter((key) => attribution[key])
    .map((key) => `\\n${ATTRIBUTION_LABELS[key]}: ${attribution[key]}`)
    .join("");
};

// Saves the campaign parameters of the current URL, if it has any. Storage can
// be unavailable (private mode, blocked site data), so failures are ignored.
export const captureAttribution = () => {
  if (typeof window === "undefined") return;
  const attribution = readAttributionParams(window.location.search);
  if (!attribution) return;
  try {
    sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution)
    );
  } catch {
    // ignore storage access errors
  }
};

export const getStoredAttribution = (): Attribution | null => {
  if (typeof window === "undefined") return null;
  try {
    return parseStoredAttribution(
      sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    );
  } catch {
    return null;
  }
};

export const clearStoredAttribution = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
  } catch {
    // ignore storage access errors
  }
};
