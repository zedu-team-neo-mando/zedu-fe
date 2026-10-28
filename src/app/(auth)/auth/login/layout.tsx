import { Metadata } from "next";
import { ReactNode } from "react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const description =
  "Log in to Zedu to pick up your classes, channels and cohort conversations where you left off, all in one learning workspace.";

export const metadata: Metadata = {
  title: "Log in | Zedu",
  description,
  openGraph: {
    title: "Log in | Zedu",
    description,
    url: siteUrl("/auth/login"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu - learning communities in one workspace",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Log in | Zedu",
    description,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/auth/login"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
