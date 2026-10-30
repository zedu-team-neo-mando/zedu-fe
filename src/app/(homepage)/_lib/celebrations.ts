export type CelebrationKey =
  | "christmas"
  | "easter"
  | "independence"
  | "newyear";

export interface CelebrationTheme {
  id: CelebrationKey;
  name: string;
  badge: string;
  greeting: string;
  headlineAccent: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  iconEmoji: string;
  bannerBgClass: string;
  pillBgClass: string;
  heroBadgeBgClass: string;
  heroGlowClass: string;
  heroSpanClass: string;
  borderAccentClass: string;
}

export const CELEBRATIONS: Record<CelebrationKey, CelebrationTheme> = {
  christmas: {
    id: "christmas",
    name: "Christmas & Holiday Season",
    badge: "🎄 Christmas Special",
    greeting: "Season's Greetings from Zedu",
    headlineAccent: "Season of Giving",
    description:
      "Celebrate the festive season with flexible cohort plans and special community learning perks.",
    ctaText: "Explore Holiday Offers",
    ctaHref: "/pricing",
    iconEmoji: "🎄",
    bannerBgClass:
      "bg-gradient-to-r from-red-700 via-rose-600 to-emerald-700 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",
    heroBadgeBgClass: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    heroGlowClass:
      "bg-gradient-to-t from-red-100/40 via-emerald-50/20 to-white",
    heroSpanClass: "text-red-600",
    borderAccentClass: "border-red-200",
  },
  easter: {
    id: "easter",
    name: "Easter Celebration",
    badge: "🐣 Happy Easter",
    greeting: "Happy Easter from Zedu",
    headlineAccent: "Season of Renewal",
    description:
      "A season of fresh starts — launch your next cohort with modern, AI-powered learning tools.",
    ctaText: "Start Learning Today",
    ctaHref: "/pricing",
    iconEmoji: "🐣",
    bannerBgClass:
      "bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",
    heroBadgeBgClass:
      "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
    heroGlowClass:
      "bg-gradient-to-t from-amber-100/30 via-emerald-50/20 to-white",
    heroSpanClass: "text-amber-600",
    borderAccentClass: "border-amber-200",
  },
  independence: {
    id: "independence",
    name: "Independence Day",
    badge: "🎆 Independence Celebration",
    greeting: "Happy Independence Day from Zedu",
    headlineAccent: "Freedom to Learn",
    description:
      "Honoring freedom, unity, and innovation across our global learning community.",
    ctaText: "Join the Community",
    ctaHref: "/about",
    iconEmoji: "🎆",
    bannerBgClass:
      "bg-gradient-to-r from-emerald-700 via-teal-600 to-green-800 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",
    heroBadgeBgClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    heroGlowClass:
      "bg-gradient-to-t from-emerald-100/40 via-teal-50/20 to-white",
    heroSpanClass: "text-emerald-700",
    borderAccentClass: "border-emerald-200",
  },
  newyear: {
    id: "newyear",
    name: "New Year Celebration",
    badge: "✨ Happy New Year",
    greeting: "Happy New Year from Zedu",
    headlineAccent: "Year of Growth",
    description:
      "Kick off the new year with modern learning spaces designed for educators and growing cohorts.",
    ctaText: "Kickstart Your Year",
    ctaHref: "/pricing",
    iconEmoji: "✨",
    bannerBgClass:
      "bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-600 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",
    heroBadgeBgClass:
      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    heroGlowClass:
      "bg-gradient-to-t from-indigo-100/30 via-purple-50/20 to-white",
    heroSpanClass: "text-purple-600",
    borderAccentClass: "border-purple-200",
  },
};

export const CELEBRATION_LIST: CelebrationTheme[] = Object.values(CELEBRATIONS);

/**
 * Checks if a specific date falls within the calendar window of a given celebration.
 */
export function isCelebrationDate(
  key: CelebrationKey,
  date: Date = new Date()
): boolean {
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 11 = Dec
  const day = date.getDate();

  switch (key) {
    case "christmas":
      // Dec 10 to Dec 31
      return month === 11 && day >= 10;
    case "newyear":
      // Dec 31 or Jan 1 - Jan 10
      return (month === 11 && day >= 31) || (month === 0 && day <= 10);
    case "easter":
      // Spring celebration window (Late March through April)
      return (month === 2 && day >= 20) || (month === 3 && day <= 30);
    case "independence":
      // Commemorates national and global milestones (July 1-7 or Oct 1-7)
      return (month === 6 && day <= 7) || (month === 9 && day <= 7);
    default:
      return false;
  }
}

/**
 * Detects the active celebration based on calendar date in priority order.
 */
export function detectActiveCelebration(
  date: Date = new Date()
): CelebrationTheme | null {
  const order: CelebrationKey[] = [
    "christmas",
    "newyear",
    "independence",
    "easter",
  ];

  for (const key of order) {
    if (isCelebrationDate(key, date)) {
      return CELEBRATIONS[key];
    }
  }

  return null;
}

/**
 * Returns the active celebration, factoring in optional marketing/QA query overrides.
 */
export function getActiveCelebration(
  overrideKey?: string | null,
  date: Date = new Date()
): CelebrationTheme | null {
  if (overrideKey) {
    const normalized = overrideKey.toLowerCase().trim();
    if (
      normalized === "none" ||
      normalized === "off" ||
      normalized === "false"
    ) {
      return null;
    }
    if (normalized in CELEBRATIONS) {
      return CELEBRATIONS[normalized as CelebrationKey];
    }
  }

  return detectActiveCelebration(date);
}
