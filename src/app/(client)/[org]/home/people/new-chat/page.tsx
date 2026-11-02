"use client";
import { useContext, useEffect, useRef, useState } from "react";
import NewChatHeader from "../../../_components/new-chat-header";
import { User } from "../../../_components/new-chat-header";
import { PostRequest } from "~/utils/new-request";
import FirstPeopleMessage from "../../../_components/first-people-message";
import FirstMessageBox from "../../../_components/first-message-box";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { showError } from "~/components/toast/sonner";

type CreatedChat = {
  recipients: string;
  channelId: string;
  participantId?: string;
};

const NewChat = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { state, dispatch } = useContext(DataContext);
  const { orgSlug } = state;
  const createdChat = useRef<CreatedChat | null>(null);

  useEffect(() => {
    dispatch({ type: ACTIONS.CLEAR_CHATS });
    dispatch({ type: ACTIONS.PARTICIPANTS, payload: [] });
  }, [dispatch]);

  const handleSendMessage = async (
    uuid: string,
    content: string,
    medias: unknown[]
  ): Promise<{ destination: string } | false> => {
    if (selectedUsers.length < 1 || selectedUsers.length > 9) {
      showError("Select between 1 and 9 people before sending.");
      return false;
    }

    const orgId = localStorage.getItem("orgId") || "";
    const recipients = selectedUsers
      .map((user) => user.id)
      .sort()
      .join(",");
    const isDirectMessage = selectedUsers.length === 1;

    try {
      let chat = createdChat.current;
      if (!chat || chat.recipients !== recipients) {
        const res = isDirectMessage
          ? await PostRequest(`/organisations/${orgId}/dms`, {
              chat_type: "user",
              participant_id: selectedUsers[0].id,
            })
          : await PostRequest(`/organisations/${orgId}/group-dms`, {
              chat_type: "user",
              participants: selectedUsers.map((user) => user.id),
            });

        if (res?.status !== 200 && res?.status !== 201) {
          showError("Could not start the conversation. Please try again.");
          return false;
        }

        const channelId = res?.data?.data?.channel_id;
        const participantId = res?.data?.data?.participant_id;
        if (!channelId || (isDirectMessage && !participantId)) {
          showError("Could not start the conversation. Please try again.");
          return false;
        }

        chat = { recipients, channelId, participantId };
        createdChat.current = chat;
      }

      const messageRes = isDirectMessage
        ? await PostRequest(`/dms/channels/${chat.channelId}/threads`, {
            content,
            thread_id: uuid,
            media: medias,
          })
        : await PostRequest(`/group-dms/channels/${chat.channelId}/threads`, {
            content,
            media: medias,
          });

      if (messageRes?.status !== 200 && messageRes?.status !== 201) {
        showError(
          "Could not send your message. Your draft is saved. Try again."
        );
        return false;
      }

      dispatch({
        type: ACTIONS.GROUP_CALLBACK,
        payload: !state?.groupCallback,
      });
      return {
        destination: isDirectMessage
          ? `/${orgSlug}/home/people/${chat.channelId}/${chat.participantId}/dm`
          : `/${orgSlug}/home/people/${chat.channelId}/dms`,
      };
    } catch {
      showError("Could not send your message. Your draft is saved. Try again.");
      return false;
    }
  };

  //

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] relative w-full overflow-hidden">
      <NewChatHeader onUsersSelected={setSelectedUsers} />

      <FirstPeopleMessage selectedUsers={selectedUsers} />
      <FirstMessageBox sendMessage={handleSendMessage} />
    </div>
  );
};

export default NewChat;
