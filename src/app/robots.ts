import type { MetadataRoute } from "next";
import { siteUrl } from "~/lib/env-urls";

// Without this file /robots.txt fell through to the [org] route and returned an HTML page.
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
