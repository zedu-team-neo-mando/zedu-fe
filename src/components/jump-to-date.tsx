"use client";

import { useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { subDays, subMonths } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { parseDateInput, toDateInputValue } from "~/utils/jump-to-date";
import type { JumpToDateStatus } from "~/hooks/use-jump-to-date";

const QUICK_JUMPS: { label: string; day: () => Date }[] = [
  { label: "Today", day: () => new Date() },
  { label: "Yesterday", day: () => subDays(new Date(), 1) },
  { label: "Last week", day: () => subDays(new Date(), 7) },
  { label: "Last month", day: () => subMonths(new Date(), 1) },
];

/**
 * The date label between days of a conversation. Clicking it opens "Jump to"
 * with quick choices and a date picker.
 */
export function JumpToDateLabel({
  label,
  onJump,
}: {
  label: string;
  onJump: (day: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const today = toDateInputValue(new Date());
  const picked = parseDateInput(value);

  const jump = (day: Date) => {
    setOpen(false);
    setValue("");
    onJump(day);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${label}. Jump to a date`}
          className="bg-white px-4 py-1 text-[13px] text-[#101828] border border-[#E6EAEF] rounded-[30px] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-60 p-2">
        <p className="px-2 pb-1 pt-1 text-xs font-semibold text-[#667085]">
          Jump to…
        </p>
        <ul className="flex flex-col">
          {QUICK_JUMPS.map((option) => (
            <li key={option.label}>
              <button
                type="button"
                onClick={() => jump(option.day())}
                className="w-full rounded px-2 py-1.5 text-left text-sm text-[#101828] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-2 flex items-center gap-2 border-t border-[#E6EAEF] px-2 pt-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (picked) jump(picked);
          }}
        >
          <label className="sr-only" htmlFor="jump-to-date-input">
            Pick a date
          </label>
          <input
            id="jump-to-date-input"
            type="date"
            max={today}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="min-w-0 flex-1 rounded border border-[#E6EAEF] px-2 py-1 text-sm text-[#101828]"
          />
          <button
            type="submit"
            disabled={!picked}
            className="rounded bg-primary-500 px-3 py-1 text-sm text-white disabled:opacity-50"
          >
            Go
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

/** A small note at the top of a conversation about a jump to a date. */
export function JumpToDateStatusNote({ status }: { status: JumpToDateStatus }) {
  if (status === "idle") return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
        {status === "finding" ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <CalendarDays className="size-3.5" aria-hidden="true" />
        )}
        {status === "finding" && "Loading messages from that date…"}
        {status === "next_day" &&
          "No messages that day. Showing the next day with messages."}
        {status === "none" && "No messages on or after that date."}
      </span>
    </div>
  );
}
