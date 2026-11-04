"use client";
import { useContext, useEffect, useRef } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { showInfo } from "~/components/toast/sonner";
import { playBuzzParticipantJoinSound } from "~/lib/buzz/play-join-sound";
import { RECORDER_SESSION_MODE } from "~/lib/buzz/session";
import { useParams } from "next/navigation";
import {
  getSharedCentrifuge,
  getSubscriptionToken,
  prepareChannelSubscription,
  releaseChannelSubscription,
} from "~/lib/centrifugo/shared-centrifuge";

export default function AgoraConnection() {
  const params = useParams();
  const id = params.id as string;
  const { state, dispatch } = useContext(DataContext);
  const { user, buzzParticipants, buzzChats, buzzSessionMode, buzzData } =
    state;

  const participantsRef = useRef(buzzParticipants);
  const chatsRef = useRef(buzzChats);
  const muteRef = useRef(state.muteParticipant);
  const hasJoinedRef = useRef(state.hasJoined);
  const isRecorderSessionRef = useRef(
    buzzSessionMode === RECORDER_SESSION_MODE
  );
  const buzzDataRef = useRef(buzzData);

  useEffect(() => {
    participantsRef.current = buzzParticipants;
  }, [buzzParticipants]);

  useEffect(() => {
    chatsRef.current = buzzChats;
  }, [buzzChats]);

  useEffect(() => {
    muteRef.current = state.muteParticipant;
  }, [state.muteParticipant]);

  useEffect(() => {
    hasJoinedRef.current = state.hasJoined;
  }, [state.hasJoined]);

  useEffect(() => {
    isRecorderSessionRef.current = buzzSessionMode === RECORDER_SESSION_MODE;
  }, [buzzSessionMode]);

  useEffect(() => {
    buzzDataRef.current = buzzData;
  }, [buzzData]);

  useEffect(() => {
    if (!id) return;

    const centrifugeClient = getSharedCentrifuge();
    const sub = prepareChannelSubscription(centrifugeClient, id, {
      getToken: () => getSubscriptionToken(id),
    });

    const onPublication = async (ctx: any) => {
      const payload = ctx?.data;
      const currentParticipants = participantsRef.current || [];
      const currentChats = chatsRef.current || [];

      if (
        payload?.notification_type === "user_joined_buzz" ||
        payload?.event === "user_joined_buzz"
      ) {
        const buzzEventData = payload?.data;
        const newUser = buzzEventData?.user_joined;

        if (newUser && newUser.user_id) {
          const alreadyExists = currentParticipants.some(
            (p: any) => String(p.user_id) === String(newUser.user_id)
          );

          if (!alreadyExists) {
            const participantToAdd = {
              ...newUser,
              videoTrack: null,
              audioTrack: null,
              handsRaised: false,
              isPinned: false,
              status: "active",
            };

            const nextParticipants = [...currentParticipants, participantToAdd];
            participantsRef.current = nextParticipants;
            dispatch({
              type: ACTIONS.BUZZ_PARTICIPANTS,
              payload: nextParticipants,
            });

            if (String(newUser.user_id) !== String(user?.user_id)) {
              playBuzzParticipantJoinSound({
                joiningUserId: newUser.user_id,
                isInCall: hasJoinedRef.current,
                isRecorderSession: isRecorderSessionRef.current,
              });
              if (!isRecorderSessionRef.current) {
                showInfo(
                  `${newUser.username || "A participant"} joined the buzz`
                );
              }
            }
          }
        }
      }

      if (
        payload?.notification_type === "user_left_buzz" ||
        payload?.event === "user_left_buzz"
      ) {
        const buzzEventData = payload;
        const userWhoLeft = buzzEventData?.user_left;

        if (userWhoLeft && userWhoLeft.user_id) {
          const updatedParticipants = currentParticipants.filter(
            (p: any) => String(p.user_id) !== String(userWhoLeft.user_id)
          );

          dispatch({
            type: ACTIONS.BUZZ_PARTICIPANTS,
            payload: updatedParticipants,
          });

          if (String(userWhoLeft.user_id) !== String(user?.user_id)) {
            showInfo(
              `${userWhoLeft.username || "A participant"} left the buzz`
            );
          }
        }
      }

      if (payload?.notification_type === "buzz_reaction_event") {
        const reactionData = payload.data;

        if (reactionData?.user_id === user?.user_id) return;

        if (reactionData?.reaction_type === "emoji") {
          const id = Date.now() + Math.random();

          const newFloatingEmoji = {
            id,
            emoji: reactionData.content,
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
            y: window.innerHeight - 100,
            name: reactionData.username,
            jitter: (Math.random() - 0.5) * 80,
          };

          dispatch({
            type: ACTIONS.ADD_FLOATING_EMOJI,
            payload: newFloatingEmoji,
          });

          setTimeout(() => {
            dispatch({ type: ACTIONS.REMOVE_FLOATING_EMOJI, payload: id });
          }, 3000);
        }
      }

      if (payload?.notification_type === "buzz_sticker_event") {
        const stickerData = payload.data;
        const latestParticipants = participantsRef.current || [];

        if (stickerData?.sticker === "raise_hand") {
          const updated = latestParticipants.map((p: any) =>
            String(p.user_id) === String(stickerData.user_id)
              ? { ...p, handsRaised: true }
              : p
          );
          dispatch({ type: ACTIONS.BUZZ_PARTICIPANTS, payload: updated });
        }

        if (stickerData?.sticker === "away") {
          const updated = latestParticipants.map((p: any) =>
            String(p.user_id) === String(stickerData.user_id)
              ? { ...p, handsRaised: false }
              : p
          );

          dispatch({ type: ACTIONS.BUZZ_PARTICIPANTS, payload: updated });
        }
      }

      if (payload?.type === "buzz_message") {
        dispatch({
          type: ACTIONS.BUZZ_CHATS,
          payload: [...currentChats, payload],
        });
      }

      if (payload?.event === "recording_started") {
        dispatch({
          type: ACTIONS.BUZZ_DATA,
          payload: {
            ...buzzDataRef.current,
            is_recording: true,
          },
        });
      }

      if (payload?.event === "recording_stopped") {
        dispatch({
          type: ACTIONS.BUZZ_DATA,
          payload: {
            ...buzzDataRef.current,
            is_recording: false,
          },
        });
      }

      if (
        payload?.notification_type === "mute_participants" ||
        payload?.event === "mute_participants"
      ) {
        dispatch({
          type: ACTIONS.MUTE_PARTICIPANT,
          payload: !muteRef.current,
        });

        if (!muteRef.current) {
          showInfo("All participants muted");
        }
      }
    };

    sub.on("publication", onPublication);

    if (sub.state !== "subscribed") {
      sub.subscribe();
    }

    return () => {
      sub.off("publication", onPublication);
      releaseChannelSubscription(centrifugeClient, id, sub);
    };
  }, [id, dispatch, user?.user_id]);

  return null;
}
