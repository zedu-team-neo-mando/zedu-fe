import type { Metadata } from "next";
import { ShippedStudio } from "~/app/(homepage)/_components/shipped/shipped-studio";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

const title = "Shipped on Zedu";
const description =
  "Make a branded Shipped on Zedu card, copy a caption, and use #ShippedOnZedu when you share a fix you shipped.";

export const metadata: Metadata = {
  title: { absolute: `${title} | Zedu` },
  description,
  alternates: { canonical: siteUrl("/shipped") },
  openGraph: {
    title,
    description,
    url: siteUrl("/shipped"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Shipped on Zedu",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Zedu`,
    description,
    images: [ogImageUrl("og-image-5.png")],
  },
  robots: { index: true, follow: true },
};

export default function ShippedPage() {
  return (
    <main>
      <ShippedStudio />
    </main>
  );
}
