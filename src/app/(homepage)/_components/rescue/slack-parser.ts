export interface SlackUser {
  id: string;
  name: string;
  realName: string;
  displayName: string;
  avatarUrl?: string;
  isBot?: boolean;
}

export interface SlackReaction {
  name: string;
  count: number;
}

export interface SlackMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
  ts: string;
  threadTs?: string;
  replyCount?: number;
  reactions?: SlackReaction[];
  channelName: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  topic?: string;
  purpose?: string;
  messageCount: number;
}

export interface ParsedSlackArchive {
  communityName: string;
  channels: SlackChannel[];
  users: Record<string, SlackUser>;
  messagesByChannel: Record<string, SlackMessage[]>;
  totalMessages: number;
  importedAt: string;
}

/**
 * Normalizes Slack markdown-style formatting into standard readable text.
 * Replaces <@U12345> user mentions with readable @Name and <http://...|label> links with standard links.
 */
export function formatSlackText(
  rawText: string,
  userMap: Record<string, SlackUser> = {}
): string {
  if (!rawText) return "";

  // Replace user mentions <@U12345> with @Name
  let text = rawText.replace(/<@([A-Z0-9]+)>/g, (_, userId) => {
    const user = userMap[userId];
    return user ? `@${user.displayName || user.name}` : "@someone";
  });

  // Replace channel mentions <#C12345|general> with #general
  text = text.replace(/<#[A-Z0-9]+\|([^>]+)>/g, "#$1");

  // Replace links <https://example.com|Label> or <https://example.com>
  text = text.replace(
    /<(https?:\/\/[^|>]+)(?:\|([^>]+))?>/g,
    (_, url, label) => {
      return label ? `[${label}](${url})` : url;
    }
  );

  return text;
}

/**
 * Converts Slack UNIX timestamps (e.g. "1700000000.000100") into formatted strings.
 */
export function formatSlackTimestamp(ts: string): string {
  if (!ts) return "";
  const seconds = parseFloat(ts);
  if (isNaN(seconds)) return ts;

  const date = new Date(seconds * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Parses raw JSON structures (channels.json, users.json, and message files)
 * into a structured, validated ParsedSlackArchive.
 */
export function parseRawSlackFiles(
  channelsJson: any[],
  usersJson: any[],
  channelMessagesMap: Record<string, any[]>,
  communityName = "Exported Cohort"
): ParsedSlackArchive {
  const users: Record<string, SlackUser> = {};

  if (Array.isArray(usersJson)) {
    for (const u of usersJson) {
      if (!u || !u.id) continue;
      users[u.id] = {
        id: u.id,
        name: u.name || "contributor",
        realName: u.real_name || u.profile?.real_name || u.name || "Member",
        displayName:
          u.profile?.display_name || u.profile?.real_name || u.name || "Member",
        avatarUrl: u.profile?.image_72 || u.profile?.image_48,
        isBot: Boolean(u.is_bot),
      };
    }
  }

  const channels: SlackChannel[] = [];
  const messagesByChannel: Record<string, SlackMessage[]> = {};
  let totalMessages = 0;

  if (Array.isArray(channelsJson)) {
    for (const ch of channelsJson) {
      if (!ch || !ch.name) continue;
      const rawMessages = channelMessagesMap[ch.name] || [];
      const parsedMessages: SlackMessage[] = [];

      for (const m of rawMessages) {
        if (!m || m.type !== "message" || m.subtype === "channel_join")
          continue;

        const user = users[m.user] || {
          id: m.user || "unknown",
          name: m.username || "Contributor",
          realName: m.username || "Contributor",
          displayName: m.username || "Contributor",
        };

        const reactions: SlackReaction[] = Array.isArray(m.reactions)
          ? m.reactions.map((r: any) => ({
              name: r.name || "thumbsup",
              count: Number(r.count) || 1,
            }))
          : [];

        parsedMessages.push({
          id: m.client_msg_id || m.ts || Math.random().toString(36).slice(2),
          userId: user.id,
          userName: user.displayName || user.name,
          userAvatar: user.avatarUrl,
          text: formatSlackText(m.text || "", users),
          timestamp: formatSlackTimestamp(m.ts),
          ts: m.ts || "",
          threadTs: m.thread_ts !== m.ts ? m.thread_ts : undefined,
          replyCount: Number(m.reply_count) || 0,
          reactions,
          channelName: ch.name,
        });
      }

      parsedMessages.sort(
        (a, b) => parseFloat(a.ts || "0") - parseFloat(b.ts || "0")
      );

      channels.push({
        id: ch.id || ch.name,
        name: ch.name,
        topic: ch.topic?.value,
        purpose: ch.purpose?.value,
        messageCount: parsedMessages.length,
      });

      messagesByChannel[ch.name] = parsedMessages;
      totalMessages += parsedMessages.length;
    }
  }

  return {
    communityName,
    channels,
    users,
    messagesByChannel,
    totalMessages,
    importedAt: new Date().toISOString(),
  };
}

/**
 * Searches across all parsed channels and messages for matching keywords.
 */
export function searchArchive(
  archive: ParsedSlackArchive,
  query: string
): SlackMessage[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  const results: SlackMessage[] = [];
  for (const channelName in archive.messagesByChannel) {
    const list = archive.messagesByChannel[channelName] || [];
    for (const msg of list) {
      if (
        msg.text.toLowerCase().includes(q) ||
        msg.userName.toLowerCase().includes(q)
      ) {
        results.push(msg);
      }
    }
  }

  return results;
}
