import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { CompetitorPageConfig } from "../_lib/competitorData";

type HeroProps = {
  config: CompetitorPageConfig;
};

export const CompetitorHero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 text-center sm:text-left">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-500"
      >
        <Link href="/" className="hover:text-primary-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link
          href="/alternatives"
          className="hover:text-primary-600 transition-colors"
        >
          Alternatives
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-800 font-medium">
          {config.name} Alternative
        </span>
      </nav>

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/90 text-primary-800 border border-primary-200 text-xs sm:text-sm font-semibold mb-6">
        <Sparkles className="w-4 h-4 text-primary-600" />
        <span>{config.badgeText}</span>
        <span className="hidden sm:inline text-neutral-400">•</span>
        <span className="hidden sm:inline font-normal text-primary-700">
          {config.heroHighlight}
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.15] max-w-4xl">
        {config.headline}
      </h1>

      {/* Subheadline */}
      <p className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-600 max-w-3xl leading-relaxed">
        {config.subheadline}
      </p>

      {/* Primary & Secondary CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href={`/auth/sign-up?source=${config.slug}&template=education-cohort`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-base transition-all shadow-lg shadow-primary-600/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-5 h-5" />
          Switch to Zedu Free
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href="#tco-calculator"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-base transition-colors border border-neutral-300"
        >
          Calculate Cost Savings
          <ArrowRight className="w-4 h-4 text-neutral-500" />
        </a>

        <Link
          href="/contact-sales"
          className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-primary-600 transition-colors sm:ml-2"
        >
          Talk to Education Specialist &rarr;
        </Link>
      </div>

      {/* Quick Trust Signals */}
      <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Free plan available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Setup in under 5 minutes</span>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {config.stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm text-left hover:border-primary-200 transition-colors"
          >
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-bold text-neutral-800 mt-1">
              {stat.label}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5 leading-snug">
              {stat.sublabel}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
