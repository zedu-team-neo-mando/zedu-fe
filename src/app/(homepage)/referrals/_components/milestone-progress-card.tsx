"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  Lock,
  Gift,
  ChevronRight,
  Zap,
} from "lucide-react";
import { MILESTONE_TIERS, calculateMilestoneProgress } from "~/lib/referrals";

interface MilestoneProgressCardProps {
  successfulSignups: number;
}

export const MilestoneProgressCard: React.FC<MilestoneProgressCardProps> = ({
  successfulSignups,
}) => {
  const progress = calculateMilestoneProgress(
    successfulSignups,
    MILESTONE_TIERS
  );

  return (
    <div
      data-testid="milestone-progression"
      className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-semibold text-amber-800">
            <Award className="h-3.5 w-3.5 text-amber-600" />
            <span>Milestone Reward Tiers</span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Unlock exclusive platform perks
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Every successful sign-up pushes you closer to higher advocate ranks,
            bonus points, and custom Zedu features.
          </p>
        </div>

        {/* Current status chip */}
        <div className="shrink-0 flex items-center gap-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 p-3 sm:px-4">
          <div className="text-right">
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Confirmed Sign-ups
            </div>
            <div className="text-2xl font-black text-neutral-900 font-mono">
              {successfulSignups}
            </div>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div className="text-left">
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Current Rank
            </div>
            <div className="text-sm font-bold text-primary-600">
              {progress.currentTier?.title || "Explorer"}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Progress Indicator towards Next Perk */}
      <div className="mt-6 rounded-2xl bg-neutral-50/90 border border-neutral-200/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-neutral-800">
              {progress.nextTier ? (
                <>
                  Next Milestone:{" "}
                  <strong className="text-primary-600">
                    {progress.nextTier.title} ({progress.nextTier.threshold}{" "}
                    invites)
                  </strong>
                </>
              ) : (
                <span className="text-emerald-700 font-bold">
                  All Milestone Tiers Unlocked!
                </span>
              )}
            </span>
          </div>
          <span className="text-xs font-medium text-neutral-500">
            {progress.nextTier
              ? `${progress.invitesNeeded} more confirmed ${
                  progress.invitesNeeded === 1 ? "invite" : "invites"
                } needed`
              : "Maximum VIP Status Reached"}
          </span>
        </div>

        {/* Progress Bar Track */}
        <div
          role="progressbar"
          aria-valuenow={progress.progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress to next milestone tier"
          className="relative h-3.5 w-full overflow-hidden rounded-full bg-neutral-200"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
            style={{ width: `${progress.progressPercentage}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <span>
            {progress.currentTier
              ? `${progress.currentTier.threshold} invites`
              : "0 invites"}
          </span>
          <span className="font-semibold text-neutral-700">
            {progress.progressPercentage}% completed
          </span>
          <span>
            {progress.nextTier
              ? `${progress.nextTier.threshold} invites`
              : "25+ invites"}
          </span>
        </div>
      </div>

      {/* Milestone Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MILESTONE_TIERS.map((tier) => {
          const isUnlocked = successfulSignups >= tier.threshold;
          const isNext = progress.nextTier?.threshold === tier.threshold;

          return (
            <div
              key={tier.threshold}
              data-testid={`milestone-tier-${tier.threshold}`}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                isUnlocked
                  ? "border-emerald-300 bg-emerald-50/30 shadow-xs"
                  : isNext
                    ? "border-primary-400 bg-primary-50/20 ring-2 ring-primary-500/20 shadow-sm"
                    : "border-neutral-200/80 bg-neutral-50/50 opacity-80"
              }`}
            >
              <div>
                {/* Top Badge & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl" role="img" aria-label={tier.title}>
                    {tier.badge}
                  </span>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : isNext ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700">
                      <Gift className="h-3 w-3 text-primary-600" />
                      <span>In Progress</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Threshold & Title */}
                <div className="mt-3">
                  <div className="text-xs font-mono font-semibold text-neutral-500 uppercase">
                    {tier.threshold} Confirmed Invites
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mt-0.5">
                    {tier.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-primary-700">
                    +{tier.bonusPoints} Bonus Points
                  </p>
                </div>

                {/* Perks Checklist */}
                <ul className="mt-3.5 space-y-2 border-t border-neutral-200/60 pt-3">
                  {tier.perks.map((perk, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-1.5 text-xs text-neutral-600"
                    >
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary-500 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Target indicator */}
              <div className="mt-4 pt-3 border-t border-neutral-200/60 text-center">
                {isUnlocked ? (
                  <span className="text-xs font-semibold text-emerald-700">
                    ✓ Reward Unlocked & Claimed
                  </span>
                ) : (
                  <span className="text-xs font-medium text-neutral-500">
                    {Math.max(0, tier.threshold - successfulSignups)} more
                    invites to unlock
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
