import type { ThreadGroup } from "~/types/threads";

/** How the Threads page orders its threads, by their latest activity. */
export type ThreadSortOrder = "newest" | "oldest";

export const DEFAULT_THREAD_SORT_ORDER: ThreadSortOrder = "newest";

const STORAGE_KEY_PREFIX = "zedu:threads-sort";

function toTime(value?: string | null): number {
  if (!value) return Number.NaN;
  return new Date(value).getTime();
}

/**
 * The latest activity in a thread group: the newest timestamp across its
 * messages, their replies and their last reply. Groups with no usable date
 * return NaN and are always listed last.
 */
export function threadActivityTime(group: ThreadGroup): number {
  let latest = Number.NaN;
  const consider = (value?: string | null) => {
    const time = toTime(value);
    if (Number.isNaN(time)) return;
    if (Number.isNaN(latest) || time > latest) latest = time;
  };

  for (const message of group.thread_messages ?? []) {
    consider(message.created_at);
    consider(message.updated_at);
    consider(message.last_reply);
    for (const reply of message.messages ?? []) consider(reply.created_at);
    for (const reply of message.preview_reply ?? []) {
      consider(reply.created_at);
    }
  }
  return latest;
}

/**
 * Returns the groups ordered by latest activity: newest first or oldest
 * first. The sort is stable, so groups with the same time keep the order
 * the server sent them in. The input array is not changed.
 */
export function sortThreadGroups(
  groups: ThreadGroup[],
  order: ThreadSortOrder
): ThreadGroup[] {
  const direction = order === "oldest" ? 1 : -1;
  return groups
    .map((group, index) => ({ group, index, time: threadActivityTime(group) }))
    .sort((a, b) => {
      const aMissing = Number.isNaN(a.time);
      const bMissing = Number.isNaN(b.time);
      if (aMissing || bMissing) {
        if (aMissing && bMissing) return a.index - b.index;
        return aMissing ? 1 : -1;
      }
      if (a.time !== b.time) return (a.time - b.time) * direction;
      return a.index - b.index;
    })
    .map(({ group }) => group);
}

function storageKey(orgId: string) {
  return `${STORAGE_KEY_PREFIX}:${orgId || "default"}`;
}

/** The sort order saved for this organisation, or the default. */
export function readThreadSortOrder(orgId: string): ThreadSortOrder {
  try {
    const saved = localStorage.getItem(storageKey(orgId));
    return saved === "oldest" || saved === "newest"
      ? saved
      : DEFAULT_THREAD_SORT_ORDER;
  } catch {
    return DEFAULT_THREAD_SORT_ORDER;
  }
}

/** Remembers the sort order for this organisation across refreshes. */
export function saveThreadSortOrder(orgId: string, order: ThreadSortOrder) {
  try {
    localStorage.setItem(storageKey(orgId), order);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // choice then lasts for this visit only.
  }
}
