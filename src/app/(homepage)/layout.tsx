import type { Metadata } from "next";
import React from "react";
import { appStoreAppId } from "~/lib/env-urls";
import { createPageMetadata } from "~/config/site";
import { Toaster } from "~/components/ui/toaster";
import { DataProvider } from "~/store/GlobalState";
import Footer from "./_components/footer";
import Header from "./_components/header";
import { ForceLightTheme } from "~/components/theme/force-light-theme";
import { CelebrationThemeProvider } from "./_components/home/CelebrationThemeContext";
import { CelebrationBanner } from "./_components/home/CelebrationBanner";
import { CelebrationAtmosphere } from "./_components/home/CelebrationAtmosphere";
import { ReferralOnboardingBanner } from "./_components/home/ReferralOnboardingBanner";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Zedu - Learning Platform for Bootcamps, Schools, and Cohorts",
    description:
      "Zedu is an AI-powered education platform built for bootcamps and learning communities. Organize cohorts, run classes, manage communication, and scale modern learning in one workspace.",
    path: "/",
  }),
  // iOS Smart App Banner: Safari offers the Zedu app on every marketing page.
  // Left out when the App Store link is not configured.
  ...(appStoreAppId() ? { itunes: { appId: appStoreAppId() } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ForceLightTheme>
      <CelebrationThemeProvider>
        <DataProvider>
          <div className="zedu-marketing w-full min-h-screen relative flex flex-col justify-between">
            <CelebrationAtmosphere />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-900 focus:shadow-lg"
            >
              Skip to main content
            </a>
            <Header />
            <div
              id="main-content"
              tabIndex={-1}
              className="pt-20 min-w-screen overflow-x-hidden flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <CelebrationBanner />
              <ReferralOnboardingBanner />
              {children}
            </div>
            <Footer />
          </div>

          <Toaster />
        </DataProvider>
      </CelebrationThemeProvider>
    </ForceLightTheme>
  );
}
