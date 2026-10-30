import type { Metadata } from "next";
import { ogImageUrl } from "~/lib/env-urls";

export { default } from "../_components/templates/templates-page";

/**
 * Static metadata configuration for the community templates directory route.
 */
export const metadata: Metadata = {
  title: "Free Community & Channel Templates Directory",
  description: "Pre-configured cohort workspaces and channel presets.",
  openGraph: {
    title: "Free Community & Channel Templates Directory",
    description: "Pre-configured cohort workspaces and channel presets.",
    url: "/templates",
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu learning platform for educators and cohorts",
      },
    ],
  },
};
