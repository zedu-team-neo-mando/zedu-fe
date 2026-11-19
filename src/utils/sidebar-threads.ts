import type { ThreadGroup } from "~/types/threads";
import { stripHtmlAndDecode } from "~/lib/search/format";
import { getThreadGroupChannelLink } from "~/utils/org-threads";

/** How many threads the sidebar lists; the full list is on the Threads page. */
export const SIDEBAR_THREADS_LIMIT = 20;

export type SidebarThreadKind = "channel" | "private" | "dm" | "group";

export type SidebarThread = {
  id: string;
  kind: SidebarThreadKind;
  channelName: string;
  preview: string;
  replyCount: number;
  /** Latest activity in ms, or 0 when the thread has no usable date. */
  lastActivity: number;
  href: string | null;
};

const toTime = (value?: string | null) => {
  const time = value ? Date.parse(value) : NaN;
  return Number.isNaN(time) ? 0 : time;
};

/** The newest date on a thread: last reply, edit, message or reply time. */
export function sidebarThreadActivity(group: ThreadGroup): number {
  let latest = 0;
  for (const message of group.thread_messages || []) {
    latest = Math.max(
      latest,
      toTime(message.last_reply),
      toTime(message.updated_at),
      toTime(message.created_at)
    );
    for (const reply of [
      ...(message.messages || []),
      ...(message.preview_reply || []),
    ]) {
      latest = Math.max(
        latest,
        toTime(reply.created_at),
        toTime(reply.updated_at)
      );
    }
  }
  return latest;
}

const kindOf = (group: ThreadGroup): SidebarThreadKind => {
  const type = (
    group.channel_type ??
    group.thread_messages?.[0]?.channel_type ??
    ""
  )
    .toLowerCase()
    .replace(/[\s_-]/g, "");
  if (type === "dm" || type === "directmessage") return "dm";
  if (type === "groupdm" || type === "groupdirectmessage") return "group";
  if (type === "private" || type === "privatechannel") return "private";
  return "channel";
};

/**
 * One sidebar row for a thread group: where it is, a one-line preview of the
 * message that started it, its reply count, and a link that opens the
 * conversation with that thread open (`thread_id`).
 */
export function toSidebarThread(
  orgSlug: string,
  group: ThreadGroup
): SidebarThread | null {
  const root = group.thread_messages?.[0];
  const id = group.thread_id ?? root?.thread_id;
  if (!root || !id) return null;

  const kind = kindOf(group);
  const conversationHref =
    getThreadGroupChannelLink(orgSlug, group)?.href ??
    (kind === "dm" && root.channels_id && orgSlug
      ? `/${orgSlug}/dms/${root.channels_id}`
      : null);

  return {
    id,
    kind,
    channelName:
      group.channel_name || root.channel_name || group.participants || "",
    preview:
      stripHtmlAndDecode(root.message || "").trim() ||
      (root.media?.length ? "Attachment" : ""),
    replyCount: Number(root.message_count) || 0,
    lastActivity: sidebarThreadActivity(group),
    href: conversationHref
      ? `${conversationHref}?thread_id=${encodeURIComponent(id)}`
      : null,
  };
}

/** The sidebar's rows: one per thread, newest activity first, at most `limit`. */
export function sidebarThreads(
  orgSlug: string,
  groups: ThreadGroup[] | null | undefined,
  limit = SIDEBAR_THREADS_LIMIT
): SidebarThread[] {
  const seen = new Set<string>();
  const rows: SidebarThread[] = [];
  for (const group of groups || []) {
    const row = toSidebarThread(orgSlug, group);
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    rows.push(row);
  }
  return rows.sort((a, b) => b.lastActivity - a.lastActivity).slice(0, limit);
}

/*
 * Unread state per thread. The threads endpoint returns only a total
 * (`unseen_thread_count`), so the sidebar remembers, per organisation in this
 * browser, the latest activity it has shown the user for each thread. A thread
 * is unread when it has activity newer than that. The first time, everything
 * listed counts as seen, so the list doesn't start with every thread marked.
 */
type SeenMap = Record<string, number>;

const seenKey = (orgId: string) => `zedu:sidebar-threads-seen:${orgId}`;

export function readSeenThreads(orgId: string): SeenMap | null {
  if (!orgId) return null;
  try {
    const raw = localStorage.getItem(seenKey(orgId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as SeenMap)
      : null;
  } catch {
    return null;
  }
}

export function saveSeenThreads(orgId: string, seen: SeenMap) {
  if (!orgId) return;
  try {
    localStorage.setItem(seenKey(orgId), JSON.stringify(seen));
  } catch {
    // Storage full or blocked: unread dots just won't survive a refresh.
  }
}

/** Marks these rows as seen at their current activity. */
export function markThreadsSeen(
  seen: SeenMap,
  rows: Pick<SidebarThread, "id" | "lastActivity">[]
): SeenMap {
  const next = { ...seen };
  for (const row of rows) {
    next[row.id] = Math.max(next[row.id] ?? 0, row.lastActivity);
  }
  return next;
}

export function isThreadUnread(
  seen: SeenMap | null,
  row: Pick<SidebarThread, "id" | "lastActivity">
): boolean {
  if (!seen) return false;
  const last = seen[row.id];
  return last === undefined ? row.lastActivity > 0 : row.lastActivity > last;
}
