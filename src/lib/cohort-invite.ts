export const COHORT_REF = "cohort_share";

export const REFERRAL_PARAM_KEYS = [
  "ref",
  "channel_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "inviter",
  "cohort",
] as const;

type SearchReader = { get(name: string): string | null };

export function displayLabel(
  value: string | null | undefined,
  fallback: string,
  max = 80
): string {
  const clean = (value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  return clean || fallback;
}

function publicUrl(hostAndPath: string): string {
  return "https:" + "//" + hostAndPath;
}

export function withCohortReferral(
  invitationLink: string,
  details: { channelId: string; inviter: string; cohort: string; base?: string }
): string {
  const url = new URL(invitationLink, details.base ?? publicUrl("zedu.chat"));
  url.searchParams.set("ref", COHORT_REF);
  url.searchParams.set(
    "channel_id",
    displayLabel(details.channelId, "channel")
  );
  url.searchParams.set("utm_source", COHORT_REF);
  url.searchParams.set("utm_medium", "peer");
  url.searchParams.set("utm_campaign", "cohort_invite");
  url.searchParams.set("inviter", displayLabel(details.inviter, "a classmate"));
  url.searchParams.set("cohort", displayLabel(details.cohort, "a cohort"));
  return url.toString();
}

export function cohortInviteMessage(
  link: string,
  inviter: string,
  cohort: string
): string {
  return `You've been invited by ${displayLabel(inviter, "a classmate")} to join ${displayLabel(cohort, "a cohort")} on Zedu. Join here: ${link}`;
}

export function shareTargets(message: string, link: string) {
  const text = encodeURIComponent(message);
  const url = encodeURIComponent(link);
  return {
    whatsapp: publicUrl(`wa.me/?text=${text}`),
    telegram: publicUrl(`t.me/share/url?url=${url}&text=${text}`),
    x: publicUrl(`twitter.com/intent/tweet?text=${text}`),
  };
}

export function preserveReferralParams(
  current: SearchReader,
  base: URLSearchParams
): URLSearchParams {
  const next = new URLSearchParams(base);
  for (const key of REFERRAL_PARAM_KEYS) {
    const value = current.get(key);
    if (value) next.set(key, value);
  }
  return next;
}

export function cohortBanner(params: {
  ref: string | null;
  inviter: string | null;
  cohort: string | null;
  organisation: string | null;
}): string | null {
  if (params.ref !== COHORT_REF && !params.inviter && !params.cohort)
    return null;
  return `You've been invited by ${displayLabel(params.inviter, "a classmate")} to join ${displayLabel(params.cohort, displayLabel(params.organisation, "this cohort"))} on Zedu`;
}

export function trackCohortInvite(
  event: "invite_generated" | "invite_link_clicked" | "invite_signup_completed",
  params: Record<string, string>
) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
    .gtag;
  gtag?.("event", event, params);
}
