"use client";

import { useContext } from "react";
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
  handleReply: any;
};

export default function ReplyCard({
  users,
  totalReplies,
  lastReplyTime,
  handleReply,
}: ReplySummaryProps) {
  const { state } = useContext(DataContext);
  const members = state?.mentionOrgMembers ?? state?.orgMembers ?? null;
  const defaultAvatarLookup = getDefaultAvatarLookup(members);

  const uniqueUsers = Array.from(
    (users ?? [])
      .reduce((acc, user) => {
        const key =
          user?.user_id ??
          user?.id ??
          user?.email ??
          user?.username ??
          user?.avatar_url ??
          user?.default_avatar_url;

        if (key !== undefined && !acc.has(key)) {
          acc.set(key, user);
        }

        return acc;
      }, new Map())
      .values()
  );

  const visibleUsers = uniqueUsers.slice(0, 4);
  const remainingUsers = uniqueUsers.length - visibleUsers.length;

  return (
    <div
      className="w-[100%] flex items-center flex-wrap space-x-1 text-sm text-gray-600 mt-2 p-1 rounded hover:bg-white hover:shadow-sm dark:hover:bg-[#2C2D30] dark:hover:shadow-none cursor-pointer"
      onClick={handleReply}
    >
      {/* Avatars */}
      <div className="flex space-x-[2px]">
        {visibleUsers?.map((user, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-md border overflow-hidden"
          >
            <UserAvatar
              item={withResolvedDefaultAvatar(user, defaultAvatarLookup)}
              size="2xs"
              alt={`User ${user.id}`}
              className="rounded-md"
              imageClassName="rounded-md object-cover"
            />
          </div>
        ))}

        {remainingUsers > 0 && (
          <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white text-xs flex items-center justify-center text-gray-700 font-medium">
            +{remainingUsers}
          </div>
        )}
      </div>

      {/* Replies count and time */}
      {visibleUsers?.length > 0 && (
        <>
          <span className="text-blue-600 hover:underline cursor-pointer ml-2">
            {totalReplies} replies
          </span>
          <span className="text-gray-500 ml-1">
            Last reply {timeformat(lastReplyTime)}
          </span>
        </>
      )}
    </div>
  );
}
