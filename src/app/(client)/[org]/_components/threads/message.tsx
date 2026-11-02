"use client";

import React, { useContext } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import ReplyCard from "../reply-card";
import UserAvatar from "~/components/layout/user-avatar";
import MessageItem from "../ChannelMessage/message-item";
import { formatSlackStyleTimestamp } from "~/utils/format-slack-timestamp";
import {
  getDefaultAvatarLookup,
  withResolvedDefaultAvatar,
} from "~/utils/avatar";

interface MessageProps {
  item: any;
  shouldShowAvatar: boolean;
  participants?: string;
  senderAvatarUrl?: string;
  senderDefaultAvatarUrl?: string;
}

function isValidReplyTimestamp(value?: string): boolean {
  if (!value || value.startsWith("0001-01-01")) return false;
  const parsed = new Date(value).getTime();
  return !Number.isNaN(parsed) && parsed > 0;
}

const Message = ({
  item,
  shouldShowAvatar,
  participants,
  senderAvatarUrl,
  senderDefaultAvatarUrl,
}: MessageProps) => {
  const { state, dispatch } = useContext(DataContext);
  const members = state?.mentionOrgMembers ?? state?.orgMembers ?? null;
  const defaultAvatarLookup = getDefaultAvatarLookup(members);

  const handleReply = () => {
    dispatch({ type: ACTIONS.THREAD, payload: item });
    dispatch({
      type: ACTIONS.REPLIES,
      payload: {
        newThreads: item.preview_reply ?? item.messages ?? [],
        newPage: 1,
        parentReactions: item.reactions,
      },
    });
    dispatch({ type: ACTIONS.REPLY, payload: true });
    dispatch({ type: ACTIONS.LOAD_THREAD, payload: !state.loadThread });
  };

  const authorName =
    item?.username || item?.full_name || item?.email || "Unknown user";
  const authorAvatarItem = withResolvedDefaultAvatar(
    {
      ...item,
      avatar_url: item?.avatar_url || senderAvatarUrl,
      default_avatar_url: item?.default_avatar_url || senderDefaultAvatarUrl,
    },
    defaultAvatarLookup
  );

  const replyList =
    Array.isArray(item?.messages) && item.messages.length > 0
      ? item.messages
      : Array.isArray(item?.preview_reply) && item.preview_reply.length > 0
        ? item.preview_reply
        : [];
  const totalReplies =
    typeof item?.message_count === "number" && item.message_count > 0
      ? item.message_count
      : replyList.length;
  const replyUsers = replyList.length > 0 ? replyList : [authorAvatarItem];
  const lastReplyTime = isValidReplyTimestamp(item?.last_reply)
    ? item.last_reply
    : item?.created_at;

  return (
    <div className="w-full min-w-0">
      {shouldShowAvatar ? (
        <div className="mt-2.5 flex min-w-0 items-center gap-2.5">
          <UserAvatar
            item={authorAvatarItem}
            size="sm"
            alt={authorName}
            className="rounded-full"
            imageClassName="rounded-full"
          />

          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="min-w-0 break-words text-[14px] font-semibold leading-snug text-[#344054]">
              {authorName}
            </span>

            {item?.created_at && (
              <time
                dateTime={item.created_at}
                className="shrink-0 text-xs text-[#667085]"
              >
                {formatSlackStyleTimestamp(item.created_at)}
              </time>
            )}
          </div>
        </div>
      ) : (
        item?.created_at && (
          <div className="mt-2">
            <time dateTime={item.created_at} className="text-xs text-[#667085]">
              {new Date(item.created_at).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </time>
          </div>
        )
      )}

      <div className="mt-2.5 flex w-full min-w-0 items-start justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1 [&_.custom-message]:text-[15px] [&_.custom-message]:leading-[22px] [&_.custom-message]:text-[#1D2939] dark:[&_.custom-message]:text-foreground">
          <div className="min-w-0 max-w-full flex-1">
            <MessageItem item={item} />
          </div>

          {(item?.user_type === "user" || item?.user_type === "") &&
          item?.edited === true ? (
            <span className="shrink-0 text-[11px] text-[#667085]">
              (edited)
            </span>
          ) : null}
        </div>
      </div>

      {totalReplies > 0 && (
        <ReplyCard
          users={replyUsers}
          totalReplies={totalReplies}
          lastReplyTime={lastReplyTime}
          handleReply={handleReply}
          participants={participants}
        />
      )}
    </div>
  );
};

export default Message;
