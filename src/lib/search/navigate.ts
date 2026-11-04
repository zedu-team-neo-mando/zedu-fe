import type { Dispatch } from "react";
import { ACTIONS } from "~/store/Actions";
import type { MessageSearchResult } from "~/lib/search/types";
import { setMessageHighlight } from "~/utils/message-highlight";

type NavigateArgs = {
  result: MessageSearchResult;
  orgSlug?: string | null;
  orgId?: string | null;
  dms?: ConversationReference[] | null;
  channels?: ConversationReference[] | null;
  getDmParticipants?: (url: string) => Promise<{ status?: number } | undefined>;
  router: { push: (href: string) => void };
  dispatch: Dispatch<{ type: string; payload?: unknown }>;
};

type ConversationReference = {
  channel_id?: string | number;
  channels_id?: string | number;
};

type ReplyReference = {
  id?: string | number;
  message_id?: string | number;
};

type ThreadReference = {
  thread_id?: string;
};

export function resolveSearchDeepLink<T extends ThreadReference>(
  threadId: string,
  messageId: string | null,
  messages: T[],
  loading: boolean
): { status: "pending" } | { status: "root" } | { status: "reply"; parent: T } {
  if (!messageId) return { status: "root" };
  if (loading) return { status: "pending" };

  const parent = messages.find((message) => message.thread_id === threadId);
  return parent ? { status: "reply", parent } : { status: "pending" };
}

export function hasMoreReplyPages(pageLength: number, pageSize = 30) {
  return pageLength >= pageSize;
}

export function shouldFetchSearchReply(
  targetId: string | null,
  replies: ReplyReference[] | null | undefined,
  hasMore: boolean
) {
  if (!targetId || !hasMore || !replies?.length) return false;

  return !replies.some(
    (reply) => String(reply.id ?? reply.message_id ?? "") === targetId
  );
}

const normalizeChannelType = (value?: string | null) =>
  (value || "").toLowerCase().replace(/[\s_-]/g, "");

export const isIndividualDmType = (value?: string | null) => {
  const type = normalizeChannelType(value);
  return type === "dm" || type === "directmessage" || type === "bot";
};

const isDmChannelType = (value?: string | null) => {
  const type = normalizeChannelType(value);
  return (
    isIndividualDmType(type) ||
    type === "groupdm" ||
    type === "groupdirectmessage"
  );
};

const isKnownChannelType = (value?: string | null) => {
  const type = normalizeChannelType(value);
  return (
    type === "channel" || type === "publicchannel" || type === "privatechannel"
  );
};

const includesConversation = (
  conversations: ConversationReference[] | null | undefined,
  channelId: string
) =>
  conversations?.some(
    (conversation) =>
      String(conversation.channel_id ?? conversation.channels_id ?? "") ===
      channelId
  ) ?? false;

async function resolveIsDm({
  result,
  channelId,
  orgId,
  dms,
  channels,
  getDmParticipants,
}: Pick<
  NavigateArgs,
  "result" | "orgId" | "dms" | "channels" | "getDmParticipants"
> & { channelId: string }) {
  const channelType = result.channel.channel_type;
  if (isDmChannelType(channelType)) return true;
  if (isKnownChannelType(channelType)) return false;
  if (includesConversation(dms, channelId)) return true;
  if (includesConversation(channels, channelId)) return false;

  if (!orgId || !getDmParticipants) return false;

  const response = await getDmParticipants(
    `/organisations/${orgId}/dms/participants/${channelId}`
  );
  return response?.status === 200 || response?.status === 201;
}

/**
 * Open a message search hit: store highlight id, update global dataId,
 * then route to the matching channel or DM conversation.
 */
export async function openSearchMessageResult({
  result,
  orgSlug,
  orgId,
  dms,
  channels,
  getDmParticipants,
  router,
  dispatch,
}: NavigateArgs) {
  if (!orgSlug) return;

  const channelId = result.channel?.channel_id;
  if (!channelId) return;

  const selectedMessage = result.messages?.[0];
  const messageId = selectedMessage?.message_id;
  const threadId =
    result.thread?.id ||
    selectedMessage?.thread_id ||
    selectedMessage?.message_id;
  if (messageId) {
    setMessageHighlight(messageId);
    dispatch({ type: ACTIONS.DATA_ID, payload: messageId });
  }

  if (result.channel.channel_name) {
    localStorage.setItem("channelName", result.channel.channel_name);
  }
  localStorage.setItem("channelId", channelId);

  const query = new URLSearchParams();
  if (threadId) query.set("thread_id", threadId);
  if (messageId && threadId && messageId !== threadId) {
    query.set("message_id", messageId);
  }
  query.set("from", "search");
  const encodedQuery = query.toString();
  const queryString = encodedQuery ? `?${encodedQuery}` : "";

  const isDm = await resolveIsDm({
    result,
    channelId,
    orgId,
    dms,
    channels,
    getDmParticipants,
  });

  const conversationPath = isDm
    ? `/${orgSlug}/dms/${channelId}`
    : `/${orgSlug}/home/channels/${channelId}`;
  router.push(`${conversationPath}${queryString}`);
}
