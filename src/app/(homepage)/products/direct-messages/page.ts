import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

export { default } from "../../_components/direct-messages/direct-messages-page";

export const metadata: Metadata = {
  title: "Direct Messages - Personal Conversations for Learning Teams",
  description:
    "Message mentors, instructors and teammates one to one or in small groups on Zedu. Keep notes to yourself, reply in threads, share files, save messages and search every conversation.",
  keywords: [
    "Zedu direct messages",
    "direct messaging for bootcamps",
    "message a mentor",
    "student mentor chat",
    "group messages for learners",
    "private class messaging",
    "cohort communication",
  ],
  openGraph: {
    title: "Zedu Direct Messages - Personal Conversations for Learning Teams",
    description:
      "One-to-one and small-group conversations for learners, mentors and instructors, in the same workspace as your classes.",
    url: siteUrl("/products/direct-messages"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu direct messages for learning teams",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu Direct Messages - Personal Help for Every Learner",
    description:
      "Message a mentor, a teammate or a small group, and find every conversation again later.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/products/direct-messages"),
  },
  robots: {
    index: true,
    follow: true,
  },
};
