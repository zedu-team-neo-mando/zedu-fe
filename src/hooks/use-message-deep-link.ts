import { useContext, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { setMessageHighlight } from "~/utils/message-highlight";
import { resolveSearchDeepLink } from "~/lib/search/navigate";

interface UseMessageDeepLinkOptions {
  messages: Array<{ thread_id?: string }>;
  loading?: boolean;
}

export function useMessageDeepLink({
  messages,
  loading = false,
}: UseMessageDeepLinkOptions) {
  const searchParams = useSearchParams();
  const { dispatch } = useContext(DataContext);
  const appliedRef = useRef<string | null>(null);
  const preparedRef = useRef<string | null>(null);

  const threadId = searchParams.get("thread_id");
  const messageId = searchParams.get("message_id");

  useEffect(() => {
    if (!threadId) {
      appliedRef.current = null;
      preparedRef.current = null;
      return;
    }

    const signature = `${threadId}:${messageId || ""}`;
    if (appliedRef.current === signature) return;

    if (preparedRef.current !== signature) {
      setMessageHighlight(threadId);
      dispatch({ type: ACTIONS.DATA_ID, payload: threadId });
      preparedRef.current = signature;
    }

    const resolution = resolveSearchDeepLink(
      threadId,
      messageId,
      messages,
      loading
    );
    if (resolution.status === "pending") return;

    if (resolution.status === "reply") {
      dispatch({ type: ACTIONS.THREAD, payload: resolution.parent });
      dispatch({ type: ACTIONS.REPLY, payload: true });
    }

    appliedRef.current = signature;
  }, [threadId, messageId, messages, loading, dispatch]);
}
