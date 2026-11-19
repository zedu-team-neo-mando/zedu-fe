import { siteUrl, storeLink } from "~/lib/env-urls";

// schema.org's fixed vocabulary identifier required by JSON-LD (not a Zedu
// URL, so it is not an environment value).
const SCHEMA_CONTEXT = ["https:", "schema.org"].join("//");

const STRUCTURED_DATA_LINK = {
  campaign: "download-page",
  content: "structured-data",
};

/** Builds the SoftwareApplication JSON-LD for the download page. */
export function getDownloadStructuredData() {
  const downloadUrl = [
    storeLink("app", STRUCTURED_DATA_LINK),
    storeLink("play", STRUCTURED_DATA_LINK),
  ].filter(Boolean);

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "SoftwareApplication",
    name: "Zedu",
    description:
      "Download Zedu on iOS, Android, and desktop. Join classes, chat with peers, manage files, and stay updated in one connected learning workspace.",
    url: siteUrl("/download"),
    image: siteUrl("/images/homepage/download/download-hero.png"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "iOS, Android",
    ...(downloadUrl.length > 0 ? { downloadUrl } : {}),
    publisher: {
      "@type": "Organization",
      name: "Zedu",
      url: siteUrl("/"),
    },
  };
}
