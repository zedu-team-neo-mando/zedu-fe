import { Metadata } from "next";
import { siteUrl } from "~/lib/env-urls";
import { ContactSalesOptions } from "./_components/contact-sales-options";

const description =
  "Contact the Zedu sales team to find the right plan for your school, bootcamp, or learning organisation. Get tailored pricing, onboarding guidance, and enterprise support.";

export const metadata: Metadata = {
  title: "Contact Sales for Schools and Cohorts",
  description,
  keywords: [
    "contact Zedu sales",
    "education platform demo",
    "bootcamp software sales",
    "enterprise learning platform",
    "cohort management software",
    "school communication platform",
    "AI education platform pricing",
    "Zedu onboarding",
  ],
  openGraph: {
    title: "Contact Sales - Zedu for Schools and Cohorts",
    description,
    url: siteUrl("/contact-sales"),
    siteName: "Zedu",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Sales - Zedu",
    description,
  },
  alternates: {
    canonical: siteUrl("/contact-sales"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ContactPage = () => {
  return (
    <section className="relative mt-12 flex px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[50%] bg-gradient-to-t from-blue-50/30 to-white"
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.15fr] lg:items-center lg:gap-10">
        <ContactSalesOptions />
      </div>
    </section>
  );
};

export default ContactPage;
