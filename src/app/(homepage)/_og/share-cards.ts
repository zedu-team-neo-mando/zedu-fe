import { siteUrl } from "~/lib/env-urls";
import { pricingCardsByCycle } from "../_lib/pricingData";

/** Text for one page's share card. The layout lives in share-card.tsx. */
export type ShareCardContent = {
  /** Route path, e.g. "/products/buzz". Also used for the URL shown on the card. */
  path: string;
  /** Small label above the headline, e.g. "Zedu Buzz". */
  eyebrow: string;
  /** Headline parts. A part written as { accent } is drawn in the brand purple. */
  headline: Array<string | { accent: string }>;
  subtitle: string;
  /** Up to three cards on the right. */
  highlights: ShareCardHighlight[];
  /** Image alt text, also used for og:image:alt and twitter:image:alt. */
  alt: string;
};

export type ShareCardHighlight = {
  title: string;
  detail?: string;
  /** Right-aligned text such as a price. */
  value?: string;
  /** Outlined in purple, like the popular plan. */
  featured?: boolean;
};

const FALLBACK_HOST = "zedu.chat";

/** "zedu.chat/products/buzz": the page URL without the protocol. */
export function shareCardDisplayUrl(path: string): string {
  const base = siteUrl();
  const host = base ? base.replace(/^https?:\/\//, "") : FALLBACK_HOST;
  return `${host}${path === "/" ? "" : path}`;
}

// Plan cards on /pricing come from the same data as the page, so the card
// stays in sync when prices change.
const pricingHighlights: ShareCardHighlight[] = pricingCardsByCycle.monthly.map(
  (plan) => {
    const audience = plan.description
      .replace(/^Best for /, "")
      .replace(/\.$/, "");
    return {
      title: plan.title,
      detail: audience.charAt(0).toUpperCase() + audience.slice(1),
      value: `${plan.amount}${plan.periodLabel ?? ""}`,
      featured: plan.variant === "popular",
    };
  }
);

export const shareCards = {
  about: {
    path: "/about",
    eyebrow: "About Zedu",
    headline: ["Built for Structured ", { accent: "Learning" }, ", Not Noise"],
    subtitle:
      "Structured learning communication for bootcamps, schools and universities.",
    highlights: [
      { title: "Structure Drives Clarity" },
      { title: "AI Should Assist, Not Replace" },
      { title: "Educators Deserve Better Tools" },
    ],
    alt: "About Zedu: structured learning communication built for education",
  },
  pricing: {
    path: "/pricing",
    eyebrow: "Pricing",
    headline: ["Simple, ", { accent: "Flexible Pricing" }, " for Education"],
    subtitle:
      "Plans for educators, bootcamps and institutions. Start free, upgrade when you grow.",
    highlights: pricingHighlights,
    alt: "Zedu pricing: Starter, Pro and Enterprise plans for education",
  },
  contactSales: {
    path: "/contact-sales",
    eyebrow: "Contact Sales",
    headline: ["Talk with our ", { accent: "sales team" }],
    subtitle:
      "Tailored pricing, onboarding guidance and support for your school or cohort.",
    highlights: [
      { title: "Run learning cohorts", detail: "See how Zedu organizes them" },
      { title: "Find the right plan", detail: "For your program or school" },
      {
        title: "One workspace",
        detail: "Communication and courses together",
      },
    ],
    alt: "Contact Zedu sales for plans, onboarding and support",
  },
  account: {
    path: "/account",
    eyebrow: "Account Deletion",
    headline: ["Account Deletion ", { accent: "Request Center" }],
    subtitle:
      "Request deletion of your Zedu account and data, with a clear process.",
    highlights: [
      { title: "Submit Request" },
      { title: "Email Verification" },
      { title: "30-Day Grace Period" },
    ],
    alt: "Zedu account deletion request center and how the process works",
  },
  buzz: {
    path: "/products/buzz",
    eyebrow: "Zedu Buzz",
    headline: [{ accent: "Start a Buzz." }, " Talk instantly with your team."],
    subtitle:
      "Instant voice calls inside your learning channels, with AI session summaries.",
    highlights: [
      {
        title: "Talk in real time",
        detail: "From any course or cohort channel",
      },
      { title: "Focus on learning", detail: "No scheduling needed" },
      { title: "AI session summaries", detail: "Key points after every Buzz" },
    ],
    alt: "Zedu Buzz: instant voice conversations inside learning channels",
  },
  channels: {
    path: "/products/channels",
    eyebrow: "Zedu Channels",
    headline: [{ accent: "Organise Learning" }, " with Structured Channels."],
    subtitle:
      "Organized communication for learning teams, built for education.",
    highlights: [
      { title: "Keep conversations in the right place" },
      { title: "Follow discussions without noise" },
      { title: "Share important updates clearly" },
    ],
    alt: "Zedu Channels: organized communication for learning teams",
  },
  fileManagement: {
    path: "/products/file-management",
    eyebrow: "Zedu File Management",
    headline: ["Organize Learning ", { accent: "Materials" }, " In One Place"],
    subtitle: "Store, find and share course materials with your class.",
    highlights: [
      { title: "Organized spaces", detail: "For course materials" },
      { title: "Find files instantly" },
      { title: "Share files securely" },
    ],
    alt: "Zedu File Management: organize and share learning materials",
  },
  bootcamps: {
    path: "/solutions/bootcamps",
    eyebrow: "Zedu for Bootcamps",
    headline: [
      { accent: "Run faster cohorts." },
      " Build stronger communities.",
    ],
    subtitle: "Structured cohort management for bootcamps.",
    highlights: [
      { title: "Cohort-Based Learning" },
      { title: "Real-Time Collaboration" },
      { title: "Structured Community" },
    ],
    alt: "Zedu for Bootcamps: structured cohort management",
  },
  schools: {
    path: "/solutions/schools",
    eyebrow: "Zedu for Schools",
    headline: [{ accent: "Smarter" }, " communication for schools."],
    subtitle: "Lessons, assignments and school-wide updates in one space.",
    highlights: [
      { title: "Organised Classrooms" },
      { title: "Engaged Students" },
      { title: "Less Administrative Overhead" },
    ],
    alt: "Zedu for Schools: structured communication for classrooms",
  },
  universities: {
    path: "/solutions/universities",
    eyebrow: "Zedu for Universities",
    headline: [{ accent: "Modern" }, " communication for universities."],
    subtitle: "Structured communication and academic collaboration at scale.",
    highlights: [
      { title: "Large Cohorts" },
      { title: "Organized Courses" },
      { title: "AI-Assisted Learning" },
    ],
    alt: "Zedu for Universities: structured communication at scale",
  },
} satisfies Record<string, ShareCardContent>;
