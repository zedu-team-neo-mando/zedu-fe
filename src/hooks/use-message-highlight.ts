import { useEffect, useRef, useState } from "react";
import {
  applyMessageHighlightClasses,
  clearMessageHighlight,
  findHighlightMessageElement,
  getMessageHighlightId,
  messageMatchesHighlight,
  MESSAGE_HIGHLIGHT_DURATION_MS,
  removeMessageHighlightClasses,
  scrollHighlightMessageIntoView,
  type HighlightableMessage,
} from "~/utils/message-highlight";

/**
 * Older pages loaded while looking for a message. A safety net only: the
 * search normally ends when the message is found or the history runs out.
 * (It used to stop silently after 30 pages, about 1,200 channel messages, so
 * an older search result opened the conversation at the bottom.)
 */
const MAX_FETCH_ATTEMPTS = 300;
/** Pages in a row that bring in no new messages before giving up. */
const MAX_STALLED_FETCHES = 3;
/** How long to wait for an older page before counting it as empty. */
const FETCH_WAIT_MS = 8000;
const RETRY_DELAYS_MS = [0, 50, 120, 250, 400, 650, 900, 1200, 1600];
/** After the last retry, how long to wait before saying it wasn't found. */
const NOT_FOUND_GRACE_MS = RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1] + 300;
/** How long the "couldn't find it" note stays up. */
const NOT_FOUND_VISIBLE_MS = 6000;

/**
 * Where a jump to a message is: `finding` while older messages are loaded to
 * reach it, `not_found` when the history ran out without it (deleted, or no
 * longer visible to this user), `idle` otherwise.
 */
export type MessageJumpStatus = "idle" | "finding" | "not_found";

interface UseMessageHighlightOptions {
  dataId?: string;
  loading: boolean;
  chats: HighlightableMessage[];
  hasMore: boolean;
  fetchMoreData: () => void;
}

export function useMessageHighlight({
  dataId,
  loading,
  chats,
  hasMore,
  fetchMoreData,
}: UseMessageHighlightOptions): { status: MessageJumpStatus } {
  const [status, setStatus] = useState<MessageJumpStatus>("idle");
  const highlightedRef = useRef(false);
  const fetchAttemptsRef = useRef(0);
  const stalledFetchesRef = useRef(0);
  const pendingFetchRef = useRef<{ length: number; at: number } | null>(null);
  const [waitTick, setWaitTick] = useState(0);
  const lastHighlightIdRef = useRef<string | null>(null);
  const retryTimersRef = useRef<number[]>([]);

  const clearRetryTimers = () => {
    retryTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    retryTimersRef.current = [];
  };

  useEffect(() => clearRetryTimers, []);

  useEffect(() => {
    if (status !== "not_found") return;
    const timer = window.setTimeout(
      () => setStatus("idle"),
      NOT_FOUND_VISIBLE_MS
    );
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (dataId == null && getMessageHighlightId()) {
      highlightedRef.current = false;
    }
  }, [dataId]);

  useEffect(() => {
    const highlightId = getMessageHighlightId() || dataId || null;

    if (highlightId !== lastHighlightIdRef.current) {
      highlightedRef.current = false;
      fetchAttemptsRef.current = 0;
      stalledFetchesRef.current = 0;
      pendingFetchRef.current = null;
      lastHighlightIdRef.current = highlightId;
      clearRetryTimers();
      setStatus("idle");
    }

    if (!highlightId || highlightedRef.current) return;

    const applyHighlight = (): boolean => {
      const el = findHighlightMessageElement(highlightId, chats);
      if (!el) return false;

      scrollHighlightMessageIntoView(el);
      applyMessageHighlightClasses(el);

      window.setTimeout(() => {
        removeMessageHighlightClasses(el);
      }, MESSAGE_HIGHLIGHT_DURATION_MS);

      clearMessageHighlight();
      highlightedRef.current = true;
      setStatus("idle");
      return true;
    };

    // Stop looking and say so, instead of leaving the user at the bottom.
    const giveUp = () => {
      clearMessageHighlight();
      highlightedRef.current = true;
      setStatus("not_found");
    };

    const retryHighlight = (thenGiveUp: boolean) => {
      RETRY_DELAYS_MS.forEach((delay) => {
        const timer = window.setTimeout(() => {
          if (!highlightedRef.current) {
            applyHighlight();
          }
        }, delay);
        retryTimersRef.current.push(timer);
      });
      if (thenGiveUp) {
        retryTimersRef.current.push(
          window.setTimeout(() => {
            if (!highlightedRef.current) giveUp();
          }, NOT_FOUND_GRACE_MS)
        );
      }
    };

    if (applyHighlight()) return;

    const messageInList = chats.some((chat) =>
      messageMatchesHighlight(chat, highlightId)
    );

    if (messageInList) {
      retryHighlight(false);
      return;
    }

    if (loading) return;

    // Wait for the page asked for last. Not every conversation sets `loading`
    // while it fetches an older page (DMs and group chats don't), so wait for
    // the list to grow, or for FETCH_WAIT_MS, before asking again.
    const pending = pendingFetchRef.current;
    if (pending) {
      if (chats.length > pending.length) {
        stalledFetchesRef.current = 0;
        pendingFetchRef.current = null;
      } else if (hasMore && Date.now() - pending.at < FETCH_WAIT_MS) {
        return;
      } else {
        // The page brought in nothing new.
        stalledFetchesRef.current += 1;
        pendingFetchRef.current = null;
      }
    }

    if (hasMore) {
      if (
        fetchAttemptsRef.current >= MAX_FETCH_ATTEMPTS ||
        stalledFetchesRef.current >= MAX_STALLED_FETCHES
      ) {
        giveUp();
        return;
      }

      fetchAttemptsRef.current += 1;
      pendingFetchRef.current = { length: chats.length, at: Date.now() };
      // Look again after the wait even if nothing changes in between.
      retryTimersRef.current.push(
        window.setTimeout(
          () => setWaitTick((tick) => tick + 1),
          FETCH_WAIT_MS + 50
        )
      );
      setStatus("finding");
      fetchMoreData();
      return;
    }

    // The whole history is loaded and the message isn't in it.
    retryHighlight(true);
  }, [dataId, loading, chats, hasMore, fetchMoreData, waitTick]);

  return { status };
}
