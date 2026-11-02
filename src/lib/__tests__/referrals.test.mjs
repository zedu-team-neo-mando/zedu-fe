import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeReferralCode,
  buildReferralUrl,
  buildSocialShareLinks,
  calculateReferralStats,
  calculateMilestoneProgress,
  formatRelativeTime,
  MILESTONE_TIERS,
} from "../referrals.ts";

describe("Referral System - Unit Tests", () => {
  describe("sanitizeReferralCode", () => {
    it("sanitizes plain alphanumeric handles", () => {
      assert.equal(sanitizeReferralCode("john_doe"), "john_doe");
      assert.equal(sanitizeReferralCode("Alex-2026"), "alex-2026");
    });

    it("strips email domains and special characters", () => {
      assert.equal(sanitizeReferralCode("sarah.dev@example.com"), "sarah-dev");
      assert.equal(sanitizeReferralCode("User!#$*123"), "user-123");
    });

    it("falls back safely on empty or null inputs", () => {
      assert.equal(sanitizeReferralCode(""), "zedu-advocate");
      assert.equal(sanitizeReferralCode(null), "zedu-advocate");
      assert.equal(sanitizeReferralCode(undefined), "zedu-advocate");
      assert.equal(sanitizeReferralCode("   ---   "), "zedu-advocate");
    });

    it("truncates excessively long handles to 30 characters", () => {
      const longInput = "a".repeat(50);
      assert.equal(sanitizeReferralCode(longInput).length, 30);
    });
  });

  const SCHEME = "https";
  const HTTP_SCHEME = "http";

  describe("buildReferralUrl", () => {
    it("generates correct full canonical url with custom origin", () => {
      const url = buildReferralUrl("marcus", `${SCHEME}://zedu.chat`);
      assert.equal(url, `${SCHEME}://zedu.chat/?ref=marcus`);
    });

    it("handles trailing slashes on origin properly", () => {
      const url = buildReferralUrl(
        "team-lead",
        `${SCHEME}://staging.zedu.chat///`
      );
      assert.equal(url, `${SCHEME}://staging.zedu.chat/?ref=team-lead`);
    });

    it("encodes query parameter values safely", () => {
      const url = buildReferralUrl(
        "cohort_alpha",
        `${HTTP_SCHEME}://localhost:3000`
      );
      assert.equal(url, `${HTTP_SCHEME}://localhost:3000/?ref=cohort_alpha`);
    });
  });

  describe("buildSocialShareLinks", () => {
    it("generates valid URLs for X, LinkedIn, Telegram, WhatsApp, and Email", () => {
      const refUrl = `${SCHEME}://zedu.chat/?ref=sarah`;
      const links = buildSocialShareLinks(refUrl, "Join me on Zedu!");

      assert.ok(links.x.includes("twitter.com/intent/tweet"));
      assert.ok(links.x.includes(encodeURIComponent(refUrl)));

      assert.ok(links.linkedIn.includes("linkedin.com/sharing/share-offsite"));
      assert.ok(links.linkedIn.includes(encodeURIComponent(refUrl)));

      assert.ok(links.telegram.includes("t.me/share/url"));
      assert.ok(links.telegram.includes(encodeURIComponent(refUrl)));

      assert.ok(links.whatsapp.includes("api.whatsapp.com/send"));
      assert.ok(links.whatsapp.includes(encodeURIComponent(refUrl)));

      assert.ok(links.email.startsWith("mailto:"));
      assert.ok(links.email.includes(encodeURIComponent(refUrl)));
    });
  });

  describe("calculateReferralStats", () => {
    it("accurately computes empty referral states", () => {
      const stats = calculateReferralStats([]);
      assert.deepEqual(stats, {
        totalInvited: 0,
        successfulSignups: 0,
        activeUsers: 0,
        pendingInvites: 0,
        pointsEarned: 0,
        conversionRate: 0,
      });
    });

    it("accurately computes populated referral states and confirmed signups", () => {
      const mockItems = [
        {
          id: "1",
          name: "Alice",
          email: "alice@test.com",
          date: new Date().toISOString(),
          status: "active",
          points: 250,
        },
        {
          id: "2",
          name: "Bob",
          email: "bob@test.com",
          date: new Date().toISOString(),
          status: "joined",
          points: 100,
        },
        {
          id: "3",
          name: "Charlie",
          email: "charlie@test.com",
          date: new Date().toISOString(),
          status: "pending",
          points: 0,
        },
        {
          id: "4",
          name: "Diana",
          email: "diana@test.com",
          date: new Date().toISOString(),
          status: "pending",
          points: 0,
        },
      ];

      const stats = calculateReferralStats(mockItems);

      assert.equal(stats.totalInvited, 4);
      // Confirmed signups: alice (active) + bob (joined) = 2
      assert.equal(stats.successfulSignups, 2);
      assert.equal(stats.activeUsers, 1);
      assert.equal(stats.pendingInvites, 2);
      assert.equal(stats.pointsEarned, 350);
      // Conversion rate: 2 / 4 = 50%
      assert.equal(stats.conversionRate, 50);
    });
  });

  describe("calculateMilestoneProgress", () => {
    it("handles 0 confirmed signups (initial state)", () => {
      const progress = calculateMilestoneProgress(0, MILESTONE_TIERS);
      assert.equal(progress.currentTier, null);
      assert.equal(progress.nextTier?.threshold, 3);
      assert.equal(progress.progressPercentage, 0);
      assert.equal(progress.invitesNeeded, 3);
      assert.equal(progress.isAllCompleted, false);
    });

    it("handles partial progress towards first milestone (2 signups)", () => {
      const progress = calculateMilestoneProgress(2, MILESTONE_TIERS);
      assert.equal(progress.currentTier, null);
      assert.equal(progress.nextTier?.threshold, 3);
      assert.equal(progress.progressPercentage, 67); // 2/3 = 67%
      assert.equal(progress.invitesNeeded, 1);
      assert.equal(progress.isAllCompleted, false);
    });

    it("unlocks first milestone tier at 3 signups and transitions to next tier (5)", () => {
      const progress = calculateMilestoneProgress(3, MILESTONE_TIERS);
      assert.equal(progress.currentTier?.threshold, 3);
      assert.equal(progress.currentTier?.title, "Starter Advocate");
      assert.equal(progress.nextTier?.threshold, 5);
      assert.equal(progress.progressPercentage, 0); // 0/2 between 3 and 5
      assert.equal(progress.invitesNeeded, 2);
      assert.equal(progress.isAllCompleted, false);
    });

    it("calculates progression between tiers accurately (4 signups = 50% between 3 and 5)", () => {
      const progress = calculateMilestoneProgress(4, MILESTONE_TIERS);
      assert.equal(progress.currentTier?.threshold, 3);
      assert.equal(progress.nextTier?.threshold, 5);
      assert.equal(progress.progressPercentage, 50);
      assert.equal(progress.invitesNeeded, 1);
    });

    it("recognizes all tiers completed at 25 or more invites", () => {
      const progress = calculateMilestoneProgress(30, MILESTONE_TIERS);
      assert.equal(progress.currentTier?.threshold, 25);
      assert.equal(progress.nextTier, null);
      assert.equal(progress.progressPercentage, 100);
      assert.equal(progress.invitesNeeded, 0);
      assert.equal(progress.isAllCompleted, true);
    });
  });

  describe("formatRelativeTime", () => {
    it("formats relative timestamps accurately", () => {
      const baseNow = 1700000000000;
      assert.equal(
        formatRelativeTime(
          new Date(baseNow - 30 * 1000).toISOString(),
          baseNow
        ),
        "Just now"
      );
      assert.equal(
        formatRelativeTime(
          new Date(baseNow - 15 * 60 * 1000).toISOString(),
          baseNow
        ),
        "15m ago"
      );
      assert.equal(
        formatRelativeTime(
          new Date(baseNow - 3 * 3600 * 1000).toISOString(),
          baseNow
        ),
        "3h ago"
      );
      assert.equal(
        formatRelativeTime(
          new Date(baseNow - 24 * 3600 * 1000).toISOString(),
          baseNow
        ),
        "Yesterday"
      );
      assert.equal(
        formatRelativeTime(
          new Date(baseNow - 4 * 24 * 3600 * 1000).toISOString(),
          baseNow
        ),
        "4d ago"
      );
    });
  });
});
