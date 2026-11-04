"use client";
import React, { useContext, useEffect, useState } from "react";
import ChatHeader from "../../../_components/chat-nav";
import GroupMessage from "~/app/(client)/[org]/_components/group-message";
import { GetRequest, PostRequest } from "~/utils/new-request";
import { DataContext } from "~/store/GlobalState";
import MessageBox from "~/app/(client)/[org]/_components/message-box";
import ChatConnection from "~/components/layout/centrifugo/chat-connection";
import ThreadsSidebar, {
  threadsSidebarPanelClassName,
} from "~/app/(client)/[org]/_components/threads-sidebar";
import UseGroupReply from "../../../home/people/hooks/group-reply";
import { useParams } from "next/navigation";
import HoverSidebar from "~/app/(client)/[org]/_components/profile-sidebar/hover-sidebar";
import { cn } from "~/lib/utils";

const ChatPage = () => {
  const { state } = useContext(DataContext);
  const { orgId } = state;
  const [participants, setParticipants] = useState<any>(null);
  const { fetchMoreData, hasMore } = UseGroupReply();
  const params = useParams();
  const id = params.id as string;

  // get the participant infor
  useEffect(() => {
    const getUser = async () => {
      const res = await GetRequest(
        `/organisations/${orgId}/dms/participants/${id}`
      );
      if (res?.status === 200 || res?.status === 201) {
        setParticipants(res?.data?.data);
      }
    };

    if (orgId) {
      getUser();
    }
  }, []);

  // send message
  const handleSendMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any,
    mentions: any = state?.mentions
  ) => {
    const payload = {
      content: content,
      media: medias,
      mentions: mentions,
    };
    const res = await PostRequest(`/group-dms/channels/${id}/threads`, payload);
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
      thread_id: state?.thread?.thread_id,
      media: medias,
      mentions: mentions,
    };

    // save the data to the database
    const res = await PostRequest(`/group-dms/messages/${id}`, payload);
    return res?.status === 200 || res?.status === 201;
  };

  //

  return (
    <div className="flex h-[calc(100vh-70px)] relative w-full overflow-hidden">
      <ChatConnection />
      <div
        className={cn(
          "relative flex flex-col flex-1",
          state?.reply && "sm:mr-[440px]"
        )}
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

      <div
        className={`fixed mt-[60px] right-0 top-0 z-20 w-full sm:w-[408px] h-full bg-white border-l border-[#E6EAEF] shadow-[-3px_0px_25px_0px_#DFDFDF] ${state?.hoverProfile ? "translate-x-0" : "translate-x-full"}`}
      >
        <HoverSidebar />
      </div>

      <div
        className={cn(
          "fixed mt-[60px] right-0 top-0 z-20 h-full transition-transform duration-300 ease-in-out",
          threadsSidebarPanelClassName,
          state?.reply ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ThreadsSidebar
          handleSendMessage={handleReplyMessage}
          fetchMoreData={fetchMoreData}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};

export default ChatPage;
