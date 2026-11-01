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

function emojiImageTag(emoji: string, unified: string) {
  const src = appleEmojiImageUrl(unified);
  if (!src) return emoji;
  const safeAlt = emoji.replace(/"/g, "&quot;");
  return `<img class="apple-emoji-img" alt="${safeAlt}" src="${src}" draggable="false" />`;
}

export type EmojiToken =
  | { type: "text"; text: string }
  | { type: "emoji"; emoji: string; unified?: string; src?: string };

export function tokenizeAppleEmoji(value: string): EmojiToken[] {
  if (!value) return [];

  const tokens: EmojiToken[] = [];
  const regex = new RegExp(EMOJI_PATTERN.source, EMOJI_PATTERN.flags);
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value)) !== null) {
    const matchIndex = match.index;
    const emoji = match[0];

    if (matchIndex > lastIndex) {
      tokens.push({
        type: "text",
        text: value.slice(lastIndex, matchIndex),
      });
    }

    const unified = lookupAppleEmoji(emoji);
    const src = unified ? appleEmojiImageUrl(unified) : undefined;

    tokens.push({
      type: "emoji",
      emoji,
      unified,
      src,
    });

    lastIndex = matchIndex + emoji.length;
  }

  if (lastIndex < value.length) {
    tokens.push({
      type: "text",
      text: value.slice(lastIndex),
    });
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
