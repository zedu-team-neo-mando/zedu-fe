import { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

// The page is a client component, so its metadata lives here. Without it the
// page falls back to the homepage's title, description and canonical.
export const metadata: Metadata = {
  title: "Resources",
  description:
    "Browse Zedu guides, webinars and learning materials for schools, bootcamps and cohorts, with practical help for running structured learning online.",
  openGraph: {
    title: "Resources | Zedu",
    description:
      "Guides, webinars and learning materials for teams running structured learning on Zedu.",
    url: siteUrl("/resources"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu resources, guides and webinars",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | Zedu",
    description:
      "Guides, webinars and learning materials for teams running structured learning on Zedu.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/resources"),
  },
};

export default function ResourcesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
