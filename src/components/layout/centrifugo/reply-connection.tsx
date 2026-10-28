"use client";
import { useContext, useEffect } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { usePathname } from "next/navigation";
import {
  getSharedCentrifuge,
  getSubscriptionToken,
  prepareChannelSubscription,
  releaseChannelSubscription,
} from "~/lib/centrifugo/shared-centrifuge";

/** eslint-disable */

//

export default function ReplyConnection() {
  const { state, dispatch } = useContext(DataContext);
  const pathname = usePathname();
  const isThreadsPage = pathname?.includes("/threads");

  // centrifugo connection for notification
  useEffect(() => {
    const threadId = state?.thread?.thread_id;
    if (!threadId) return;

    const centrifugeClient = getSharedCentrifuge();
    const sub = prepareChannelSubscription(centrifugeClient, threadId, {
      getToken: () => getSubscriptionToken(threadId),
    });

    const onSubscribed = () => {
      dispatch({ type: ACTIONS.REPLY_SUBSCRIPTION, payload: sub });
    };

    const onPublication = (ctx: any) => {
      console.log(ctx, "connection logs from reply-connection");
      if (ctx?.data?.type === "typing") {
        dispatch({
          type: ACTIONS.THREAD_TYPING,
          payload: {
            userId: ctx.data?.user?.id || ctx.data?.user?.user_id,
            username: ctx.data?.user?.username,
            typing: ctx.data?.typing,
          },
        });
        return;
      }

      if (ctx?.data?.type === "message") {
        dispatch({
          type: ACTIONS.THREAD_TYPING,
          payload: { userId: ctx.data?.user_id, typing: false },
        });
        dispatch({
          type: ACTIONS.REPLIES,
          payload: { newMessage: ctx.data, isRealTime: true },
        });
      }
    };

    const onError = (ctx: any) => {
      console.error(`Subscription error: ${ctx.message}`);
    };

    sub.on("subscribed", onSubscribed);
    sub.on("publication", onPublication);
    sub.on("error", onError);

    if (sub.state !== "subscribed") {
      sub.subscribe();
    } else {
      dispatch({ type: ACTIONS.REPLY_SUBSCRIPTION, payload: sub });
    }

    return () => {
      sub.off("subscribed", onSubscribed);
      sub.off("publication", onPublication);
      sub.off("error", onError);
      releaseChannelSubscription(centrifugeClient, threadId, sub);
      dispatch({ type: ACTIONS.REPLY_SUBSCRIPTION, payload: null });
      dispatch({ type: ACTIONS.CLEAR_THREAD_TYPING });
    };
  }, [dispatch, state?.thread?.thread_id]);

  // Threads page has no channel/DM connection — subscribe to the channel for reply realtime events.
  useEffect(() => {
    const channelId = state?.thread?.channels_id;
    if (!isThreadsPage || !channelId) return;

    const centrifugeClient = getSharedCentrifuge();
    const sub = prepareChannelSubscription(centrifugeClient, channelId, {
      getToken: () => getSubscriptionToken(channelId),
    });

    const onPublication = (ctx: any) => {
      const result = ctx?.data;

      if (
        result?.section === "reply_message" &&
        result?.notification_type === "updated"
      ) {
        const message = ctx?.data?.data;
        const messageId = ctx?.data?.modification_ids?.message_id;

        dispatch({
          type: ACTIONS.EDIT_REPLY_MESSAGE,
          payload: {
            threadId: messageId,
            newMessageData: message,
          },
        });
        return;
      }

      if (
        result?.section === "reply_message" &&
        result?.notification_type === "deleted"
      ) {
        const message = ctx?.data?.modification_ids;
        const updates = ctx?.data?.update_change;

        dispatch({
          type: ACTIONS.DELETE_MESSAGE_THREAD_REPLY,
          payload: {
            threadId: message.thread_id,
            messageId: message?.message_id,
            updates,
          },
        });
        return;
      }

      if (
        result?.section === "reply_message" &&
        result?.notification_type === "pinned_message_event"
      ) {
        const ids = ctx?.data?.modification_ids;

        dispatch({
          type: ACTIONS.UPDATE_REPLY_PIN,
          payload: {
            threadId: ids.message_id,
            is_pin: true,
            details: ctx?.data?.pinned_details,
          },
        });
        return;
      }

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
        return;
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

    return () => {
      sub.off("publication", onPublication);
      sub.off("error", onError);
      releaseChannelSubscription(centrifugeClient, channelId, sub);
    };
  }, [dispatch, isThreadsPage, state?.thread?.channels_id]);

  //

  return <></>;
}
