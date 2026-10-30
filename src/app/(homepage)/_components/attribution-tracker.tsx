"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "~/utils/attribution";

/**
 * Saves campaign parameters (utm_*, ref) from the URL on every marketing page
 * visit, so sign-up can still credit the campaign after the visitor has
 * navigated away from the link they arrived on.
 */
export default function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureAttribution();
  }, [pathname, searchParams]);

  return null;
}
