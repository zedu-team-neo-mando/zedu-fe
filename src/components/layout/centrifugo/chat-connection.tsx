"use client";
import { useContext, useEffect, useRef } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { useParams } from "next/navigation";
import {
  getSharedCentrifuge,
  getSubscriptionToken,
  prepareChannelSubscription,
  releaseChannelSubscription,
} from "~/lib/centrifugo/shared-centrifuge";

/** eslint-disable */

const getParticipantId = (participant: any) =>
  String(participant?.user_id ?? participant?.id ?? "");

const removeParticipantFromList = (list: any[] | undefined, userId: string) =>
  (list || []).filter(
    (participant) => getParticipantId(participant) !== userId
  );

const updateConversationParticipants = (
  conversations: any[] | undefined,
  channelId: string,
  nextParticipants: any[]
) =>
  (conversations || []).map((conversation) => {
    if (
      String(conversation?.channel_id || conversation?.channels_id) !==
      String(channelId)
    ) {
      return conversation;
    }

    return {
      ...conversation,
      participants: nextParticipants,
      username: nextParticipants
        .map((participant) => participant?.username)
        .filter(Boolean)
        .join(", "),
    };
  });

const resolveLeftUserId = (result: any, data: any) => {
  const leftUser =
    result?.data?.user_left ||
    result?.data?.left_user ||
    result?.data?.removed_user ||
    result?.data?.user ||
    data?.user_left ||
    data?.left_user ||
    data?.removed_user ||
    null;

  return String(
    leftUser?.user_id ??
      leftUser?.id ??
      result?.data?.user_id ??
      result?.data?.left_user_id ??
      result?.data?.participant_id ??
      result?.modification_ids?.user_id ??
      result?.modification_ids?.participant_id ??
      data?.user_id ??
      ""
  );
};

const isGroupMembershipLeaveEvent = (result: any, data: any) => {
  const notificationType = String(
    result?.notification_type || ""
  ).toLowerCase();
  const event = String(
    result?.event || data?.event || result?.data?.event || ""
  ).toLowerCase();
  const message = String(
    data?.message || result?.data?.message || ""
  ).toLowerCase();

  return (
    notificationType.includes("member_left") ||
    notificationType.includes("participant_left") ||
    notificationType.includes("user_left_group") ||
    notificationType.includes("left_group") ||
    notificationType.includes("member_removed") ||
    notificationType.includes("removed_participant") ||
    notificationType.includes("leave_conversation") ||
    event.includes("member_left") ||
    event.includes("participant_left") ||
    event.includes("user_left_group") ||
    event.includes("left_group") ||
    event.includes("member_removed") ||
    ((data?.type === "system" || data?.user_type === "system") &&
      (message.includes("left") || message.includes("removed")))
  );
};

//

