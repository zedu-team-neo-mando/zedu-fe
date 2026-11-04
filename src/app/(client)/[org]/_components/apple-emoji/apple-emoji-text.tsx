"use client";

import { Fragment } from "react";
import { tokenizeAppleEmoji } from "~/lib/apple-emoji";

export function AppleEmojiText({ text }: { text?: string | null }) {
  const value = text ?? "";
  const tokens = tokenizeAppleEmoji(value);

  if (
    tokens.length === 0 ||
    (tokens.length === 1 && tokens[0].type === "text")
  ) {
    return <>{value}</>;
  }

  return (
    <span>
      {tokens.map((token, index) => {
        if (token.type === "text") {
          return <Fragment key={`text-${index}`}>{token.value}</Fragment>;
        }

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`emoji-${index}`}
            className="apple-emoji-img"
            src={token.src}
            alt={token.emoji}
            draggable={false}
          />
        );
      })}
    </span>
  );
}
