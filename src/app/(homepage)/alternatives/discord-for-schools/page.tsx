import type { Metadata } from "next";
import { siteUrl, ogImageUrl } from "~/lib/env-urls";
import { discordConfig } from "../_lib/competitorData";
import { getCompetitorStructuredData } from "../_lib/alternativesStructuredData";
import { CompetitorHero } from "../_components/CompetitorHero";
import { TcoCalculator } from "../_components/TcoCalculator";
import { CompetitorComparisonMatrix } from "../_components/CompetitorComparisonMatrix";
import { MigrationPlaybook } from "../_components/MigrationPlaybook";
import { SocialProofQuotes } from "../_components/SocialProofQuotes";
import { AlternativesFAQ } from "../_components/AlternativesFAQ";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";
import { AlertCircle, Lock, Layout, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: discordConfig.meta.title,
  description: discordConfig.meta.description,
  keywords: discordConfig.meta.keywords,
  openGraph: {
    title: discordConfig.meta.title,
    description: discordConfig.meta.description,
    url: siteUrl(discordConfig.meta.canonical),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu vs Discord for Schools comparison and migration guide",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: discordConfig.meta.title,
    description: discordConfig.meta.description,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl(discordConfig.meta.canonical),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DiscordForSchoolsPage() {
  const structuredData = JSON.stringify(
    getCompetitorStructuredData(discordConfig)
  ).replace(/</g, "\\u003c");

  return (
    <div className="w-full bg-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      {/* Hero Section */}
      <CompetitorHero config={discordConfig} />

      {/* Why Discord Fails Education Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-neutral-50/60 border-y border-neutral-200">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase font-extrabold tracking-wider text-rose-600 block mb-2">
            The Fundamental Problem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Why Discord Hurts Student Focus &amp; Compliance
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600">
            Discord was created for gamers. Bringing students onto Discord
            exposes them to constant distractions, gaming statuses, and serious
            institutional compliance concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {discordConfig.painPoints.map((pain, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                {idx === 0 && <AlertCircle className="w-5 h-5" />}
                {idx === 1 && <Lock className="w-5 h-5" />}
                {idx === 2 && <Layout className="w-5 h-5" />}
                {idx === 3 && <Layers className="w-5 h-5" />}
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
      <TcoCalculator config={discordConfig} />

      {/* Feature Comparison Matrix */}
      <CompetitorComparisonMatrix config={discordConfig} />

      {/* 1-Click Migration Playbook */}
      <MigrationPlaybook config={discordConfig} />

      {/* Real Testimonials */}
      <SocialProofQuotes config={discordConfig} />

      {/* Frequently Asked Questions */}
      <AlternativesFAQ config={discordConfig} />

      {/* Dynamic Funnel Footer CTA */}
      <DynamicFooter
        text="Give Your Students a Focused Learning Space"
        description="Switch your classes to Zedu in under 5 minutes. No gaming distractions, verified student roles, and built-in whiteboards."
      />
    </div>
  );
}
