import type { Metadata } from "next";
// import { Plus_Jakarta_Sans } from "next/font/google";
import React from "react";
import "./globals.css";
import "./responsive.css";
import "react-loading-skeleton/dist/skeleton.css";
import { DataProvider } from "~/store/GlobalState";
import Script from "next/script";
import ClientLayout from "./client-layout";
import { gtmScriptUrl, ogImageUrl, siteUrl } from "~/lib/env-urls";
import { ThemeProvider } from "~/components/theme/theme-provider";

export const metadata: Metadata = {
  title: "Zedu — Structured Learning for Bootcamps & Schools",
  description:
    "Zedu is a structured learning platform for bootcamps, schools, and universities. Organize cohorts, channels, and AI-powered learning in one workspace.",
  icons: {
    icon: "/zedu-icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Zedu — Structured Learning for Bootcamps & Schools",
    description:
      "Zedu is a structured learning platform for bootcamps, schools, and universities. Organize cohorts, channels, and AI-powered learning in one workspace.",
    url: siteUrl(),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu — Structured Learning for Bootcamps & Schools",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu — Structured Learning for Bootcamps & Schools",
    description:
      "Zedu is a structured learning platform for bootcamps, schools, and universities. Organize cohorts, channels, and AI-powered learning in one workspace.",
    images: [ogImageUrl("og-image-5.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Without both values the script URL would be "?id=undefined", which loads
  // the page itself as a script, so analytics is only added when configured.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmUrl = gtmScriptUrl();
  const analyticsEnabled = Boolean(gaId && gtmUrl);

  return (
    <html
      lang="en"
      className="max-w-screen overflow-x-hidden relative"
      suppressHydrationWarning
    >
      <head>
        {analyticsEnabled && (
          <>
            <Script async src={`${gtmUrl}?id=${gaId}`} />
            <Script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `,
              }}
            />
          </>
        )}
      </head>

      <body className="max-w-screen overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider>
          <ClientLayout>
            <DataProvider>{children}</DataProvider>
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
