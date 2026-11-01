import { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

// The page is a client component, so its metadata lives here. Without it the
// page falls back to the homepage's title, description and canonical.
export const metadata: Metadata = {
  title: "Resources for Modern Learning Teams",
  description:
    "Explore guides, insights, and tools to help universities, schools, and bootcamps run better learning communities.",
  openGraph: {
    title: "Resources for Modern Learning Teams | Zedu",
    description:
      "Guides, webinars and tools for universities, schools and bootcamps running modern learning communities.",
    url: siteUrl("/resources"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu learning resources for educators and cohorts",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources for Modern Learning Teams | Zedu",
    description:
      "Guides, webinars and tools for universities, schools and bootcamps running modern learning communities.",
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
