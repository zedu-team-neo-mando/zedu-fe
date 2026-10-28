import React from "react";
import { Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const title = "You're invited to join Zedu";
const description =
  "You've been invited to join an organisation on Zedu. Accept your invitation to chat, collaborate in channels and learn together with your team.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl("/accept_org_invitation"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Invitation to join an organisation on Zedu",
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
  // Invitation links are personal, so keep them out of search results
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* <Header /> */}
      <div className="">{children}</div>
      {/* <ExternalPageFooter /> */}
      <Toaster />
    </>
  );
}
