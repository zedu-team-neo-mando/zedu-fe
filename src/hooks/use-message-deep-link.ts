import { useContext, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { setMessageHighlight } from "~/utils/message-highlight";
import { resolveSearchDeepLink } from "~/lib/search/navigate";

/** Options for the useMessageDeepLink hook. */
interface UseMessageDeepLinkOptions {
  messages: Array<{ thread_id?: string; [key: string]: any }>;
  loading?: boolean;
}

/**
 * Handles deep linking into a message or thread drawer from URL query parameters.
 * Automatically highlights the target message and opens the thread drawer,
 * creating a fallback placeholder if parent message data is still loading
 * and restoring parent metadata and replies once available.
 */
export function useMessageDeepLink({
  messages,
  loading = false,
}: UseMessageDeepLinkOptions) {
  const searchParams = useSearchParams();
  const params = useParams();
  const { state, dispatch } = useContext(DataContext);
  const appliedRef = useRef<string | null>(null);
  const preparedRef = useRef<string | null>(null);
  const threadRef = useRef(state?.thread);
  const loadThreadRef = useRef(state?.loadThread);
  const repliesRef = useRef(state?.replies);

  useEffect(() => {
    threadRef.current = state?.thread;
    loadThreadRef.current = state?.loadThread;
    repliesRef.current = state?.replies;
  }, [state?.thread, state?.loadThread, state?.replies]);

  const threadId = searchParams.get("thread_id");
  const messageId = searchParams.get("message_id");
  const channelId = (params?.id as string) || "";

  useEffect(() => {
    if (!threadId) {
      appliedRef.current = null;
      preparedRef.current = null;
      return;
    }

    const signature = `${channelId}:${threadId}:${messageId || ""}`;
    const parentThread = messages?.find(
      (message: any) =>
        String(message?.thread_id || "") === String(threadId) ||
        String(message?.id || "") === String(threadId)
    );

    const hasReplies =
      (Array.isArray(parentThread?.preview_reply) &&
        parentThread.preview_reply.length > 0) ||
      Boolean(parentThread?.replies_count && parentThread.replies_count > 0);
    const shouldOpenDrawer = Boolean(messageId) || hasReplies;

    if (appliedRef.current === signature) {
      if (
        shouldOpenDrawer &&
        parentThread &&
        String(threadRef.current?.thread_id || "") === String(threadId) &&
        (!threadRef.current?.message ||
          threadRef.current?.username === "Thread")
      ) {
        // Restore parent metadata only; page-1 REPLIES would wipe fetched replies.
        dispatch({ type: ACTIONS.THREAD, payload: parentThread });
        const existingReplies = repliesRef.current || [];
        if (
          Array.isArray(parentThread.preview_reply) &&
          parentThread.preview_reply.length > 0
        ) {
          if (existingReplies.length === 0) {
            dispatch({
              type: ACTIONS.REPLIES,
              payload: {
                newThreads: parentThread.preview_reply,
                newPage: 1,
                parentReactions: parentThread.reactions,
              },
            });
          } else {
            // Merge preview replies by reply ID without replacing already-fetched replies
            const existingIds = new Set(
              existingReplies.map((r: any) =>
                String(r?.id ?? r?.thread_id ?? r?._id ?? "")
              )
            );
            const missingPreviews = parentThread.preview_reply.filter(
              (r: any) => {
                const id = String(r?.id ?? r?.thread_id ?? r?._id ?? "");
                return id && !existingIds.has(id);
              }
            );
            if (missingPreviews.length > 0) {
              dispatch({
                type: ACTIONS.REPLIES,
                payload: {
                  newThreads: missingPreviews,
                  newPage: 2,
                  parentReactions: parentThread.reactions,
                },
              });
            }
          }
        } else if (
          existingReplies.length === 0 &&
          Boolean(parentThread?.replies_count && parentThread.replies_count > 0)
        ) {
          // Trigger initial reply fetch when replacing placeholder without preview replies
          dispatch({
            type: ACTIONS.LOAD_THREAD,
            payload: !loadThreadRef.current,
          });
        }
      }
      return;
    }

    if (preparedRef.current !== signature) {
      setMessageHighlight(threadId);
      dispatch({ type: ACTIONS.DATA_ID, payload: threadId });
      preparedRef.current = signature;
    }

    const isFromSearch = searchParams.get("from") === "search";
    if (isFromSearch) {
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
      return;
    }

    if (parentThread) {
      if (shouldOpenDrawer) {
        dispatch({ type: ACTIONS.THREAD, payload: parentThread });
        dispatch({
          type: ACTIONS.REPLIES,
          payload: {
            newThreads: parentThread.preview_reply || [],
            newPage: 1,
            parentReactions: parentThread.reactions,
          },
        });
        dispatch({ type: ACTIONS.REPLY, payload: true });
        dispatch({
          type: ACTIONS.LOAD_THREAD,
          payload: !loadThreadRef.current,
        });
      }
      appliedRef.current = signature;
      return;
    }

    if (!loading) {
      if (Boolean(messageId)) {
        const fallbackThread = {
          thread_id: threadId,
          channels_id: channelId,
          message: "",
          username: "Thread",
          created_at: new Date().toISOString(),
          reactions: [],
          preview_reply: [],
          type: "message",
        };

        dispatch({ type: ACTIONS.THREAD, payload: fallbackThread });
        dispatch({
          type: ACTIONS.REPLIES,
          payload: {
            newThreads: [],
            newPage: 1,
            parentReactions: [],
          },
        });
        dispatch({ type: ACTIONS.REPLY, payload: true });
        dispatch({
          type: ACTIONS.LOAD_THREAD,
          payload: !loadThreadRef.current,
        });
        // Mark applied only after opening the placeholder thread for child replies.
        // Thread-only links remain unapplied so the effect retries when parent loads.
        appliedRef.current = signature;
      }
    }
  }, [
    channelId,
    threadId,
    messageId,
    searchParams,
    messages,
    loading,
    dispatch,
  ]);
}
