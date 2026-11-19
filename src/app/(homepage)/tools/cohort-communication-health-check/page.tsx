import type { Metadata } from "next";
import { CohortCommunicationHealthCheck } from "./_components/cohort-communication-health-check";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const TITLE = "Free Cohort Communication Health Check";
const DESCRIPTION =
  "Assess how effectively your bootcamp or community coordinates communications, resource delivery, and student feedback support.";

export const metadata: Metadata = {
  // Absolute, so " | Zedu" appears once whether or not a layout adds a title template.
  title: { absolute: `${TITLE} | Zedu` },
  description: DESCRIPTION,
  // Without its own openGraph and twitter, a shared link showed the homepage's preview.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: siteUrl("/tools/cohort-communication-health-check"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Free Cohort Communication Health Check on Zedu",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Zedu`,
    description: DESCRIPTION,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: "https://zedu.chat/tools/cohort-communication-health-check",
  },
};

export default function CohortCommunicationHealthCheckPage() {
  return <CohortCommunicationHealthCheck />;
}
