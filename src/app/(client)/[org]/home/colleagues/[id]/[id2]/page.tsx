"use client";
import React, { useContext, useEffect, useState } from "react";
import { GetRequest, PostRequest } from "~/utils/new-request";
import { DataContext } from "~/store/GlobalState";
import MessageBox from "../../../../_components/message-box";
import AgentMessage from "../../../../_components/agent-message";
import ChatConnection from "~/components/layout/centrifugo/chat-connection";
import { useParams } from "next/navigation";
import ColleaguesSidebar from "~/app/(client)/[org]/_components/profile-sidebar/colleages-sidebar";
import ColleagueHeader from "~/app/(client)/[org]/_components/colleagues/colleague-header";

const Page = () => {
  const { state } = useContext(DataContext);
  const { orgId, participant: participants } = state;
  const [participant, setParticipant] = useState<any>(participants);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const params = useParams();
  const id = params.id as string;

  // get the participant infor
  useEffect(() => {
    const getUser = async () => {
      const res = await GetRequest(
        `/organisations/${orgId}/dms/participants/${id}`
      );

      if (res?.status === 200 || res?.status === 201) {
        const userData = res?.data?.data.participants?.find(
          (item: any) => item.user_type === "bot"
        );
        setParticipant(userData);
      }
      setLoading(false);
    };

    if (orgId) {
      getUser();
    }
  }, []);

  const handleSendMessage = async (
    id: string,
    uuid: string,
    content: string,
    medias: any,
    mentions: any = state?.mentions
  ) => {
    const secondPayload = {
      content: content,
      media: medias,
      mentions: mentions,
    };

    try {
      const res = await PostRequest(
        `/dms/channels/${id}/threads`,
        secondPayload
      );

      if (res?.status !== 200 && res?.status !== 201) return false;
      // Dispatch custom event to trigger credit data refetch
      window.dispatchEvent(
        new CustomEvent("agentMessageSent", {
          detail: { agentId: id, content, timestamp: Date.now() },
        })
      );
      return true;
    } catch (error) {
      console.error("Error sending agent message:", error);
      return false;
    }
  };

  //

  return (
    <div className="flex h-[calc(100vh-70px)] relative w-full overflow-hidden">
      <ChatConnection />
      <div className={`relative flex flex-col flex-1`}>
        <ColleagueHeader user={participant} loading={loading} />

        <AgentMessage
          participant={participant}
          setShowProfile={setShowProfile}
          showProfile={showProfile}
        />

        <div className="absolute bottom-0 left-0 right-[17px]">
          <MessageBox
            subscription={state?.chatSubscription}
            sendMessage={handleSendMessage}
          />
        </div>
      </div>

      <div
        className={`fixed mt-[60px] right-0 top-0 z-20 w-full sm:w-[380px] h-full bg-white border-l border-[#E6EAEF] shadow-[-3px_0px_25px_0px_#DFDFDF] ${state?.showProfile ? "translate-x-0" : "translate-x-full"}`}
      >
        <ColleaguesSidebar user={participant} />
      </div>
    </div>
  );
};

export default Page;
