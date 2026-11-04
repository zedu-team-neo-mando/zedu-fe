import type { Metadata } from "next";
import React from "react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const title = "Sign up for Zedu - Free for Bootcamps, Schools and Cohorts";
const description =
  "Create a free Zedu account and bring your cohort, class or learning community into one organised workspace. No credit card needed.";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_CLIENT_URL
    ? new URL(siteUrl())
    : undefined,
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl("/auth/sign-up"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu learning platform for educators and cohorts",
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
  alternates: {
    canonical: siteUrl("/auth/sign-up"),
  },
};

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
