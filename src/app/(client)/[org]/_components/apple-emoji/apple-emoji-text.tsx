"use client";

import { tokenizeAppleEmoji } from "~/lib/apple-emoji";

export function AppleEmojiText({ text }: { text?: string | null }) {
  const value = text || "";
  const tokens = tokenizeAppleEmoji(value);

  if (!tokens.some((token) => token.type === "emoji")) return <>{value}</>;

  return (
    <>
      {tokens.map((token, index) =>
        token.type === "emoji" ? (
          // Emoji images are pre-sized by their CSS class; next/image would need
          // explicit dimensions and a remote-pattern entry for the CDN.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`emoji-${index}`}
            className="apple-emoji-img"
            alt={token.emoji}
            src={token.src}
            draggable={false}
          />
        ) : (
          <span key={`text-${index}`}>{token.text}</span>
        )
      )}
    </>
  );
}
