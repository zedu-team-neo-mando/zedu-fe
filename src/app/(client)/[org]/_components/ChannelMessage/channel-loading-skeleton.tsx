"use client";

import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

const MESSAGE_ROWS = [
  ["w-24", "w-3/4"],
  ["w-32", "w-1/2"],
  ["w-20", "w-2/3"],
  ["w-28", "w-5/12"],
];

/** Placeholder rows shown while a channel's first page of messages loads. */
export const MessageListSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Loading messages"
    className="flex flex-col gap-5 px-5 py-4"
  >
    {MESSAGE_ROWS.map(([nameWidth, lineWidth], index) => (
      <div key={index} className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className={`h-3.5 ${nameWidth}`} />
          <Skeleton className={`h-3.5 ${lineWidth}`} />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Non-interactive stand-in for the composer while the channel's details (and
 * so the user's posting permission) are loading. Matches the footprint of the
 * composer and the restricted banner, so neither causes a layout jump.
 */
export const ComposerSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Loading message composer"
    className="relative z-20 w-full bg-white pb-3 dark:bg-[#1A1D21]"
  >
    <div className="mx-3 md:mx-5 mb-3 rounded-xl border border-[#E6EAEF] dark:border-white/10 px-4 py-4">
      <Skeleton className="h-4 w-1/3" />
      <div className="mt-6 flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="ml-auto h-8 w-10" />
      </div>
    </div>
  </div>
);
