"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import images from "~/assets/images";
import { Button } from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { cn } from "~/lib/utils";
import { selectInvoice, type InvoiceRecord } from "~/lib/invoice";
import { GetRequest } from "~/utils/new-request";

// Add print styles
const printStyles = `
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    .print\\:hidden { display: none !important; }
    .print\\:block { display: block !important; }
    .print\\:border-0 { border: 0 !important; }
    .print\\:shadow-none { box-shadow: none !important; }
    @page {
      margin: 0in;
      size: A4;
    }
  }
`;

// Issuer details. No postal address is published by the product, so only
// the verified public contact is shown — never sample data.
const OFFICE_LINES = ["Zedu", "support@zedu.chat"];
const GENERATED_BY = "Zedu Billing";

type OrgSummary = {
  name?: string;
  email?: string;
};

const formatDay = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAmount = (fee?: number): string =>
  typeof fee === "number" ? `₦${fee.toFixed(2)}` : "";

type InvoiceViewProps = {
  invoiceId: string;
};

const InvoiceView = ({ invoiceId }: InvoiceViewProps) => {
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading"
  );
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [org, setOrg] = useState<OrgSummary | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const token = localStorage.getItem("token") || "";
      const orgId = localStorage.getItem("orgId") || "";
      const orgSlug = localStorage.getItem("orgSlug") || "";

      // The route relies on the app's client-side session. Without one the
      // invoice cannot be authorized, so it is treated as not found.
      if (!token || !orgId) {
        if (active) setStatus("missing");
        return;
      }

      const [listRes, orgRes] = await Promise.all([
        GetRequest(`/subscriptions/list/${orgId}`),
        GetRequest(`/organisations/${orgId}`),
      ]);
      if (!active) return;

      const rows = listRes?.data?.data;
      const invoiceRecord = selectInvoice(
        Array.isArray(rows) ? rows : [],
        invoiceId,
        orgId
      );

      if (
        !invoiceRecord ||
        (listRes?.status !== 200 && listRes?.status !== 201)
      ) {
        // Unknown id, another organisation's invoice, or a failed lookup:
        // all resolve to the same safe not-found outcome.
        setStatus("missing");
        return;
      }

      // Display-only organisation context; a failure never hides an
      // authorized invoice.
      const orgData = orgRes?.data?.data;
      setOrg({
        name: orgData?.organisation_name || orgData?.name || orgSlug,
        email: orgData?.email,
      });
      setInvoice(invoiceRecord);
      setStatus("ready");
    };

    load();

    return () => {
      active = false;
    };
  }, [invoiceId]);

  if (status === "missing") {
    notFound();
  }

  if (status !== "ready" || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading color="#7141F8" />
      </div>
    );
  }

  const startDate = formatDay(invoice.start_date);
  const endDate = formatDay(invoice.end_date);
  const amount = formatAmount(invoice.fee);
  const invoiceNo = `#${invoice.invoice_number ?? invoice.id}`;
  const period = [startDate, endDate].filter(Boolean).join(" - ");
  const sessionId = invoice.session_id ?? "";
  const sessionHead = sessionId ? `ID: ${sessionId.slice(0, 8)}...` : "";

  const items = [
    {
      description: invoice.name || "Subscription",
      period,
      date: startDate || "—",
      amount: amount || "—",
      vatPercent: "—",
      vat: "—",
      total: amount || "—",
    },
  ];

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className="flex justify-between">
        <Image
          className="h-screen w-auto "
          src={images.border}
          alt="Logo"
          width={200}
          height={200}
        />
        <div className="bg-white">
          <div className="bg-white  rounded-lg px-8 print:border-0 print:shadow-none">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col items-start  gap-3 mt-20">
                <Image
                  className="h-16 w-auto "
                  src={"/Zedu.png"}
                  alt="Logo"
                  width={200}
                  height={200}
                />
                <div className="mt-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-24 ">
                    <div>
                      <h3 className="text-sm text-gray-600 mb-2">
                        Office Information
                      </h3>
                      <div className=" text-gray-900 space-y-1">
                        {OFFICE_LINES.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-600 mb-2">
                        Biller Information
                      </h3>
                      <div className=" text-gray-900 space-y-1">
                        <div className="font-medium text-gray-900">
                          {org?.name ?? "—"}
                        </div>
                        {org?.email ? <div>{org.email}</div> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-center bg-[#F6F7F9] border rounded-b-2xl px-8 pt-12 pb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  INVOICE
                </h2>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="border bg-white flex items-center gap-6 p-2 rounded-lg mb-4">
                    <div className="text-start">
                      <span className="font-medium text-xs text-[#475467] whitespace-nowrap">
                        Invoice No
                      </span>
                      <div className="font-bold text-gray-900 whitespace-nowrap">
                        {invoiceNo}
                      </div>
                    </div>
                    <div className="w-[1px] h-5 bg-gray-300"></div>
                    <div className="text-start">
                      <span className="font-medium text-xs text-[#475467]">
                        Date
                      </span>
                      <div className="font-bold text-gray-900 whitespace-nowrap">
                        {startDate || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="border bg-white flex flex-col items-start p-2 rounded-lg">
                    <span className="font-medium text-xs text-[#475467]">
                      Generated By
                    </span>
                    <div className="font-bold text-gray-900 flex items-center gap-1 mt-1">
                      <Image
                        src={images.bot}
                        alt={""}
                        width={20}
                        height={20}
                        className={cn(
                          `border rounded bg-[#E6FAEF] border-[#E6EAEF]`
                        )}
                      />
                      {GENERATED_BY}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 mt-16">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        VAT %
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        VAT
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Payment Method
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.period}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.amount}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.vatPercent}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.vat}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {item.total}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="border rounded bg-white border-[#F5F5F5] py-2 px-2 text-[10px] font-bold text-blue-600">
                              CARD
                            </div>
                            <span className="text-sm text-gray-900">
                              {sessionHead} (Stripe Checkout)
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button
                variant={"outline"}
                onClick={handleDownload}
                className="border border-[#7141F8] text-[#7141F8] hover:bg-[#7141F8] hover:text-white px-6 py-2"
              >
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceView;
