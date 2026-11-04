import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";
import { ContributorCard } from "./_components/ContributorCard";
import { contributors, TEAM_NAME } from "./_lib/contributors";

export const metadata: Metadata = {
  title: `${TEAM_NAME} Contributors | HNG 15 Internship`,
  description: `Meet ${TEAM_NAME} - the contributors building and shipping together on Zedu during the HNG 15 Internship.`,
  keywords: [
    "Zedu contributors",
    TEAM_NAME,
    "HNG 15 Internship",
    "Zedu learning workspace",
  ],
  openGraph: {
    title: `${TEAM_NAME} Contributors | HNG 15 Internship`,
    description: `Meet the contributors of ${TEAM_NAME} from the HNG 15 Internship building Zedu.`,
    url: siteUrl("/contributors/zedu-jacana"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: `${TEAM_NAME} contributors from the HNG 15 Internship`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TEAM_NAME} Contributors | HNG 15 Internship`,
    description: `Meet the contributors of ${TEAM_NAME} from the HNG 15 Internship building Zedu.`,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/contributors/zedu-jacana"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * ZeduJacanaContributorsPage lists the members of Team Zedu Jacana who
 * contributed to Zedu during the HNG 15 Internship.
 *
 * @returns The rendered contributors page.
 */
const ZeduJacanaContributorsPage = () => {
  return (
    <div className="space-y-16">
      <section className="relative isolate mt-10 flex w-full flex-col items-center gap-4 overflow-hidden px-4 py-10 text-center sm:gap-5 sm:px-8 sm:py-14 lg:px-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold tracking-wide text-primary-500">
          <Sparkles className="h-3.5 w-3.5" />
          HNG 15 INTERNSHIP | TEAM JACANA
        </span>

        <h1 className="text-center text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
          Meet <span className="text-primary-500">{TEAM_NAME}</span>
        </h1>

        <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[85%] sm:text-base md:max-w-[60%]">
          The{" "}
          <span className="font-semibold text-primary-500">
            {contributors.length}
          </span>{" "}
          contributors building and shipping Zedu during the HNG 15 Internship.
        </p>
      </section>

      <section className="relative isolate flex w-full flex-col items-center px-4 sm:px-8 lg:px-12">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {contributors.map((member) => (
            <ContributorCard
              key={`${member.name}-${member.username}-${member.githubUsername}`}
              {...member}
            />
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

export default ZeduJacanaContributorsPage;
