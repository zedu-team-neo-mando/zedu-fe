import type { Metadata } from "next";
import { siteUrl, ogImageUrl } from "~/lib/env-urls";
import { slackConfig } from "../../alternatives/_lib/competitorData";
import { getCompetitorStructuredData } from "../../alternatives/_lib/alternativesStructuredData";
import { CompetitorHero } from "../../alternatives/_components/CompetitorHero";
import { TcoCalculator } from "../../alternatives/_components/TcoCalculator";
import { CompetitorComparisonMatrix } from "../../alternatives/_components/CompetitorComparisonMatrix";
import { MigrationPlaybook } from "../../alternatives/_components/MigrationPlaybook";
import { SocialProofQuotes } from "../../alternatives/_components/SocialProofQuotes";
import { AlternativesFAQ } from "../../alternatives/_components/AlternativesFAQ";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";

const compareConfig = {
  ...slackConfig,
  slug: "slack-vs-zedu",
  meta: {
    ...slackConfig.meta,
    title: "Slack vs. Zedu: Head-to-Head Comparison for Education (2026)",
    description:
      "Direct head-to-head breakdown: Slack vs Zedu. Compare student pricing ($8.75/seat vs flat cohort), 90-day history vs permanent search, and whiteboard tools.",
    canonical: "/compare/slack-vs-zedu",
  },
};

export const metadata: Metadata = {
  title: compareConfig.meta.title,
  description: compareConfig.meta.description,
  keywords: [
    "slack vs zedu",
    "zedu vs slack",
    "slack comparison education",
    "slack pricing comparison",
    "cohort management software vs slack",
  ],
  openGraph: {
    title: compareConfig.meta.title,
    description: compareConfig.meta.description,
    url: siteUrl("/compare/slack-vs-zedu"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Slack vs Zedu Head to Head Comparison",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: compareConfig.meta.title,
    description: compareConfig.meta.description,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/compare/slack-vs-zedu"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SlackVsZeduPage() {
  const structuredData = JSON.stringify(
    getCompetitorStructuredData(compareConfig)
  ).replace(/</g, "\\u003c");

  return (
    <div className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <CompetitorHero config={compareConfig} />
      <TcoCalculator config={compareConfig} />
      <CompetitorComparisonMatrix config={compareConfig} />
      <MigrationPlaybook config={compareConfig} />
      <SocialProofQuotes config={compareConfig} />
      <AlternativesFAQ config={compareConfig} />
      <DynamicFooter
        text="Make the Switch to Zedu Today"
        description="Save $15,000+ per cohort year and unlock unlimited permanent history for your students."
      />
    </div>
  );
}
