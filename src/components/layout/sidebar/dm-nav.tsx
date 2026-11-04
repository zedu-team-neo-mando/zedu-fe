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
  const { hasMore, loadMore } = useOrganisationDms(orgId);

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

  const searchData = useMemo(
    () => filterDmList(state?.dms, searchInput),
    [state?.dms, searchInput]
  );

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
          `fixed top-[60px] lg:rounded-tl-[8px] lg:rounded-bl-[8px] bottom-[60px] left-0 lg:left-[85px] h-[100dvh] bg-blue-300 lg:translate-x-0  ${state?.openSidebar ? "translate-x-[85px]" : "-translate-x-full "}
      pt-4 flex flex-col gap-4 sm:w-[350px] transition-transform duration-300 ease-in-out z-30`,
          // DMs index on mobile: the list is the page, not a hidden drawer.
          fullPageOnMobile && "w-full sm:w-full lg:w-[var(--dm-sidebar-width)]",
          fullPageOnMobile && !state?.openSidebar && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-[5px] md:justify-between w-full">
            <OrganisationMenu name="Direct Messages" />

            <button type="button" onClick={handleNewChat}>
              <PlusIcon color="white" size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

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

        {/* Must be a bounded flex child so overflow-auto scrolls here (InfiniteScroll target). */}
        <div
          id="dmScrollableDiv"
          className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden text-blue-50 cursor-pointer pb-20"
          ref={sidebarScrollRef}
          onScroll={handleScroll}
          onClick={() =>
            dispatch({ type: ACTIONS.OPEN_SIDEBAR, payload: false })
          }
        >
          <InfiniteScroll
            dataLength={state?.dms?.length || 0}
            next={loadMore}
            hasMore={hasMore && !searchInput}
            loader={
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-white/70" size={20} />
              </div>
            }
            scrollableTarget="dmScrollableDiv"
          >
            <div className="flex flex-col">
              {searchData?.map((dm: any, index: number) => {
                return (
                  <Fragment key={String(dm.channel_id || dm.channels_id)}>
                    <div
                      className={`flex items-start gap-3 px-3 py-4 hover:bg-[#4B4BB4] ${dm?.channel_id === id || dm?.channels_id === id ? "bg-[#4B4BB4]" : ""}`}
                      onClick={() =>
                        dm?.is_suggested
                          ? handleSuggestedRoute(dm)
                          : handleRoute(dm)
                      }
                    >
                      <div className="relative">
                        <UserAvatar item={dm} size="2xs" alt="avatar" />
                        {!isUserDeactivated(dm) && (
                          <span
                            className={`absolute -right-1 -bottom-1 ${dm?.participants?.some((p: any) => p.online) ? "bg-[#00AD51]" : "bg-[#F97316]"} w-[8px] h-[8px] rounded-full border border-white`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="relative flex justify-between items-start mb-1">
                          <span className="text-[15px] font-semibold text-white break-words max-w-[200px] line-clamp-2">
                            {dm.username}
                          </span>

                          <div className="">
                            {dm.thread_count > 0 && (
                              <div
                                className={cn(
                                  `absolute right-3 top-6 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-500 text-white tracking-[-0.5%] font-bold text-right text-[10px] px-2 size-5`
                                )}
                              >
                                {formatCount(dm?.thread_count || 0)}
                              </div>
                            )}
                            <span className="text-[12px] text-[#BABAFB]">
                              {moment(dm.last_read_at).format("LT")}
                            </span>
                          </div>
                        </div>
                        <p className="text-[14px] text-[#D0D0FD] break-words max-w-[200px] line-clamp-2">
                          {stripHtmlTags(dm.preview_message)}
                        </p>
                      </div>
                    </div>
                    {index !== searchData?.length - 1 && (
                      <hr className="border-[#5F5FE1]" />
                    )}
                  </Fragment>
                );
              })}

              {searchData?.length === 0 && (
                <p className="self-center mt-10">No recent messages</p>
              )}
            </div>
          </InfiniteScroll>
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
