import { siteUrl } from "~/lib/env-urls";
import type { CompetitorPageConfig } from "./competitorData";

const SCHEMA_CONTEXT = "https://schema.org";

/**
 * Builds Schema.org JSON-LD for Competitor Comparison pages.
 * Includes Organization, WebPage, BreadcrumbList, Product, and FAQPage.
 */
export function getCompetitorStructuredData(config: CompetitorPageConfig) {
  const pageUrl = siteUrl(config.meta.canonical);

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "Organization",
        "@id": siteUrl("/#organization"),
        name: "Zedu",
        url: siteUrl("/"),
        logo: siteUrl("/Zedu.png"),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: config.meta.title,
        description: config.meta.description,
        isPartOf: {
          "@id": siteUrl("/#website"),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Alternatives",
            item: siteUrl("/alternatives"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${config.name} Alternative for Education`,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: "Zedu - Education Communication & Cohort Learning Platform",
        description:
          "Purpose-built communication platform for bootcamps, schools, and academies. Featuring unlimited message history, structured cohort channels, native collaborative whiteboard, and Buzz audio rooms.",
        brand: {
          "@type": "Brand",
          name: "Zedu",
        },
        category: "SoftwareApplication > EducationalSoftware",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, iOS, Android, macOS, Windows",
        url: pageUrl,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "0",
          highPrice: "40",
          offerCount: "3",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
