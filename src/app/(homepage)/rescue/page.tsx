import type { Metadata } from "next";
import { SlackRescuePage } from "../_components/rescue/slack-rescue-page";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const title =
  "SlackRescue — Free Slack 90-Day History Importer & Permanent Cohort Archive";
const description =
  "Import your Slack export ZIP before the 90-day paywall deletes your messages. Get a free, permanent, searchable web archive on Zedu Chat with zero message loss.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: siteUrl("/rescue") },
  openGraph: {
    title,
    description,
    url: siteUrl("/rescue"),
    siteName: "Zedu Chat",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "SlackRescue by Zedu Chat",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I download my community's Slack export?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As a Slack Workspace Admin or Owner, navigate to Workspace Settings > Data Exports > Export Data to generate a ZIP archive of public channels.",
      },
    },
    {
      "@type": "Question",
      name: "Does Zedu Chat delete messages after 90 days like Slack?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! Zedu provides permanent, unlimited message history across all tiers for student cohorts and developer communities.",
      },
    },
    {
      "@type": "Question",
      name: "Is SlackRescue free for schools and bootcamps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, SlackRescue is 100% free for educational cohorts, developer clubs, and student study groups.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SlackRescuePage />
    </>
  );
}
