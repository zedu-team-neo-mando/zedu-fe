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
    <section className="border-b border-[#E6EAEF]">
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-1.5">
          {isPrivate ? (
            <Lock className="size-3.5 shrink-0 text-[#667085]" />
          ) : (
            <Hash className="size-3.5 shrink-0 text-[#667085]" />
          )}
          {channelLink?.href ? (
            <Link
              href={channelLink.href}
              className="text-[15px] font-bold text-[#1D2939] hover:underline"
            >
              {channelName}
            </Link>
          ) : (
            <h2 className="text-[15px] font-bold text-[#1D2939]">
              {channelName}
            </h2>
          )}
        </div>
        {group.participants && (
          <p className="mt-0.5 text-[13px] text-[#667085]">
            {group.participants}
          </p>
        )}
      </div>

      <div className="mx-5 mb-6 overflow-hidden rounded-lg border border-[#E6EAEF] bg-white py-1">
        {group.thread_messages?.map((item, index) => {
          const nextMessage = group.thread_messages[index + 1];
          const shouldShowAvatar =
            !nextMessage || nextMessage.user_id !== item.user_id;
          const isSaved = bookmarks?.some(
            (b: { thread_id?: string }) =>
              b.thread_id === (group.thread_id ?? item.thread_id)
          );

          return (
            <div
              // Each message needs its own key: keying every row by the
              // group's thread id made React drop or reuse rows in a group.
              key={`${item.thread_id ?? "message"}-${index}`}
              className={cn(
                "transition-colors",
                index > 0 && "border-t border-[#E6EAEF]",
                item.is_pinned
                  ? "bg-yellow-50 hover:bg-yellow-50"
                  : isSaved
                    ? "bg-primary-50 hover:bg-primary-50"
                    : "hover:bg-[#F9FAFB]"
              )}
            >
              {item?.is_pinned ? (
                <div className="flex items-center gap-2 bg-yellow-50 pl-10 text-[13px] font-semibold text-blue-100 pt-2">
                  <Pin size={13} className="text-[#667085] mt-[3px]" />
                  Pinned
                </div>
              ) : isSaved ? (
                <div className="flex items-center gap-2 pl-10 text-[13px] font-bold text-blue-100 pt-2">
                  <BookmarkFilledIcon
                    fontSize={13}
                    className="text-[#667085]"
                  />
                  Saved for Later
                </div>
              ) : null}

              <Message
                item={item}
                shouldShowAvatar={shouldShowAvatar}
                group={group}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
