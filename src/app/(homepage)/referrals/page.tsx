import type { Metadata } from "next";
import { siteUrl } from "~/lib/env-urls";
import { ReferralDashboard } from "./_components/referral-dashboard";

export const metadata: Metadata = {
  title: "Referral Program | Earn Rewards & Invite Teammates to Zedu",
  description:
    "Invite educators, bootcamps, and fellow learners to Zedu. Get your unique referral link, track real-time sign-ups, and unlock milestone rewards at 3, 5, 10, and 25 invites.",
  alternates: {
    canonical: siteUrl("/referrals"),
  },
  openGraph: {
    title: "Zedu Referral Program | Share & Unlock Perks",
    description:
      "Invite your cohort to Zedu. Earn bonus points, custom badges, and platform perks with your unique referral link.",
    url: siteUrl("/referrals"),
    siteName: "Zedu",
    type: "website",
    images: [
      {
        url: "/og/zedu-home-share.png",
        width: 1200,
        height: 630,
        alt: "Zedu Referral Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu Referral Program | Share & Unlock Perks",
    description:
      "Invite your cohort to Zedu. Earn bonus points, custom badges, and platform perks with your unique referral link.",
    images: ["/og/zedu-home-share.png"],
  },
};

export default function ReferralsPage() {
  return (
    <main className="relative min-h-screen bg-neutral-50/50 pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-primary-50/70 via-neutral-50/30 to-transparent"
      />
      <ReferralDashboard />
    </main>
  );
}
