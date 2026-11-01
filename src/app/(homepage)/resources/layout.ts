import { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

// The page is a client component, so its metadata lives here. Without it the
// page falls back to the homepage's title, description and canonical.
export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides, case studies and templates to help universities, schools and bootcamps run better learning communities with Zedu.",
  openGraph: {
    title: "Resources for Modern Learning Teams | Zedu",
    description:
      "Guides, insights and tools for universities, schools and bootcamps.",
    url: siteUrl("/resources"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu resources for modern learning teams",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources for Modern Learning Teams | Zedu",
    description:
      "Guides, insights and tools for universities, schools and bootcamps.",
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
