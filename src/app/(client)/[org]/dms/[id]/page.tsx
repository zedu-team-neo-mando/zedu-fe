"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { GetRequest } from "~/utils/new-request";
import { setMessageHighlight } from "~/utils/message-highlight";
import { isIndividualDmType } from "~/lib/search/navigate";
import Loading from "~/components/ui/loading";

const DmDeepLinkPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);

  const orgSlug = params.org as string;
  const channelId = params.id as string;
  const threadId = searchParams.get("thread_id");
  const messageId = searchParams.get("message_id");
  const orgId =
    state.orgId ||
    (typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId || !channelId) return;

    let cancelled = false;

    const resolveAndRedirect = async () => {
      try {
        const res = await GetRequest(
          `/organisations/${orgId}/dms/participants/${channelId}`
        );

        if (cancelled) return;

        if (res?.status !== 200 && res?.status !== 201) {
          setError("Could not open this conversation.");
          return;
        }

        const data = res?.data?.data;
        const channelType = data?.type || data?.channel_type;
        const isIndividualDm = isIndividualDmType(channelType);
        const participants = data?.participants || [];

        if (isIndividualDm) {
          dispatch({ type: ACTIONS.PARTICIPANT, payload: participants[0] });
        } else {
          dispatch({ type: ACTIONS.PARTICIPANTS, payload: participants });
        }

        dispatch({ type: ACTIONS.CLEAR_CHATS });

        if (threadId) {
          setMessageHighlight(threadId);
          dispatch({ type: ACTIONS.DATA_ID, payload: threadId });
        }

        if (data?.username) {
          localStorage.setItem("channelName", data.username);
        }

        const query = new URLSearchParams();
        if (threadId) query.set("thread_id", threadId);
        if (messageId) query.set("message_id", messageId);
        const queryString = query.toString() ? `?${query.toString()}` : "";

        if (isIndividualDm) {
          const participantId =
            data?.participant_id ||
            participants.find(
              (participant: { user_id?: string }) =>
                participant.user_id !== state.user?.user_id
            )?.user_id ||
            participants[0]?.user_id ||
            participants[0]?.id;

          router.replace(
            `/${orgSlug}/dm/${channelId}/${participantId}${queryString}`
          );
          return;
        }

        router.replace(`/${orgSlug}/dm/${channelId}/dms${queryString}`);
      } catch {
        if (!cancelled) {
          setError("Could not open this conversation.");
        }
      }
    };

    resolveAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [
    orgId,
    channelId,
    threadId,
    messageId,
    orgSlug,
    router,
    dispatch,
    state.user?.user_id,
  ]);

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-gray-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loading />
    </div>
  );
};

export default DmDeepLinkPage;
