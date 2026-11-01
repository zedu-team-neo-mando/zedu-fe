"use client";

import React, { useContext, useState } from "react";

import ArchivedChannel from "../../../_components/archived-channel";
import ChannelConnection from "~/components/layout/centrifugo/channel-connection";
import ChannelHeader from "../../../_components/channel-nav";
import ChannelsMessage from "../../../_components/ChannelMessage";
import { DataContext } from "~/store/GlobalState";
import HoverSidebar from "../../../_components/profile-sidebar/hover-sidebar";
import JoinChannel from "../../../_components/join-channel";
import MessageBox from "../../../_components/message-box";
import { PostRequest } from "~/utils/new-request";
import ThreadsSidebar, {
  getThreadsSidebarLayoutWidth,
  threadsSidebarPanelClassName,
} from "../../../_components/threads-sidebar";
import UseChannelReply from "../../../home/channels/hooks/channel-reply";
import UseGetSingleChannel from "../../../home/channels/hooks/get-single-channel";
import { useIsSmUp } from "~/hooks/use-media-query";
import { cn } from "~/lib/utils";

const ChannelsPage = () => {
  const { state, dispatch } = useContext(DataContext);
  const { fetchMoreData, hasMore } = UseChannelReply();
  const isSmUp = useIsSmUp();

  const [showBuzzPanel, setShowBuzzPanel] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSendMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any,
    mentions: any = state?.mentions
  ) => {
    const payload = {
      content: content,
      thread_id: uuid,
      media: medias,
      mentions: mentions,
    };

    const res = await PostRequest(`/threads/${id}`, payload);
    return res?.status === 200 || res?.status === 201;
  };

  const handleReplyMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any,
    mentions: any = state?.mentions
  ) => {
    const payload = {
      content: content,
      channels_id: id,
      user_id: state?.user?.id,
      thread_id: state?.thread?.thread_id,
      media: medias,
      mentions: mentions,
    };

    const res = await PostRequest(`/channels/${id}/messages`, payload);
    return res?.status === 200 || res?.status === 201;
  };

  if (state?.channelloading) return null;

  // Calculate combined width of open side panels
  let totalSidePanelWidth = 0;
  if (showBuzzPanel) {
    totalSidePanelWidth += isSmUp ? 440 : 0; // BuzzSidePanel width
  }
  if (isChatOpen) {
    totalSidePanelWidth += isSmUp ? 305 : 0; // ChatDemo width
  }
  // Add other fixed sidebars if they are also open
  if (state?.hoverProfile) {
    totalSidePanelWidth += isSmUp ? 408 : 0; // HoverSidebar width
  }
  if (state?.reply) {
    totalSidePanelWidth += getThreadsSidebarLayoutWidth(true, isSmUp);
  }

  return (
    <div className="flex h-[calc(100vh-70px)] relative w-full overflow-hidden">
      <ChannelConnection />
      <UseGetSingleChannel />

      {/* MAIN CONTENT */}
      <div
        className="relative flex flex-col flex-1 transition-[margin] duration-300 ease-in-out"
        style={{ marginRight: `${totalSidePanelWidth}px` }}
      >
        <ChannelHeader />

        <ChannelsMessage />

        <div className="absolute bottom-0 left-0 right-[17px]">
          {!state?.channelloading && state?.channelDetails?.access === false ? (
            <JoinChannel />
          ) : state?.channelDetails?.archived ? (
            <ArchivedChannel />
          ) : (
            <MessageBox
              subscription={state?.channelSubscription}
              sendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>

      {/* Master Side Panels Container - Holds all right-aligned panels */}
      <div
        className={cn(
          "fixed z-30 mt-[60px] right-0 top-0 h-full flex transition-all duration-300 ease-in-out",
          !isSmUp && state?.reply && "w-full"
        )}
        style={
          !isSmUp && state?.reply
            ? undefined
            : { width: `${totalSidePanelWidth}px` }
        }
      >
        {/* Hover Sidebar */}
        {state?.hoverProfile && isSmUp && (
          <div className="w-[408px] h-full bg-white border-l border-[#E6EAEF]">
            <HoverSidebar />
          </div>
        )}

        {/* Threads Sidebar */}
        {state?.reply && (
          <div className={threadsSidebarPanelClassName}>
            <ThreadsSidebar
              handleSendMessage={handleReplyMessage}
              fetchMoreData={fetchMoreData}
              hasMore={hasMore}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelsPage;
