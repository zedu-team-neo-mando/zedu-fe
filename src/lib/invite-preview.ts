// Pure helpers for the workspace-specific link preview on invitation pages.
// Kept free of imports so the node test runner can load this file directly.

/** Below this many members the preview invites people to be early instead. */
export const MIN_MEMBERS_FOR_COUNT = 5;

/** Longest workspace name drawn on the share image before it is cut short. */
export const MAX_IMAGE_NAME_LENGTH = 48;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isOrgId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/**
 * Member count from the backend's `org_user_info` sentence, which is built as
 * "A is in…", "A and B are in…" or "A, B and N others are in…".
 * Returns null when the sentence has no count we can trust.
 */
export function memberCountFromOrgInfo(info: unknown): number | null {
  if (typeof info !== "string") return null;
  const text = info.trim();

  const others = text.match(/ and (\d+) others? (?:is|are) in /);
  if (others) return Number(others[1]) + 2;
  if (/^[^,]+ and [^,]+ are in /.test(text)) return 2;
  if (/^[^,]+ is in /.test(text)) return 1;
  return null;
}

/** Capitalises the first letter, matching how the invite page shows the name. */
export function formatOrgName(name: unknown): string {
  if (typeof name !== "string") return "";
  const trimmed = name.trim().replace(/\s+/g, " ");
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function truncateName(
  name: string,
  max = MAX_IMAGE_NAME_LENGTH
): string {
  return name.length > max ? `${name.slice(0, max - 1).trimEnd()}…` : name;
}

export type InvitePreviewCopy = {
  title: string;
  description: string;
  countLine: string;
};

/** Title, description and image line for a workspace invite. */
export function invitePreviewCopy(
  orgName: string,
  memberCount: number | null
): InvitePreviewCopy {
  const showCount =
    memberCount !== null && memberCount >= MIN_MEMBERS_FOR_COUNT;
  const countLine = showCount
    ? `${memberCount.toLocaleString("en-US")} people are already in`
    : `Be one of the first to join ${orgName}`;

  return {
    title: `Join ${orgName} on Zedu`,
    description: `${countLine}. Accept your invite to chat, share files and learn together.`,
    countLine,
  };
}
