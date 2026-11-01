import type { Metadata } from "next";
import { BadgePage } from "../_components/badge/badge-page";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const title = "Zedu Badges - Invite Your Learning Community";
const description =
  "Add a Join us on Zedu badge to your website, README, or newsletter and invite your learning community to collaborate on Zedu.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: siteUrl("/badge") },
  openGraph: {
    title,
    description,
    url: siteUrl("/badge"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Join us on Zedu badges",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("og-image-5.png")],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <BadgePage configuredSiteUrl={siteUrl()} />;
}
