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
  motifs: string[];

  // Header & Navbar
  topBarGradientClass: string;
  headerTagText: string;
  headerTagClass: string;
  headerBtnClass: string;

  // Banner
  bannerBgClass: string;
  pillBgClass: string;

  // Hero section
  heroBadgeBgClass: string;
  heroGlowClass: string;
  heroSpanClass: string;
  heroButtonClass: string;
  heroOutlineBtnClass: string;
  heroCardClass: string;
  heroCardBorderClass: string;

  // Features & Content sections
  featureTagText: string;
  featureSpanClass: string;
  featureCardBorderClass: string;
  calloutBgClass: string;

  // Pricing
  pricingBannerText: string;
  pricingBannerClass: string;
  pricingBadgeClass: string;

  // Why section
  whyCardBadge: string;

  // Dynamic Footer
  footerBgClass: string;
  footerHeadline: string;
  footerDescription: string;
  footerBtnClass: string;
}

export const CELEBRATIONS: Record<CelebrationKey, CelebrationTheme> = {
  christmas: {
    id: "christmas",
    name: "Christmas & Holiday Season",
    badge: "🎄 Christmas Special",
    greeting: "Season's Greetings from Zedu",
    headlineAccent: "Season of Giving",
    description:
      "Celebrate the festive season with flexible cohort plans, AI learning tools, and special holiday community perks.",
    ctaText: "Explore Holiday Offers",
    ctaHref: "/pricing",
    iconEmoji: "🎄",
    motifs: ["🎄", "❄️", "🎁", "⭐", "🎅", "🔔", "✨", "🦌"],

    // Header & Navbar
    topBarGradientClass:
      "bg-gradient-to-r from-red-600 via-emerald-600 to-red-600",
    headerTagText: "🎄 Holiday Season",
    headerTagClass: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    headerBtnClass:
      "bg-gradient-to-r from-red-600 via-rose-600 to-emerald-700 hover:from-red-700 hover:to-emerald-800 text-white shadow-md shadow-red-500/20",

    // Banner
    bannerBgClass:
      "bg-gradient-to-r from-red-700 via-rose-600 to-emerald-700 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",

    // Hero
    heroBadgeBgClass:
      "bg-red-50 text-red-700 border-red-300 hover:bg-red-100 shadow-sm",
    heroGlowClass:
      "bg-gradient-to-t from-red-100/50 via-emerald-50/30 to-white",
    heroSpanClass:
      "text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 font-bold",
    heroButtonClass:
      "bg-gradient-to-r from-red-600 via-rose-600 to-emerald-700 hover:from-red-700 hover:to-emerald-800 text-white shadow-lg shadow-red-500/25 ring-2 ring-red-200",
    heroOutlineBtnClass:
      "border-red-600 text-red-700 hover:bg-red-50 hover:text-red-800",
    heroCardClass: "bg-red-50/50 border-red-200/80 shadow-sm",
    heroCardBorderClass: "border-red-200",

    // Features
    featureTagText: "🎁 Holiday Cohort Features",
    featureSpanClass: "text-red-600",
    featureCardBorderClass: "hover:border-red-300 hover:shadow-red-50",
    calloutBgClass:
      "bg-gradient-to-br from-red-50/60 via-white to-emerald-50/60 border border-red-200/70",

    // Pricing
    pricingBannerText:
      "🎄 Holiday Special: Special holiday pricing & free cohort onboarding available throughout the celebration season!",
    pricingBannerClass:
      "bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50 text-red-900 border border-red-200",
    pricingBadgeClass: "bg-red-600 text-white shadow-sm",

    // Why section
    whyCardBadge: "🎄 Holiday Special",

    // Footer
    footerBgClass:
      "bg-gradient-to-b from-red-50/50 via-white to-emerald-50/60 border-t border-red-100",
    footerHeadline: "Celebrate the Season: Run Your Next Cohort Without Limits",
    footerDescription:
      "Wrap up the year with modern learning tools. Join thousands of educators celebrating better cohort experiences with Zedu.",
    footerBtnClass:
      "bg-gradient-to-r from-red-600 via-rose-600 to-emerald-700 hover:from-red-700 hover:to-emerald-800 text-white shadow-md shadow-red-500/25",
  },
  easter: {
    id: "easter",
    name: "Easter Celebration",
    badge: "🐣 Happy Easter",
    greeting: "Happy Easter from Zedu",
    headlineAccent: "Season of Renewal",
    description:
      "A season of fresh starts — launch your next cohort with modern, AI-powered learning tools and spring perks.",
    ctaText: "Start Learning Today",
    ctaHref: "/pricing",
    iconEmoji: "🐣",
    motifs: ["🐣", "🌸", "🥚", "🌷", "🌿", "🦋", "✨"],

    // Header & Navbar
    topBarGradientClass:
      "bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500",
    headerTagText: "🐣 Easter Season",
    headerTagClass:
      "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
    headerBtnClass:
      "bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 hover:from-amber-700 hover:to-teal-800 text-white shadow-md shadow-amber-500/20",

    // Banner
    bannerBgClass:
      "bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",

    // Hero
    heroBadgeBgClass:
      "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-sm",
    heroGlowClass:
      "bg-gradient-to-t from-amber-100/40 via-emerald-50/20 to-white",
    heroSpanClass:
      "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 font-bold",
    heroButtonClass:
      "bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 hover:from-amber-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-200",
    heroOutlineBtnClass:
      "border-amber-600 text-amber-800 hover:bg-amber-50 hover:text-amber-900",
    heroCardClass: "bg-amber-50/40 border-amber-200/80 shadow-sm",
    heroCardBorderClass: "border-amber-200",

    // Features
    featureTagText: "🌸 Spring Cohort Launch",
    featureSpanClass: "text-amber-600",
    featureCardBorderClass: "hover:border-amber-300 hover:shadow-amber-50",
    calloutBgClass:
      "bg-gradient-to-br from-amber-50/50 via-white to-teal-50/50 border border-amber-200/70",

    // Pricing
    pricingBannerText:
      "🐣 Spring Renewal Special: Launch your new cohort with special spring enrollment packages!",
    pricingBannerClass:
      "bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 text-amber-900 border border-amber-200",
    pricingBadgeClass: "bg-emerald-600 text-white shadow-sm",

    // Why section
    whyCardBadge: "🐣 Spring Edition",

    // Footer
    footerBgClass:
      "bg-gradient-to-b from-amber-50/40 via-white to-teal-50/50 border-t border-amber-100",
    footerHeadline: "Spring Forward: Run Your Next Cohort Without Limits",
    footerDescription:
      "Start fresh this spring with organized classrooms, AI-assisted learning, and scalable modern plans.",
    footerBtnClass:
      "bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 hover:from-amber-700 hover:to-teal-800 text-white shadow-md shadow-emerald-500/25",
  },
  independence: {
    id: "independence",
    name: "Nigeria Independence Day",
    badge: "🇳🇬 Nigeria Independence",
    greeting: "Happy Independence Day Nigeria from Zedu",
    headlineAccent: "Freedom & Unity",
    description:
      "Celebrating Nigeria at Independence! Honoring Nigerian excellence, tech innovation, educators, and cohorts nationwide.",
    ctaText: "Celebrate with Zedu",
    ctaHref: "/pricing",
    iconEmoji: "🇳🇬",
    motifs: ["🇳🇬", "🦅", "🍛", "💚", "🪘", "🌴", "🎉", "✨"],

    // Header & Navbar
    topBarGradientClass:
      "bg-gradient-to-r from-green-600 via-emerald-500 to-green-700",
    headerTagText: "🇳🇬 Nigeria Independence",
    headerTagClass:
      "bg-green-50 text-green-800 border-green-200 hover:bg-green-100",
    headerBtnClass:
      "bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md shadow-green-600/20",

    // Banner
    bannerBgClass:
      "bg-gradient-to-r from-green-800 via-emerald-700 to-green-900 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",

    // Hero
    heroBadgeBgClass:
      "bg-green-50 text-green-800 border-green-300 hover:bg-green-100 shadow-sm",
    heroGlowClass:
      "bg-gradient-to-t from-green-100/50 via-emerald-50/30 to-white",
    heroSpanClass:
      "text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 font-bold",
    heroButtonClass:
      "bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg shadow-green-600/25 ring-2 ring-green-200",
    heroOutlineBtnClass:
      "border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800",
    heroCardClass: "bg-green-50/50 border-green-200/80 shadow-sm",
    heroCardBorderClass: "border-green-200",

    // Features
    featureTagText: "🇳🇬 Naija Tech & Learning",
    featureSpanClass: "text-green-600",
    featureCardBorderClass: "hover:border-green-300 hover:shadow-green-50",
    calloutBgClass:
      "bg-gradient-to-br from-green-50/60 via-white to-emerald-50/60 border border-green-200/70",

    // Pricing
    pricingBannerText:
      "🇳🇬 Happy Independence Day Nigeria: Empowering Nigerian bootcamps & schools with 0% per-student fees! 🦅 🍛",
    pricingBannerClass:
      "bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 text-green-900 border border-green-200",
    pricingBadgeClass: "bg-green-700 text-white shadow-sm",

    // Why section
    whyCardBadge: "🇳🇬 Naija Built",

    // Footer
    footerBgClass:
      "bg-gradient-to-b from-green-50/50 via-white to-emerald-50/60 border-t border-green-100",
    footerHeadline:
      "Happy Independence Day Nigeria: Run Your Cohort Without Limits",
    footerDescription:
      "Honoring Nigerian innovation, educators, and learners. Build world-class tech cohorts and learning communities with Zedu.",
    footerBtnClass:
      "bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md shadow-green-600/25",
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
    motifs: ["✨", "🥂", "🍾", "🎆", "⭐", "🎉", "💫"],

    // Header & Navbar
    topBarGradientClass:
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500",
    headerTagText: "✨ New Year 2026",
    headerTagClass:
      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    headerBtnClass:
      "bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-600 hover:from-indigo-800 hover:to-purple-800 text-white shadow-md shadow-purple-600/20",

    // Banner
    bannerBgClass:
      "bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-600 text-white",
    pillBgClass: "bg-white/20 text-white border-white/30 hover:bg-white/30",

    // Hero
    heroBadgeBgClass:
      "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 shadow-sm",
    heroGlowClass:
      "bg-gradient-to-t from-indigo-100/40 via-purple-50/20 to-white",
    heroSpanClass:
      "text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-amber-600 font-bold",
    heroButtonClass:
      "bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-600 hover:from-indigo-800 hover:to-purple-800 text-white shadow-lg shadow-purple-600/25 ring-2 ring-purple-200",
    heroOutlineBtnClass:
      "border-purple-600 text-purple-700 hover:bg-purple-50 hover:text-purple-800",
    heroCardClass: "bg-purple-50/40 border-purple-200/80 shadow-sm",
    heroCardBorderClass: "border-purple-200",

    // Features
    featureTagText: "✨ New Year Growth",
    featureSpanClass: "text-purple-600",
    featureCardBorderClass: "hover:border-purple-300 hover:shadow-purple-50",
    calloutBgClass:
      "bg-gradient-to-br from-purple-50/50 via-white to-amber-50/40 border border-purple-200/70",

    // Pricing
    pricingBannerText:
      "✨ New Year Offer: Kick off your annual learning goals with structured channels and AI power!",
    pricingBannerClass:
      "bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 text-purple-900 border border-purple-200",
    pricingBadgeClass: "bg-purple-700 text-white shadow-sm",

    // Why section
    whyCardBadge: "✨ Year of Growth",

    // Footer
    footerBgClass:
      "bg-gradient-to-b from-purple-50/40 via-white to-amber-50/40 border-t border-purple-100",
    footerHeadline: "Ring in the New Year: Run Your Next Cohort Without Limits",
    footerDescription:
      "Kickstart your year with structured learning spaces designed for educator and student success.",
    footerBtnClass:
      "bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-600 hover:from-indigo-800 hover:to-purple-800 text-white shadow-md shadow-purple-600/25",
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
      // Commemorates Nigerian Independence (Oct 1 - Oct 7)
      return (month === 9 && day <= 7) || (month === 6 && day <= 7);
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
