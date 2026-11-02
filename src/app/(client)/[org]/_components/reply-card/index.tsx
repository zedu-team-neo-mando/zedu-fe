"use client";

import { useContext, useMemo } from "react";
import { format as timeformat } from "timeago.js";
import UserAvatar from "~/components/layout/user-avatar";
import { DataContext } from "~/store/GlobalState";
import {
  getDefaultAvatarLookup,
  withResolvedDefaultAvatar,
} from "~/utils/avatar";

type User = {
  id?: number | string;
  user_id?: number | string;
  username?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  default_avatar_url?: string;
  user_type?: string;
  is_deactivated?: boolean;
};

type ReplySummaryProps = {
  users: User[];
  totalReplies: number;
  lastReplyTime: string;
  handleReply: () => void;
  participants?: string;
};

function parseParticipantNames(participants?: string): string[] {
  if (!participants) return [];
  return participants
    .split(/,\s*|\s+and\s+/i)
    .map((name) => name.trim())
    .filter(Boolean);
}

export default function ReplyCard({
  users,
  totalReplies,
  lastReplyTime,
  handleReply,
  participants,
}: ReplySummaryProps) {
  const { state } = useContext(DataContext);
  const members = state?.mentionOrgMembers ?? state?.orgMembers ?? null;
  const defaultAvatarLookup = getDefaultAvatarLookup(members);

  const memberNameLookup = useMemo(() => {
    const map = new Map<string, string>();
    if (!Array.isArray(members)) return map;

    for (const member of members) {
      const name = (
        member?.username ??
        member?.full_name ??
        member?.profile?.username ??
        member?.email ??
        ""
      )
        .toString()
        .trim();
      if (!name) continue;

      for (const candidate of [member?.user_id, member?.id]) {
        if (candidate !== undefined && candidate !== null && candidate !== "") {
          const key = String(candidate);
          if (!map.has(key)) map.set(key, name);
        }
      }
    }
    return map;
  }, [members]);

  const uniqueUsers = Array.from(
    (users ?? [])
      .reduce((acc, user) => {
        const key =
          user?.user_id ??
          user?.username ??
          user?.email ??
          user?.id ??
          user?.avatar_url ??
          user?.default_avatar_url;

        if (key !== undefined && !acc.has(key)) {
          acc.set(key, user);
        }

        return acc;
      }, new Map<string | number, User>())
      .values()
  );

  const fallbackNames = useMemo(
    () => parseParticipantNames(participants),
    [participants]
  );

  const currentUserId = String(
    state?.user?.user_id ?? state?.user?.id ?? ""
  ).trim();
  const currentUserName = (
    state?.user?.username ??
    state?.user?.full_name ??
    state?.user?.email ??
    "You"
  )
    .toString()
    .trim();

  const userNames = uniqueUsers.map((user, index) => {
    const direct =
      user?.username?.trim() || user?.full_name?.trim() || user?.email?.trim();
    if (direct) return direct;

    const idKey = String(user?.user_id ?? user?.id ?? "").trim();
    if (idKey && memberNameLookup.has(idKey)) {
      return memberNameLookup.get(idKey)!;
    }
    if (idKey && currentUserId && idKey === currentUserId) {
      return currentUserName || "You";
    }
    if (fallbackNames[index]) {
      return fallbackNames[index];
    }
    return `Participant ${index + 1}`;
  });

  const visibleUsers = uniqueUsers.slice(0, 4);
  const remainingUsers = uniqueUsers.length - visibleUsers.length;
  const remainingNames = userNames.slice(4);

  const participantsLabel =
    participants?.trim() || (userNames.length > 0 ? userNames.join(", ") : "");

  const replyCountLabel = `${totalReplies} ${
    totalReplies === 1 ? "reply" : "replies"
  }`;
  const lastReplyLabel = lastReplyTime
    ? `Last reply ${timeformat(lastReplyTime)}`
    : "";
  const accessibleSummary = [
    replyCountLabel,
    lastReplyLabel,
    participantsLabel ? `Participants: ${participantsLabel}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      onClick={handleReply}
      aria-label={accessibleSummary}
      title={
        participantsLabel ? `Participants: ${participantsLabel}` : undefined
      }
      className="group/activity relative mt-3 inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-md py-1 pr-2 text-left text-[13px] text-[#667085] transition-colors hover:bg-[#F2F4F7]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1264A3] focus-visible:ring-offset-2 dark:hover:bg-[#2C2D30]"
    >
      {/* Avatars */}
      {visibleUsers.length > 0 && (
        <span
          role="group"
          aria-label={
            participantsLabel
              ? `Thread participants: ${participantsLabel}`
              : "Thread participants"
          }
          className="flex shrink-0 items-center -space-x-1.5"
        >
          {visibleUsers.map((user, index) => {
            const participantName =
              userNames[index] || `Participant ${index + 1}`;
            return (
              <span
                key={String(
                  user?.user_id ?? user?.id ?? participantName ?? index
                )}
                title={participantName}
                aria-label={participantName}
                className="group/avatar relative inline-flex size-6 shrink-0 rounded-full ring-2 ring-white dark:ring-[#222529]"
              >
                <UserAvatar
                  item={withResolvedDefaultAvatar(user, defaultAvatarLookup)}
                  size="2xs"
                  alt={participantName}
                  className="size-6 rounded-full"
                  imageClassName="rounded-full border-0 object-cover"
                />
                <span
                  role="tooltip"
                  aria-hidden="true"
                  className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-1.5 max-w-[220px] truncate rounded bg-[#101828] px-2 py-0.5 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover/avatar:visible group-hover/avatar:opacity-100"
                >
                  {participantName}
                </span>
              </span>
            );
          })}

          {remainingUsers > 0 && (
            <span
              title={
                remainingNames.length > 0
                  ? remainingNames.join(", ")
                  : `${remainingUsers} more participant${
                      remainingUsers === 1 ? "" : "s"
                    }`
              }
              aria-label={
                remainingNames.length > 0
                  ? `More participants: ${remainingNames.join(", ")}`
                  : `${remainingUsers} more participant${
                      remainingUsers === 1 ? "" : "s"
                    }`
              }
              className="group/avatar relative inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[11px] font-semibold text-[#344054] ring-2 ring-white dark:bg-zinc-700 dark:text-zinc-100 dark:ring-[#222529]"
            >
              +{remainingUsers}
              <span
                role="tooltip"
                aria-hidden="true"
                className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-1.5 max-w-[220px] truncate rounded bg-[#101828] px-2 py-0.5 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover/avatar:visible group-hover/avatar:opacity-100"
              >
                {remainingNames.length > 0
                  ? remainingNames.join(", ")
                  : `+${remainingUsers} more`}
              </span>
            </span>
          )}
        </span>
      )}

      {participantsLabel && (
        <span
          role="tooltip"
          aria-hidden="true"
          className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-1.5 max-w-[260px] truncate rounded bg-[#101828] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity group-focus-visible/activity:visible group-focus-visible/activity:opacity-100"
        >
          {participantsLabel}
        </span>
      )}

      {/* Replies count and time */}
      <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-snug">
        <span className="font-semibold text-[#1264A3] group-hover/activity:underline dark:text-sky-400">
          {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
        </span>
        {lastReplyLabel && (
          <>
            <span aria-hidden="true" className="text-[#98A2B3]">
              •
            </span>
            <span className="text-[#667085]">{lastReplyLabel}</span>
          </>
        )}
      </span>
    </button>
  );
}
