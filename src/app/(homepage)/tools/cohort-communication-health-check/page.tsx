import type { Metadata } from "next";
import { CohortCommunicationHealthCheck } from "./_components/cohort-communication-health-check";

export const metadata: Metadata = {
  title: "Free Cohort Communication Health Check | Zedu",
  description:
    "Assess how effectively your bootcamp or community coordinates communications, resource delivery, and student feedback support.",
  alternates: {
    canonical: "https://zedu.chat/tools/cohort-communication-health-check",
  },
};

export default function CohortCommunicationHealthCheckPage() {
  return <CohortCommunicationHealthCheck />;
}
