"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { DataContext } from "~/store/GlobalState";
import { groupMessagesByDate } from "~/utils/group-messages";
import InfiniteScroll from "react-infinite-scroll-component";
import UsePeopleMessage from "../../home/people/hooks/people-message";
import UserAvatar from "~/components/layout/user-avatar";
import Message from "../ChannelMessage/message";
import { GetRequest, PutRequest } from "~/utils/new-request";
import { useParams } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { ArrowDownIcon, Pin } from "lucide-react";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import UsernameHover from "../hover-card/username";
import { useMessageHighlight } from "~/hooks/use-message-highlight";
import { useMessageDeepLink } from "~/hooks/use-message-deep-link";
import { ACTIONS } from "~/store/Actions";
import EditMessageBox from "../message-box/edit";

const GroupMessage = ({ participants }: any) => {
  const { fetchMoreData, hasMore, loading } = UsePeopleMessage();
  const { state, dispatch } = useContext(DataContext);
  const { chats, user, notify, bookmarks, dataId, isEdit, thread } = state;
  const groupedMessages = groupMessagesByDate(chats);
  const [showBadge, setShowBadge] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const [popupId, setPopupId] = useState<any>(null);

  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const hasDispatchedRef = useRef(false);

  const clearDmUnread = useCallback(() => {
    dispatch({
      type: ACTIONS.UPDATE_DM_COUNT,
      payload: {
        channel_id: id,
        thread_count: 0,
      },
    });
    dispatch({ type: ACTIONS.DM_COUNT, payload: 0 });
  }, [dispatch, id]);

  const getData = useCallback(async () => {
    if (!id) return;
    await GetRequest(`/group-dms/channels/${id}/threads?page=1&limit=1`);
    clearDmUnread();
  }, [id, clearDmUnread]);

  // Mark as read and clear Nav highlight whenever this group DM is opened
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
  }, [chats]);

  const handleEditMessage = async (content: any) => {
    const payload = {
      content,
    };

    await PutRequest(
      `/group-dms/thread/${thread?.thread_id}/channels/${id}`,
      payload
    );
    dispatch({
      type: ACTIONS.IS_EDIT,
      payload: false,
    });
  };

  useMessageDeepLink({
    messages: chats || [],
    loading,
  });

  useMessageHighlight({
    dataId,
    loading,
    chats,
    hasMore,
    fetchMoreData,
  });

  // if (loading) return null;

  //

  return (
    <div
      id="scrollableDivs"
      ref={scrollableContainerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        paddingBottom: "var(--chat-composer-height, 140px)",
      }}
      className="w-full"
    >
      {showBadge && state?.dmCount > 0 && (
        <Badge
          onClick={() => {
            if (scrollableContainerRef.current) {
              scrollableContainerRef.current.scrollTop = 0;
            }
            getData();
          }}
          className="absolute bottom-40 z-20 mx-auto cursor-pointer -translate-x-[50%] left-1/2 px-3 py-1.5 flex gap-1 bg-primary-500 font-normal text-white text-[0.8125rem] border border-[E6EAEF]"
        >
          <ArrowDownIcon />
          Latest messages
        </Badge>
      )}

      <InfiniteScroll
        dataLength={chats?.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          chats?.length !== 0 && (
            <h4 className="my-5 text-xs text-center">Loading threads...</h4>
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
                !nextMessage || nextMessage.user_id !== item.user_id;

              const isSaved = bookmarks?.some(
                (b: any) => b.thread_id === item.thread_id
              );

              return (
                <React.Fragment key={index}>
                  {isEdit && thread?.thread_id === item?.thread_id ? (
                    <div className="flex mb-5 mt-2 z-10 bg-white px-5 py-3 bg-blue-50 w-full">
                      <div className="mb-2 mr-3">
                        <UserAvatar item={item} size="md" alt="group-dm" />
                      </div>

                      <EditMessageBox
                        subscription={state?.chatSubscription}
                        sendMessage={handleEditMessage}
                      />
                    </div>
                  ) : (
                    <div
                      id={`thread-${item.thread_id}`}
                      className={`${item.is_pinned ? "bg-yellow-50" : isSaved ? "bg-primary-50" : "hover:bg-gray-50"} duration-500 ease-in-out`}
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
                        setPopupId={setPopupId}
                        popupId={popupId}
                      />
                    </div>
                  )}
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

      {participants?.length > 0 && (
        <div className="px-5 my-5">
          <div className="flex gap-2 mb-4">
            {participants?.map((user: any) => (
              <UserAvatar
                key={user.user_id}
                item={user}
                size="intro"
                alt={user.username}
                imageClassName="rounded-lg"
                className="rounded-lg"
              />
            ))}
          </div>
          <p className="text-[17px] text-[#344054] mb-2">
            This is the very beginning of your direct message history with
            {participants?.map((user: any, index: number) => (
              <React.Fragment key={index}>
                <UsernameHover item={user} />
                {index < participants?.length - 2 && ", "}
                {index === participants?.length - 2 && " and"}
              </React.Fragment>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupMessage;
