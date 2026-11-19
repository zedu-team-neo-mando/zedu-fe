import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

export const siteConfig = {
  name: "Zedu",
  title: "Zedu — Structured Learning for Bootcamps & Schools",
  titleTemplate: "%s | Zedu",
  description:
    "Zedu is a structured learning platform for bootcamps, schools, and universities. Organize cohorts, channels, and AI-powered learning in one workspace.",
  keywords: [
    "Zedu",
    "learning platform",
    "bootcamp platform",
    "cohort management",
    "education communication platform",
    "AI learning platform",
    "classroom communication",
    "learning workspace",
  ],
  locale: "en_US",
  themeColor: "#6D28D9",
  image: ogImageUrl("og-image-5.png"),
  icons: {
    icon: "/zedu-icon.png",
    apple: "/apple-touch-icon.png",
  },
} as const;

export function createSiteMetadata(): Metadata {
  const imageAlt = "Zedu learning platform for educators and cohorts";

  return {
    metadataBase: process.env.NEXT_PUBLIC_CLIENT_URL
      ? new URL(siteUrl())
      : undefined,
    title: {
      default: siteConfig.title,
      template: siteConfig.titleTemplate,
    },
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    applicationName: siteConfig.name,
    icons: siteConfig.icons,
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: siteUrl("/"),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        { url: siteConfig.image, width: 1200, height: 630, alt: imageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.image],
    },
    alternates: { canonical: siteUrl("/") },
    robots: { index: true, follow: true },
  };
}

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const imageAlt = "Zedu learning platform for educators and cohorts";
  const image = {
    url: siteConfig.image,
    width: 1200,
    height: 630,
    alt: imageAlt,
  };

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    icons: siteConfig.icons,
    alternates: { canonical: siteUrl(path) },
    openGraph: {
      title,
      description,
      url: siteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.image],
    },
    robots: { index: true, follow: true },
  };
}

export function createWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteUrl("/"),
    description: siteConfig.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    image: siteConfig.image,
  };
}
