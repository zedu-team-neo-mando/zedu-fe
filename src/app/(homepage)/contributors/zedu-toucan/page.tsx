import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";
import { Sparkles } from "lucide-react";
import { ContributorCard } from "./_components/ContributorCard";
import { zeduToucanContributors as contributors } from "./lib/zedu-toucan-contributors";

export const metadata: Metadata = {
  title: "Team Toucan Contributors | HNG 15 Internship",
  description:
    "Meet Team Toucan — AI Product Engineers from the HNG 15 Internship building and shipping together on Zedu.",
  keywords: [
    "Zedu contributors",
    "Team Toucan",
    "HNG 15 Internship",
    "AI Product Engineer",
    "Zedu learning workspace",
  ],
  openGraph: {
    title: "Team Toucan Contributors | HNG 15 Internship",
    description:
      "Meet the AI Product Engineers of Team Toucan from the HNG 15 Internship contributing to Zedu.",
    url: siteUrl("/contributors/zedu-toucan"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Team Toucan contributors from the HNG 15 Internship",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Toucan Contributors | HNG 15 Internship",
    description:
      "Meet the AI Product Engineers of Team Toucan from the HNG 15 Internship contributing to Zedu.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/contributors/zedu-toucan"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * TeamToucanPage displays the hero banner, grid of contributor cards,
 * and dynamic footer for Team Toucan.
 *
 * @returns The rendered contributors page.
 */
const TeamToucanPage = () => {
  return (
    <div className="space-y-16">
      <section className="relative isolate mt-10 flex w-full flex-col items-center gap-4 overflow-hidden px-4 py-10 text-center sm:gap-5 sm:px-8 sm:py-14 lg:px-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold tracking-wide text-primary-500">
          <Sparkles className="h-3.5 w-3.5" />
          HNG 15 INTERNSHIP • TEAM Toucan
        </span>

        <h1 className="text-center text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
          Meet <span className="text-primary-500">Team Toucan</span>
        </h1>

        <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[85%] sm:text-base md:max-w-[60%]">
          AI Product Engineers in the{" "}
          <span className="font-semibold text-primary-500">
            HNG 15 Internship
          </span>{" "}
          with diverse backgrounds building and contributing to zedu.
        </p>
      </section>

      <section className="relative isolate flex w-full flex-col items-center px-4 sm:px-8 lg:px-12">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contributors.map((member) => (
            <ContributorCard key={member.username} {...member} />
          ))}
        </div>
      </section>

      <DynamicFooter
        text="Start Building Structured Learning Today"
        description="Create organized channels, manage cohorts, and streamline your learning environment."
      />
    </div>
  );
};

export default TeamToucanPage;
