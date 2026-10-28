import { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

// The page is a client component, so its metadata lives here. Without it the
// page falls back to the homepage's title, description and canonical.
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms that apply when you use Zedu, the learning platform for schools, bootcamps and cohorts, including acceptable use, your content, subscriptions and termination.",
  openGraph: {
    title: "Terms of Service | Zedu",
    description: "The terms that apply when you use Zedu.",
    url: siteUrl("/terms-of-service"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu terms of service",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Zedu",
    description: "The terms that apply when you use Zedu.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/terms-of-service"),
  },
};

export default function TermsOfServiceLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
