import type { Metadata } from "next";
import { siteUrl, ogImageUrl } from "~/lib/env-urls";
import { slackConfig } from "../_lib/competitorData";
import { getCompetitorStructuredData } from "../_lib/alternativesStructuredData";
import { CompetitorHero } from "../_components/CompetitorHero";
import { TcoCalculator } from "../_components/TcoCalculator";
import { CompetitorComparisonMatrix } from "../_components/CompetitorComparisonMatrix";
import { MigrationPlaybook } from "../_components/MigrationPlaybook";
import { SocialProofQuotes } from "../_components/SocialProofQuotes";
import { AlternativesFAQ } from "../_components/AlternativesFAQ";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";
import Link from "next/link";
import {
  Clock,
  DollarSign,
  Layout,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: slackConfig.meta.title,
  description: slackConfig.meta.description,
  keywords: slackConfig.meta.keywords,
  openGraph: {
    title: slackConfig.meta.title,
    description: slackConfig.meta.description,
    url: siteUrl(slackConfig.meta.canonical),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu vs Slack for Education feature matrix and savings calculator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: slackConfig.meta.title,
    description: slackConfig.meta.description,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl(slackConfig.meta.canonical),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SlackForEducationPage() {
  const structuredData = JSON.stringify(
    getCompetitorStructuredData(slackConfig)
  ).replace(/</g, "\\u003c");

  return (
    <div className="w-full bg-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      {/* Hero Section */}
      <CompetitorHero config={slackConfig} />

      {/* Why Slack Fails Education Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-neutral-50/60 border-y border-neutral-200">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase font-extrabold tracking-wider text-rose-600 block mb-2">
            The Fundamental Problem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Why Slack Doesn&apos;t Work for Schools &amp; Bootcamps
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600">
            Slack was engineered for enterprise sales teams, not classroom
            pedagogy. Here is why educational institutions hit a brick wall on
            Slack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {slackConfig.painPoints.map((pain, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                {idx === 0 && <Clock className="w-5 h-5" />}
                {idx === 1 && <DollarSign className="w-5 h-5" />}
                {idx === 2 && <Layers className="w-5 h-5" />}
                {idx === 3 && <Layout className="w-5 h-5" />}
              </div>
              <h3 className="font-bold text-neutral-900 text-base">
                {pain.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {pain.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive TCO Calculator */}
      <TcoCalculator config={slackConfig} />

      {/* Feature Comparison Matrix */}
      <CompetitorComparisonMatrix config={slackConfig} />

      {/* 1-Click Migration Playbook */}
      <MigrationPlaybook config={slackConfig} />

      {/* Real Testimonials */}
      <SocialProofQuotes config={slackConfig} />

      {/* Frequently Asked Questions */}
      <AlternativesFAQ config={slackConfig} />

      {/* Dynamic Funnel Footer CTA */}
      <DynamicFooter
        text="Never Pay $8.75 Per Student Seat Again"
        description="Join leading bootcamps and educators scaling their cohorts on Zedu with unlimited history and flat pricing."
      />
    </div>
  );
}
