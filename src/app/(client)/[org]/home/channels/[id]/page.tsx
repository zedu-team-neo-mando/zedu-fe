"use client";

import { useCallback, useContext, useEffect, useState } from "react";

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
import UseChannelReply from "../hooks/channel-reply";
import UseGetSingleChannel from "../hooks/get-single-channel";
import { useParams } from "next/navigation";
import ChannelAgoraConnection from "~/components/layout/centrifugo/channel-agora-connection";
import { ACTIONS } from "~/store/Actions";
import { useIsSmUp } from "~/hooks/use-media-query";
import { cn } from "~/lib/utils";
import RestrictedChannel from "../../../_components/restricted-channel";
import { ComposerSkeleton } from "../../../_components/ChannelMessage/channel-loading-skeleton";
import ErrorState, {
  ErrorStateVariant,
  errorVariantFromStatus,
} from "~/components/ui/error-state";
import ConversationSearchSidebar, {
  CONVERSATION_SEARCH_PANEL_TRANSITION,
  getConversationSearchSidebarWidth,
} from "../../../_components/conversation-search/conversation-search-sidebar";

const CHANNEL_ERROR_COPY: Partial<
  Record<ErrorStateVariant, { title: string; description: string }>
> = {
  "not-found": {
    title: "Channel not found",
    description:
      "This channel doesn't exist or has been deleted. Check the link, or pick a channel from the list.",
  },
  "no-access": {
    title: "You don't have access to this channel",
    description:
      "It may be private, or you may have been removed. Ask a channel admin to add you.",
  },
};

const ChannelsPage = () => {
  const params = useParams();
  const channelId = params?.id;

  const { state, dispatch } = useContext(DataContext);
  const { buzzSidebar, buzzView, user } = state;
  const { fetchMoreData, hasMore } = UseChannelReply();
  const isSmUp = useIsSmUp();
  const shouldShowBuzzSidePanel =
    buzzSidebar && (buzzView === "side" || buzzView === "full");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [render, setRender] = useState(true);
  const [channelError, setChannelError] = useState<ErrorStateVariant | null>(
    null
  );

  useEffect(() => {
    setChannelError(null);
  }, [channelId]);

  const handleChannelError = useCallback(
    (status: number | undefined | null) => {
      setChannelError(status === null ? null : errorVariantFromStatus(status));
    },
    []
  );

  useEffect(() => {
    if (!state?.channelReady) {
      setRender(false);
    }
  }, [state?.channelReady]);

  useEffect(() => {
    if (!buzzSidebar && isChatOpen) {
      setIsChatOpen(false);
    }
  }, [buzzSidebar, isChatOpen]);

  useEffect(() => {
    const updateDesktopState = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    updateDesktopState();
    window.addEventListener("resize", updateDesktopState);

    return () => window.removeEventListener("resize", updateDesktopState);
  }, []);

  // send messages
  const handleSendMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any
  ) => {
    // send client side update
    const optimisticMessage = {
      channels_id: id,
      thread_id: uuid,
      username: user?.username || "You",
      avatar_url: user?.avatar_url,
      message: content,
      created_at: new Date().toISOString(),
      status: "pending",
      type: "message",
      media: state.media,
      user_id: user?.user_id,
      reactions: null,
      isOptimistic: true,
    };

    dispatch({
      type: ACTIONS.MESSAGES,
      payload: { newMessage: optimisticMessage },
    });

    const payload = {
      content: content,
      thread_id: uuid,
      media: medias,
      mentions: state?.mentions,
    };

    await PostRequest(`/threads/${id}`, payload);
  };

  // reply messages
  const handleReplyMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any
  ) => {
    const optimisticMessage = {
      id: uuid,
      channels_id: id,
      thread_id: state?.thread?.thread_id,
      username: user?.username || "You",
      avatar_url: user?.avatar_url,
      message: content,
      created_at: new Date().toISOString(),
      status: "pending",
      type: "message",
      media: state.media,
      user_id: user?.user_id ?? user?.id,
      reactions: null,
      isOptimistic: true,
    };

    dispatch({
      type: ACTIONS.REPLIES,
      payload: { newMessage: optimisticMessage },
    });

    const payload = {
      content: content,
      channels_id: id,
      user_id: state?.user?.id,
      thread_id: state?.thread?.thread_id,
      media: medias,
      mentions: state?.mentions,
    };

    await PostRequest(`/channels/${id}/messages`, payload);
  };

  if (state?.channelloading) return null;

  // Calculate combined width of open side panels
  let totalSidePanelWidth = 0;

  const buzzRegionWidth = shouldShowBuzzSidePanel
    ? isDesktop && isChatOpen
      ? 820
      : 440
    : 0;
  totalSidePanelWidth += buzzRegionWidth;

  if (state?.hoverProfile) {
    totalSidePanelWidth += isSmUp ? 408 : 0;
  }
  if (state?.reply) {
    totalSidePanelWidth += getThreadsSidebarLayoutWidth(true, isSmUp);
  }
  totalSidePanelWidth += getConversationSearchSidebarWidth(
    Boolean(state?.conversationSearchOpen),
    isSmUp
  );

  const channelReady =
    String(state?.channelDetails?.channels_id || "") ===
    String(channelId || "");

  if (channelError) {
    return (
      <div className="flex h-[calc(100dvh-70px)] relative w-full overflow-hidden">
        <UseGetSingleChannel onError={handleChannelError} />
        <ErrorState
          variant={channelError}
          {...CHANNEL_ERROR_COPY[channelError]}
          action={{
            label: "Go to channels",
            href: `/${params?.org}/home/channels`,
          }}
          className="min-h-0 h-full"
        />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-70px)] relative w-full overflow-hidden">
      <UseGetSingleChannel onError={handleChannelError} />
      <ChannelConnection />
      <ChannelAgoraConnection />

      {/* MAIN CONTENT */}
      <div
        className={cn(
          "relative flex flex-col flex-1 transition-[margin]",
          CONVERSATION_SEARCH_PANEL_TRANSITION
        )}
        style={{ marginRight: `${totalSidePanelWidth}px` }}
      >
        <ChannelHeader />

        <ChannelsMessage />

        <div className="absolute bottom-0 left-0 right-[17px]">
          {/* Until this channel's details load we don't know whether the user
              may post, so never show an editable composer before then. */}
          {!channelReady ? (
            <ComposerSkeleton />
          ) : !render && state?.channelDetails?.access === false ? (
            <JoinChannel />
          ) : state?.channelDetails?.archived ? (
            <ArchivedChannel />
          ) : state?.channelDetails?.is_restricted ? (
            <RestrictedChannel />
          ) : (
            <MessageBox
              subscription={state?.channelSubscription}
              sendMessage={handleSendMessage}
              channelLoading={render}
            />
          )}
        </div>
      </div>

      {/* Master Side Panels Container - Holds all right-aligned panels */}
      <div
        className={cn(
          "fixed z-30 mt-[60px] right-0 top-0 h-full flex overflow-hidden transition-[width]",
          CONVERSATION_SEARCH_PANEL_TRANSITION,
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

        <ConversationSearchSidebar
          channelId={String(channelId || "")}
          conversationLabel={
            state?.channelName || state?.channelDetails?.name
              ? `#${state?.channelName || state?.channelDetails?.name}`
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ChannelsPage;
