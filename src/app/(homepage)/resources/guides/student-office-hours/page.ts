import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const title = "Running student office hours with Zedu Buzz";
const description =
  "Prepare student questions, run a focused 30-minute office-hours session, and share a useful recap with these practical templates.";
const path = "/resources/guides/student-office-hours";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: siteUrl(path) },
  openGraph: {
    title,
    description,
    url: siteUrl(path),
    siteName: "Zedu",
    type: "article",
    images: [{ url: ogImageUrl("og-image-5.png"), alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("og-image-5.png")],
  },
};

export { default } from "./_components/student-office-hours-guide";
