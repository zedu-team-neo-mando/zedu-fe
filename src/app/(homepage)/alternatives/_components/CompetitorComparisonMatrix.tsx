"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import type {
  CompetitorPageConfig,
  FeatureComparisonItem,
} from "../_lib/competitorData";

type MatrixProps = {
  config: CompetitorPageConfig;
};

const categoryLabels: Record<string, string> = {
  organization: "Cohort & Structure",
  collaboration: "Whiteboard & Tools",
  communication: "Voice & Audio",
  pricing: "Cost & Pricing",
  security: "Safety & Privacy",
};

export const CompetitorComparisonMatrix: React.FC<MatrixProps> = ({
  config,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const categories = useMemo(() => {
    const presentCategories = Array.from(
      new Set(config.features.map((f) => f.category))
    );
    return [
      { key: "all", label: "All Features" },
      ...presentCategories.map((cat) => ({
        key: cat,
        label: categoryLabels[cat] || cat,
      })),
    ];
  }, [config.features]);

  const effectiveCategory = categories.some((c) => c.key === activeCategory)
    ? activeCategory
    : "all";

  const filteredFeatures =
    effectiveCategory === "all"
      ? config.features
      : config.features.filter((f) => f.category === effectiveCategory);

  const renderStatusIcon = (status: "yes" | "no" | "partial") => {
    switch (status) {
      case "yes":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case "no":
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case "partial":
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
    }
  };

  return (
    <section
      id="comparison-matrix"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20"
      aria-labelledby="matrix-heading"
    >
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs sm:text-sm font-semibold mb-3">
          <Layers className="w-4 h-4" />
          Side-by-Side Deep Dive
        </div>
        <h2
          id="matrix-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight"
        >
          Zedu vs. {config.name}: Built for Learning from Day One
        </h2>
        <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
          See how Zedu&apos;s education-first architecture compares to{" "}
          {config.name}&apos;s generalist platform across academic
          collaboration, cohort organization, and real total cost.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.key
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Matrix Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/70">
              <th className="py-4 px-6 text-sm font-bold text-neutral-900 w-2/5">
                Feature &amp; Capability
              </th>
              <th className="py-4 px-6 text-sm font-bold text-primary-700 bg-primary-50/60 w-3/10 border-x border-primary-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                  Zedu (Cohort Platform)
                </div>
              </th>
              <th className="py-4 px-6 text-sm font-bold text-neutral-700 w-3/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
                  {config.name}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-sm">
            {filteredFeatures.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-sm text-neutral-500"
                >
                  No comparison features found in this category.
                </td>
              </tr>
            ) : (
              filteredFeatures.map((item, index) => (
                <tr
                  key={item.feature}
                  className={index % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}
                >
                  {/* Feature Name & Tooltip */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-neutral-900 block">
                          {item.feature}
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          {item.tooltip}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Zedu Column */}
                  <td className="py-4 px-6 align-top bg-primary-50/30 border-x border-primary-100/60">
                    <div className="flex items-start gap-2.5">
                      {renderStatusIcon(item.zedu.status)}
                      <div>
                        <span className="font-semibold text-neutral-900 block text-xs sm:text-sm">
                          {item.zedu.label}
                        </span>
                        <span className="text-xs text-neutral-600 leading-relaxed block mt-0.5">
                          {item.zedu.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Competitor Column */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-start gap-2.5">
                      {renderStatusIcon(item.competitor.status)}
                      <div>
                        <span className="font-semibold text-neutral-800 block text-xs sm:text-sm">
                          {item.competitor.label}
                        </span>
                        <span className="text-xs text-neutral-500 leading-relaxed block mt-0.5">
                          {item.competitor.description}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Matrix Cards */}
      <div className="md:hidden space-y-4">
        {filteredFeatures.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-500 rounded-2xl border border-neutral-200 bg-white p-6">
            No comparison features found in this category.
          </div>
        ) : (
          filteredFeatures.map((item) => (
            <div
              key={item.feature}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900 text-sm">
                    {item.feature}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{item.tooltip}</p>
              </div>

              {/* Zedu Advantage */}
              <div className="p-3 rounded-xl bg-primary-50/70 border border-primary-200/60 space-y-1">
                <div className="flex items-center gap-2">
                  {renderStatusIcon(item.zedu.status)}
                  <span className="text-xs font-bold text-primary-900">
                    Zedu
                  </span>
                  <span className="text-xs font-semibold text-neutral-900">
                    • {item.zedu.label}
                  </span>
                </div>
                <p className="text-xs text-neutral-700 pl-7">
                  {item.zedu.description}
                </p>
              </div>

              {/* Competitor */}
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2">
                  {renderStatusIcon(item.competitor.status)}
                  <span className="text-xs font-bold text-neutral-700">
                    {config.name}
                  </span>
                  <span className="text-xs font-semibold text-neutral-800">
                    • {item.competitor.label}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 pl-7">
                  {item.competitor.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 text-center bg-gradient-to-r from-primary-50 via-white to-primary-50 border border-primary-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h3 className="text-base sm:text-lg font-bold text-neutral-900">
            Ready to upgrade your cohort experience?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Switch from {config.name} in 5 minutes with our automated education
            template.
          </p>
        </div>
        <Link
          href={`/auth/sign-up?source=${config.slug}&template=education-cohort`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all shadow-sm hover:scale-[1.02] shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Start Free Migration
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
};
