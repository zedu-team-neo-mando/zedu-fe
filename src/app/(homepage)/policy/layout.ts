import { Metadata } from "next";
import type { ReactNode } from "react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

// The page is a client component, so its metadata lives here. Without it the
// page falls back to the homepage's title, description and canonical.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how Zedu collects, uses and protects your personal information when you use our learning platform for schools, bootcamps and cohorts.",
  openGraph: {
    title: "Privacy Policy | Zedu",
    description:
      "How Zedu collects, uses and protects your personal information.",
    url: siteUrl("/policy"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu privacy policy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Zedu",
    description:
      "How Zedu collects, uses and protects your personal information.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/policy"),
  },
};

export default function PolicyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
