import React from "react";
import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import HackathonPageView from "../../_components/hackathon/hackathon-page-view";

export const metadata: Metadata = {
  title: "Hackathon-in-a-Box Template | Turnkey Workspace for Hackathons",
  description:
    "1-click turnkey workspace for hackathons, coding competitions, and build weekends. Automated team matchmaking, /call-mentor dispatch, private Buzz voice rooms, and team whiteboards.",
  openGraph: {
    title: "Hackathon-in-a-Box Template | Turnkey Workspace for Hackathons",
    description:
      "1-click turnkey workspace for student hackathons, coding competitions, and build weekends. Includes automated team matchmaking and /call-mentor helpdesk.",
    url: siteUrl("/templates/hackathon"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu Hackathon-in-a-Box turnkey workspace template",
      },
    ],
  },
  alternates: {
    canonical: siteUrl("/templates/hackathon"),
  },
};

export default function HackathonTemplatePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Zedu Hackathon-in-a-Box Template",
    applicationCategory: "BusinessApplication",
    description:
      "Turnkey workspace template for hackathons with automated matchmaking, mentor voice room dispatch, and collaborative team whiteboards.",
    url: siteUrl("/templates/hackathon"),
    operatingSystem: "Web, macOS, Windows, Linux, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HackathonPageView />
    </>
  );
}
