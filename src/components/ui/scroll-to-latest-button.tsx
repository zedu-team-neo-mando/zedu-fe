"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ScrollToLatestButtonProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  onScrollToBottom?: () => void;
  className?: string;
  scrollToTop?: boolean;
}

export const ScrollToLatestButton = ({
  scrollContainerRef,
  isAtBottom,
  onScrollToBottom,
  className,
  scrollToTop = true,
}: ScrollToLatestButtonProps) => {
  const handleClick = () => {
    const container = scrollContainerRef.current;
    if (container) {
      if (scrollToTop) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
    onScrollToBottom?.();
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "absolute bottom-4 right-4 z-20 shadow-lg transition-all duration-200 ease-in-out",
        isAtBottom
          ? "opacity-0 pointer-events-none translate-y-2.5 disabled:opacity-0"
          : "opacity-100 pointer-events-auto translate-y-0",
        className
      )}
      onClick={handleClick}
      aria-label="Scroll to latest messages"
      aria-hidden={isAtBottom}
      disabled={isAtBottom}
      tabIndex={isAtBottom ? -1 : 0}
    >
      <ChevronDown size={18} strokeWidth={2.5} className="text-primary" />
    </Button>
  );
};
