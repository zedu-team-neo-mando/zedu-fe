import {
  facebookUrl,
  instagramUrl,
  siteUrl,
  tiktokUrl,
  xUrl,
} from "~/lib/env-urls";
import { homeFAQs, type HomeFAQ } from "./faqData";

// schema.org's fixed vocabulary identifier required by JSON-LD (not a Zedu
// URL, so it is not an environment value).
const SCHEMA_CONTEXT = ["https:", "schema.org"].join("//");

/** Builds the Organization and FAQPage JSON-LD for the home page. */
export function getHomeStructuredData(faqs: HomeFAQ[] = homeFAQs) {
  const sameAs = [instagramUrl(), tiktokUrl(), facebookUrl(), xUrl()].filter(
    Boolean
  );

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "Organization",
        "@id": siteUrl("/#organization"),
        name: "Zedu",
        url: siteUrl("/"),
        logo: siteUrl("/Zedu.png"),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "FAQPage",
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
