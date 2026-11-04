"use client";

import React, { useMemo } from "react";
import { tokenizeAppleEmoji } from "~/lib/apple-emoji";

interface AppleEmojiTextProps {
  text?: string | null;
  className?: string;
}

export function AppleEmojiText({ text, className }: AppleEmojiTextProps) {
  const elements = useMemo(() => {
    if (!text) return null;

    const tokens = tokenizeAppleEmoji(text);
    return tokens.map((token, index) => {
      if (token.type === "text") {
        return token.text;
      }

      if (token.src) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`emoji-${index}`}
            className="apple-emoji-img"
            alt={token.emoji}
            src={token.src}
            draggable={false}
          />
        );
      }

      return token.emoji;
    });
  }, [text]);

  if (!text) return <>{text || ""}</>;

  if (className) {
    return <span className={className}>{elements}</span>;
  }

  return <>{elements}</>;
}
