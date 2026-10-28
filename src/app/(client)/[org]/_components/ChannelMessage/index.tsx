"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import UseChannel from "../../home/channels/hooks/channel-message";
import { DataContext } from "~/store/GlobalState";
import { groupMessagesByDate } from "~/utils/group-messages";
import InfiniteScroll from "react-infinite-scroll-component";
import ChannelIntro from "../channel-intro";
import Thread from "./thread";
import Message from "./message";
import EditMessageBox from "../message-box/edit";
import UserAvatar from "~/components/layout/user-avatar";
import { GetRequest, PutRequest } from "~/utils/new-request";
import { ACTIONS } from "~/store/Actions";
import { useParams } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { ArrowDownIcon, Pin } from "lucide-react";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useMessageHighlight } from "~/hooks/use-message-highlight";
import { useMessageDeepLink } from "~/hooks/use-message-deep-link";

const ChannelsMessage = () => {
  const { fetchMoreData, hasMore, loading } = UseChannel();
  const { state, dispatch } = useContext(DataContext);
  const { messages, user, isEdit, thread, notify, bookmarks, dataId } = state;
  const groupedMessages = groupMessagesByDate(messages);
  const params = useParams();
  const id = params.id as string;
  const [showBadge, setShowBadge] = useState(false);
  const [popupId, setPopupId] = useState<any>(null);
  const [unreadDividerId, setUnreadDividerId] = useState<string | null>(null);
  const [dividerOnTop, setDividerOnTop] = useState(false);

  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const hasDispatchedRef = useRef(false);
  const unreadCountRef = useRef<number>(0);
  const threadCountRef = useRef<number>(0);
  const capturedRef = useRef(false);

  // Keep threadCount in a ref so getData's identity stays stable
  useEffect(() => {
    threadCountRef.current = state?.threadCount || 0;
  }, [state?.threadCount]);

  const clearChannelUnread = useCallback(() => {
    dispatch({
      type: ACTIONS.UPDATE_THREAD_COUNT,
      payload: {
        channels_id: id,
        mention_count: 0,
        thread_count: 0,
      },
    });
    dispatch({ type: ACTIONS.THREAD_COUNT, payload: 0 });
  }, [dispatch, id]);

  const getData = useCallback(async () => {
    if (!id) return;
    // Capture unread count once per channel opening (before clearing)
    if (!capturedRef.current) {
      capturedRef.current = true;
      unreadCountRef.current = threadCountRef.current;
    }
    await GetRequest(`/threads/channels/${id}?page=1&limit=1`);
    clearChannelUnread();
  }, [id, clearChannelUnread]);

  // Reset unread capture when channel changes
  useEffect(() => {
    unreadCountRef.current = 0;
    capturedRef.current = false;
    setUnreadDividerId(null);
  }, [id]);

  // Mark as read and clear Nav highlight whenever this channel is opened
  useEffect(() => {
    if (!id) return;
    getData();
  }, [id, getData]);

  useEffect(() => {
    const container = scrollableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom = container.scrollTop >= 0;

      if (isAtBottom) {
        getData();
        hasDispatchedRef.current = true;
      } else if (!isAtBottom && hasDispatchedRef.current) {
        hasDispatchedRef.current = false;
      }

      setShowBadge(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);

    // Trigger initial check
    handleScroll();
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [getData]);

  // Runs when new messages arrive; reads the latest badge and user without re-running on them.
  const markReadOnNewMessage = useEffectEvent(() => {
    if (!showBadge && notify?.user_id !== user?.user_id) {
      getData();
    }
  });

  useEffect(() => {
    markReadOnNewMessage();
  }, [messages]);

  // Set unread divider position after messages load
  useEffect(() => {
    if (messages && messages.length > 0 && unreadCountRef.current > 0) {
      // In column-reverse, messages[0] is newest (bottom), messages[length-1] is oldest (top)
      // Unread messages are the newest ones, so divider goes before messages[unreadCount]
      const unreadIndex = Math.min(unreadCountRef.current, messages.length - 1);
      const firstUnread = messages[unreadIndex];
      if (firstUnread) {
        // Issue 2 fix: if unread boundary is beyond loaded messages, use the oldest loaded message
        const targetMsg =
          unreadCountRef.current >= messages.length
            ? messages[messages.length - 1]
            : firstUnread;
        setUnreadDividerId(`unread-divider-${targetMsg.thread_id}`);
        setDividerOnTop(unreadCountRef.current >= messages.length);
      }
    } else {
      setUnreadDividerId(null);
    }
  }, [messages]);

  // Scroll to the first unread message (not the older message above the divider)
  useEffect(() => {
    if (!unreadDividerId) return;
    const hasScrolled = { current: false };
    const timer = setTimeout(() => {
      if (hasScrolled.current) return;
      hasScrolled.current = true;
      // Issue 3 fix: scroll directly to the first unread message by thread ID
      const firstUnreadThreadId = unreadDividerId.replace(
        "unread-divider-",
        ""
      );
      const firstUnreadMsg = document.getElementById(
        `thread-${firstUnreadThreadId}`
      );
      if (firstUnreadMsg) {
        firstUnreadMsg.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [unreadDividerId]);

  const handleEditMessage = async (content: any) => {
    const payload = {
      content: content,
    };
    await PutRequest(`/threads/${thread?.thread_id}/channels/${id}`, payload);
    dispatch({
      type: ACTIONS.IS_EDIT,
      payload: false,
    });
  };

  useMessageDeepLink({
    messages: messages || [],
    loading,
  });

  useMessageHighlight({
    dataId,
    loading,
    chats: messages || [],
    hasMore,
    fetchMoreData,
  });

  return (
    <div
      id="scrollableDivs"
      ref={scrollableContainerRef}
      style={{
        height: hasMore || messages?.length ? "100dvh" : "",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        paddingBottom: "var(--chat-composer-height, 140px)",
      }}
      className="w-full"
    >
      {showBadge && state?.threadCount > 0 && (
        <Badge
          onClick={() => {
            if (scrollableContainerRef.current) {
              scrollableContainerRef.current.scrollTop = 0;
            }
            dispatch({
              type: ACTIONS.COUNT_CALLBACK,
              payload: !state?.countCallback,
            });
          }}
          className="absolute bottom-40 z-20 mx-auto cursor-pointer -translate-x-[50%] left-1/2 px-3 py-1.5 flex gap-1 bg-primary-500 font-normal text-white text-[0.8125rem] border border-[E6EAEF]"
        >
          <ArrowDownIcon />
          Latest messages
        </Badge>
      )}

      <InfiniteScroll
        dataLength={messages?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          messages?.length !== 0 && (
            <h4 className="my-5 text-xs text-center">
              Loading older threads...
            </h4>
          )
        }
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          overflow: "visible",
        }}
        scrollableTarget="scrollableDivs"
        inverse={true}
      >
        {Object.entries(groupedMessages)?.map(([dateLabel, threads]: any) => (
          <div key={dateLabel} className="flex flex-col-reverse">
            {threads?.map((item: any, index: number) => {
              const nextMessage = threads[index + 1];
              const shouldShowAvatar =
                !nextMessage ||
                nextMessage.user_id !== item.user_id ||
                nextMessage.type === "system";

              const isSaved = bookmarks?.some(
                (b: any) => b.thread_id === item.thread_id
              );

              // Check if this is the first unread message
              const isFirstUnread =
                unreadDividerId === `unread-divider-${item.thread_id}`;

              const unreadDividerEl = isFirstUnread ? (
                <div
                  id={unreadDividerId}
                  className="flex items-center gap-3 my-3 px-5"
                >
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#e5e7eb" }}
                  ></div>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: "#9CA3AF" }}
                  >
                    Unread messages
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#e5e7eb" }}
                  ></div>
                </div>
              ) : null;

              return (
                <React.Fragment key={index}>
                  {isFirstUnread && !dividerOnTop && unreadDividerEl}
                  {isEdit && thread?.thread_id === item?.thread_id ? (
                    <div
                      className={`flex mb-5 mt-2 z-10 px-5 py-3 bg-blue-50 w-full`}
                    >
                      <div className="mb-2 mr-3">
                        <UserAvatar item={item} size="md" />
                      </div>

                      <EditMessageBox
                        subscription={state?.channelSubscription}
                        sendMessage={handleEditMessage}
                      />
                    </div>
                  ) : (
                    <div
                      id={`thread-${item.thread_id}`}
                      className={`${item.is_pinned ? "bg-yellow-50" : isSaved ? "bg-primary-50" : item?.type === "thread" ? "" : "hover:bg-gray-50"} duration-500 ease-in-out`}
                    >
                      {item?.is_pinned ? (
                        <div className="flex items-center gap-2 bg-yellow-50 pl-10 text-[13px] font-semibold text-blue-100 pt-2">
                          <Pin size={13} className="text-[#667085] mt-[3px]" />
                          Pinned by{" "}
                          {user?.email === item?.pinned_details?.email
                            ? "you"
                            : item?.pinned_details?.username}
                        </div>
                      ) : isSaved ? (
                        <div
                          id={`thread-${item.thread_id}`}
                          className={`flex items-center gap-2 pl-10 text-[13px] font-bold text-blue-100 pt-2`}
                        >
                          <BookmarkFilledIcon
                            fontSize={13}
                            className="text-[#667085]"
                          />
                          Saved for Later
                        </div>
                      ) : null}

                      {item?.type === "thread" ? (
                        <Thread item={item} />
                      ) : (
                        <Message
                          item={item}
                          shouldShowAvatar={shouldShowAvatar}
                          setPopupId={setPopupId}
                          popupId={popupId}
                        />
                      )}
                    </div>
                  )}
                  {isFirstUnread && dividerOnTop && unreadDividerEl}
                </React.Fragment>
              );
            })}

            <div className="sticky top-0 z-10 my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dotted border-[#E6EAEF]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 py-1 text-[13px] text-[#101828] border border-[#E6EAEF] rounded-[30px]">
                  {dateLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>

      {/* ChannelIntro typically appears when all older messages are loaded */}
      {!hasMore && <ChannelIntro />}
    </div>
  );
};

export default ChannelsMessage;
