import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyMessageHighlightClasses,
  MESSAGE_HIGHLIGHT_DURATION_MS,
  removeMessageHighlightClasses,
  scrollHighlightMessageIntoView,
} from "~/utils/message-highlight";
import {
  nextJumpToDateStep,
  startOfLocalDay,
  type DatedMessage,
} from "~/utils/jump-to-date";

/** Older pages loaded while looking for a day. A safety net only. */
const MAX_FETCH_ATTEMPTS = 300;
/** Pages in a row that bring in no new messages before treating the history as fully loaded. */
const MAX_STALLED_FETCHES = 3;
/** How long to wait for an older page before counting it as empty. */
const FETCH_WAIT_MS = 8000;
/**
 * Retries for the target message to render before scrolling to it. A jump
 * can add many older pages at once, so give the page time to render them.
 */
const SCROLL_RETRY_DELAYS_MS = [0, 80, 200, 400, 800, 1400, 2200, 3200, 4500];
/** How long a note ("no messages on that day") stays up. */
const NOTE_VISIBLE_MS = 6000;

/**
 * `finding` while older messages load to reach the day; `next_day` when the
 * day had no messages and the view moved to the next day that has some;
 * `none` when nothing was sent on or after the day.
 */
export type JumpToDateStatus = "idle" | "finding" | "next_day" | "none";

interface UseJumpToDateOptions {
  chats: DatedMessage[];
  hasMore: boolean;
  loading: boolean;
  fetchMoreData: () => void;
}

export function useJumpToDate({
  chats,
  hasMore,
  loading,
  fetchMoreData,
}: UseJumpToDateOptions) {
  const [target, setTarget] = useState<Date | null>(null);
  const [status, setStatus] = useState<JumpToDateStatus>("idle");
  const [waitTick, setWaitTick] = useState(0);
  const fetchAttemptsRef = useRef(0);
  const stalledFetchesRef = useRef(0);
  const pendingFetchRef = useRef<{ length: number; at: number } | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (status !== "next_day" && status !== "none") return;
    const timer = window.setTimeout(() => setStatus("idle"), NOTE_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const jumpToDate = useCallback((day: Date) => {
    clearTimers();
    fetchAttemptsRef.current = 0;
    stalledFetchesRef.current = 0;
    pendingFetchRef.current = null;
    setTarget(startOfLocalDay(day));
    setStatus("finding");
  }, []);

  useEffect(() => {
    if (!target) return;

    const scrollTo = (messageIds: string[], exactDay: boolean) => {
      setTarget(null);
      setStatus(exactDay ? "idle" : "next_day");
      let done = false;
      // The first of the day's messages that is on the page by its own id.
      const findTarget = () => {
        for (const id of messageIds) {
          const el = document.getElementById(`thread-${id}`);
          if (el) return el;
        }
        return null;
      };
      SCROLL_RETRY_DELAYS_MS.forEach((delay) => {
        timersRef.current.push(
          window.setTimeout(() => {
            if (done) return;
            const el = findTarget();
            if (!el) return;
            done = true;
            scrollHighlightMessageIntoView(el);
            applyMessageHighlightClasses(el);
            window.setTimeout(
              () => removeMessageHighlightClasses(el),
              MESSAGE_HIGHLIGHT_DURATION_MS
            );
          }, delay)
        );
      });
    };

    const finish = (historyLeft: boolean) => {
      const step = nextJumpToDateStep(chats, target, historyLeft);
      if (step.action === "scroll") {
        scrollTo(step.messageIds, step.exactDay);
      } else {
        setTarget(null);
        setStatus("none");
      }
    };

    const step = nextJumpToDateStep(chats, target, hasMore);
    if (step.action !== "load_older") {
      finish(hasMore);
      return;
    }

    if (loading) return;

    // Wait for the page asked for last. DMs and group chats don't set
    // `loading` while they fetch, so wait for the list to grow, or for
    // FETCH_WAIT_MS, before asking again.
    const pending = pendingFetchRef.current;
    if (pending) {
      if (chats.length > pending.length) {
        stalledFetchesRef.current = 0;
        pendingFetchRef.current = null;
      } else if (Date.now() - pending.at < FETCH_WAIT_MS) {
        return;
      } else {
        stalledFetchesRef.current += 1;
        pendingFetchRef.current = null;
      }
    }

    if (
      fetchAttemptsRef.current >= MAX_FETCH_ATTEMPTS ||
      stalledFetchesRef.current >= MAX_STALLED_FETCHES
    ) {
      // Older pages stopped coming: use what is loaded.
      finish(false);
      return;
    }

    fetchAttemptsRef.current += 1;
    pendingFetchRef.current = { length: chats.length, at: Date.now() };
    timersRef.current.push(
      window.setTimeout(
        () => setWaitTick((tick) => tick + 1),
        FETCH_WAIT_MS + 50
      )
    );
    fetchMoreData();
  }, [target, chats, hasMore, loading, fetchMoreData, waitTick]);

  return { jumpToDate, status };
}
