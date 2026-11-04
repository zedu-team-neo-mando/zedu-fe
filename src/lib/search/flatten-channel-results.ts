import type { MessageSearchResult } from "~/lib/search/types";
import { parseSearchTimestamp } from "~/lib/search/format";

export type ConversationSearchHit = {
  message_id: string;
  thread_id?: string;
  message: string;
  timestamp: string;
  user_name: string;
  user_id: string;
  avatar_url?: string;
  default_avatar_url?: string;
};

export function flattenChannelSearchResults(
  groups: MessageSearchResult[]
): ConversationSearchHit[] {
  const hits: ConversationSearchHit[] = [];

  for (const group of groups) {
    const user = group?.user;
    for (const message of group?.messages || []) {
      if (!message?.message_id) continue;
      hits.push({
        message_id: message.message_id,
        thread_id: message.thread_id || group.thread?.id,
        message: message.message,
        timestamp: message.timestamp,
        user_name: user?.user_name || "Unknown",
        user_id: user?.user_id || "",
        avatar_url: user?.avatar_url,
        default_avatar_url: user?.default_avatar_url,
      });
    }
  }

  hits.sort((a, b) => {
    const aTime = parseSearchTimestamp(a.timestamp)?.getTime() ?? 0;
    const bTime = parseSearchTimestamp(b.timestamp)?.getTime() ?? 0;
    return bTime - aTime;
  });

  return hits;
}

export function groupHitsByDay(hits: ConversationSearchHit[]) {
  const sections: { label: string; hits: ConversationSearchHit[] }[] = [];
  const map = new Map<string, ConversationSearchHit[]>();

  for (const hit of hits) {
    const date = parseSearchTimestamp(hit.timestamp);
    const label = date
      ? date.toLocaleDateString([], {
          weekday: "long",
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown date";

    if (!map.has(label)) {
      map.set(label, []);
    }
    map.get(label)!.push(hit);
  }

  for (const [label, sectionHits] of map.entries()) {
    sections.push({ label, hits: sectionHits });
  }

  return sections;
}
