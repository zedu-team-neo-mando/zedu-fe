"use client";
import { useContext, useEffect, useState } from "react";
import ChatDemo from "~/app/(client)/[org]/_components/buzz-management/ChatDemo";
// import ChatBuzzSidePanel from "~/app/(client)/[org]/_components/buzz-management/chatBuzzSidePanel";
import ChatHeader from "../../../../_components/chat-nav";
import GroupMessage from "~/app/(client)/[org]/_components/group-message";
import { GetRequest, PostRequest } from "~/utils/new-request";
import { DataContext } from "~/store/GlobalState";
import MessageBox from "~/app/(client)/[org]/_components/message-box";
import ChatConnection from "~/components/layout/centrifugo/chat-connection";
import ThreadsSidebar, {
  getThreadsSidebarLayoutWidth,
  threadsSidebarPanelClassName,
} from "~/app/(client)/[org]/_components/threads-sidebar";
import UseGroupReply from "../../hooks/group-reply";
import { useParams } from "next/navigation";
import HoverSidebar from "~/app/(client)/[org]/_components/profile-sidebar/hover-sidebar";
import ChatAgoraConnection from "~/components/layout/centrifugo/chat-agora-connection";
import { ACTIONS } from "~/store/Actions";
import { useIsSmUp } from "~/hooks/use-media-query";
import { cn } from "~/lib/utils";
import ConversationSearchSidebar, {
  CONVERSATION_SEARCH_PANEL_TRANSITION,
  getConversationSearchSidebarWidth,
} from "~/app/(client)/[org]/_components/conversation-search/conversation-search-sidebar";

const ChatPage = () => {
  const { state, dispatch } = useContext(DataContext);
  const { orgId, dmDetails, participants: previewParticipants, user } = state;
  const [participants, setParticipants] = useState<any>(null);
  const [fetchedChannelId, setFetchedChannelId] = useState<string | null>(null);
  const { fetchMoreData, hasMore } = UseGroupReply();
  const isSmUp = useIsSmUp();
  const params = useParams();
  const id = params.id as string;

  // Keep local header state in sync when membership changes in global state.
  useEffect(() => {
    setParticipants(previewParticipants);
  }, [previewParticipants]);

  // get the participant infor
  useEffect(() => {
    if (!orgId || !id) return;

    let cancelled = false;

    const getUser = async () => {
      const res = await GetRequest(
        `/organisations/${orgId}/dms/participants/${id}`
      );
      if (cancelled) return;
      if (res?.status === 200 || res?.status === 201) {
        const list = res?.data?.data.participants ?? [];
        setParticipants(list);
        setFetchedChannelId(id);
        dispatch({ type: ACTIONS.PARTICIPANTS, payload: list });
      }
    };

    void getUser();

    return () => {
      cancelled = true;
    };
  }, [id, orgId, dispatch]);

  // send message
  const handleSendMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any
  ) => {
    const payload = {
      content: content,
      media: medias,
      mentions: state?.mentions,
    };
    const res = await PostRequest(`/group-dms/channels/${id}/threads`, payload);
    // Tells the message box whether to keep the typed text as a draft.
    return res?.status === 200 || res?.status === 201;
  };

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
      thread_id: state?.thread?.thread_id,
      media: medias,
      mentions: state?.mentions,
    };

    await PostRequest(`/group-dms/messages/${id}`, payload);
  };

  //

  let totalSidePanelWidth = 0;
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

  return (
    <div className="flex h-[calc(100vh-70px)] relative w-full overflow-hidden">
      <ChatConnection />
      <div
        className={cn(
          "relative flex flex-col flex-1 transition-[margin]",
          CONVERSATION_SEARCH_PANEL_TRANSITION
        )}
        style={{ marginRight: `${totalSidePanelWidth}px` }}
      >
        <ChatHeader participants={participants} />
        <GroupMessage participants={participants} />
        <div className="absolute bottom-0 left-0 right-[17px]">
          <MessageBox
            subscription={state?.chatSubscription}
            sendMessage={handleSendMessage}
          />
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
          <div className="w-[408px] h-full bg-white border-l border-[#E6EAEF] shadow-[-3px_0px_25px_0px_#DFDFDF]">
            <HoverSidebar />
          </div>
        )}

        {/* Threads Sidebar */}
        {state?.reply && (
          <div
            className={cn(
              threadsSidebarPanelClassName,
              "shadow-[-3px_0px_27px_0px_#DFDFDF]"
            )}
          >
            <ThreadsSidebar
              handleSendMessage={handleReplyMessage}
              fetchMoreData={fetchMoreData}
              hasMore={hasMore}
            />
          </div>
        )}

        <ConversationSearchSidebar
          channelId={id}
          conversationLabel={state?.dmDetails?.name || "Group chat"}
        />
      </div>
    </div>
  );
};

export default ChatPage;
