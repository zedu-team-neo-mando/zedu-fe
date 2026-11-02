import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

export { default } from "./_components/google-classroom-alternative";

export const metadata: Metadata = {
  title: "Google Classroom Alternative for Schools & Bootcamps",
  description:
    "Compare Zedu and Google Classroom. See how Zedu gives schools and bootcamps live channels, Buzz voice and video calls, and file sharing in one workspace.",
  keywords: [
    "google classroom alternative",
    "zedu vs google classroom",
    "google classroom alternatives for bootcamps",
    "classroom communication platform",
    "school chat platform",
    "Zedu",
  ],
  icons: {
    icon: "/TelexIcon.svg",
  },
  openGraph: {
    title: "Zedu vs Google Classroom",
    description:
      "Looking for a Google Classroom alternative? Compare class communication, live calls, community channels and pricing.",
    url: siteUrl("/alternatives/google-classroom"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu vs Google Classroom comparison page preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu vs Google Classroom",
    description:
      "Compare Zedu and Google Classroom for class communication, live calls, community channels and pricing.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/alternatives/google-classroom"),
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
  applicationName: "Zedu",
  creator: "Zedu",
  publisher: "Zedu",
};
