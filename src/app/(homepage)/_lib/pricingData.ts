export type BillingCycle = "monthly" | "yearly";
export type CtaVariant = "outline" | "filled";
export type PricingVariant = "starter" | "popular" | "enterprise";

/** Resolved at render time to the viewer's org billing page, or sign-up. */
export const PLAN_CTA = "plan";

export type PricingFeature = {
  text: string;
  enabled: boolean;
};

export type PricingCardData = {
  key: string;
  title: string;
  description: string;
  amount: string;
  periodLabel?: string;
  footnote?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaHref?: string;
  ctaVariant: CtaVariant;
  variant: PricingVariant;
  badgeText?: string;
};

const monthlyCards: PricingCardData[] = [
  {
    key: "starter",
    title: "Starter",
    description: "Best for small classes and educators starting with Zedu.",
    amount: "₦0",
    periodLabel: "/month",
    footnote: "Per workspace · No credit card needed",
    features: [
      { text: "Up to 3 cohorts", enabled: true },
      { text: "Up to 100 members in total", enabled: true },
      { text: "Up to 5 teachers/admins", enabled: true },
      { text: "Organized learning channels", enabled: true },
      { text: "Basic messaging and threads", enabled: true },
      { text: "File sharing", enabled: true },
      { text: "Basic notifications", enabled: true },
      { text: "Limited AI assistance", enabled: true },
    ],
    ctaText: "Get Started Free",
    ctaHref: "/auth/sign-up",
    ctaVariant: "outline",
    variant: "starter",
  },
  {
    key: "pro",
    title: "Pro",
    description: "Best for bootcamps and structured programs.",
    amount: "₦20,000",
    periodLabel: "/month",
    footnote: "Per workspace · about $13 USD",
    features: [
      { text: "Everything in Starter, and", enabled: true },
      { text: "Unlimited cohorts", enabled: true },
      { text: "Up to 500 students per cohort", enabled: true },
      { text: "Up to 50 teachers/admins", enabled: true },
      { text: "Live classes and collaboration tools", enabled: true },
      { text: "AI study assistants", enabled: true },
      { text: "Assignment and cohort management", enabled: true },
      { text: "Admin moderation tools", enabled: true },
    ],
    ctaText: "Start Pro Plan",
    ctaHref: PLAN_CTA,
    ctaVariant: "filled",
    variant: "popular",
    badgeText: "Most Popular",
  },
  {
    key: "enterprise",
    title: "Enterprise",
    description: "Flexible pricing for universities and institutions.",
    amount: "Let's Talk",
    periodLabel: "",
    footnote: "Custom billing",
    features: [
      { text: "Everything in Pro, and", enabled: true },
      { text: "Custom student limits per cohort", enabled: true },
      { text: "Unlimited teachers/admins", enabled: true },
      { text: "Advanced AI agents and automation", enabled: true },
      { text: "Institution-level workspace control", enabled: true },
      { text: "Security and compliance tools", enabled: true },
      { text: "Custom integrations", enabled: true },
      { text: "Dedicated onboarding & priority support", enabled: true },
    ],
    ctaText: "Contact Sales",
    ctaHref: "/contact-sales",
    ctaVariant: "outline",
    variant: "enterprise",
  },
];

const yearlyCards: PricingCardData[] = [
  {
    ...monthlyCards[0],
    features: [...monthlyCards[0].features],
  },
  {
    ...monthlyCards[1],
    amount: "Contact Sales",
    periodLabel: "",
    footnote: "Annual billing available on request",
    ctaText: "Contact Sales",
    ctaHref: "/contact-sales",
    ctaVariant: "outline",
    features: [...monthlyCards[1].features],
  },
  {
    ...monthlyCards[2],
    features: [...monthlyCards[2].features],
  },
];

export const pricingCardsByCycle: Record<BillingCycle, PricingCardData[]> = {
  monthly: monthlyCards,
  yearly: yearlyCards,
};
