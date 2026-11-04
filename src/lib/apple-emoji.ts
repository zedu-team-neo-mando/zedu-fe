import appleData from "@emoji-mart/data/sets/15/apple.json";
import { appleEmojiImageUrl } from "~/lib/env-urls";

export { appleEmojiImageUrl };

type EmojiSkin = { native?: string; unified?: string };
type EmojiEntry = { skins?: EmojiSkin[] };

const nativeToUnified = new Map<string, string>();

for (const emoji of Object.values(
  (appleData as { emojis: Record<string, EmojiEntry> }).emojis
)) {
  for (const skin of emoji.skins ?? []) {
    if (!skin.native || !skin.unified) continue;
    nativeToUnified.set(skin.native, skin.unified.toLowerCase());
  }
}

const EMOJI_PATTERN =
  /\p{Extended_Pictographic}[\u{E0020}-\u{E007E}]+\u{E007F}|\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F|\uFE0E)?)*/gu;

export { EMOJI_PATTERN };

export function lookupAppleEmoji(emoji: string) {
  return (
    nativeToUnified.get(emoji) ||
    nativeToUnified.get(emoji.replace(/\uFE0F/g, "")) ||
    nativeToUnified.get(`${emoji}\uFE0F`)
  );
}

export type AppleEmojiToken =
  | { type: "text"; value: string }
  | { type: "emoji"; emoji: string; src: string };

const escapeHtmlAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function emojiImageTag(emoji: string, unified: string) {
  const src = appleEmojiImageUrl(unified);
  if (!src) return emoji;
  return `<img class="apple-emoji-img" alt="${escapeHtmlAttribute(
    emoji
  )}" src="${escapeHtmlAttribute(src)}" draggable="false" />`;
}

/**
 * Split text into literal text and Apple emoji image tokens.
 *
 * Unlike `replaceEmojiWithImages`, this never returns HTML. Callers render the
 * tokens as React nodes, so message text is escaped by React rather than
 * injected into the DOM.
 */
export function tokenizeAppleEmoji(value: string): AppleEmojiToken[] {
  if (!value) return [];

  const tokens: AppleEmojiToken[] = [];
  let cursor = 0;

  EMOJI_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = EMOJI_PATTERN.exec(value)) !== null) {
    const emoji = match[0];
    if (!emoji) continue;

    const unified = lookupAppleEmoji(emoji);
    if (!unified) continue;

    const src = appleEmojiImageUrl(unified);
    if (!src) continue;

    if (match.index > cursor) {
      tokens.push({ type: "text", value: value.slice(cursor, match.index) });
    }

    tokens.push({ type: "emoji", emoji, src });
    cursor = match.index + emoji.length;
  }

  if (cursor < value.length) {
    tokens.push({ type: "text", value: value.slice(cursor) });
  }

  return tokens;
}

export function replaceEmojiWithImages(value: string) {
  if (!value) return value;

  const parts = value.split(/(<[^>]*>)/g);
  let skip = 0;

  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<(pre|code)\b/i.test(part)) skip += 1;
        else if (/^<\/(pre|code)>/i.test(part)) skip = Math.max(0, skip - 1);
        return part;
      }

      if (!part || skip > 0) return part;

      EMOJI_PATTERN.lastIndex = 0;
      return part.replace(EMOJI_PATTERN, (emoji) => {
        const unified = lookupAppleEmoji(emoji);
        if (!unified) return emoji;
        return emojiImageTag(emoji, unified);
      });
    })
    .join("");
}
