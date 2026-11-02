"use client";

import { useEffect, useRef, useState } from "react";
import { pricingCardsByCycle } from "../../_lib/pricingData";
import { PricingCard } from "../ui/PricingCard";
import Link from "next/link";
import { PurpleArrowRight } from "../svgs";
import { SlackZeduCalculator } from "../pricing/SlackZeduCalculator";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { useCelebration } from "./CelebrationThemeContext";
import { CelebrationThemeIcon } from "./CelebrationBanner";

type PricingSectionProps = {
  showSubtitle?: boolean;
};

export const PricingSection = ({
  showSubtitle = true,
}: PricingSectionProps) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const externalOpenerRef = useRef<HTMLElement | null>(null);
  const plans = pricingCardsByCycle[billingCycle];
  const { celebration } = useCelebration();

  // Listen for the custom event dispatched by the "Calculate Your Savings" button
  useEffect(() => {
    const handler = (event: Event) => {
      const opener = (event as CustomEvent).detail;
      externalOpenerRef.current = opener instanceof HTMLElement ? opener : null;
      setCalculatorOpen(true);
    };
    window.addEventListener("open-zedu-calculator", handler);
    return () => window.removeEventListener("open-zedu-calculator", handler);
  }, []);

  const handleCalculatorCloseAutoFocus = (event: Event) => {
    const opener = externalOpenerRef.current;
    externalOpenerRef.current = null;
    if (opener) {
      event.preventDefault();
      opener.focus();
    }
  };

  return (
    <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
      <section className="relative isolate flex w-full flex-col items-center gap-6 overflow-hidden px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16 lg:gap-8 lg:px-12">
        {/* Festive celebration seasonal pricing highlight */}
        {celebration && (
          <div
            className={`w-full max-w-4xl px-4 py-3 rounded-2xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold shadow-sm transition-all ${celebration.pricingBannerClass}`}
          >
            <CelebrationThemeIcon
              id={celebration.id}
              className="w-5 h-5 shrink-0"
            />
            <span>{celebration.pricingBannerText}</span>
          </div>
        )}

        <div
          className={`flex flex-col items-center ${
            showSubtitle ? "gap-4 sm:gap-6" : "gap-3"
          }`}
        >
          <h2 className="text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl md:text-4xl text-center">
            Simple, Flexible Pricing for Education
          </h2>
          {showSubtitle ? (
            <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
              Flexible plans for educators, bootcamps, and institutions building
              structured learning environments with collaboration and AI
              support.
            </p>
          ) : null}

          {/* Interactive Billing Toggle */}
          <div className="mt-2 inline-flex items-center rounded-full bg-neutral-100 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              aria-pressed={billingCycle === "yearly"}
              className={`flex items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                billingCycle === "yearly"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <span>Yearly</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid w-full max-w-7xl grid-cols-1 mt-4 place-items-stretch justify-center gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div key={plan.key} className="flex justify-center">
              <PricingCard
                title={plan.title}
                description={plan.description}
                amount={plan.amount}
                periodLabel={plan.periodLabel}
                footnote={plan.footnote}
                features={plan.features}
                ctaText={plan.ctaText}
                ctaHref={plan.ctaHref}
                ctaVariant={plan.ctaVariant}
                variant={plan.variant}
                badgeText={
                  celebration && plan.variant === "popular"
                    ? "Holiday Favorite"
                    : plan.badgeText
                }
              />
            </div>
          ))}
        </div>
        <p className="max-w-2xl text-xs text-neutral-600 sm:text-sm">
          Prices are in Nigerian naira (₦) and billed monthly for each
          workspace. US dollar amounts are approximate and change with the
          exchange rate.
        </p>
        <p className="mt-4 text-xs sm:text-sm font-medium text-neutral-600">
          Launching a bootcamp? Let&apos;s build a custom model that fits your
          cohort size.
        </p>
        <Link
          href="/pricing#compare-plans"
          className="group flex items-center gap-2 font-semibold text-primary-500 hover:underline"
        >
          Compare all plans and features
          <span className="inline-flex transition-transform duration-300 ease-out group-hover:translate-x-1">
            <PurpleArrowRight />
          </span>
        </Link>

        {/* CTA: open Slack vs. Zedu comparison calculator */}
        <DialogTrigger asChild>
          <button
            type="button"
            className="group flex items-center -mt-4 gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors duration-150 focus:outline-none focus-visible:underline"
          >
            Compare Zedu with other platform
            <span className="inline-flex transition-transform duration-300 ease-out group-hover:translate-x-1">
              <PurpleArrowRight />
            </span>
          </button>
        </DialogTrigger>
      </section>

      {/* Calculator modal */}
      <SlackZeduCalculator onCloseAutoFocus={handleCalculatorCloseAutoFocus} />
    </Dialog>
  );
};
