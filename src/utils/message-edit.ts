type ReplyPreview = {
  user_id?: string;
};

type EditableMessage = {
  user_id?: string;
  message_count?: number | string;
  messages?: ReplyPreview[] | null;
};

/**
 * How many replies the server lists in a message's preview (the backend loads
 * the first page of 50 replies for each thread).
 */
export const REPLY_PREVIEW_LIMIT = 50;

/**
 * True when someone other than the author may have replied to the message.
 *
 * Replies are only listed as a preview, and live updates keep a single
 * preview per person, so the reply count can be higher than the preview even
 * when the author replied more than once. The count is therefore not compared
 * with the number of previews. Replies can only be hidden once the preview is
 * full; then editing is hidden, which is the safe side.
 */
export function hasRepliesFromOthers(item?: EditableMessage | null) {
  if (!item) return false;

  const replyCount = Number(item.message_count) || 0;
  if (replyCount <= 0) return false;

  const previews = Array.isArray(item.messages) ? item.messages : [];
  if (previews.some((reply) => reply?.user_id !== item.user_id)) return true;

  return previews.length >= REPLY_PREVIEW_LIMIT && replyCount > previews.length;
}

/** Only the author may edit, and only until someone else has replied. */
export function canEditMessage(
  currentUserId: string | undefined,
  item?: EditableMessage | null
) {
  if (!currentUserId || !item || item.user_id !== currentUserId) return false;
  return !hasRepliesFromOthers(item);
}
