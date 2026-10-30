// components/CopyToClipboardWithTooltip.tsx

"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface CopyToClipboardWithTooltipProps {
  textToCopy: string;
  tooltipText?: string;
  // Accessible name of the copy button, e.g. "Copy email".
  label?: string;
  children: React.ReactNode;
}

export function CopyToClipboardWithTooltip({
  textToCopy,
  tooltipText = "Copied",
  label = "Copy",
  children,
}: CopyToClipboardWithTooltipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          {/* A real button, so keyboard and screen-reader users can copy too. */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={label}
            className="cursor-pointer inline-flex rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {children}
          </button>
        </TooltipTrigger>

        <TooltipContent side="top" className="bg-black text-white">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
