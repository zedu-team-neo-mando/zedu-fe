"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { Loader2, PlusIcon, Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import OrganisationMenu from "~/app/(client)/[org]/_components/org-dropdown";
import { formatCount, stripHtmlTags } from "~/utils/utils";
import { cn } from "~/lib/utils";
import UserAvatar from "~/components/layout/user-avatar";
import { isUserDeactivated } from "~/utils/user-deactivation";
import { useOrganisationDms } from "~/hooks/useOrganisationDms";
import { PostRequest } from "~/utils/new-request";

const dedupeDmList = (dms: any[] | undefined) => {
  const seen = new Set<string>();
  const list: any[] = [];

  for (const dm of dms || []) {
    const key = String(dm?.channel_id || dm?.channels_id || "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    list.push(dm);
  }

  return list;
};

const filterDmList = (dms: any[] | undefined, rawQuery: string) => {
  const list = dedupeDmList(dms);
  const query = rawQuery.trim().toLowerCase();
  if (!query) return list;

  const words = query.split(/\s+/).filter(Boolean);

  const getUserFields = (dm: any): string[] => {
    const fields: string[] = [];
    if (dm?.username) fields.push(String(dm.username));
    if (dm?.participant_email) fields.push(String(dm.participant_email));

    for (const p of dm?.participants || []) {
      if (p?.username) fields.push(String(p.username));
      if (p?.full_name) fields.push(String(p.full_name));
      if (p?.display_name) fields.push(String(p.display_name));
      if (p?.email) fields.push(String(p.email));
    }

    return fields.map((v) => v.toLowerCase().trim()).filter(Boolean);
  };

  const getChatFields = (dm: any): string[] => {
    const fields: string[] = [];
    if (dm?.preview_message) {
      fields.push(stripHtmlTags(dm.preview_message).toLowerCase());
    }
    for (const thread of dm?.preview_thread || []) {
      if (thread?.message) {
        fields.push(stripHtmlTags(thread.message).toLowerCase());
      }
    }
    return fields.filter(Boolean);
  };

  const scoreUserMatch = (names: string[]): number | null => {
    let best: number | null = null;
    const setBest = (score: number) => {
      best = best === null ? score : Math.min(best, score);
    };

    for (const name of names) {
      if (name === query) setBest(0);
      else if (name.startsWith(query)) setBest(1);
      else if (words.every((w) => name.includes(w))) setBest(2);
      else if (name.includes(query)) setBest(3);
    }

    return best;
  };

  const scoreChatMatch = (texts: string[]): number | null => {
    let best: number | null = null;
    const setBest = (score: number) => {
      best = best === null ? score : Math.min(best, score);
    };

    for (const text of texts) {
      if (text.includes(query)) setBest(4);
      else if (words.every((w) => text.includes(w))) setBest(5);
    }

    return best;
  };

  return list
    .map((dm) => {
      const userScore = scoreUserMatch(getUserFields(dm));
      const chatScore = scoreChatMatch(getChatFields(dm));
      const score =
        userScore !== null && chatScore !== null
          ? Math.min(userScore, chatScore)
          : (userScore ?? chatScore);

      return score === null ? null : { dm, score };
    })
    .filter((row): row is { dm: any; score: number } => row !== null)
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return String(a.dm.username || "").localeCompare(
        String(b.dm.username || "")
      );
    })
    .map(({ dm }) => dm);
};

