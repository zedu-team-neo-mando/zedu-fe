"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, X, Gift } from "lucide-react";
import { sanitizeReferralCode, STORAGE_KEYS } from "~/lib/referrals";

function ReferralBannerContent() {
  const searchParams = useSearchParams();
  const [referrer, setReferrer] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Check URL query params for ?ref=... or ?referral=...
    const refParam = searchParams.get("ref") || searchParams.get("referral");

    if (refParam) {
      const clean = sanitizeReferralCode(refParam);
      setReferrer(clean);
      try {
        localStorage.setItem(STORAGE_KEYS.INCOMING_REF, clean);
      } catch {
        /* storage may be disabled in private mode */
      }
    } else {
      // 2. Check stored incoming ref from earlier in the session
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.INCOMING_REF);
        if (stored) {
          setReferrer(sanitizeReferralCode(stored));
        }
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  // Check if user already dismissed for this referrer
  useEffect(() => {
    if (!referrer) return;
    try {
      const dismissedCode = localStorage.getItem(STORAGE_KEYS.BANNER_DISMISSED);
      if (dismissedCode === referrer) {
        setIsDismissed(true);
      }
    } catch {
      /* ignore */
    }
  }, [referrer]);

  if (!referrer || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEYS.BANNER_DISMISSED, referrer);
    } catch {
      /* ignore */
    }
  };

  const signupUrl = `/auth/sign-up?ref=${encodeURIComponent(referrer)}`;

  return (
    <aside
      aria-label="Community invitation welcome banner"
      data-testid="referral-onboarding-banner"
      className="relative z-30 w-full bg-gradient-to-r from-[#6042EC] via-[#7141F8] to-[#8D67FA] text-white shadow-md transition-all duration-300"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        {/* Left greeting & message */}
        <div className="flex flex-1 items-center gap-3 min-w-[280px]">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 shadow-inner ring-1 ring-white/30"
            role="img"
            aria-label="Gift box"
          >
            <Gift className="h-4 w-4 text-white" />
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
            <span className="font-bold tracking-wide text-white drop-shadow-xs">
              🎉 You were invited by{" "}
              <span className="underline decoration-white/60 underline-offset-2">
                @{referrer}
              </span>
              !
            </span>
            <span className="text-white/90">
              Join Zedu to get structured collaboration and claim your 100
              starter point bonus.
            </span>
          </div>
        </div>

        {/* Right CTA and dismiss */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={signupUrl}
            data-testid="referral-banner-signup-cta"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-primary-600 shadow-md transition hover:bg-neutral-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            <span>Claim Invite & Sign Up</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss referral invitation banner"
            data-testid="dismiss-referral-banner"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function ReferralOnboardingBanner() {
  return (
    <Suspense fallback={null}>
      <ReferralBannerContent />
    </Suspense>
  );
}
