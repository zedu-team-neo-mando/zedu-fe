export type ReferralStatus = "pending" | "joined" | "active";

export interface ReferralItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  date: string; // ISO date string
  status: ReferralStatus;
  points: number;
  role?: string;
}

export interface MilestoneTier {
  threshold: number;
  title: string;
  reward: string;
  bonusPoints: number;
  badge: string;
  perks: string[];
}

export interface ReferralStats {
  totalInvited: number;
  successfulSignups: number;
  activeUsers: number;
  pendingInvites: number;
  pointsEarned: number;
  conversionRate: number; // 0 to 100
}

export interface MilestoneProgress {
  currentTier: MilestoneTier | null;
  nextTier: MilestoneTier | null;
  progressPercentage: number; // 0 to 100
  invitesNeeded: number;
  isAllCompleted: boolean;
}

export interface SocialShareLinks {
  x: string;
  linkedIn: string;
  telegram: string;
  whatsapp: string;
  email: string;
}

export const MILESTONE_TIERS: MilestoneTier[] = [
  {
    threshold: 3,
    title: "Starter Advocate",
    reward: "250 Bonus Points + Early Advocate Badge",
    bonusPoints: 250,
    badge: "🌟",
    perks: [
      "Official Early Advocate profile badge",
      "250 reward points instantly credited",
      "Priority customer community access",
    ],
  },
  {
    threshold: 5,
    title: "Community Builder",
    reward: "500 Bonus Points + Custom Workspace Themes",
    bonusPoints: 500,
    badge: "🚀",
    perks: [
      "Custom workspace branding & color accents",
      "500 reward points bonus",
      "Extended Buzz room participant limits",
    ],
  },
  {
    threshold: 10,
    title: "Super Connector",
    reward: "1,500 Bonus Points + VIP Community Role",
    bonusPoints: 1500,
    badge: "👑",
    perks: [
      "Exclusive VIP Advocate community role",
      "1,500 bonus reward points",
      "Zedu digital sticker & swag pack eligibility",
    ],
  },
  {
    threshold: 25,
    title: "Growth Legend",
    reward: "5,000 Bonus Points + Lifetime Pro Perks",
    bonusPoints: 5000,
    badge: "🏆",
    perks: [
      "Lifetime Pro feature privileges",
      "5,000 top-tier reward points",
      "Quarterly 1:1 strategy call with product team",
    ],
  },
];

export const POINTS_CONFIG = {
  PER_JOINED_SIGNUP: 100,
  PER_ACTIVE_USER: 150,
};

export const STORAGE_KEYS = {
  REFERRALS: "zedu:referrals:items:v1",
  USER_CODE: "zedu:referral_code:v1",
  INCOMING_REF: "zedu:incoming_ref:v1",
  BANNER_DISMISSED: "zedu:ref_banner_dismissed:v1",
} as const;

/**
 * Sanitizes an arbitrary identifier into a clean, URL-safe referral handle.
 */
export function sanitizeReferralCode(raw?: string | null): string {
  if (!raw || typeof raw !== "string") {
    return "zedu-advocate";
  }

  // Remove email domain if an email was passed
  const handle = raw.includes("@") ? raw.split("@")[0] : raw;

  const cleaned = handle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

  return cleaned.length > 0 ? cleaned.slice(0, 30) : "zedu-advocate";
}

/**
 * Generates or derives a referral code from user data in storage/context.
 */
export function getStoredOrGeneratedReferralCode(
  preferredHandle?: string
): string {
  if (preferredHandle && preferredHandle.trim()) {
    return sanitizeReferralCode(preferredHandle);
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_CODE);
      if (stored && stored.trim()) {
        return sanitizeReferralCode(stored);
      }

      // Check if logged in user info exists
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        const nameOrEmail = user?.username || user?.name || user?.email;
        if (nameOrEmail) {
          const derived = sanitizeReferralCode(nameOrEmail);
          localStorage.setItem(STORAGE_KEYS.USER_CODE, derived);
          return derived;
        }
      }

      const email = localStorage.getItem("useremail");
      if (email) {
        const derived = sanitizeReferralCode(email);
        localStorage.setItem(STORAGE_KEYS.USER_CODE, derived);
        return derived;
      }
    } catch {
      // Fall through to fallback
    }
  }

  return "zedu-advocate";
}

/**
 * Builds the canonical public referral URL.
 */
export function buildReferralUrl(code: string, origin?: string): string {
  const safeCode = sanitizeReferralCode(code);
  const SCHEME = "https";
  const base =
    origin?.trim() ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_CLIENT_URL || "");

  const cleanBase = base.replace(/\/+$/, "");
  return `${cleanBase}/?ref=${encodeURIComponent(safeCode)}`;
}

/**
 * Generates quick social share links with pre-filled promotional messages.
 */
