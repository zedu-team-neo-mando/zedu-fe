"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Trophy, Users } from "lucide-react";
import {
  ReferralItem,
  getSampleReferrals,
  calculateReferralStats,
  getStoredOrGeneratedReferralCode,
  STORAGE_KEYS,
} from "~/lib/referrals";
import { ReferralStatCards } from "./referral-stat-cards";
import { ReferralLinkCard } from "./referral-link-card";
import { MilestoneProgressCard } from "./milestone-progress-card";
import { ReferralActivityTable } from "./referral-activity-table";
import { ReferralFAQ } from "./referral-faq";
import { showSuccess } from "~/components/toast/sonner";

export function ReferralDashboard() {
  const [referralCode, setReferralCode] = useState("zedu-advocate");
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [isEmptyView, setIsEmptyView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from storage or samples
  useEffect(() => {
    const code = getStoredOrGeneratedReferralCode();
    setReferralCode(code);

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReferrals(parsed);
          setIsLoaded(true);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    // Default to realistic sample data
    const samples = getSampleReferrals();
    setReferrals(samples);
    setIsLoaded(true);
  }, []);

  const handleAddInvite = (email: string, name?: string) => {
    const newItem: ReferralItem = {
      id: `ref-${Date.now()}`,
      name: name || email.split("@")[0],
      email: `${email.slice(0, 3)}***@${email.split("@")[1]}`,
      date: new Date().toISOString(),
      status: "pending",
      points: 0,
      role: "Invited Colleague",
    };

    const updated = [newItem, ...referrals];
    setReferrals(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    }
    showSuccess("Invite queued!", `We've recorded an invite for ${email}.`);
  };

  const handleToggleEmptyState = () => {
    setIsEmptyView((prev) => !prev);
  };

  const activeReferralsList = isEmptyView ? [] : referrals;
  const stats = calculateReferralStats(activeReferralsList);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary-600 transition">
              Home
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <span
              aria-current="page"
              className="font-semibold text-neutral-900"
            >
              Referral Program
            </span>
          </li>
        </ol>
      </nav>

      {/* Hero Header */}
      <section className="text-center sm:text-left space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-600 border border-primary-200/50">
          <Sparkles className="h-4 w-4" />
          <span>Zedu Viral Growth Engine & Rewards</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          Refer Friends & Expand Your Cohort
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
          Share Zedu with educators, bootcamps, and fellow learners. Track your
          invites in real-time, earn milestone perks at 3, 5, 10, and 25
          sign-ups, and level up your community rank.
        </p>
      </section>

      {/* Real-time Summary Stat Cards */}
      <ReferralStatCards stats={stats} />

      {/* Referral Link Generator & Social Sharing Card */}
      <ReferralLinkCard
        referralCode={referralCode}
        onCodeChange={(newCode) => setReferralCode(newCode)}
      />

      {/* Reward Milestones & Progression Bar */}
      <MilestoneProgressCard successfulSignups={stats.successfulSignups} />

      {/* Referral Activity Table (with empty & populated state support) */}
      <ReferralActivityTable
        items={referrals}
        isEmptyView={isEmptyView}
        onToggleEmptyState={handleToggleEmptyState}
        onAddInvite={handleAddInvite}
      />

      {/* FAQs */}
      <ReferralFAQ />
    </div>
  );
}
