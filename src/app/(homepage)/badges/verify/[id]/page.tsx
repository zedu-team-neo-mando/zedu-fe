import React from "react";
import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import {
  getCredentialById,
  getAllCredentials,
} from "../../../_components/badges/badge-credential-data";
import CredentialVerificationCard from "../../../_components/badges/credential-verification-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const credential = getCredentialById(id);

  if (!credential) {
    return {
      title: "Credential Not Found | Zedu Trust Registry",
      description: "The requested academic credential could not be verified.",
    };
  }

  const title = `${credential.title}: ${credential.recipientName} | Zedu Verified Credential`;
  const description = `${credential.recipientName} has been awarded ${credential.title} by ${credential.organizationName} in ${credential.cohortName}. Verified with ${credential.metrics.solutionsProvided} peer solutions and ${credential.metrics.buzzStudyHours} Buzz hours.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl(`/badges/verify/${credential.id}`),
      siteName: "Zedu Chat",
      images: [
        {
          url: ogImageUrl("og-image-5.png"),
          width: 1200,
          height: 630,
          alt: `${credential.recipientName} - ${credential.title}`,
        },
      ],
      type: "article",
    },
    alternates: {
      canonical: siteUrl(`/badges/verify/${credential.id}`),
    },
  };
}

export function generateStaticParams() {
  return getAllCredentials().map((c) => ({
    id: c.id,
  }));
}

export default async function BadgeVerificationPage({ params }: PageProps) {
  const { id } = await params;
  const credential = getCredentialById(id);

  const structuredData = credential
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalCredential",
        name: credential.title,
        description: credential.description,
        credentialCategory: "Micro-credential",
        recognizedBy: {
          "@type": "Organization",
          name: credential.organizationName,
        },
        about: {
          "@type": "Person",
          name: credential.recipientName,
        },
        url: siteUrl(`/badges/verify/${credential.id}`),
      }).replace(/</g, "\\u003c")
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      <CredentialVerificationCard
        credential={credential}
        attemptedId={id}
        configuredSiteUrl={siteUrl()}
      />
    </>
  );
}
