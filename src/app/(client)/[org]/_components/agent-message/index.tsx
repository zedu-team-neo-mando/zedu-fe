"use client";
import React, { useContext } from "react";
import { DataContext } from "~/store/GlobalState";
import { groupMessagesByDate } from "~/utils/group-messages";
import InfiniteScroll from "react-infinite-scroll-component";
import UsePeopleMessage from "../../home/people/hooks/people-message";
import Message from "../ChannelMessage/message";
import Image from "next/image";
import images from "~/assets/images";
import UsernameHover from "../hover-card/username";
import { Button } from "~/components/ui/button";
import { ACTIONS } from "~/store/Actions";

const AgentMessage = ({ participant }: any) => {
  const { fetchMoreData, hasMore, loading } = UsePeopleMessage();
  const { state, dispatch } = useContext(DataContext);
  const { chats } = state;
  const groupedMessages = groupMessagesByDate(chats);

  if (loading) return null;
  //

  return (
    <div
      id="scrollableDivs"
      style={{
        height: "100vh",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        paddingBottom: "var(--chat-composer-height, 140px)",
      }}
      className="w-full"
    >
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
        {/* {agentState?.state === "working" && <ChatLoader />} */}
        {Object.entries(groupedMessages)?.map(([dateLabel, threads]: any) => (
          <div key={dateLabel} className="flex flex-col-reverse">
            {threads?.map((item: any, index: number) => {
              const nextMessage = threads[index + 1];
              const shouldShowAvatar =
                !nextMessage || nextMessage.email !== item.email;

              return (
                <React.Fragment key={index}>
                  <Message item={item} shouldShowAvatar={shouldShowAvatar} />
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

      {!hasMore && (
        <div className="mt-auto px-5">
          <div className="flex gap-2 items-center my-4">
            <div className="relative size-24">
              <Image
                key={participant?.id}
                src={
                  participant?.avatar_url
                    ? participant?.avatar_url
                    : participant?.user_type == "user" ||
                        participant?.user_type === ""
                      ? images?.user
                      : images?.bot
                }
                alt={participant?.username || "avatar"}
                width={100}
                height={100}
                className="rounded-lg border size-24 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#00AD51] w-3 h-3 rounded-full border border-white" />
            </div>
            <h3 className="text-lg font-bold text-[#1D2939]">
              {participant?.username}
            </h3>
          </div>
          <p className="text-[17px] text-[#344054] mb-2">
            This conversation is just between you and
            <UsernameHover item={participant} />. Check out their profile to
            learn about them.
          </p>
          <Button
            variant={"outline"}
            className="h-10"
            onClick={() =>
              dispatch({ type: ACTIONS.SHOW_PROFILE, payload: true })
            }
          >
            View Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default AgentMessage;
