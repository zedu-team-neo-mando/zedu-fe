import type {
  ThreadGroup,
  ThreadMention,
  ThreadMessage,
} from "~/types/threads";
import { getThreadGroupChannelLink } from "~/utils/org-threads";

/** Where a thread on the Threads page should open: the thread and, if any, one reply in it. */
export interface ThreadMentionTarget {
  threadId: string;
  /** The reply to scroll to, or null to open the thread at its start. */
  messageId: string | null;
}

type ReplyWithMentions = {
  id?: string;
  created_at?: string;
  mentions?: ThreadMention[];
};

function mentionsUser(mentions: ThreadMention[] | undefined, userId: string) {
  return Boolean(
    userId && mentions?.some((mention) => String(mention?.id) === userId)
  );
}

/**
 * The reply to land on when opening a thread from the Threads page: the newest
 * reply that mentions the signed-in user. When no reply mentions them (they
 * were mentioned in the root message, started the thread or replied), the
 * thread opens at its start.
 */
export function threadMentionTarget(
  item: Pick<ThreadMessage, "thread_id"> & {
    messages?: ReplyWithMentions[];
    preview_reply?: ReplyWithMentions[];
  },
  userId: string | undefined | null
): ThreadMentionTarget {
  const id = String(userId ?? "");
  const seen = new Set<string>();
  const replies = [...(item.messages ?? []), ...(item.preview_reply ?? [])]
    .filter((reply) => {
      if (!reply?.id || seen.has(reply.id)) return false;
      seen.add(reply.id);
      return mentionsUser(reply.mentions, id);
    })
    .sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
    );

  return { threadId: item.thread_id, messageId: replies[0]?.id ?? null };
}

/** The query string that opens a thread (and scrolls to a reply) where it is read. */
export function threadTargetQuery(target: ThreadMentionTarget): string {
  const query = new URLSearchParams();
  if (target.threadId) query.set("thread_id", target.threadId);
  if (target.messageId) query.set("message_id", target.messageId);
  const value = query.toString();
  return value ? `?${value}` : "";
}

/**
 * The link to the thread's message in its own conversation (channel, group or
 * DM), opening the thread and scrolling to the target reply. Null when the
 * conversation is unknown.
 */
export function threadConversationHref(
  orgSlug: string,
  group: ThreadGroup,
  target: ThreadMentionTarget
): string | null {
  if (!orgSlug) return null;
  const query = threadTargetQuery(target);
  const channelLink = getThreadGroupChannelLink(orgSlug, group);
  if (channelLink?.href) return `${channelLink.href}${query}`;

  const root = group.thread_messages?.[0];
  const channelType = (
    group.channel_type ??
    root?.channel_type ??
    ""
  ).toLowerCase();
  if (channelType === "dm" && root?.channels_id) {
    return `/${orgSlug}/dms/${root.channels_id}${query}`;
  }
  return null;
}
