import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidInvoiceId } from "~/lib/invoice";
import InvoiceView from "./_components/invoice-view";

/**
 * Invoice pages contain private billing information, so they must never be
 * indexed or followed by crawlers (issue #1068).
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type InvoicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  // Malformed ids never reach the data layer or the renderer.
  if (!isValidInvoiceId(id)) {
    notFound();
  }

  return <InvoiceView invoiceId={id} />;
}
