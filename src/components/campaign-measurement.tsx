"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  campaignConsent,
  captureCampaign,
  reportCampaignVisit,
  setCampaignConsent,
  type Consent,
} from "~/lib/campaign-attribution";

export function CampaignMeasurement() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>("unknown");
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const refresh = () => {
      setConsent(campaignConsent());
      const campaign = captureCampaign(window.location.search);
      if (campaign) void reportCampaignVisit(campaign);
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [pathname, consent]);
  const choose = (value: "granted" | "denied") => {
    setCampaignConsent(value);
    setConsent(value);
    setEditing(false);
  };
  if (consent !== "unknown" && !editing)
    return (
      <button
        type="button"
        className="fixed bottom-2 left-2 z-50 rounded border bg-white px-2 py-1 text-xs text-slate-700 shadow"
        onClick={() => setEditing(true)}
      >
        Campaign measurement preferences
      </button>
    );
  return (
    <section
      aria-label="Campaign measurement preferences"
      className="fixed bottom-3 left-3 right-3 z-50 max-w-md rounded-xl border bg-white p-4 text-sm text-slate-800 shadow-lg"
    >
      <p>
        Allow campaign measurement to remember which marketing link brought you
        to Zedu for up to 30 days? This optional measurement helps us understand
        enquiries and registrations. You can withdraw this choice here at any
        time.
      </p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          className="rounded bg-[#6458F5] px-3 py-2 text-white"
          onClick={() => choose("granted")}
        >
          Allow campaign measurement
        </button>
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={() => choose("denied")}
        >
          Decline
        </button>
      </div>
    </section>
  );
}
