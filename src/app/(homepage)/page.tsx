import type { Metadata } from "next";
import { FeatureSection } from "./_components/home/FeatureSection";
import HeroSection from "./_components/home/Herosection";
import { ArticlesSection } from "./_components/home/ArticlesSection";
import { PricingSection } from "./_components/home/PricingSection";
import { WhySection } from "./_components/home/WhySection";
import { FAQSection } from "./_components/home/FAQSection";
import { DynamicFooter } from "./_components/footer/dynamic-footer";
import { getHomeStructuredData } from "./_lib/homeStructuredData";
import { ogImageUrl } from "~/lib/env-urls";

export const metadata: Metadata = {
  title: {
    absolute: "Zedu - The All-in-One Cohort Workspace for Modern Educators",
  },
  description:
    "The All-in-One Cohort Workspace that Multiplies Student Completion Rates. Replace fragmented chat channels, meeting links, and storage folders with a unified, AI-assisted platform.",
  openGraph: {
    title: "Zedu - Scale Your Cohorts Without Admin Overhead",
    description:
      "The All-in-One Cohort Workspace that Multiplies Student Completion Rates. Built for bootcamps, schools, and structured learning communities.",
    url: "/",
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu - Learning Platform for Bootcamps, Schools, and Cohorts",
      },
    ],
    type: "website",
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
