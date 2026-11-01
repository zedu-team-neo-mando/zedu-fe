import type { MetadataRoute } from "next";
import { siteUrl } from "~/lib/env-urls";

// The public marketing pages in (homepage). Workspace pages (/[org]/...) need a sign-in, so they are left out.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/pricing", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/solutions/bootcamps", priority: 0.8 },
  { path: "/solutions/schools", priority: 0.8 },
  { path: "/solutions/universities", priority: 0.8 },
  { path: "/alternatives/google-classroom", priority: 0.8 },
  { path: "/products/channels", priority: 0.7 },
  { path: "/products/buzz", priority: 0.7 },
  { path: "/products/file-management", priority: 0.7 },
  { path: "/download", priority: 0.6 },
  { path: "/contact-sales", priority: 0.6 },
  { path: "/resources", priority: 0.5 },
  { path: "/policy", priority: 0.3 },
  { path: "/terms-of-service", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PAGES.map(({ path, priority }) => ({
    url: path === "/" ? base : `${base}${path}`,
    changeFrequency: "weekly",
    priority,
  }));
}
