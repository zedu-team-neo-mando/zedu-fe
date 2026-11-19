"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Hash, Lock, User, Users } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { DropdownIcon } from "~/svgs";
import { cn } from "~/lib/utils";
import type { ThreadGroup } from "~/types/threads";
import { loadOrganisationThreadsPage } from "~/utils/org-threads";
import {
  isThreadUnread,
  markThreadsSeen,
  readSeenThreads,
  saveSeenThreads,
  sidebarThreads,
  type SidebarThread,
} from "~/utils/sidebar-threads";

const OPEN_KEY = "zedu:sidebar-threads-open";
const RELOAD_DELAY_MS = 1000;

const ICONS = { channel: Hash, private: Lock, dm: User, group: Users };

const readOpen = () => {
  try {
    return localStorage.getItem(OPEN_KEY) !== "false";
  } catch {
    return true;
  }
};

/**
 * Recent threads under the sidebar's Threads link (Ziki #12365): newest
 * activity first, each with where it is, a preview of the message that
 * started it, its reply count and an unread dot. Clicking one opens the
 * conversation with that thread open. It uses the threads the app already
 * loads for the sidebar and reloads them when a thread notification arrives.
 */
export function SidebarThreads() {
  const { state } = useContext(DataContext);
  const pathname = usePathname();
  const orgSlug: string = state?.orgSlug || "";
  const orgId: string =
    state?.orgId ||
    (typeof window !== "undefined" ? localStorage.getItem("orgId") : "") ||
    "";

  const [open, setOpen] = useState(true);
  const [reloaded, setReloaded] = useState<ThreadGroup[] | null>(null);
  const [seenState, setSeenState] = useState<{
    orgId: string;
    map: Record<string, number>;
  } | null>(null);
  const seen = seenState?.orgId === orgId ? seenState.map : null;

  useEffect(() => setOpen(readOpen()), []);

  // The shared list changed (first load, the Threads page, a new organisation):
  // show it rather than an older reload.
  useEffect(() => setReloaded(null), [state?.threadMentions]);

  // Live: reload the newest threads after a thread notification, waiting a
  // moment so a burst of notifications makes one request.
  const threadActivity: number = state?.threadActivity ?? 0;
  const firstActivity = useRef(threadActivity);
  useEffect(() => {
    if (threadActivity === firstActivity.current || !orgId) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const { success, threads } = await loadOrganisationThreadsPage(orgId, 1);
      if (!cancelled && success) setReloaded(threads);
    }, RELOAD_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [threadActivity, orgId]);

  const rows = useMemo(
    () => sidebarThreads(orgSlug, reloaded ?? state?.threadMentions),
    [orgSlug, reloaded, state?.threadMentions]
  );

  // Unread memory for this organisation; the first time, what is listed now
  // counts as seen.
  useEffect(() => {
    if (!orgId || rows.length === 0 || seen) return;
    let map = readSeenThreads(orgId);
    if (!map) {
      map = markThreadsSeen({}, rows);
      saveSeenThreads(orgId, map);
    }
    setSeenState({ orgId, map });
  }, [orgId, rows, seen]);

  // Looking at the Threads page counts as having seen what is listed.
  const onThreadsPage = pathname.includes("/threads");
  useEffect(() => {
    if (!onThreadsPage || !seen) return;
    if (!rows.some((row) => isThreadUnread(seen, row))) return;
    const map = markThreadsSeen(seen, rows);
    saveSeenThreads(orgId, map);
    setSeenState({ orgId, map });
  }, [onThreadsPage, rows, seen, orgId]);

  const markSeen = (row: SidebarThread) => {
    if (!seen) return;
    const map = markThreadsSeen(seen, [row]);
    saveSeenThreads(orgId, map);
    setSeenState({ orgId, map });
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      localStorage.setItem(OPEN_KEY, String(next));
    } catch {
      // The choice just won't be remembered.
    }
  };

  if (rows.length === 0) return null;

  return (
    <section aria-label="Recent threads" className="mx-2 mb-2">
      <button
        type="button"
        onClick={(event) => {
          // The sidebar closes on any click on mobile; this only folds the list.
          event.stopPropagation();
          toggle();
        }}
        aria-expanded={open}
        className="flex w-full items-center gap-1 rounded-lg px-2 py-1 text-[13px] text-blue-50 hover:text-white"
      >
        <DropdownIcon
          className={cn(
            "transition-transform duration-300",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
        Recent threads
      </button>

      {open && (
        <>
          <ul className="mt-1 flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {rows.map((row) => {
              const unread = isThreadUnread(seen, row);
              const Icon = ICONS[row.kind];
              const replies =
                row.replyCount === 1 ? "1 reply" : `${row.replyCount} replies`;
              const content = (
                <>
                  <span className="flex items-center gap-1 text-[12px] text-blue-50/80">
                    <Icon className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{row.channelName}</span>
                    {unread && (
                      <span
                        className="ml-auto size-2 shrink-0 rounded-full bg-white"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "block truncate text-[13px]",
                      unread ? "font-semibold text-white" : "text-blue-50"
                    )}
                  >
                    {row.preview || "Thread"}
                  </span>
                  <span className="block text-[11px] text-blue-50/70">
                    {replies}
                    {unread && <span className="sr-only">, new replies</span>}
                  </span>
                </>
              );

              return (
                <li key={row.id}>
                  {row.href ? (
                    <Link
                      href={row.href}
                      onClick={() => markSeen(row)}
                      className="block rounded-lg px-2 py-1.5 hover:bg-blue-200 hover:text-white"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="block rounded-lg px-2 py-1.5">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href={`/${orgSlug}/threads`}
            className="block px-2 pt-1 text-[12px] text-blue-50/90 underline-offset-2 hover:text-white hover:underline"
          >
            See all threads
          </Link>
        </>
      )}
    </section>
  );
}
