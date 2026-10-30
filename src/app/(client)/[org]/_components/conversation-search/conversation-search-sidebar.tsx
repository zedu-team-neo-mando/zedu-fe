"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CalendarSearch, Search, X } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { searchChannelMessages } from "~/lib/search/api";
import {
  flattenChannelSearchResults,
  groupHitsByDay,
  type ConversationSearchHit,
} from "~/lib/search/flatten-channel-results";
import { stripHtmlAndDecode } from "~/lib/search/format";
import { HighlightedText } from "~/app/(client)/[org]/_components/search/highlight";
import { jumpToMessageInConversation } from "~/lib/search/jump-to-message";
import Loading from "~/components/ui/loading";
import { cn } from "~/lib/utils";
import { ACTIONS } from "~/store/Actions";

export const CONVERSATION_SEARCH_SIDEBAR_WIDTH = 400;

/** Shared side-panel motion on channel/DM layouts. */
export const CONVERSATION_SEARCH_PANEL_TRANSITION = "duration-150 ease-out";

type ConversationSearchSidebarProps = {
  channelId: string;
  conversationLabel?: string;
};

export function getConversationSearchSidebarWidth(
  isOpen: boolean,
  isSmUp: boolean
) {
  if (!isOpen) return 0;
  return isSmUp
    ? CONVERSATION_SEARCH_SIDEBAR_WIDTH
    : CONVERSATION_SEARCH_SIDEBAR_WIDTH;
}

export default function ConversationSearchSidebar({
  channelId,
  conversationLabel,
}: ConversationSearchSidebarProps) {
  const { state, dispatch } = useContext(DataContext);
  const { conversationSearchOpen } = state;
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<ConversationSearchHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!conversationSearchOpen) {
      setQuery("");
      setDebouncedQuery("");
      setHits([]);
      setError(null);
    }
  }, [conversationSearchOpen]);

  const previousChannelIdRef = useRef(channelId);
  useEffect(() => {
    if (previousChannelIdRef.current !== channelId) {
      dispatch({ type: ACTIONS.CONVERSATION_SEARCH_OPEN, payload: false });
      previousChannelIdRef.current = channelId;
    }
  }, [channelId, dispatch]);

  useEffect(() => {
    if (!conversationSearchOpen) return;
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [conversationSearchOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!conversationSearchOpen || !channelId) return;

    if (!debouncedQuery) {
      setHits([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    searchChannelMessages(channelId, debouncedQuery)
      .then((results) => {
        if (cancelled) return;
        setHits(flattenChannelSearchResults(results));
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not search messages. Try again.");
        setHits([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [channelId, debouncedQuery, conversationSearchOpen]);

  const sections = useMemo(() => groupHitsByDay(hits), [hits]);

  const handleSelect = (hit: ConversationSearchHit) => {
    const highlightId = hit.thread_id || hit.message_id;
    dispatch({ type: ACTIONS.CONVERSATION_SEARCH_OPEN, payload: false });

    window.requestAnimationFrame(() => {
      jumpToMessageInConversation(highlightId, dispatch);
    });
  };

  return (
    <div
      aria-hidden={!conversationSearchOpen}
      className={cn(
        "h-full shrink-0 overflow-hidden",
        conversationSearchOpen ? "w-[400px]" : "w-0"
      )}
    >
      <div
        className={cn(
          "flex h-full w-[400px] flex-col border-l border-[#E6EAEF] bg-white dark:border-white/10 dark:bg-[#1A1D21]",
          !conversationSearchOpen && "pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2 border-b border-[#E6EAEF] px-3 py-3 dark:border-white/10">
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: ACTIONS.CONVERSATION_SEARCH_OPEN,
                payload: false,
              })
            }
            className="rounded-md p-1.5 text-[#667085] hover:bg-[#F2F4F7] dark:text-zinc-400 dark:hover:bg-white/10"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
          <h2 className="text-base font-semibold text-[#101828] dark:text-zinc-100">
            Search messages
          </h2>
        </div>

        <div className="flex items-center gap-2 border-b border-[#E6EAEF] px-3 py-2 dark:border-white/10">
          <button
            type="button"
            className="rounded-md p-2 text-[#667085] hover:bg-[#F2F4F7] dark:text-zinc-400 dark:hover:bg-white/10"
            aria-label="Search by date"
            title="Date filters (from:, before:, on:, after:)"
          >
            <CalendarSearch className="size-5" />
          </button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3] dark:text-zinc-500" />
            <input
              ref={inputRef}
              type="search"
              aria-label="Search in conversation"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-full border border-[#E6EAEF] bg-[#F9FAFB] pl-9 pr-9 text-sm text-[#101828] outline-none focus:border-[#5757CD] dark:border-white/15 dark:bg-[#222529] dark:text-zinc-100"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#667085] hover:bg-[#E6EAEF] dark:text-zinc-400 dark:hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        {conversationLabel ? (
          <p className="truncate px-4 py-2 text-xs text-[#667085] dark:text-zinc-500">
            {conversationLabel}
          </p>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loading color="#5757CD" />
            </div>
          ) : error ? (
            <p className="px-4 py-6 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : !debouncedQuery ? (
            <p className="px-4 py-6 text-sm text-[#667085] dark:text-zinc-400">
              Search messages in this conversation. Use keywords like{" "}
              <code className="text-xs">from:username</code> or{" "}
              <code className="text-xs">before:2024-12-31</code> in the search
              box.
            </p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#667085] dark:text-zinc-400">
              No messages found.
            </p>
          ) : (
            sections.map((section) => (
              <div key={section.label}>
                <div className="sticky top-0 bg-[#F9FAFB] px-4 py-2 text-xs font-medium text-[#667085] dark:bg-[#1A1D21] dark:text-zinc-500">
                  {section.label}
                </div>
                <ul>
                  {section.hits.map((hit) => {
                    const preview = stripHtmlAndDecode(hit.message);
                    return (
                      <li key={hit.message_id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(hit)}
                          className="w-full border-b border-[#F2F4F7] px-4 py-3 text-left hover:bg-[#F9FAFB] dark:border-white/5 dark:hover:bg-white/5"
                        >
                          <p className="truncate text-sm font-medium text-[#344054] dark:text-zinc-200">
                            {hit.user_name}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-[#667085] dark:text-zinc-400">
                            <HighlightedText
                              text={preview}
                              query={debouncedQuery}
                            />
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
