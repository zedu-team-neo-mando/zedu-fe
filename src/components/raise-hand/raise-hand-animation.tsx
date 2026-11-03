"use client";

import { useEffect, useState } from "react";
import { Hand } from "lucide-react";
import { cn } from "~/lib/utils";

interface RaiseHandAnimationProps {
  trigger: boolean;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "center";
  useRelativePosition?: boolean; // When true, doesn't apply fixed positioning (for use in absolute containers)
}

export function RaiseHandAnimation({
  trigger,
  position = "bottom-right",
  useRelativePosition = false,
}: RaiseHandAnimationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (trigger) {
      const bounceTimer = setTimeout(() => {
        setIsBouncing(true);
      }, 200);

      const expandTimer = setTimeout(() => {
        setIsBouncing(false);
        setIsExpanded(true);
      }, 900);

      return () => {
        clearTimeout(bounceTimer);
        clearTimeout(expandTimer);
      };
    } else {
      setIsBouncing(false);
      setIsExpanded(false);
    }
  }, [trigger]);

  if (!trigger) return null;

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-0 right-4",
    "bottom-left": "bottom-4 left-4",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={cn(
        "z-50 pointer-events-none",
        !useRelativePosition && "fixed",
        !useRelativePosition && positionClasses[position]
      )}
    >
      <div
        className={cn(
          "bg-blue-300 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-out",
          !isExpanded && "w-7 h-10 animate-slide-up",
          isExpanded && "w-auto h-10 px-3 gap-2"
        )}
      >
        <Hand
          size={18}
          className={cn(
            "flex-shrink-0",
            isBouncing && "animate-bounce-gentle",
            isExpanded && "animate-wave"
          )}
        />

        {/* Text appears only when expanded */}
        {isExpanded && (
          <span className="font-medium text-sm whitespace-nowrap animate-fade-in">
            Hand raised!
          </span>
        )}
      </div>
    </div>
  );
}
