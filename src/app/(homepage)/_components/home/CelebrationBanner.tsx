"use client";

import Link from "next/link";
import React, { useState } from "react";
import { X, Sparkles, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useCelebration } from "./CelebrationThemeContext";
import { CELEBRATION_LIST } from "../../_lib/celebrations";
import {
  NigerianFlagIcon,
  ChristmasTreeIcon,
  EasterEggIcon,
  ChampagneToastIcon,
} from "./CelebrationIcons";

export const CelebrationThemeIcon: React.FC<{
  id: string;
  className?: string;
}> = ({ id, className = "w-5 h-5" }) => {
  switch (id) {
    case "independence":
      return <NigerianFlagIcon className="h-4 w-6 shadow-sm" />;
    case "christmas":
      return <ChristmasTreeIcon className={className} />;
    case "easter":
      return <EasterEggIcon className={className} />;
    case "newyear":
      return <ChampagneToastIcon className={className} />;
    default:
      return null;
  }
};

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
    return null;
  }

  return (
    <aside
      aria-label="Seasonal celebration announcement"
      className={`relative z-40 w-full transition-all duration-300 shadow-md ${celebration.bannerBgClass}`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-xs sm:px-6 sm:text-sm lg:px-8">
        {/* Left / Message section */}
        <div className="flex flex-1 items-center gap-3 min-w-[280px]">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 shadow-inner ring-1 ring-white/30"
            role="img"
            aria-label={celebration.name}
          >
            <CelebrationThemeIcon id={celebration.id} className="w-5 h-5" />
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-bold tracking-wide text-white drop-shadow-sm flex items-center gap-1.5">
              {celebration.id === "independence" && (
                <NigerianFlagIcon className="h-3.5 w-5 inline-block mr-1" />
              )}
              {celebration.greeting}:
            </span>
            <span className="text-white/95">{celebration.description}</span>
          </div>
        </div>

        {/* Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={celebration.ctaHref}
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-900 shadow-md transition hover:bg-neutral-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
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
              className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-black/35 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Theme</span>
            </button>

            {showPreviewMenu && (
              <div
                role="menu"
                aria-orientation="vertical"
                className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-neutral-200 bg-white p-2 text-neutral-800 shadow-2xl"
              >
                <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
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
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition hover:bg-neutral-100 ${
                      activeKey === theme.id
                        ? "font-bold text-primary-500 bg-primary-50"
                        : "text-neutral-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CelebrationThemeIcon id={theme.id} className="w-4 h-4" />
                      {theme.name}
                    </span>
                    {activeKey === theme.id && (
                      <Sparkles className="h-3.5 w-3.5 text-primary-500" />
                    )}
                  </button>
                ))}
                <div className="my-1.5 border-t border-neutral-100" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setCelebrationKey("auto");
                    setShowPreviewMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition hover:bg-neutral-100 ${
                    activeKey === "auto"
                      ? "font-bold text-primary-500 bg-primary-50"
                      : "text-neutral-600"
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
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left text-neutral-500 transition hover:bg-neutral-100"
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
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
