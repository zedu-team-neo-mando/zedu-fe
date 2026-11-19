import React from "react";

interface AuthWorkspacePanelProps {
  title?: string;
  subtitle?: string;
  channelName?: string;
}

/**
 * Modern workspace promotional side panel for auth flows (login / signup).
 * Displays branding, ambient gradient backdrop, and interactive message preview cards
 * matching the Zedu workspace design system.
 */
export const AuthWorkspacePanel: React.FC<AuthWorkspacePanelProps> = ({
  title = "Your team has been busy.",
  subtitle = "12 new messages are waiting for you in 3 channels.",
  channelName = "#team-flamingo",
}) => {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex lg:w-1/2 relative bg-[#18103A] p-12 xl:p-16 flex-col justify-between overflow-hidden select-none"
    >
      {/* Decorative ambient lighting glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#7141F8]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#4828b8]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-[#7141F8]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top headline text */}
      <div className="relative z-10 max-w-md pt-4">
        <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {title}
        </h2>
        <p className="mt-3 text-sm xl:text-base text-purple-200/80 leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>

      {/* Workspace Preview Mockup & Floating Message Stack */}
      <div className="relative z-10 my-auto py-8">
        <div className="relative mx-auto w-full max-w-md rounded-2xl bg-white/[0.05] border border-white/10 p-5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-medium text-purple-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">{channelName}</span>
            </div>
            <span className="text-purple-300/60 text-[11px]">Active now</span>
          </div>

          {/* Floating Message Cards */}
          <div className="space-y-3.5">
            {/* Message 1 */}
            <div className="rounded-xl bg-white p-3.5 shadow-lg border border-neutral-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#7141F8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-xs text-neutral-900">
                    Amara
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    in #team-flamingo
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-700 leading-snug">
                  Good morning everyone
                </p>
              </div>
            </div>

            {/* Message 2 */}
            <div className="rounded-xl bg-white p-3.5 shadow-lg border border-neutral-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F04438] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                T
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-xs text-neutral-900">
                    Tolu
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    in #general
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-700 leading-snug">
                  Anyone active?
                </p>
              </div>
            </div>

            {/* Message 3 (Typing indicator) */}
            <div className="rounded-xl bg-white/95 backdrop-blur-xs py-2 px-3 shadow-lg border border-neutral-100 flex items-center gap-2.5 w-fit">
              <div className="w-7 h-7 rounded-full bg-[#12B76A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                D
              </div>
              <div className="flex items-center gap-1 py-1 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 flex items-center justify-between text-xs text-purple-300/60 pt-4">
        <span>One workspace for your entire cohort</span>
        <span>zedu.chat</span>
      </div>
    </div>
  );
};
