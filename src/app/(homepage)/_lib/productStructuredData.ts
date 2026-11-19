import { siteUrl } from "~/lib/env-urls";

// schema.org's fixed vocabulary identifier required by JSON-LD (not a Zedu
// URL, so it is not an environment value).
const SCHEMA_CONTEXT = ["https:", "schema.org"].join("//");

/**
 * Builds the BreadcrumbList JSON-LD (Home > product) for a product page and
 * returns it as a string that is safe to inline in a script tag.
 */
export function getProductBreadcrumbJsonLd(name: string, path: string) {
  const data = {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    "@id": `${siteUrl(path)}#breadcrumb`,
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
        name,
        item: siteUrl(path),
      },
    ],
  };

  return JSON.stringify(data).replace(/</g, "\\u003c");
}
