import { siteUrl } from "~/lib/env-urls";
import { pricingFAQs, type HomeFAQ } from "./faqData";
import { pricingCardsByCycle } from "./pricingData";

// Schema.org's vocabulary identifier, not an application URL.
const SCHEMA_CONTEXT = ["https:", "schema.org"].join("//");

/** Describes published monthly prices and the FAQs shown on the pricing page. */
export function getPricingStructuredData(faqs: HomeFAQ[] = pricingFAQs) {
  const offers = pricingCardsByCycle.monthly
    // Enterprise has a custom quote, not a published price.
    .filter((plan) => plan.monthlyPrice !== undefined)
    .map((plan) => ({
      "@type": "Offer",
      "@id": siteUrl(`/pricing#${plan.key}-offer`),
      name: `Zedu ${plan.title}`,
      description: plan.description,
      url: siteUrl("/pricing"),
      price: plan.monthlyPrice,
      priceCurrency: "NGN",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.monthlyPrice,
        priceCurrency: "NGN",
        billingDuration: "P1M",
      },
    }));

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": siteUrl("/pricing#software"),
        name: "Zedu",
        url: siteUrl("/pricing"),
        applicationCategory: "EducationalApplication",
        offers,
      },
      {
        "@type": "OfferCatalog",
        "@id": siteUrl("/pricing#plans"),
        name: "Zedu pricing plans",
        url: siteUrl("/pricing"),
        itemListElement: offers.map((offer) => ({ "@id": offer["@id"] })),
      },
      {
        "@type": "FAQPage",
        "@id": siteUrl("/pricing#help-center"),
        mainEntity: faqs.map((faq) => ({
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
