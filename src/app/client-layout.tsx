"use client";
import { ReactNode } from "react";
import { ThemeToaster } from "~/components/theme/theme-toaster";
import { CampaignMeasurement } from "~/components/campaign-measurement";
// import { useVisitTracker } from "~/hooks/useVisitTracker";

export default function ClientLayout({ children }: { children: ReactNode }) {
  // useVisitTracker();

  return (
    <>
      <ThemeToaster />
      <CampaignMeasurement />
      {children}
    </>
  );
}
