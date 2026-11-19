"use client";

import { Lock } from "lucide-react";
import React, { useEffect, useRef } from "react";

const RestrictedChannel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // No 140px floor here: the banner is shorter than the composer, and the
    // floor would keep the message list padded as if the composer were there.
    const updateHeight = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--chat-composer-height",
        `${height + 16}px`
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--chat-composer-height");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-20 w-full bg-white pb-3 dark:bg-[#1A1D21]"
    >
      <div className="mx-3 md:mx-5 rounded-xl border border-[#E6EAEF] dark:border-white/10 bg-[#F9FAFB] dark:bg-[#222529] px-4 py-3 flex items-center justify-center gap-2 text-center">
        <Lock aria-hidden="true" className="h-4 w-4 shrink-0 text-[#5757CD]" />
        <p className="text-sm font-medium text-[#101828] dark:text-zinc-100">
          Only admins can send messages in this channel.
        </p>
      </div>
    </div>
  );
};

export default RestrictedChannel;
