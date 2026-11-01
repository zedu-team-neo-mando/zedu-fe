import type { MetadataRoute } from "next";
import { resources } from "~/app/(homepage)/_lib/resources";
import { siteUrl } from "~/lib/env-urls";
import { allComparisonSlugs } from "~/app/(homepage)/_components/compare/comparisonData";

// The public marketing pages in (homepage). Workspace pages (/[org]/...) need a sign-in, so they are left out.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/pricing", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/solutions/bootcamps", priority: 0.8 },
  { path: "/solutions/schools", priority: 0.8 },
  { path: "/solutions/universities", priority: 0.8 },
  { path: "/alternatives/google-classroom", priority: 0.8 },
  { path: "/compare", priority: 0.7 },
  ...allComparisonSlugs.map((slug) => ({
    path: `/compare/${slug}`,
    priority: 0.7,
  })),
  { path: "/products/channels", priority: 0.7 },
  { path: "/products/buzz", priority: 0.7 },
  { path: "/products/file-management", priority: 0.7 },
  { path: "/products/ai", priority: 0.7 },
  { path: "/download", priority: 0.6 },
  { path: "/contact-sales", priority: 0.6 },
  { path: "/ambassadors", priority: 0.6 },
  { path: "/resources", priority: 0.5 },
  { path: "/policy", priority: 0.3 },
  { path: "/terms-of-service", priority: 0.3 },
];

// Resource articles with their own page. Read from the Resources list, so a new article is listed once its card links to it.
const RESOURCE_PAGES = resources
  .filter(({ link }) => link.startsWith("/resources/"))
  .map(({ link }) => ({ path: link, priority: 0.5 }));

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [...PAGES, ...RESOURCE_PAGES].map(({ path, priority }) => ({
    url: path === "/" ? base : `${base}${path}`,
    changeFrequency: "weekly",
    priority,
  }));
}