export default function ChatConnection() {
  const params = useParams();
  const id = params.id as string;
  const { state, dispatch } = useContext(DataContext);
  const { homeDmsCallback } = state;
  const participantsRef = useRef(state.participants);
  const dmsRef = useRef(state.dms);
  const homeDmsRef = useRef(state.homeDms);

  useEffect(() => {
    participantsRef.current = state.participants;
  }, [state.participants]);

  useEffect(() => {
    dmsRef.current = state.dms;
  }, [state.dms]);

  useEffect(() => {
    homeDmsRef.current = state.homeDms;
  }, [state.homeDms]);

  // centrifugo connection for notification
  useEffect(() => {
    if (id) {
      const centrifugeClient = getSharedCentrifuge();
      const sub = prepareChannelSubscription(centrifugeClient, id, {
        getToken: () => getSubscriptionToken(id),
      });

      const applyParticipantsUpdate = (nextParticipants: any[]) => {
        dispatch({ type: ACTIONS.PARTICIPANTS, payload: nextParticipants });
        dispatch({
          type: ACTIONS.DMS,
          payload: updateConversationParticipants(
            dmsRef.current,
            id,
            nextParticipants
          ),
        });
        dispatch({
          type: ACTIONS.HOME_DMS,
          payload: updateConversationParticipants(
            homeDmsRef.current,
            id,
            nextParticipants
          ),
        });
      };

      const onPublication = (ctx: any) => {
        const result = ctx?.data;
        const { data } = ctx;

        if (data?.type === "typing") {
          dispatch({
            type: ACTIONS.USER_TYPING,
            payload: {
              userId: data?.user?.id || data?.user?.user_id,
              username: data?.user?.username,
              typing: data?.typing,
            },
          });
          return;
        }

        if (data?.type === "message" && data.user_type === "user") {
          dispatch({
            type: ACTIONS.USER_TYPING,
            payload: {
              userId: data?.user_id,
              typing: false,
            },
          });
          dispatch({
            type: ACTIONS.CHATS,
            payload: { newMessage: data, isRealTime: true },
          });
          dispatch({ type: ACTIONS.HOME_DMS_CALLBACK });
        }

        if (
          data?.type === "system" ||
          (data?.type === "message" && data?.user_type === "system")
        ) {
          dispatch({
            type: ACTIONS.CHATS,
            payload: { newMessage: data, isRealTime: true },
          });
        }

        if (
          data?.type === "message" &&
          data.user_type === "bot" &&
          data?.streaming
        ) {
          dispatch({
            type: ACTIONS.STREAM_APPEND,
            payload: { message: data },
          });
        }

        // Keep group member lists in sync when someone leaves/is removed.
        if (isGroupMembershipLeaveEvent(result, data)) {
          const nextParticipantsFromEvent =
            result?.data?.participants || data?.participants;

          if (Array.isArray(nextParticipantsFromEvent)) {
            applyParticipantsUpdate(nextParticipantsFromEvent);
          } else {
            const leftUserId = resolveLeftUserId(result, data);
            if (leftUserId) {
              applyParticipantsUpdate(
                removeParticipantFromList(participantsRef.current, leftUserId)
              );
            }
          }
        } else if (
          Array.isArray(result?.data?.participants) &&
          (String(result?.notification_type || "")
            .toLowerCase()
            .includes("participant") ||
            String(result?.notification_type || "")
              .toLowerCase()
              .includes("member") ||
            String(result?.event || result?.data?.event || "")
              .toLowerCase()
              .includes("participant") ||
            String(result?.event || result?.data?.event || "")
              .toLowerCase()
              .includes("member"))
        ) {
          applyParticipantsUpdate(result.data.participants);
        }

        // update the reply count from reply message
        if (
          result?.section === "channels_section" &&
          result?.notification_type === "reply_count_change"
        ) {
          const message = ctx?.data?.data;
          const updates = ctx?.data?.update_change;

          dispatch({
            type: ACTIONS.UPDATE_DM_MESSAGE_THREAD,
            payload: {
              threadId: message.thread_id,
              reply: message,
              updates,
            },
          });
          dispatch({
            type: ACTIONS.HOME_DMS_CALLBACK,
            payload: !homeDmsCallback,
          });
        }

        // update the message count for agents
        if (
          result?.section === "agent_channels_section" &&
          result?.notification_type === "reply_count_change"
        ) {
          const message = ctx?.data?.data;
          const updates = ctx?.data?.update_change;

          dispatch({
            type: ACTIONS.UPDATE_DM_MESSAGE_THREAD,
            payload: {
              threadId: message.thread_id,
              reply: message,
              updates,
            },
          });
        }

        if (
          result?.section === "reply_message" &&
          result?.notification_type === "deleted"
        ) {
          const message = ctx?.data?.modification_ids;
          const updates = ctx?.data?.update_change;

          dispatch({
            type: ACTIONS.DELETE_DM_THREAD_REPLY,
            payload: {
              threadId: message.thread_id,
              messageId: message?.message_id,
              updates,
            },
          });
        }

        // delete dm message
        if (
          result?.section === "thread_message" &&
          result?.notification_type === "deleted"
        ) {
          const message = ctx?.data?.modification_ids;

          dispatch({
            type: ACTIONS.DELETE_DM_MESSAGE,
            payload: {
              threadId: message.thread_id,
            },
          });
        }

        // Edit dm message
        if (
          result?.section === "thread_message" &&
          result?.notification_type === "updated"
        ) {
          const message = ctx?.data?.data;

          dispatch({
            type: ACTIONS.EDIT_DM_MESSAGE,
            payload: {
              threadId: message.thread_id,
              newMessageData: message,
            },
          });
        }

        // Edit reply message
        if (
          result?.section === "reply_message" &&
          result?.notification_type === "updated"
        ) {
          const message = ctx?.data?.data;
          const id = ctx?.data?.modification_ids?.message_id;

          dispatch({
            type: ACTIONS.EDIT_REPLY_MESSAGE,
            payload: {
              threadId: id,
              newMessageData: message,
            },
          });
        }

        // pinned message
        if (
          result?.section === "thread_message" &&
          result?.notification_type === "pinned_message_event"
        ) {
          const ids = ctx?.data?.modification_ids;
          const details = ctx?.data?.pinned_details;

          dispatch({
            type: ACTIONS.UPDATE_DM_PIN,
            payload: {
              threadId: ids.thread_id,
              is_pin: true,
              details,
            },
          });
        }

        // pinned reply
        if (
          result?.section === "reply_message" &&
          result?.notification_type === "pinned_message_event"
        ) {
          const ids = ctx?.data?.modification_ids;
          const details = ctx?.data?.pinned_details;

          dispatch({
            type: ACTIONS.UPDATE_REPLY_PIN,
            payload: {
              threadId: ids.message_id,
              is_pin: true,
              details,
            },
          });
        }

        // unpinned message
        if (
          result?.section === "thread_message" &&
          result?.notification_type === "unpinned_message_event"
        ) {
          const ids = ctx?.data?.modification_ids;

          dispatch({
            type: ACTIONS.UPDATE_DM_PIN,
            payload: {
              threadId: ids.thread_id,
              is_pin: false,
            },
          });
        }

        // unpinned reply
        if (
          result?.section === "reply_message" &&
          result?.notification_type === "unpinned_message_event"
        ) {
          const ids = ctx?.data?.modification_ids;

          dispatch({
            type: ACTIONS.UPDATE_REPLY_PIN,
            payload: {
              threadId: ids.message_id,
              is_pin: false,
            },
          });
        }

        // =======REACTIONS=============

        //  dm thread
        if (
          result?.section === "thread_message" &&
          result?.notification_type === "reaction_event"
        ) {
          const ids = ctx?.data?.modification_ids;
          const reactions = ctx?.data?.reactions;

          dispatch({
            type: ACTIONS.UPDATE_DM_REACTIONS,
            payload: {
              threadId: ids.thread_id,
              reactions,
            },
          });
        }

        if (
          result?.section === "reply_message" &&
          result?.notification_type === "reaction_event"
        ) {
          const ids = ctx?.data?.modification_ids;
          const reactions = ctx?.data?.reactions;
          const messageId = ids?.message_id;

          if (messageId) {
            dispatch({
              type: ACTIONS.UPDATE_REPLY_REACTIONS,
              payload: {
                messageId,
                reactions,
              },
            });
          }
        }
      };

      const onError = (ctx: any) => {
        console.error(`Subscription error: ${ctx.message}`);
      };

      sub.on("publication", onPublication);
      sub.on("error", onError);

      if (sub.state !== "subscribed") {
        sub.subscribe();
      }
      dispatch({ type: ACTIONS.CHAT_SUBSCRIPTION, payload: sub });

      // Cleanup on channel change or unmount — keep the shared connection alive
      return () => {
        sub.off("publication", onPublication);
        sub.off("error", onError);
        releaseChannelSubscription(centrifugeClient, id, sub);
        dispatch({ type: ACTIONS.CHAT_SUBSCRIPTION, payload: null });
        dispatch({ type: ACTIONS.CLEAR_TYPING });
      };
    }
  }, [id, dispatch]);

  //

  return <></>;
}
