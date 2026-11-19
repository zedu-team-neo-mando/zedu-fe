import type { MessageSearchResult } from "~/lib/search/types";

export type SearchResultSourceKind = "channel" | "private" | "dm" | "group";

export type SearchResultSource = {
  kind: SearchResultSourceKind;
  /** What to show: the channel's name, or the person or group for a DM. */
  label: string;
  /** Spoken description, e.g. "Direct message with Ada". */
  description: string;
};

type DmReference = {
  channel_id?: string | number;
  channels_id?: string | number;
  channel_type?: string;
  username?: string;
  name?: string;
  channel_name?: string;
  participants?: unknown[];
};

const normalizeType = (value?: string | null) =>
  (value || "").toLowerCase().replace(/[\s_-]/g, "");

const KIND_BY_TYPE: Record<string, SearchResultSourceKind> = {
  dm: "dm",
  directmessage: "dm",
  bot: "dm",
  groupdm: "group",
  groupdirectmessage: "group",
  private: "private",
  privatechannel: "private",
  channel: "channel",
  public: "channel",
  publicchannel: "channel",
};

/**
 * Where a message search result came from: a channel, a private channel, a
 * DM or a group chat, and the name to show for it. The result's own
 * `channel_type` decides when the backend sends one; otherwise a match in the
 * user's DM list marks it as a DM or group chat. A DM is labelled with the
 * other person's name from that list, as the sidebar does.
 */
export function searchResultSource(
  result: Pick<MessageSearchResult, "channel">,
  dms?: DmReference[] | null
): SearchResultSource {
  const channelId = String(result.channel?.channel_id ?? "");
  const channelName = result.channel?.channel_name?.trim() || "";
  const dm = channelId
    ? dms?.find(
        (entry) =>
          String(entry.channel_id ?? entry.channels_id ?? "") === channelId
      )
    : undefined;

  let kind = KIND_BY_TYPE[normalizeType(result.channel?.channel_type)];
  if (!kind && dm) {
    kind =
      KIND_BY_TYPE[normalizeType(dm.channel_type)] === "group" ||
      (dm.participants?.length ?? 0) > 1
        ? "group"
        : "dm";
  }
  kind = kind ?? "channel";

  if (kind === "dm" || kind === "group") {
    const label =
      dm?.username?.trim() ||
      dm?.name?.trim() ||
      channelName ||
      (kind === "dm" ? "Direct message" : "Group chat");
    return {
      kind,
      label,
      description:
        kind === "dm" ? `Direct message with ${label}` : `Group chat: ${label}`,
    };
  }

  const label = channelName.replace(/^#/, "") || "channel";
  return {
    kind,
    label,
    description:
      kind === "private" ? `Private channel ${label}` : `Channel #${label}`,
  };
}
