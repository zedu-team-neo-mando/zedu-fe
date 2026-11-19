import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import SignaturePage from "../../_components/email-signature/signature-page";

/**
 * Static metadata for the Email Signature Generator resource route.
 */
export const metadata: Metadata = {
  title: "Free Email Signature Generator for Teachers & Schools",
  description:
    "Make a clean email signature for your school, class or cohort in two minutes. Live preview, copy into Gmail, Outlook or Apple Mail. Free, no sign-up.",
  keywords: [
    "email signature generator",
    "teacher email signature",
    "school email signature",
    "free email signature",
    "gmail signature",
    "outlook signature",
  ],
  openGraph: {
    title: "Free Email Signature Generator for Teachers & Schools",
    description:
      "Fill in your details, watch the preview, and copy a signature that pastes cleanly into Gmail, Outlook or Apple Mail.",
    url: siteUrl("/resources/email-signature-generator"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Email Signature Generator on Zedu",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Signature Generator | Zedu",
    description:
      "Make a clean email signature for your school or cohort, free, no sign-up.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/resources/email-signature-generator"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EmailSignatureGeneratorPage() {
  return <SignaturePage siteBase={siteUrl()} />;
}
