import React from "react";
import { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import AccountDeletionHero from "../_components/account/AccountDeletionHero";
import DeletionSteps from "../_components/account/DeletionSteps";
import DataInformation from "../_components/account/DataInformation";
import DeletionRequestForm from "../_components/account/DeletionRequestForm";
import DeletionFAQ from "../_components/account/DeletionFAQ";

export const metadata: Metadata = {
  title: "Account Deletion - Zedu",
  description:
    "Request deletion of your Zedu account and associated data. Learn about our data deletion process, retention policies, and GDPR-compliant privacy practices. Full transparency and control over your information.",
  keywords: [
    "Zedu account deletion",
    "delete Zedu account",
    "data deletion request",
    "GDPR compliance",
    "privacy rights",
    "account removal",
    "data privacy",
    "user data control",
    "Zedu privacy",
    "delete personal data",
  ],
  openGraph: {
    title: "Account Deletion - Zedu",
    description:
      "Request deletion of your Zedu account with full transparency. Learn what data is deleted, what is retained, and our GDPR-compliant deletion process.",
    url: siteUrl("/account"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu Account Deletion Request Center",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Account Deletion - Zedu",
    description:
      "Transparent account deletion process with full control over your data. GDPR compliant and user-friendly.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/account"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const AccountDeletionPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <AccountDeletionHero />

      {/* Steps Section */}
      <DeletionSteps />

      {/* Data Information Section */}
      <DataInformation />

      {/* Deletion Request Form */}
      <DeletionRequestForm />

      {/* FAQ Section */}
      <DeletionFAQ />
    </main>
  );
};

export default AccountDeletionPage;
