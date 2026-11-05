import React from "react";
import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import BadgeDirectoryView from "../../_components/badges/badge-directory-view";

export const metadata: Metadata = {
  title: "Verify Peer Mentorship Credentials | Zedu Trust Registry",
  description:
    "Public verification portal for Zedu student micro-credentials. Verify Top Peer Mentors, Study Circle Leads, and Technical Collaborators.",
  openGraph: {
    title: "Verify Peer Mentorship Credentials | Zedu Trust Registry",
    description:
      "Public verification portal for Zedu student micro-credentials. Cryptographically signed proof-of-contribution.",
    url: siteUrl("/badges/verify"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu Badge Verification Registry",
      },
    ],
  },
  alternates: {
    canonical: siteUrl("/badges/verify"),
  },
};

export default function BadgeVerifyDirectoryPage() {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Zedu Credential Verification Registry",
    applicationCategory: "EducationalApplication",
    description:
      "Verify peer mentorship micro-credentials, solutions provided, and study circle contributions on Zedu.",
    url: siteUrl("/badges/verify"),
    operatingSystem: "Web, iOS, Android, macOS, Windows",
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <BadgeDirectoryView />
    </>
  );
}
