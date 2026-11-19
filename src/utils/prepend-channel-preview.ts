import { Dispatch } from "react";
import { ACTIONS } from "~/store/Actions";

type SendPreviewParams = {
  channelId: string;
  threadId: string;
  message: string;
  user?: {
    username?: string;
    avatar_url?: string;
    default_avatar_url?: string;
    user_id?: string;
    id?: string;
    full_name?: string;
    email?: string;
    user_type?: string;
    org_id?: string;
  } | null;
  media?: unknown;
  channelName?: string;
  channelType?: string;
  createdAt?: string;
};

export const dispatchPrependChannelPreview = (
  dispatch: Dispatch<{ type: string; payload?: unknown }>,
  params: SendPreviewParams
) => {
  const { channelId, threadId, message } = params;
  if (!channelId || !threadId || !message) return;

  dispatch({
    type: ACTIONS.PREPEND_CHANNEL_PREVIEW,
    payload: {
      channel_id: channelId,
      thread_id: threadId,
      message,
      username: params.user?.username,
      avatar_url: params.user?.avatar_url,
      default_avatar_url: params.user?.default_avatar_url,
      user_id: params.user?.user_id ?? params.user?.id,
      full_name: params.user?.full_name,
      email: params.user?.email,
      user_type: params.user?.user_type,
      org_id: params.user?.org_id,
      type: "message",
      created_at: params.createdAt ?? new Date().toISOString(),
      media: params.media ?? [],
      channel_name: params.channelName,
      channel_type: params.channelType,
    },
  });
};
