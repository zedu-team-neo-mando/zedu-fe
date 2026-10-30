import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

export { default } from "../../_components/cohort-planner/planner-page";

/**
 * Static metadata for the Cohort Communication Planner resource route.
 */
export const metadata: Metadata = {
  title: "Free Cohort Communication Planner & Playbook Generator",
  description:
    "Answer four questions about your cohort and get a personalised Cohort Playbook — channels, a weekly roadmap, a communication schedule, roles, and a checklist. Free, no sign-up.",
  keywords: [
    "cohort communication planner",
    "cohort playbook",
    "programme communication plan",
    "cohort roadmap generator",
    "bootcamp communication plan",
    "learning cohort schedule",
  ],
  openGraph: {
    title: "Free Cohort Communication Planner & Playbook Generator",
    description:
      "Build a personalised Cohort Playbook — channels, weekly roadmap, communication schedule, roles, and checklist — in minutes.",
    url: siteUrl("/resources/cohort-communication-planner"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Cohort Communication Planner on Zedu",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cohort Communication Planner | Zedu",
    description:
      "Generate a personalised Cohort Playbook with channels, roadmap, schedule, roles, and checklist — free, no sign-up.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/resources/cohort-communication-planner"),
  },
  robots: {
    index: true,
    follow: true,
  },
};
