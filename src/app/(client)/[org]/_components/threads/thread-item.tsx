"use client";

import Link from "next/link";
import { Hash, Lock, Pin } from "lucide-react";
import { useContext } from "react";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { Message } from "./messages";
import { DataContext } from "~/store/GlobalState";
import type { ThreadGroup } from "~/types/threads";
import { cn } from "~/lib/utils";
import { getThreadGroupChannelLink } from "~/utils/org-threads";

interface ThreadItemProps {
  group: ThreadGroup;
}

export const ThreadItem = ({ group }: ThreadItemProps) => {
  const { state } = useContext(DataContext);
  const { orgSlug, bookmarks } = state;

  const channelLink = orgSlug
    ? getThreadGroupChannelLink(orgSlug, group)
    : null;
  const isPrivate = channelLink?.isPrivate ?? true;
  const channelName =
    group.channel_name || group.thread_messages?.[0]?.channel_name;

  return (
    <section className="border-b border-[#E6EAEF] bg-white">
      {group.thread_messages?.map((item, index) => {
        const previousMessage = group.thread_messages[index - 1];
        const shouldShowAvatar =
          !previousMessage || previousMessage.user_id !== item.user_id;
        const isSaved = bookmarks?.some(
          (b: { thread_id?: string }) =>
            b.thread_id === (group.thread_id ?? item.thread_id)
        );

        return (
          <div
            key={group.thread_id ?? item.thread_id ?? index}
            className={cn(
              "px-4 py-4 transition-colors sm:px-5 sm:py-5",
              index > 0 && "border-t border-[#E6EAEF]",
              item.is_pinned
                ? "bg-yellow-50 hover:bg-yellow-50"
                : isSaved
                  ? "bg-primary-50 hover:bg-primary-50"
                  : "hover:bg-[#F9FAFB]"
            )}
          >
            {item?.is_pinned ? (
              <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-blue-100">
                <Pin size={13} className="text-[#667085]" />
                Pinned
              </div>
            ) : isSaved ? (
              <div className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-blue-100">
                <BookmarkFilledIcon fontSize={13} className="text-[#667085]" />
                Saved for Later
              </div>
            ) : null}

            {index === 0 && channelName && (
              <div className="flex min-w-0 items-center gap-1">
                {isPrivate ? (
                  <Lock
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-[#667085]"
                  />
                ) : (
                  <Hash
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-[#667085]"
                  />
                )}
                {channelLink?.href ? (
                  <Link
                    href={channelLink.href}
                    className="min-w-0 break-words rounded-sm text-[15px] font-bold leading-snug text-[#1D2939] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1264A3] focus-visible:ring-offset-2"
                  >
                    {channelName}
                  </Link>
                ) : (
                  <h2 className="min-w-0 break-words text-[15px] font-bold leading-snug text-[#1D2939]">
                    {channelName}
                  </h2>
                )}
              </div>
            )}

            <Message
              item={item}
              shouldShowAvatar={shouldShowAvatar}
              participants={group.participants}
              senderAvatarUrl={group.sender_avatar_url}
              senderDefaultAvatarUrl={group.sender_default_avatar_url}
            />
          </div>
        );
      })}
    </section>
  );
};
