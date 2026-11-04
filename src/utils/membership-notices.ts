/**
 * Channel join and leave notices, shown the way Slack shows them: one quiet
 * line per run of consecutive events ("Ada, Ben and 3 others joined #general")
 * instead of a full message row for every person.
 *
 * The server writes these notices as system messages in plain English:
 * "@Ada joined this channel", "@Ada joined this channel. @Ben also joined."
 * or "@Ada left this channel". Anything else is left alone and keeps the
 * existing system row.
 */

export type MembershipKind = "joined" | "left";

export interface MembershipNotice {
  kind: MembershipKind;
  /** People in the order they joined or left, oldest first. */
  names: string[];
  /** Every thread id folded into this line, so links and dividers still find it. */
  threadIds: string[];
}

const textOf = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanName = (name: string) => name.replace(/^@/, "").trim();

/** Reads one system message; null when it is not a join or leave notice. */
export function parseMembershipNotice(
  item: any
): Omit<MembershipNotice, "threadIds"> | null {
  if (item?.type !== "system" || typeof item?.message !== "string") {
    return null;
  }
  const text = textOf(item.message);

  const joined = text.match(/^(.+?) joined this channel\.?(.*)$/i);
  if (joined) {
    const names = [cleanName(joined[1])];
    const rest = joined[2].trim();
    if (rest) {
      const others = [...rest.matchAll(/(@?[^.@]+?) also joined\.?/gi)];
      if (!others.length) return null;
      names.push(...others.map((match) => cleanName(match[1])));
    }
    return names.every(Boolean) ? { kind: "joined", names } : null;
  }

  const left = text.match(/^(.+?) left this channel\.?$/i);
  if (left) {
    const name = cleanName(left[1]);
    return name ? { kind: "left", names: [name] } : null;
  }

  return null;
}

/**
 * Folds runs of consecutive join (or leave) notices into one item. `threads`
 * is newest first, as the channel list renders it; the newest notice of a run
 * stands for the whole run and carries `membership`. A run stops at any other
 * message, so a real message is never hidden between two notices.
 */
export function groupMembershipNotices(threads: any[] = []): any[] {
  const rows: any[] = [];
  let run: {
    item: any;
    kind: MembershipKind;
    names: string[];
    ids: string[];
  } | null = null;

  const flush = () => {
    if (!run) return;
    // Oldest first, without repeating anyone who joined twice in a row.
    const names = [...new Set([...run.names].reverse())];
    const membership: MembershipNotice = {
      kind: run.kind,
      names,
      threadIds: run.ids,
    };
    rows.push({ ...run.item, membership });
    run = null;
  };

  for (const item of threads) {
    const notice = parseMembershipNotice(item);
    if (!notice) {
      flush();
      rows.push(item);
      continue;
    }
    if (run && run.kind === notice.kind) {
      // Newest first: this notice is older, so its names go after the ones held.
      run.names.push(...[...notice.names].reverse());
      run.ids.push(String(item.thread_id));
      continue;
    }
    flush();
    run = {
      item,
      kind: notice.kind,
      names: [...notice.names].reverse(),
      ids: [String(item.thread_id)],
    };
  }
  flush();
  return rows;
}

/** "Ada", "Ada and Ben", "Ada, Ben and Chidi", "Ada, Ben and 3 others". */
export function membershipNames(names: string[]): {
  shown: string[];
  others: number;
} {
  if (names.length <= 3) return { shown: names, others: 0 };
  return { shown: names.slice(0, 2), others: names.length - 2 };
}
