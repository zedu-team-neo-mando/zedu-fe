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
// @ts-ignore
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "../ChannelMessage/message";
import EditMessageBox from "../message-box/edit";
import Image from "next/image";
import images from "~/assets/images";
import { GetRequest, PostRequest, PutRequest } from "~/utils/new-request";
import { ACTIONS } from "~/store/Actions";
import { useParams, usePathname } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { ArrowDownIcon, Pin } from "lucide-react";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import MessageBox from "../message-box";

import ChannelConnection from "~/components/layout/centrifugo/channel-connection";

const BuzzChat = () => {
  const { fetchMoreData, hasMore, loading } = UseChannel();
  const { state, dispatch } = useContext(DataContext);
  const { messages, user, isEdit, thread, notify, bookmarks, dataId } = state;
  const groupedMessages = groupMessagesByDate(messages);
  const params = useParams();
  const id = params.id as string;
  const pathname = usePathname();
  const [showBadge, setShowBadge] = useState(false);
  const [popupId, setPopupId] = useState<any>(null);

  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const hasDispatchedRef = useRef(false);

  const getData = useCallback(async () => {
    await GetRequest(`/threads/channels/${id}?page=1&limit=1`);
  }, [id]);

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

  const handleSendMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any
  ) => {
    const payload = {
      content: content,
      thread_id: uuid,
      media: medias,
      mentions: state?.mentions,
    };

    await PostRequest(`/threads/${id}`, payload);
  };

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

  useEffect(() => {
    const highlightId = localStorage.getItem("data-id");

    if (!highlightId || !pathname.includes("/later")) return;

    const el = document.getElementById(`thread-${highlightId}`);

    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "center" });
      el.classList.add("bg-yellow-100");

      setTimeout(() => {
        el.classList.remove("bg-yellow-100");
      }, 1500);
    }
  }, [dataId, loading, pathname]);

  if (loading) return null;

  //

  return (
    <div className="flex flex-col h-full">
      <ChannelConnection />
      <div className="flex-grow overflow-y-auto">
        <div
          id="scrollableDivs"
          ref={scrollableContainerRef}
          style={{
            height: "100%",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column-reverse",
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
            {Object.entries(groupedMessages)?.map(
              ([dateLabel, threads]: any) => (
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
                          <div
                            className={`flex mb-5 mt-2 z-10 px-5 py-3 bg-blue-50 w-full`}
                          >
                            <div className="size-10 mb-2 mr-3">
                              <Image
                                src={
                                  item?.avatar_url
                                    ? item?.avatar_url
                                    : item?.user_type == "user" ||
                                        item?.user_type === ""
                                      ? images?.user
                                      : images?.bot
                                }
                                alt="avatar"
                                width={80}
                                height={40}
                                className="rounded-[7px] border size-10"
                              />
                            </div>

                            <EditMessageBox
                              subscription={state?.channelSubscription}
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
                                <Pin
                                  size={13}
                                  className="text-[#667085] mt-[3px]"
                                />
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
              )
            )}
          </InfiniteScroll>
        </div>
      </div>
      <div className="w-full">
        <MessageBox
          subscription={state?.channelSubscription}
          sendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default BuzzChat;
