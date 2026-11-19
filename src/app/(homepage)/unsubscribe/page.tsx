import React from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "~/config/site";
import UnsubscribeCard from "./_components/UnsubscribeCard";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Unsubscribe from the Zedu newsletter",
    description:
      "Stop receiving the Zedu newsletter. Confirm your email address to unsubscribe.",
    path: "/unsubscribe",
  }),
  // Links carry a personal email address and token, so keep them out of search.
  robots: { index: false, follow: false },
};

type UnsubscribePageProps = {
  searchParams: Promise<{
    email?: string | string[];
    token?: string | string[];
  }>;
};

const firstValue = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) ?? "";

const UnsubscribePage = async ({ searchParams }: UnsubscribePageProps) => {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white px-6 pt-32 pb-24">
      <UnsubscribeCard
        email={firstValue(params.email)}
        token={firstValue(params.token)}
      />
    </main>
  );
};

export default UnsubscribePage;
