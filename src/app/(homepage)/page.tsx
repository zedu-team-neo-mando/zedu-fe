import type { Metadata } from "next";
import { ogImageUrl } from "~/lib/env-urls";
import { ChooseSetupGuide } from "./_components/home/ChooseSetupGuide";
import { FeatureSection } from "./_components/home/FeatureSection";
import HeroSection from "./_components/home/Herosection";
import { CreatorSection } from "./_components/home/CreatorSection";
import { ArticlesSection } from "./_components/home/ArticlesSection";
import { LearningSetupGuide } from "./_components/home/LearningSetupGuide";
import { PricingSection } from "./_components/home/PricingSection";
import { WhySection } from "./_components/home/WhySection";
import { TestimonialsSection } from "./_components/home/TestimonialsSection";
import { FAQSection } from "./_components/home/FAQSection";
import { DynamicFooter } from "./_components/footer/dynamic-footer";
import { getHomeStructuredData } from "./_lib/homeStructuredData";

const description =
  "Stop juggling scattered chat groups, meeting links, and shared folders. Zedu brings learners and educators together in one organized space built for bootcamps and learning communities.";
export const metadata: Metadata = {
  title: {
    absolute: "Zedu - One Workspace for Your Entire Cohort",
  },
  description,
  openGraph: {
    title: "Zedu - One Workspace for Your Entire Cohort",
    description,
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
  // A page's twitter block replaces the layout's, so the layout's title and description are repeated here
  twitter: {
    card: "summary_large_image",
    title: "Zedu — Structured Learning for Bootcamps & Schools",
    description,
    images: ["/og/zedu-home-share.png"],
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
      <CreatorSection />
      <ChooseSetupGuide />
      <FeatureSection />
      <ArticlesSection />
      <LearningSetupGuide />
      <PricingSection />
      <WhySection />
      <TestimonialsSection />
      <FAQSection />
      <DynamicFooter
        text="Run Your Next Cohort Without Limits"
        description="Join thousands of educators building better learning experiences."
      />
    </section>
  );
};

export default HomePage;
