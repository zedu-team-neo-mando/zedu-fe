import { ReactNode } from "react";
import ClientLayout from "./client-layout";
import AuthGuard from "./_components/auth/auth-guard";
import { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

export const metadata: Metadata = {
  title: "Zedu - Seamless Video Meetings & Learning Communities",
  description:
    "Connect classrooms, cohorts, and teams in one shared space. Zedu provides high-quality video calls and collaborative tools designed for every learning community.",
  keywords: [
    "Zedu video meetings",
    "online learning platform",
    "video conferencing for education",
    "virtual classrooms",
    "Zedu chat",
    "seamless video calls",
    "team collaboration tool",
    "cohort communication",
    "learning community platform",
    "interactive video meetings",
  ],
  openGraph: {
    title: "Zedu - Seamless Video Meetings & Learning Communities",
    description:
      "Join the conversation on Zedu. Connect with your team or classroom through our high-performance video meeting platform.",
    url: siteUrl(),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-1.png"),
        width: 1200,
        height: 630,
        alt: "Zedu - Collaborative Video Meetings for Teams and Classrooms",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu - Seamless Video Meetings & Learning Communities",
    description:
      "Seamless video calls and meetings for every learning community. Connect in one shared space with Zedu.",
    images: [ogImageUrl("og-image-1.png")],
  },
  alternates: {
    canonical: siteUrl(),
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthGuard>
      <ClientLayout>{children}</ClientLayout>
    </AuthGuard>
  );
}
