"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GetRequest, PostRequest } from "~/utils/new-request";
import { Clock, Hash } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { openSearchMessageResult } from "~/lib/search/navigate";
import type { MessageSearchResult, UserSearchResult } from "~/lib/search/types";
import { formatSearchTimestamp, stripHtmlAndDecode } from "~/lib/search/format";
import { HighlightedText } from "~/app/(client)/[org]/_components/search/highlight";
import UserAvatar from "~/components/layout/user-avatar";
import { DeactivationBadge } from "~/components/layout/deactivation-badge";

type CardItem = MessageSearchResult | UserSearchResult;

interface CardProps {
  cardData: CardItem[];
  query?: string;
}

function isMessageCard(item: CardItem): item is MessageSearchResult {
  return (item as MessageSearchResult).messages !== undefined;
}

export const SearchCards = ({ cardData, query = "" }: CardProps) => {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { orgSlug } = state;
  const orgId =
    typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "";

  if (!cardData || cardData.length === 0) {
    return null;
  }

  const handleUserCardClick = async (user: UserSearchResult) => {
    if (!orgId || !orgSlug) return;
    localStorage.setItem("channelName", user.username);
    const res = await PostRequest(`/organisations/${orgId}/dms`, {
      chat_type: "user",
      participant_id: user.id,
    });

    if (res?.status === 200 || res?.status === 201) {
      router.push(
        `/${orgSlug}/home/people/${res?.data?.data?.channel_id}/${res?.data?.data?.participant_id}/dm`
      );
    }
  };

  const handleMessageCardClick = async (item: MessageSearchResult) => {
    await openSearchMessageResult({
      result: item,
      orgSlug,
      orgId,
      dms: state.dms,
      channels: state.channels,
      getDmParticipants: GetRequest,
      router,
      dispatch,
    });
  };

  return (
    <div className="w-full space-y-3">
      {cardData.map((item, idx) => {
        const isMessage = isMessageCard(item);

        const key = isMessage
          ? item.messages[0]?.message_id || `msg-${idx}`
          : item.id;

        const avatar = isMessage
          ? item.user.avatar_url
          : item.profile_url || item.avatar_url;
        const name = isMessage ? item.user.user_name : item.name;

        return (
          <div
            key={key}
            className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-500"
            onClick={async () => {
              if (isMessage) {
                await handleMessageCardClick(item);
              } else {
                await handleUserCardClick(item);
              }
            }}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="flex-shrink-0">
                <UserAvatar
                  item={isMessage ? item.user : item}
                  src={avatar}
                  size="md"
                  alt={name}
                  imageClassName="rounded-full"
                  className="rounded-full"
                />
              </div>

              <div className="flex-1 min-w-0 w-full">
                {isMessage ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 inline-flex items-center gap-1.5">
                        <HighlightedText
                          text={item.user.user_name}
                          query={query}
                        />
                      </h3>
                      {item.messages[0]?.timestamp && (
                        <span className="ml-auto text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                          <Clock size={12} />
                          {formatSearchTimestamp(item.messages[0].timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 line-clamp-3 break-words mb-2">
                      <HighlightedText
                        text={stripHtmlAndDecode(
                          item.messages[0]?.message || ""
                        )}
                        query={query}
                      />
                    </p>
                    <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded px-2 py-0.5 text-xs text-gray-600 dark:text-zinc-300">
                      <Hash size={12} />
                      <HighlightedText
                        text={item.channel.channel_name}
                        query={query}
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 inline-flex items-center gap-1.5">
                        <HighlightedText text={item.name} query={query} />
                        <DeactivationBadge user={item} size="sm" />
                      </h3>
                      {item.username && (
                        <span className="text-xs text-gray-500 dark:text-zinc-400">
                          @
                          <HighlightedText text={item.username} query={query} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      {item.email && (
                        <span className="text-sm text-gray-600 dark:text-zinc-300 truncate">
                          <HighlightedText text={item.email} query={query} />
                        </span>
                      )}
                      {item.role && (
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300 rounded px-2 py-0.5 capitalize">
                          <HighlightedText text={item.role} query={query} />
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
