import type { Metadata } from "next";
import { ogImageUrl } from "~/lib/env-urls";
import { FeatureSection } from "./_components/home/FeatureSection";
import HeroSection from "./_components/home/Herosection";
import { ArticlesSection } from "./_components/home/ArticlesSection";
import { PricingSection } from "./_components/home/PricingSection";
import { WhySection } from "./_components/home/WhySection";
import { FAQSection } from "./_components/home/FAQSection";
import { DynamicFooter } from "./_components/footer/dynamic-footer";
import { getHomeStructuredData } from "./_lib/homeStructuredData";

export const metadata: Metadata = {
  title: {
    absolute: "Zedu - Learning Platform for Bootcamps, Schools, and Cohorts",
  },
  description:
    "Zedu is an AI-powered education platform built for bootcamps and learning communities. Organize cohorts, run classes, manage communication, and scale modern learning in one workspace.",
  openGraph: {
    title: "Zedu - Learning Platform for Bootcamps, Schools, and Cohorts",
    description:
      "Built for modern learning: structured channels, AI-powered support, flexible education pricing, and tools that help educators run better cohorts.",
    url: "/",
    // Next.js replaces the layout's openGraph object instead of merging it,
    // so the share image must be repeated here or the homepage has none.
    siteName: "Zedu",
    type: "website",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu learning platform for educators and cohorts",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

const HomePage = () => {
  const structuredData = JSON.stringify(getHomeStructuredData()).replace(
    /</g,
    "\\u003c"
  );

  return (
    <section className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <HeroSection />
      <FeatureSection />
      <ArticlesSection />
      <PricingSection />
      <WhySection />
      <FAQSection />
      <DynamicFooter
        text="Run Your Next Cohort Without Limits"
        description="Join thousands of educators building better learning experiences."
      />
    </section>
  );
};

export default HomePage;
