type DmUnreadEntry = {
  channel_id?: string | null;
  thread_count?: number | string | null;
};

/**
 * Total unread messages across DM conversations. A conversation can appear in
 * more than one list (the visible sidebar DMs and the full DM list), so each
 * channel is counted once.
 */
export function getDmUnreadTotal(
  ...lists: (DmUnreadEntry[] | null | undefined)[]
): number {
  const counts = new Map<string, number>();

  lists.forEach((list) => {
    if (!Array.isArray(list)) return;

    list.forEach((dm) => {
      if (!dm?.channel_id) return;
      const count = Math.max(0, Math.floor(Number(dm.thread_count) || 0));
      counts.set(
        dm.channel_id,
        Math.max(counts.get(dm.channel_id) ?? 0, count)
      );
    });
  });

  let total = 0;
  counts.forEach((count) => {
    total += count;
  });
  return total;
}

export function formatUnreadBadge(count: number): string {
  return count > 99 ? "99+" : String(count);
}
