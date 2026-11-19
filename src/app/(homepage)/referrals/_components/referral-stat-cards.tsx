"use client";

import React from "react";
import { Users, UserCheck, Sparkles, TrendingUp } from "lucide-react";
import { ReferralStats } from "~/lib/referrals";

interface ReferralStatCardsProps {
  stats: ReferralStats;
}

export const ReferralStatCards: React.FC<ReferralStatCardsProps> = ({
  stats,
}) => {
  return (
    <section aria-label="Referral Performance Summary" className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Invited */}
        <div
          data-testid="stat-card-total-invited"
          className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Total Invited
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
                {stats.totalInvited}
              </span>
              <span className="text-xs font-medium text-neutral-500">
                {stats.totalInvited === 1
                  ? "invitation sent"
                  : "invitations sent"}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              {stats.pendingInvites} awaiting sign-up
            </p>
          </div>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-primary-500/5 blur-xl" />
        </div>

        {/* Card 2: Successful Sign-ups */}
        <div
          data-testid="stat-card-signups"
          className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Confirmed Sign-ups
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
                {stats.successfulSignups}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                {stats.activeUsers} Active
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              {stats.successfulSignups} joined through your unique link
            </p>
          </div>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl" />
        </div>

        {/* Card 3: Points Earned */}
        <div
          data-testid="stat-card-points"
          className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Points / Rewards Earned
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
                {stats.pointsEarned.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 font-mono">
                PTS
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              +100 pts per signup, +150 pts when active
            </p>
          </div>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-amber-500/5 blur-xl" />
        </div>

        {/* Card 4: Conversion Rate */}
        <div
          data-testid="stat-card-conversion"
          className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Invite Conversion
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
                {stats.conversionRate}%
              </span>
              <span className="text-xs font-medium text-neutral-500">
                sign-up rate
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              {stats.successfulSignups} of {stats.totalInvited} invited have
              registered
            </p>
          </div>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-purple-500/5 blur-xl" />
        </div>
      </div>
    </section>
  );
};
