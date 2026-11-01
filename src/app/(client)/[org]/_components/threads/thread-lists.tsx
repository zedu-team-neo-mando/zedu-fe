"use client";

import { useContext, useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { ThreadItem } from "./thread-item";
import { DataContext } from "~/store/GlobalState";
import UseThreads from "../../home/channels/hooks/use-threads";
import type { ThreadGroup } from "~/types/threads";
import Loading from "~/components/ui/loading";

function scrollingElement(node: HTMLElement | null) {
  let current = node;
  while (current) {
    const style = window.getComputedStyle(current);
    const canScroll = /(auto|scroll)/.test(style.overflowY);
    if (canScroll && current.scrollHeight > current.clientHeight + 1) {
      return current;
    }
    current = current.parentElement;
  }
  return document.scrollingElement instanceof HTMLElement
    ? document.scrollingElement
    : null;
}

export const ThreadList = () => {
  const { state } = useContext(DataContext);
  const { threadMentions } = state;
  const { fetchMoreData, hasMore, loading } = UseThreads();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const threadGroups: ThreadGroup[] = threadMentions || [];
  const totalThreads = threadGroups.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          fetchMoreData();
        }
      },
      { root: null, rootMargin: "240px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchMoreData, hasMore, loading, totalThreads]);

  useEffect(() => {
    const scroller = scrollingElement(scrollRef.current);
    if (!scroller || !hasMore || loading) return;

    const loadIfNearBottom = () => {
      const distanceFromBottom =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      if (distanceFromBottom < 240) fetchMoreData();
    };

    scroller.addEventListener("scroll", loadIfNearBottom, { passive: true });
    loadIfNearBottom();
    return () => scroller.removeEventListener("scroll", loadIfNearBottom);
  }, [fetchMoreData, hasMore, loading, totalThreads]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EAEF] shrink-0">
        <h1 className="text-[22px] font-bold text-[#1D2939]">Threads</h1>
        {!loading && totalThreads > 0 && (
          <span className="text-sm text-[#667085]">
            {totalThreads} thread{totalThreads === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div
        id="threadsScrollable"
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {loading && threadGroups.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loading color="#1264A3" />
            <p className="text-sm text-[#667085]">Loading threads...</p>
          </div>
        ) : threadGroups.length > 0 ? (
          <>
            {threadGroups.map((group, index) => (
              <ThreadItem
                key={group.thread_id ?? `${group.channel_name}-${index}`}
                group={group}
              />
            ))}
            <div ref={sentinelRef} className="min-h-8 py-6">
              {loading && (
                <p className="text-xs text-center text-[#667085]">
                  Loading more threads...
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#F2F4F7]">
              <MessageSquare
                className="size-8 text-[#98A2B3]"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="mb-2 text-lg font-bold text-[#344054]">
              No threads yet
            </h2>
            <p className="max-w-sm text-sm text-[#667085]">
              Threads you&apos;re involved in will show up here. Reply to a
              message in a channel to start a thread.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
