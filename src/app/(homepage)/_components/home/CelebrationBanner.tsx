"use client";

import Link from "next/link";
import React, { useState } from "react";
import { X, Sparkles, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useCelebration } from "./CelebrationThemeContext";
import { CELEBRATION_LIST, CelebrationKey } from "../../_lib/celebrations";

export const CelebrationBanner: React.FC = () => {
  const {
    celebration,
    activeKey,
    setCelebrationKey,
    dismissBanner,
    isDismissed,
    isLoaded,
  } = useCelebration();

  const [showPreviewMenu, setShowPreviewMenu] = useState(false);

  if (!isLoaded || !celebration || isDismissed) {
    // If no celebration is active or banner is dismissed, we can still surface a subtle QA preview control if requested via query or show nothing
    return null;
  }

  return (
    <aside
      aria-label="Seasonal celebration announcement"
      className={`relative z-30 w-full transition-all duration-300 shadow-sm ${celebration.bannerBgClass}`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 text-xs sm:px-6 sm:text-sm lg:px-8">
        {/* Left / Message section */}
        <div className="flex flex-1 items-center gap-2.5 min-w-[260px]">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm shadow-inner"
            role="img"
            aria-label={celebration.name}
          >
            {celebration.iconEmoji}
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold tracking-wide">
              {celebration.greeting}:
            </span>
            <span className="text-white/90">{celebration.description}</span>
          </div>
        </div>

        {/* Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={celebration.ctaHref}
            className="group inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            <span>{celebration.ctaText}</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Marketing & QA preview trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPreviewMenu((prev) => !prev)}
              title="Preview another celebration theme"
              aria-label="Preview celebration themes"
              aria-expanded={showPreviewMenu}
              className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm transition hover:bg-black/30 focus:outline-none focus:ring-1 focus:ring-white/40"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {showPreviewMenu && (
              <div
                role="menu"
                aria-orientation="vertical"
                className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-800 shadow-xl"
              >
                <div className="px-2 py-1 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Marketing Preview
                </div>
                {CELEBRATION_LIST.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setCelebrationKey(theme.id);
                      setShowPreviewMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition hover:bg-neutral-100 ${
                      activeKey === theme.id
                        ? "font-semibold text-primary-500 bg-primary-50"
                        : ""
                    }`}
                  >
                    <span>
                      {theme.iconEmoji} {theme.name}
                    </span>
                    {activeKey === theme.id && (
                      <Sparkles className="h-3 w-3 text-primary-500" />
                    )}
                  </button>
                ))}
                <div className="my-1 border-t border-neutral-100" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setCelebrationKey("auto");
                    setShowPreviewMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition hover:bg-neutral-100 ${
                    activeKey === "auto"
                      ? "font-semibold text-primary-500 bg-primary-50"
                      : ""
                  }`}
                >
                  <span>📅 Auto (Calendar Date)</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setCelebrationKey("none");
                    setShowPreviewMenu(false);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left text-neutral-500 transition hover:bg-neutral-100"
                >
                  <span>🚫 Default (Standard)</span>
                </button>
              </div>
            )}
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss seasonal announcement"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-1 focus:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