export default function DMNav({
  resizerRef,
  sidebarWidth,
  sidebarRef,
  fullPageOnMobile = false,
}: any) {
  const { state, dispatch } = useContext(DataContext);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { orgSlug } = state;
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);

  const orgId =
    typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "";
  const { loading, hasMore, loadMore, failedPage, retry } =
    useOrganisationDms(orgId);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebar-scroll");
    if (sidebarScrollRef.current && savedScroll) {
      sidebarScrollRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleScroll = () => {
    if (sidebarScrollRef.current) {
      sessionStorage.setItem(
        "sidebar-scroll",
        sidebarScrollRef.current.scrollTop.toString()
      );
    }
  };

  const handleRoute = (data: any) => {
    dispatch({
      type: ACTIONS.CHATS,
      payload: { newThreads: data?.preview_thread || [], newPage: 1 },
    });

    localStorage.setItem("channelName", data?.username);

    // Clear Nav unread highlight immediately on open
    if (data?.channel_id) {
      dispatch({
        type: ACTIONS.UPDATE_DM_COUNT,
        payload: {
          channel_id: data.channel_id,
          thread_count: 0,
        },
      });
      dispatch({ type: ACTIONS.DM_COUNT, payload: 0 });
    }

    if (data?.channel_type === "dm") {
      const participant = data?.participants?.[0];
      dispatch({ type: ACTIONS.PARTICIPANT, payload: participant });
      router.push(`/${orgSlug}/dm/${data?.channel_id}/${data?.participant_id}`);
    } else {
      dispatch({ type: ACTIONS.PARTICIPANTS, payload: data?.participants });
      router.push(`/${orgSlug}/dm/${data?.channel_id}/dms`);
    }
  };

  const handleSuggestedRoute = async (data: any) => {
    const payload = {
      chat_type: "user",
      participant_id: data?.participant_id,
    };

    const res = await PostRequest(`/organisations/${orgId}/dms`, payload);

    if (res?.status === 200 || res?.status === 201) {
      router.push(
        `/${orgSlug}/dm/${res?.data?.data?.channel_id}/${res?.data?.data?.participant_id}`
      );
    }
  };

  const handleNewChat = () => {
    router.push(`/${orgSlug}/home/people/new-chat`);
  };

  type FilterType = "all" | "unread" | "groups";
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = useMemo(
    () =>
      dedupeDmList(state?.dms).filter((dm: any) => (dm?.thread_count || 0) > 0)
        .length,
    [state?.dms]
  );

  const groupCount = useMemo(
    () =>
      dedupeDmList(state?.dms).filter(
        (dm: any) =>
          dm?.channel_type === "group_dm" || dm?.channel_type === "group"
      ).length,
    [state?.dms]
  );

  const searchData = useMemo(
    () => filterDmList(state?.dms, searchInput),
    [state?.dms, searchInput]
  );

  const filteredData = useMemo(() => {
    if (filter === "unread") {
      return searchData.filter((dm: any) => (dm?.thread_count || 0) > 0);
    }
    if (filter === "groups") {
      return searchData.filter(
        (dm: any) =>
          dm?.channel_type === "group_dm" || dm?.channel_type === "group"
      );
    }
    return searchData;
  }, [searchData, filter]);

  useEffect(() => {
    const scroller = sidebarScrollRef.current;
    if (!scroller || !hasMore || loading || failedPage !== null) return;

    const loadIfNearBottom = () => {
      if (
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <
        120
      ) {
        loadMore();
      }
    };

    loadIfNearBottom();
    window.addEventListener("resize", loadIfNearBottom);
    return () => window.removeEventListener("resize", loadIfNearBottom);
  }, [filteredData, hasMore, loading, failedPage, loadMore]);

  return (
    <>
      <div
        ref={sidebarRef}
        style={
          fullPageOnMobile
            ? ({
                "--dm-sidebar-width": `${sidebarWidth}px`,
              } as React.CSSProperties)
            : { width: `${sidebarWidth}px` }
        }
        className={cn(
          `fixed top-[60px] lg:rounded-tl-[8px] lg:rounded-bl-[8px] bottom-0 left-0 lg:left-[85px] bg-blue-300 lg:translate-x-0  ${state?.openSidebar ? "translate-x-[85px]" : "-translate-x-full "}
      pt-4 flex flex-col gap-4 sm:w-[350px] transition-transform duration-300 ease-in-out z-30`,
          // DMs index on mobile: the list is the page, not a hidden drawer.
          fullPageOnMobile && "w-full sm:w-full lg:w-[var(--dm-sidebar-width)]",
          fullPageOnMobile && !state?.openSidebar && "translate-x-0"
        )}
      >
        {/* Fixed 56px (h-14) Header Container */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-[#5F5FE1]/40 shrink-0">
          <div className="flex items-center gap-[5px] justify-between w-full">
            <OrganisationMenu name="Direct Messages" />

            <button
              type="button"
              onClick={handleNewChat}
              className="p-1.5 rounded-md hover:bg-[#4A4AAF] transition-colors"
              aria-label="New direct message"
              title="New direct message"
            >
              <PlusIcon color="white" size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Integrated Search Container */}
        <div className="relative h-fit w-full px-3">
          <Input
            type="search"
            placeholder="Find a conversation"
            className="h-10 pl-8 pr-8 bg-[#4A4AAF] border-[#5F5FE1] text-white placeholder:text-white/80"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />

          <div className="absolute top-[12px] left-6">
            <Search color="#FFFFFF" size={16} />
          </div>

          {searchInput && (
            <button
              type="button"
              className="absolute top-[12px] right-5 text-white"
              onClick={() => setSearchInput("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Streamlined Filter Controls (All, Unread, Groups) */}
        <div className="flex items-center gap-1.5 px-3">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
              filter === "all"
                ? "bg-[#5F5FE1] text-white"
                : "bg-[#4A4AAF]/70 text-white/80 hover:bg-[#4A4AAF] hover:text-white"
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1",
              filter === "unread"
                ? "bg-[#5F5FE1] text-white"
                : "bg-[#4A4AAF]/70 text-white/80 hover:bg-[#4A4AAF] hover:text-white"
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter("groups")}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1",
              filter === "groups"
                ? "bg-[#5F5FE1] text-white"
                : "bg-[#4A4AAF]/70 text-white/80 hover:bg-[#4A4AAF] hover:text-white"
            )}
          >
            <span>Groups</span>
            {groupCount > 0 && (
              <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {groupCount}
              </span>
            )}
          </button>
        </div>

        {/* Bounded Scrollable Container */}
        <div
          id="dmScrollableDiv"
          className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden text-blue-50 cursor-pointer pb-2"
          ref={sidebarScrollRef}
          onScroll={handleScroll}
          onClick={() =>
            dispatch({ type: ACTIONS.OPEN_SIDEBAR, payload: false })
          }
        >
          <InfiniteScroll
            dataLength={state?.dms?.length || 0}
            next={loadMore}
            hasMore={hasMore && failedPage === null}
            loader={
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-white/70" size={20} />
              </div>
            }
            scrollableTarget="dmScrollableDiv"
          >
            <div className="flex flex-col">
              {filteredData?.map((dm: any, index: number) => {
                return (
                  <Fragment key={String(dm.channel_id || dm.channels_id)}>
                    <div
                      className={`flex items-center gap-3 px-3 py-3 hover:bg-[#4B4BB4] transition-colors ${dm?.channel_id === id || dm?.channels_id === id ? "bg-[#4B4BB4]" : ""}`}
                      onClick={() =>
                        dm?.is_suggested
                          ? handleSuggestedRoute(dm)
                          : handleRoute(dm)
                      }
                    >
                      <div className="relative shrink-0">
                        <UserAvatar item={dm} size="2xs" alt="avatar" />
                        {!isUserDeactivated(dm) && (
                          <span
                            className={`absolute -right-1 -bottom-1 ${dm?.participants?.some((p: any) => p.online) ? "bg-[#00AD51]" : "bg-[#F97316]"} w-[8px] h-[8px] rounded-full border border-white`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[14px] font-semibold text-white truncate">
                            {dm.username}
                          </span>
                          <span className="text-[11px] text-[#BABAFB] shrink-0 font-medium whitespace-nowrap">
                            {moment(dm.last_read_at).format("LT")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] text-[#D0D0FD] truncate flex-1 leading-snug">
                            {stripHtmlTags(dm.preview_message)}
                          </p>
                          {dm.thread_count > 0 && (
                            <span
                              className={cn(
                                "shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-[10px] px-1.5 h-4 min-w-4 tracking-[-0.5%]"
                              )}
                            >
                              {formatCount(dm?.thread_count || 0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {index !== filteredData?.length - 1 && (
                      <hr className="border-[#5F5FE1]/40" />
                    )}
                  </Fragment>
                );
              })}

              {filteredData?.length === 0 && !hasMore && !loading && (
                <p className="self-center mt-10 text-sm text-blue-100">
                  {filter === "unread"
                    ? "No unread messages"
                    : filter === "groups"
                      ? "No group conversations"
                      : "No recent messages"}
                </p>
              )}
            </div>
          </InfiniteScroll>
          {failedPage !== null && (
            <div className="flex flex-col items-center gap-2 p-4 text-sm text-blue-100">
              <span>Could not load conversations.</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  retry();
                }}
                className="underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Sticky Footer Wrapper for Action Button (Does not overlap list items) */}
        <div className="p-3 bg-blue-300 border-t border-[#5F5FE1]/40 shrink-0 mt-auto">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[#4A4AAF] hover:bg-[#5F5FE1] text-white font-medium text-sm transition-colors shadow-sm"
          >
            <PlusIcon size={16} />
            <span>New Direct Message</span>
          </button>
        </div>
      </div>

      <div
        ref={resizerRef}
        style={{ left: `${sidebarWidth + 85}px` }}
        className="fixed top-[60px] bottom-[10px] w-1.5 cursor-ew-resize opacity-100 transition-opacity duration-300 z-50 hover:opacity-100"
      />
    </>
  );
}
