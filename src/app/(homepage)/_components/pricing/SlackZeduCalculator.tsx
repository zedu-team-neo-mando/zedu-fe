"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import {
  DialogClose,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";

// ---------------------------------------------------------------------------
// Pricing constants — illustrative rates inferred from the reference screenshot
// (350 learners × ₦13,500 = ₦4,725,000 Slack estimate shown in the UI).
// Change SLACK_RATE_PER_LEARNER_PER_MONTH to update the comparison without
// touching any other logic.
// ---------------------------------------------------------------------------
const SLACK_RATE_PER_LEARNER_PER_MONTH = 13_500; // ₦ per learner per month
const ZEDU_MONTHLY_PRICE = 20_000; // ₦ fixed, learner-count-independent
const PRO_PLAN_HREF = "/client/settings/organisation/billing/all-plans"; // same as PricingCard Pro

// Slider configuration
const SLIDER_MIN = 10;
const SLIDER_MAX = 5_000;
const SLIDER_STEP = 10;
const SLIDER_INITIAL = 350;

// Piecewise scale mapping visual position percentage (0 to 100) to learner count.
// Corresponds directly to tick marks: 10 (0%), 500 (25%), 1,000 (50%), 3,000 (75%), 5,000+ (100%).
const SCALE_POINTS: readonly { pos: number; value: number }[] = [
  { pos: 0, value: SLIDER_MIN },
  { pos: 25, value: 500 },
  { pos: 50, value: 1_000 },
  { pos: 75, value: 3_000 },
  { pos: 100, value: SLIDER_MAX },
];

function learnersToPosition(value: number): number {
  if (isNaN(value) || value <= SCALE_POINTS[0].value)
    return SCALE_POINTS[0].pos;
  const lastPoint = SCALE_POINTS[SCALE_POINTS.length - 1];
  if (value >= lastPoint.value) return lastPoint.pos;

  for (let i = 0; i < SCALE_POINTS.length - 1; i++) {
    const p0 = SCALE_POINTS[i];
    const p1 = SCALE_POINTS[i + 1];
    if (value >= p0.value && value <= p1.value) {
      const fraction = (value - p0.value) / (p1.value - p0.value);
      return p0.pos + fraction * (p1.pos - p0.pos);
    }
  }
  return 0;
}

function positionToLearners(pos: number): number {
  if (isNaN(pos) || pos <= SCALE_POINTS[0].pos) return SCALE_POINTS[0].value;
  const lastPoint = SCALE_POINTS[SCALE_POINTS.length - 1];
  if (pos >= lastPoint.pos) return lastPoint.value;

  for (let i = 0; i < SCALE_POINTS.length - 1; i++) {
    const p0 = SCALE_POINTS[i];
    const p1 = SCALE_POINTS[i + 1];
    if (pos >= p0.pos && pos <= p1.pos) {
      const fraction = (pos - p0.pos) / (p1.pos - p0.pos);
      const rawValue = p0.value + fraction * (p1.value - p0.value);
      const rounded = Math.round(rawValue / SLIDER_STEP) * SLIDER_STEP;
      return Math.min(
        lastPoint.value,
        Math.max(SCALE_POINTS[0].value, rounded)
      );
    }
  }
  return SCALE_POINTS[0].value;
}

// Duration options
type DurationOption = {
  months: number;
  label: string;
  sublabel?: string;
};

const DURATION_OPTIONS: DurationOption[] = [
  { months: 1, label: "1 Month" },
  { months: 3, label: "3 Months", sublabel: "Standard Bootcamp" },
  { months: 6, label: "6 Months" },
  { months: 12, label: "12 Months" },
];
const DEFAULT_DURATION_MONTHS = 3;

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
function formatNaira(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return "₦0";
  return (
    "₦" +
    Math.round(amount).toLocaleString("en-NG", {
      maximumFractionDigits: 0,
    })
  );
}

function formatPercent(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "0%";
  return value.toFixed(1) + "%";
}

// ---------------------------------------------------------------------------
// Calculation engine
// ---------------------------------------------------------------------------
function calcPricing(learnerCount: number, durationMonths: number) {
  const slackMonthlyEstimate = learnerCount * SLACK_RATE_PER_LEARNER_PER_MONTH;
  const slackDurationTotal = slackMonthlyEstimate * durationMonths;
  const zeduMonthlyPrice = ZEDU_MONTHLY_PRICE;
  const zeduDurationTotal = zeduMonthlyPrice * durationMonths;
  const monthlySavings = slackMonthlyEstimate - zeduMonthlyPrice;
  const durationSavings = slackDurationTotal - zeduDurationTotal;
  const savingsPercentage =
    slackDurationTotal > 0
      ? Math.min(100, Math.max(0, (durationSavings / slackDurationTotal) * 100))
      : 0;

  return {
    slackMonthlyEstimate,
    slackDurationTotal,
    zeduMonthlyPrice,
    zeduDurationTotal,
    monthlySavings,
    durationSavings,
    savingsPercentage,
  };
}