export function buildSocialShareLinks(
  referralUrl: string,
  customMessage?: string
): SocialShareLinks {
  const SCHEME = "https";
  const defaultText =
    customMessage ||
    "I'm using Zedu to organize cohort learning, communication, and real-time collaboration. Join with my invite link and get started:";

  const encodedUrl = encodeURIComponent(referralUrl);
  const encodedText = encodeURIComponent(defaultText);

  return {
    x: `${SCHEME}://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedIn: `${SCHEME}://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `${SCHEME}://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `${SCHEME}://api.whatsapp.com/send?text=${encodeURIComponent(
      `${defaultText} ${referralUrl}`
    )}`,
    email: `mailto:?subject=${encodeURIComponent(
      "Join me on Zedu - Workspace for Collaborative Learning"
    )}&body=${encodeURIComponent(`${defaultText}\n\n${referralUrl}`)}`,
  };
}

/**
 * Calculates referral statistics from a list of referrals.
 */
export function calculateReferralStats(items: ReferralItem[]): ReferralStats {
  const totalInvited = items.length;
  const successfulSignups = items.filter(
    (item) => item.status === "joined" || item.status === "active"
  ).length;
  const activeUsers = items.filter((item) => item.status === "active").length;
  const pendingInvites = items.filter(
    (item) => item.status === "pending"
  ).length;

  const pointsEarned = items.reduce((sum, item) => sum + (item.points || 0), 0);

  const conversionRate =
    totalInvited > 0 ? Math.round((successfulSignups / totalInvited) * 100) : 0;

  return {
    totalInvited,
    successfulSignups,
    activeUsers,
    pendingInvites,
    pointsEarned,
    conversionRate,
  };
}

/**
 * Calculates progress towards the reward milestone tiers.
 */
export function calculateMilestoneProgress(
  confirmedSignups: number,
  tiers: MilestoneTier[] = MILESTONE_TIERS
): MilestoneProgress {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);

  let currentTier: MilestoneTier | null = null;
  let nextTier: MilestoneTier | null = null;

  for (let i = 0; i < sorted.length; i++) {
    if (confirmedSignups >= sorted[i].threshold) {
      currentTier = sorted[i];
    } else if (!nextTier) {
      nextTier = sorted[i];
    }
  }

  if (!nextTier) {
    // All milestones unlocked!
    return {
      currentTier,
      nextTier: null,
      progressPercentage: 100,
      invitesNeeded: 0,
      isAllCompleted: true,
    };
  }

  const previousThreshold = currentTier ? currentTier.threshold : 0;
  const range = nextTier.threshold - previousThreshold;
  const progressInRange = Math.max(0, confirmedSignups - previousThreshold);
  const progressPercentage = Math.min(
    100,
    Math.round((progressInRange / range) * 100)
  );
  const invitesNeeded = Math.max(0, nextTier.threshold - confirmedSignups);

  return {
    currentTier,
    nextTier,
    progressPercentage,
    invitesNeeded,
    isAllCompleted: false,
  };
}

/**
 * Formats timestamps into human-readable relative intervals (e.g., "2 hours ago").
 */
export function formatRelativeTime(
  dateString: string,
  nowMs: number = Date.now()
): string {
  const then = new Date(dateString).getTime();
  if (Number.isNaN(then)) return "Recently";

  const diffSeconds = Math.floor((nowMs - then) / 1000);
  if (diffSeconds < 60) return "Just now";
  if (diffSeconds < 3600) {
    const mins = Math.floor(diffSeconds / 60);
    return `${mins}m ago`;
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours}h ago`;
  }
  if (diffSeconds < 604800) {
    const days = Math.floor(diffSeconds / 86400);
    return days === 1 ? "Yesterday" : `${days}d ago`;
  }
  if (diffSeconds < 2592000) {
    const weeks = Math.floor(diffSeconds / 604800);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  const months = Math.floor(diffSeconds / 2592000);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

/**
 * Initial sample referral data for previewing populated state.
 */
export function getSampleReferrals(): ReferralItem[] {
  const SCHEME = "https";
  const now = Date.now();
  const hour = 3600 * 1000;
  const day = 24 * hour;

  return [
    {
      id: "ref-1",
      name: "Marcus Vance",
      email: "m.vance***@techcorp.io",
      avatarUrl: `${SCHEME}://api.dicebear.com/7.x/bottts/svg?seed=Marcus`,
      date: new Date(now - 2 * hour).toISOString(),
      status: "active",
      points: 250,
      role: "Cohort Lead",
    },
    {
      id: "ref-2",
      name: "Amara Chen",
      email: "amara.c***@bootcamp.edu",
      avatarUrl: `${SCHEME}://api.dicebear.com/7.x/bottts/svg?seed=Amara`,
      date: new Date(now - 14 * hour).toISOString(),
      status: "active",
      points: 250,
      role: "Instructor",
    },
    {
      id: "ref-3",
      name: "Devon O'Connor",
      email: "devon.o***@gmail.com",
      avatarUrl: `${SCHEME}://api.dicebear.com/7.x/bottts/svg?seed=Devon`,
      date: new Date(now - 1 * day).toISOString(),
      status: "joined",
      points: 100,
      role: "Student Advocate",
    },
    {
      id: "ref-4",
      name: "Zainab Al-Mansoor",
      email: "zainab.m***@learning.org",
      avatarUrl: `${SCHEME}://api.dicebear.com/7.x/bottts/svg?seed=Zainab`,
      date: new Date(now - 3 * day).toISOString(),
      status: "joined",
      points: 100,
      role: "Community Manager",
    },
    {
      id: "ref-5",
      name: "Liam Gallagher",
      email: "liam.g***@innovate.co",
      avatarUrl: `${SCHEME}://api.dicebear.com/7.x/bottts/svg?seed=Liam`,
      date: new Date(now - 5 * day).toISOString(),
      status: "pending",
      points: 0,
      role: "Invited Collaborator",
    },
    {
      id: "ref-6",
      name: "Priya Sharma",
      email: "p.sharma***@edutech.in",
      avatarUrl: `${SCHEME}://api.dicebear.com/7.x/bottts/svg?seed=Priya`,
      date: new Date(now - 8 * day).toISOString(),
      status: "pending",
      points: 0,
      role: "Invited Educator",
    },
  ];
}
