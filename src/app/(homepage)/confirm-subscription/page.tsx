import React from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "~/config/site";
import ConfirmSubscriptionCard from "./_components/ConfirmSubscriptionCard";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Confirm your Zedu newsletter subscription",
    description:
      "Confirm your email address to start receiving the Zedu newsletter.",
    path: "/confirm-subscription",
  }),
  // Links carry a personal email address and token, so keep them out of search.
  robots: { index: false, follow: false },
};

type ConfirmSubscriptionPageProps = {
  searchParams: Promise<{
    email?: string | string[];
    token?: string | string[];
  }>;
};

const firstValue = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) ?? "";

const ConfirmSubscriptionPage = async ({
  searchParams,
}: ConfirmSubscriptionPageProps) => {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white px-6 pt-32 pb-24">
      <ConfirmSubscriptionCard
        email={firstValue(params.email)}
        token={firstValue(params.token)}
      />
    </main>
  );
};

export default ConfirmSubscriptionPage;
