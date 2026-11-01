// Public, versioned storage namespaces. Existing saved choices keep their keys.
const STORAGE_VERSION = 1;
export const CAMPAIGN_KEY = `zedu:campaign-attribution:v${STORAGE_VERSION}`;
export const CONSENT_KEY = `zedu:campaign-consent:v${STORAGE_VERSION}`;
export const ATTRIBUTION_WINDOW = 30 * 24 * 60 * 60 * 1000;
const fields = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
const safeLabel = /^[A-Za-z0-9 _./:-]{1,100}$/;
const uuid =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
export type Campaign = Partial<Record<(typeof fields)[number], string>> & {
  visit_id: string;
  captured_at: number;
  consent: true;
};
export type Consent = "granted" | "denied" | "unknown";
let fallbackConsent: Exclude<Consent, "unknown"> | undefined;

function storage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}
export function campaignConsent(store = storage()): Consent {
  if (fallbackConsent) return fallbackConsent;
  try {
    const value = store?.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : "unknown";
  } catch {
    return "unknown";
  }
}
export function setCampaignConsent(
  value: Exclude<Consent, "unknown">,
  store = storage()
) {
  // Honor the current choice even if the browser refuses to persist it.
  fallbackConsent = value;
  try {
    if (store) {
      store.setItem(CONSENT_KEY, value);
      fallbackConsent = undefined;
    }
  } catch {
    /* optional storage */
  }
  if (value !== "granted") {
    try {
      store?.removeItem(CAMPAIGN_KEY);
    } catch {
      /* optional storage */
    }
  }
}
export function validCampaign(
  value: unknown,
  now = Date.now()
): value is Campaign {
  if (!value || typeof value !== "object") return false;
  const a = value as Campaign;
  return (
    a.consent === true &&
    typeof a.visit_id === "string" &&
    a.visit_id.length === 36 &&
    uuid.test(a.visit_id) &&
    Number.isSafeInteger(a.captured_at) &&
    a.captured_at <= now &&
    now - a.captured_at <= ATTRIBUTION_WINDOW &&
    !!a.utm_source &&
    fields.every(
      (field) =>
        a[field] === undefined ||
        (typeof a[field] === "string" &&
          safeLabel.test(a[field]!) &&
          a[field] === a[field]!.trim())
    )
  );
}
export function readCampaign(
  store = storage(),
  now = Date.now()
): Campaign | undefined {
  try {
    if (campaignConsent(store) !== "granted") {
      store?.removeItem(CAMPAIGN_KEY);
      return;
    }
    const value: unknown = JSON.parse(store?.getItem(CAMPAIGN_KEY) || "null");
    if (validCampaign(value, now)) {
      const clean: Campaign = {
        visit_id: value.visit_id,
        captured_at: value.captured_at,
        consent: true,
      };
      for (const field of fields) {
        if (value[field] !== undefined) clean[field] = value[field];
      }
      return clean;
    }
    store?.removeItem(CAMPAIGN_KEY);
  } catch {
    /* blocked/corrupt storage never affects the business flow */
  }
}
export function captureCampaign(
  search: string,
  store = storage(),
  now = Date.now(),
  makeId: () => string = () => crypto.randomUUID()
): Campaign | undefined {
  if (campaignConsent(store) !== "granted") return;
  const existing = readCampaign(store, now);
  if (existing) return existing;
  try {
    const params = new URLSearchParams(search);
    const value: Record<string, unknown> = {
      visit_id: makeId(),
      captured_at: now,
      consent: true,
    };
    for (const field of fields) {
      const raw = params.get(field);
      if (raw?.trim()) value[field] = raw.trim();
    }
    if (!validCampaign(value, now)) return;
    store?.setItem(CAMPAIGN_KEY, JSON.stringify(value));
    return value;
  } catch {
    return;
  }
}
// Read immediately before a request so withdrawal and expiry take effect.
export function campaignPayload(): { campaign?: Campaign } {
  const campaign = readCampaign();
  return campaign ? { campaign } : {};
}
const reported = new Set<string>();
export async function reportCampaignVisit(campaign: Campaign) {
  if (campaignConsent() !== "granted" || !validCampaign(campaign)) return;
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (!base || reported.has(campaign.visit_id)) return;
  try {
    const response = await fetch(`${base}/campaign/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaign),
      keepalive: true,
    });
    if (response.ok) reported.add(campaign.visit_id);
  } catch {
    /* never interrupt signup for analytics */
  }
}
