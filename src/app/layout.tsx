import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";
import "./responsive.css";
import "react-loading-skeleton/dist/skeleton.css";
import { DataProvider } from "~/store/GlobalState";
import Script from "next/script";
import { gtmScriptUrl } from "~/lib/env-urls";
import { ThemeProvider } from "~/components/theme/theme-provider";
import {
  createSiteMetadata,
  createWebApplicationJsonLd,
  siteConfig,
} from "~/config/site";
import ClientLayout from "./client-layout";

export const metadata: Metadata = createSiteMetadata();

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createWebApplicationJsonLd()).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
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
