import React from "react";
import { Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const title = "You're invited to join Zedu";
const description =
  "You've been invited to join Zedu. Accept your invitation to chat, collaborate in channels and learn together with your team.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl("/accept_general_invitation"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Invitation to join Zedu",
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
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="">{children}</div>
      <Toaster />
    </GoogleOAuthProvider>
  );
}
