import type { MetadataRoute } from "next";
import { playStorePackageId, playStoreUrl } from "~/lib/env-urls";

/**
 * Web app manifest, served at /manifest.webmanifest and linked from every
 * page head. `related_applications` points Chrome on Android at the Zedu app
 * on Google Play, so the browser offers the native app instead of a web
 * install.
 */
export default function manifest(): MetadataRoute.Manifest {
  const packageId = playStorePackageId();

  return {
    name: "Zedu - Learning Platform for Bootcamps, Schools, and Cohorts",
    short_name: "Zedu",
    description:
      "Zedu is an AI-powered education platform built for bootcamps and learning communities.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7141F8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    ...(packageId
      ? {
          prefer_related_applications: true,
          related_applications: [
            { platform: "play", url: playStoreUrl(), id: packageId },
          ],
        }
      : {}),
  };
}
