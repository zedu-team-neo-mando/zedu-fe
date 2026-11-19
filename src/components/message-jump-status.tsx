import { Loader2, SearchX } from "lucide-react";
import type { MessageJumpStatus as Status } from "~/hooks/use-message-highlight";

/**
 * A small note at the top of a conversation while a jump to a message (from
 * search, a mention or a pin) loads older messages to reach it, and when the
 * message couldn't be found. Nothing is shown otherwise.
 */
export function MessageJumpStatus({ status }: { status: Status }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center"
    >
      {status === "finding" && (
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Finding the message in older history…
        </span>
      )}
      {status === "not_found" && (
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          <SearchX className="size-3.5" aria-hidden="true" />
          Couldn’t find that message. It may have been deleted.
        </span>
      )}
    </div>
  );
}
