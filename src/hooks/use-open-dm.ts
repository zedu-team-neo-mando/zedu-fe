"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { PostRequest } from "~/utils/new-request";

/** True when any participant of a DM or group DM is online. */
export const isDmOnline = (dm: any): boolean =>
  Boolean(dm?.participants?.some((p: any) => p?.online));

/** Opens a DM, group DM or suggested contact from the conversation list data. */
export function useOpenDm() {
  const { state, dispatch } = useContext(DataContext);
  const router = useRouter();

  // Suggested contacts have no DM yet, so create one first.
  const openSuggested = async (data: any) => {
    const orgId = localStorage.getItem("orgId") || "";
    const res = await PostRequest(`/organisations/${orgId}/dms`, {
      chat_type: "user",
      participant_id: data?.participant_id,
    });

    if (res?.status === 200 || res?.status === 201) {
      router.push(
        `/${state?.orgSlug}/dm/${res?.data?.data?.channel_id}/${res?.data?.data?.participant_id}`
      );
    }
  };

  return (data: any) => {
    if (data?.is_suggested) {
      return openSuggested(data);
    }

    dispatch({
      type: ACTIONS.CHATS,
      payload: { newThreads: data?.preview_thread || [], newPage: 1 },
    });

    localStorage.setItem("channelName", data?.username);

    // Clear Nav unread highlight immediately on open
    if (data?.channel_id) {
      dispatch({
        type: ACTIONS.UPDATE_DM_COUNT,
        payload: {
          channel_id: data.channel_id,
          thread_count: 0,
        },
      });
      dispatch({ type: ACTIONS.DM_COUNT, payload: 0 });
    }

    if (data?.channel_type === "dm") {
      const participant = data?.participants?.[0];
      dispatch({ type: ACTIONS.PARTICIPANT, payload: participant });
      router.push(
        `/${state?.orgSlug}/dm/${data?.channel_id}/${data?.participant_id}`
      );
    } else {
      dispatch({ type: ACTIONS.PARTICIPANTS, payload: data?.participants });
      router.push(`/${state?.orgSlug}/dm/${data?.channel_id}/dms`);
    }
  };
}
