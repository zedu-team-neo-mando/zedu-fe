"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import type { CompetitorPageConfig } from "../_lib/competitorData";

type TcoCalculatorProps = {
  config: CompetitorPageConfig;
};

export const TcoCalculator: React.FC<TcoCalculatorProps> = ({ config }) => {
  const [headcount, setHeadcount] = useState<number>(150);
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(
    "annual"
  );

  const presets = [30, 80, 150, 300, 500];

  const calculations = useMemo(() => {
    const isSlack = config.key === "slack";

    // Slack Pro is $8.75/user/month (standard) or $7.25 billed annually. Let's calculate standard Slack Pro at $8.75/user/month.
    const monthlyPerSeatRate = isSlack ? 8.75 : 0;
    const annualPerSeatRate = monthlyPerSeatRate * 12; // $105.00/year

    // Extra tools required on competitor platform:
    // Slack: Miro/Whiteboard add-on ($10/seat or at least for 5-10 instructors = $600/yr), Zoom add-on ($200/yr)
    // Discord: Server Boosts Level 3 ($100/mo = $1,200/yr) + Whiteboard tool ($300/yr)
    const annualCompetitorAddons = isSlack ? 800 : 1500;
    const monthlyCompetitorAddons = annualCompetitorAddons / 12;

    const competitorMonthlyTotal = isSlack
      ? headcount * monthlyPerSeatRate + monthlyCompetitorAddons
      : monthlyCompetitorAddons;

    const competitorAnnualTotal = isSlack
      ? headcount * annualPerSeatRate + annualCompetitorAddons
      : annualCompetitorAddons;

    // Zedu Flat Cohort Pricing:
    // Starter: $0 (small classes <= 30)
    // Pro Flat Cohort: ~$40/month ($480/year flat, no per-seat student penalties!)
    const zeduMonthly = headcount <= 30 ? 0 : 40;
    const zeduAnnual = headcount <= 30 ? 0 : 480;

    const displayedCompetitor =
      billingCycle === "annual"
        ? competitorAnnualTotal
        : competitorMonthlyTotal;
    const displayedZedu = billingCycle === "annual" ? zeduAnnual : zeduMonthly;
    const displayedSavings = Math.max(0, displayedCompetitor - displayedZedu);
    const savingsPercent =
      displayedCompetitor > 0
        ? Math.round((displayedSavings / displayedCompetitor) * 100)
        : 95;

    return {
      competitorCost: Math.round(displayedCompetitor),
      zeduCost: Math.round(displayedZedu),
      annualSavings: Math.round(competitorAnnualTotal - zeduAnnual),
      displayedSavings: Math.round(displayedSavings),
      savingsPercent,
      annualCompetitorTotal: Math.round(competitorAnnualTotal),
    };
  }, [headcount, billingCycle, config.key]);

  return (
    <section
      id="tco-calculator"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20"
      aria-labelledby="calculator-heading"
    >
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-primary-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-neutral-800">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs sm:text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Interactive TCO & ROI Calculator
          </div>
          <h2
            id="calculator-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3"
          >
            Calculate Your Total Cost Savings with Zedu
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Unlike {config.name}, Zedu offers flat cohort pricing. See in
            real-time how much your school, bootcamp, or academy saves by
            eliminating per-student seat paywalls and separate whiteboard
            licenses.
          </p>
        </div>

        {/* Controls Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Headcount Slider & Presets */}
          <div className="lg:col-span-7 space-y-6 bg-neutral-800/60 p-6 sm:p-8 rounded-2xl border border-neutral-700/60">
            {/* Cycle Toggle */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="student-slider"
                className="text-sm font-semibold text-neutral-200"
              >
                Number of Active Students / Members
              </label>
              <div className="inline-flex p-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    billingCycle === "annual"
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Annual View
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    billingCycle === "monthly"
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Monthly View
                </button>
              </div>
            </div>

            {/* Big Headcount Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-primary-400">
                {headcount.toLocaleString()}
              </span>
              <span className="text-neutral-400 text-base font-medium">
                enrolled students / cohort
              </span>
            </div>

            {/* Headcount Slider */}
            <div className="space-y-2">
              <input
                id="student-slider"
                type="range"
                min={15}
                max={1000}
                step={5}
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full h-3 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Student headcount slider"
              />
              <div className="flex justify-between text-xs text-neutral-400">
                <span>15 students</span>
                <span>250</span>
                <span>500</span>
                <span>1,000+ students</span>
              </div>
            </div>

            {/* Quick Cohort Presets */}
            <div className="pt-2">
              <span className="text-xs text-neutral-400 font-medium block mb-2">
                Quick Cohort Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setHeadcount(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      headcount === preset
                        ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                        : "bg-neutral-900/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                    }`}
                  >
                    {preset} Students
                  </button>
                ))}
              </div>
            </div>

            {/* What's Included Callout */}
            <div className="pt-4 border-t border-neutral-700/80 space-y-2.5">
              <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                What Zedu Eliminates From Your Budget:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                {config.budgetEliminations.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Cost Output Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-primary-900/40 via-neutral-900 to-neutral-900 p-6 sm:p-8 rounded-2xl border-2 border-primary-500/40 relative overflow-hidden shadow-xl">
            {/* Savings Badge */}
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wide">
              <TrendingDown className="w-3.5 h-3.5" />
              {calculations.savingsPercent}% Lower Cost
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Estimated {billingCycle === "annual" ? "Annual" : "Monthly"}{" "}
                  Savings
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                    ${calculations.displayedSavings.toLocaleString()}
                  </span>
                  <span className="text-neutral-400 text-sm">
                    {billingCycle === "annual" ? "/ year" : "/ month"}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Net savings against {config.name}&apos;s standard fees &amp;
                  required add-on licenses.
                </p>
              </div>

              {/* Side-by-Side Breakdown */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
                  <div>
                    <span className="text-xs font-medium text-neutral-400 block">
                      {config.name} Total Cost:
                    </span>
                    <span className="text-lg font-bold text-rose-400">
                      ${calculations.competitorCost.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {billingCycle === "annual" ? " / yr" : " / mo"}
                    </span>
                  </div>
                  <div className="text-right text-xs text-neutral-400">
                    <span className="text-neutral-300 font-semibold block">
                      {config.key === "slack"
                        ? `$8.75 × ${headcount} seats`
                        : "Server Boosts + Whiteboard"}
                    </span>
                    <span>+ add-on licenses</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-primary-950/60 border border-primary-500/40">
                  <div>
                    <span className="text-xs font-semibold text-primary-300 block">
                      Zedu Total Cost:
                    </span>
                    <span className="text-2xl font-black text-white">
                      ${calculations.zeduCost.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {billingCycle === "annual" ? " / yr" : " / mo"}
                    </span>
                  </div>
                  <div className="text-right text-xs text-primary-300">
                    <span className="font-bold text-white block">
                      Flat Cohort Rate
                    </span>
                    <span>0 per-student fees</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href={`/auth/sign-up?source=${config.slug}&seats=${headcount}&template=education-cohort`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  Claim Flat Cohort Rate Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-neutral-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    Free setup in under 2 minutes • No credit card required
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
