/**
 * Jump to a date in a conversation (channel, group chat or DM).
 *
 * Messages are loaded newest first, a page at a time, and the API cannot load
 * history around a date. So a jump loads older pages until the loaded history
 * reaches back past the start of the chosen day, then scrolls to the first
 * message sent on or after it.
 */

export type DatedMessage = {
  thread_id?: string;
  id?: string;
  created_at?: string;
};

/** Midnight at the start of `date`, in the viewer's time zone. */
export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Reads a `yyyy-mm-dd` value from a date input as a local day, or null. */
export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

/** `yyyy-mm-dd` for a date input, in the viewer's time zone. */
export function toDateInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function timeOf(message: DatedMessage): number | null {
  if (!message?.created_at) return null;
  const time = new Date(message.created_at).getTime();
  return Number.isNaN(time) ? null : time;
}

export type JumpToDateStep =
  /** Load an older page: the loaded history may not reach the day yet. */
  | { action: "load_older" }
  /**
   * Scroll to the first message on or after the day. `messageIds` lists the
   * messages from that point on, oldest first: some are not on the page by
   * their own id (consecutive join notices render as one line), so the view
   * scrolls to the first one that is.
   */
  | {
      action: "scroll";
      messageId: string;
      messageIds: string[];
      exactDay: boolean;
    }
  /** Nothing was sent on or after the day. */
  | { action: "none" };

/**
 * Decides the next step of a jump to `day`.
 *
 * `messages` is the loaded history in any order; `hasMore` says whether older
 * pages are left to load.
 */
export function nextJumpToDateStep(
  messages: DatedMessage[],
  day: Date,
  hasMore: boolean
): JumpToDateStep {
  const dayStart = startOfLocalDay(day).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  let oldest = Number.POSITIVE_INFINITY;
  const onOrAfter: { id: string; time: number }[] = [];

  for (const message of messages) {
    const time = timeOf(message);
    if (time == null) continue;
    if (time < oldest) oldest = time;
    const id = String(message.thread_id ?? message.id ?? "");
    if (id && time >= dayStart) onOrAfter.push({ id, time });
  }

  // Until the history reaches back before the day, an earlier message of that
  // day may still be unloaded.
  if (hasMore && oldest >= dayStart) return { action: "load_older" };

  if (onOrAfter.length === 0) return { action: "none" };
  onOrAfter.sort((a, b) => a.time - b.time);
  return {
    action: "scroll",
    messageId: onOrAfter[0].id,
    messageIds: onOrAfter.map((item) => item.id),
    exactDay: onOrAfter[0].time < dayEnd,
  };
}