// ---------------------------------------------------------------------------
// CohortDurationSelector sub-component
// ---------------------------------------------------------------------------
function CohortDurationSelector({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (months: number) => void;
}) {
  return (
    <div
      className="grid grid-cols-2 gap-1.5 sm:grid-cols-4"
      role="group"
      aria-label="Cohort duration"
    >
      {DURATION_OPTIONS.map((opt) => {
        const isActive = opt.months === selected;
        return (
          <button
            key={opt.months}
            type="button"
            onClick={() => onChange(opt.months)}
            aria-pressed={isActive}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              isActive
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300"
            )}
          >
            <span>{opt.label}</span>
            {opt.sublabel && (
              <span
                className={cn(
                  "text-[9px] font-normal leading-tight",
                  isActive ? "text-purple-100" : "text-neutral-400"
                )}
              >
                {opt.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CostEstimateCard sub-component
// ---------------------------------------------------------------------------
function CostEstimateCard({
  platform,
  logo,
  monthlyLabel,
  monthlyAmount,
  durationLabel,
  durationAmount,
  highlight,
  isEstimated,
}: {
  platform: string;
  logo: React.ReactNode;
  monthlyLabel: string;
  monthlyAmount: string;
  durationLabel: string;
  durationAmount: string;
  highlight?: boolean;
  isEstimated?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col justify-between rounded-xl border p-3 sm:p-3.5",
        highlight
          ? "border-primary-200 bg-primary-50"
          : "border-neutral-200 bg-white"
      )}
    >
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          {logo}
          <span className="text-xs font-semibold text-neutral-700">
            {isEstimated ? "Slack (Estimated)" : platform}
          </span>
          {isEstimated && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5 shrink-0 text-red-500"
              aria-label="Estimated cost warning"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="text-[11px] text-neutral-500">{monthlyLabel}</p>
          <p
            className={cn(
              "text-lg font-bold sm:text-xl",
              isEstimated
                ? "text-red-500 line-through"
                : highlight
                  ? "text-primary-500"
                  : "text-neutral-900"
            )}
          >
            {monthlyAmount}
          </p>
          <p className="text-[10px] text-neutral-400">/month</p>
        </div>
      </div>
      <div className="mt-2 border-t border-neutral-100 pt-1.5">
        <p className="text-[10px] text-neutral-500">{durationLabel}</p>
        <p className="text-sm font-semibold text-neutral-700 sm:text-base">
          {durationAmount}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SavingsIndicator sub-component
// ---------------------------------------------------------------------------
function SavingsIndicator({
  monthlySavings,
  savingsPercentage,
}: {
  monthlySavings: number;
  savingsPercentage: number;
}) {
  const hasSavings = monthlySavings > 0;
  const barWidth = Math.min(100, Math.max(0, savingsPercentage));

  return (
    <div className="rounded-xl bg-gradient-to-r from-secondary-500 to-tertiary-500 p-2.5 sm:p-3">
      {/* Badge */}
      <div className="mb-1.5 flex justify-center">
        <div className="rounded-full bg-neutral-900 px-3 py-0.5 text-xs font-semibold text-white">
          {hasSavings ? (
            <>
              YOU SAVE {formatNaira(monthlySavings)}/mo (
              {formatPercent(savingsPercentage)}!)
            </>
          ) : (
            "No savings at this learner count"
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="overflow-hidden rounded-full bg-white/30"
        style={{ height: "6px" }}
        aria-label={`Savings percentage: ${formatPercent(savingsPercentage)}`}
        role="progressbar"
        aria-valuenow={Math.round(savingsPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-300"
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <p className="mt-1 text-center text-[11px] font-medium text-white/80">
        {hasSavings
          ? `${formatPercent(savingsPercentage)} cheaper than Slack`
          : "Increase learner count to see savings"}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Platform logo SVGs (inline, no extra dependencies)
// ---------------------------------------------------------------------------
const SlackLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Slack"
  >
    <path
      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      fill="#E01E5A"
    />
  </svg>
);

const ZeduLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Zedu"
  >
    <circle cx="12" cy="12" r="12" fill="rgb(113, 65, 248)" />
    <path d="M7 8h10l-6 8H7V8zm4 0h6v8h-4" fill="none" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="white"
      fontSize="10"
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      Z
    </text>
  </svg>
);

// ---------------------------------------------------------------------------
// Main SlackZeduCalculator component (modal)
// ---------------------------------------------------------------------------
export function SlackZeduCalculator({
  onCloseAutoFocus,
}: {
  onCloseAutoFocus?: (event: Event) => void;
}) {
  const [learnerCount, setLearnerCount] = useState(SLIDER_INITIAL);
  const [durationMonths, setDurationMonths] = useState(DEFAULT_DURATION_MONTHS);

  const sliderPercent = learnersToPosition(learnerCount);

  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      delta = e.shiftKey ? 100 : SLIDER_STEP;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      delta = e.shiftKey ? -100 : -SLIDER_STEP;
    } else if (e.key === "PageUp") {
      delta = 100;
    } else if (e.key === "PageDown") {
      delta = -100;
    } else if (e.key === "Home") {
      e.preventDefault();
      setLearnerCount(SLIDER_MIN);
      return;
    } else if (e.key === "End") {
      e.preventDefault();
      setLearnerCount(SLIDER_MAX);
      return;
    }

    if (delta !== 0) {
      e.preventDefault();
      setLearnerCount((prev) =>
        Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, prev + delta))
      );
    }
  };

  const pricing = calcPricing(learnerCount, durationMonths);

  const selectedDuration = DURATION_OPTIONS.find(
    (d) => d.months === durationMonths
  );
  const durationLabelStr = selectedDuration
    ? `${selectedDuration.label}${selectedDuration.sublabel ? ` (${selectedDuration.sublabel})` : ""}`
    : `${durationMonths} Month${durationMonths !== 1 ? "s" : ""}`;

  return (
    <DialogContent
      onCloseAutoFocus={onCloseAutoFocus}
      overlayClassName="bg-black/60 backdrop-blur-sm"
      className="fixed inset-0 z-[10001] flex h-full w-full max-w-none translate-x-0 translate-y-0 items-center justify-center overflow-y-auto rounded-none border-0 bg-transparent p-3 shadow-none sm:p-4"
    >
      <div className="relative my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        {/* Close button */}
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Close calculator"
            className="absolute right-3.5 top-3.5 z-10 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogClose>

        {/* Header */}
        <div className="px-4 pb-2 pt-4 text-center sm:px-6">
          <DialogTitle className="text-base font-bold text-neutral-900 sm:text-lg">
            See the Difference: Slack vs. Zedu
          </DialogTitle>
          <p className="mx-auto mt-0.5 max-w-md text-xs text-neutral-500">
            Calculate how much you&apos;ll save by switching from Slack&apos;s
            per-student fees to Zedu&apos;s flat pricing.
          </p>
        </div>

        {/* Calculator card */}
        <div className="mx-3.5 mb-2 rounded-xl border border-primary-200 shadow-sm sm:mx-5">
          <div className="flex flex-col divide-y divide-neutral-100 md:flex-row md:divide-x md:divide-y-0">
            {/* ---- Left column: inputs ---- */}
            <div className="flex flex-1 flex-col justify-between gap-3 p-3.5 sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-500">
                Estimate Your Cohort
              </p>

              {/* Learner slider */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="learner-slider"
                  className="text-xs font-medium text-neutral-700 sm:text-sm"
                >
                  1. How many learners in your cohort?
                </label>

                <div className="relative pb-1 pt-14">
                  {/* White circular tooltip sitting directly above the slider thumb */}
                  <div
                    className="pointer-events-none absolute top-0 z-20 flex -translate-x-1/2 flex-col items-center justify-center rounded-full bg-white shadow-md transition-[left] duration-75"
                    style={{
                      left: `clamp(26px, ${sliderPercent}%, calc(100% - 26px))`,
                      width: "52px",
                      height: "52px",
                    }}
                  >
                    <span className="text-sm font-bold leading-tight text-neutral-900">
                      {learnerCount.toLocaleString("en-NG")}
                    </span>
                    <span className="text-[9px] font-normal leading-tight text-neutral-700">
                      Learners
                    </span>
                  </div>

                  {/* Track and slider */}
                  <div className="relative flex h-6 items-center">
                    {/* Background & filled track */}
                    <div className="pointer-events-none absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{
                          width: `${sliderPercent}%`,
                        }}
                      />
                    </div>

                    {/* Native range slider thumb sitting on track below the badge */}
                    <input
                      id="learner-slider"
                      type="range"
                      min={0}
                      max={100}
                      step="any"
                      value={sliderPercent}
                      onChange={(e) =>
                        setLearnerCount(
                          positionToLearners(Number(e.target.value))
                        )
                      }
                      onKeyDown={handleSliderKeyDown}
                      aria-label="Number of learners in your cohort"
                      aria-valuemin={SLIDER_MIN}
                      aria-valuemax={SLIDER_MAX}
                      aria-valuenow={learnerCount}
                      className="zedu-slider relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent"
                    />
                  </div>

                  {/* Tick marks */}
                  <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
                    {["10", "500", "1,000", "3,000", "5,000+"].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration selector */}
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-neutral-700 sm:text-sm">
                  2. How long is your cohort?
                </p>
                <CohortDurationSelector
                  selected={durationMonths}
                  onChange={setDurationMonths}
                />
              </div>
            </div>

            {/* ---- Right column: estimates ---- */}
            <div className="flex flex-1 flex-col gap-2.5 p-3.5 sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                Estimated Costs
              </p>

              {/* Side-by-side cost cards */}
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <CostEstimateCard
                  platform="Slack"
                  logo={<SlackLogo />}
                  monthlyLabel="Estimated monthly"
                  monthlyAmount={formatNaira(pricing.slackMonthlyEstimate)}
                  durationLabel={`Total for ${durationLabelStr}`}
                  durationAmount={formatNaira(pricing.slackDurationTotal)}
                  isEstimated
                />
                <CostEstimateCard
                  platform="Zedu Pro"
                  logo={<ZeduLogo />}
                  monthlyLabel="Flat monthly price"
                  monthlyAmount={formatNaira(pricing.zeduMonthlyPrice)}
                  durationLabel={`Total for ${durationLabelStr}`}
                  durationAmount={formatNaira(pricing.zeduDurationTotal)}
                  highlight
                />
              </div>

              {/* Savings panel */}
              <SavingsIndicator
                monthlySavings={pricing.monthlySavings}
                savingsPercentage={pricing.savingsPercentage}
              />

              {/* CTA — reuses exact Pro plan href from PricingCard */}
              <div className="flex flex-col items-center gap-1.5">
                <Link href={PRO_PLAN_HREF} className="w-full">
                  <button
                    type="button"
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:text-sm"
                  >
                    Start Saving with Zedu Pro
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path
                        d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9964 9.5533 24.6256 6.24882 22.1884 3.81163C19.7512 1.37445 16.4467 0.00363977 13 0ZM18.7075 13.7075L14.7075 17.7075C14.5199 17.8951 14.2654 18.0006 14 18.0006C13.7346 18.0006 13.4801 17.8951 13.2925 17.7075C13.1049 17.5199 12.9994 17.2654 12.9994 17C12.9994 16.7346 13.1049 16.4801 13.2925 16.2925L15.5863 14H8.00001C7.73479 14 7.48044 13.8946 7.2929 13.7071C7.10536 13.5196 7.00001 13.2652 7.00001 13C7.00001 12.7348 7.10536 12.4804 7.2929 12.2929C7.48044 12.1054 7.73479 12 8.00001 12H15.5863L13.2925 9.7075C13.1049 9.51986 12.9994 9.26536 12.9994 9C12.9994 8.73464 13.1049 8.48014 13.2925 8.2925C13.4801 8.10486 13.7346 7.99944 14 7.99944C14.2654 7.99944 14.5199 8.10486 14.7075 8.2925L18.7075 12.2925C18.8005 12.3854 18.8742 12.4957 18.9246 12.6171C18.9749 12.7385 19.0008 12.8686 19.0008 13C19.0008 13.1314 18.9749 13.2615 18.9246 13.3829C18.8742 13.5043 18.8005 13.6146 18.7075 13.7075Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </Link>
                <p className="text-[11px] text-neutral-400">
                  Instant migration • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="px-4 pb-2 text-center text-[10px] text-neutral-400 sm:px-6">
          * Slack cost is an illustrative estimate at ₦13,500 per learner/month.
          Actual Slack pricing may vary.
        </p>
      </div>

      {/* Slider thumb styling injected inline to avoid extra CSS files */}
      <style>{`
        .zedu-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgb(113, 65, 248);
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(113,65,248,0.4);
          cursor: pointer;
        }
        .zedu-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgb(113, 65, 248);
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(113,65,248,0.4);
          cursor: pointer;
        }
        .zedu-slider::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
        }
        .zedu-slider::-moz-range-track {
          height: 6px;
          background: transparent;
        }
      `}</style>
    </DialogContent>
  );
}
