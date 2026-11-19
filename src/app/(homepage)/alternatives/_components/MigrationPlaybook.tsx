"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck,
  Check,
  Share2,
} from "lucide-react";
import type { CompetitorPageConfig } from "../_lib/competitorData";

type PlaybookProps = {
  config: CompetitorPageConfig;
};

export const MigrationPlaybook: React.FC<PlaybookProps> = ({ config }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [checklist, setChecklist] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });

  const toggleCheck = (stepNum: number) => {
    setChecklist((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  return (
    <section
      id="migration-playbook"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20"
      aria-labelledby="playbook-heading"
    >
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-neutral-800 shadow-xl overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold mb-3">
            <Clock className="w-4 h-4" />
            5-Minute Zero-Downtime Migration
          </div>
          <h2
            id="playbook-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
          >
            {config.migrationPlaybook.title}
          </h2>
          <p className="mt-3 text-neutral-300 text-sm sm:text-base leading-relaxed">
            {config.migrationPlaybook.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step navigation list */}
          <div className="lg:col-span-5 space-y-3">
            {config.migrationPlaybook.steps.map((s) => {
              const isActive = activeStep === s.step;
              const isChecked = checklist[s.step];

              return (
                <div
                  key={s.step}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-4 ${
                    isActive
                      ? "bg-neutral-800/90 border-primary-500 shadow-md shadow-primary-500/10"
                      : "bg-neutral-800/40 border-neutral-700/60 hover:bg-neutral-800/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleCheck(s.step)}
                    aria-pressed={isChecked}
                    aria-label={`Mark step ${s.step} as ${isChecked ? "incomplete" : "complete"}`}
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                      isChecked
                        ? "bg-emerald-500 text-white"
                        : "border-2 border-neutral-500 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(s.step)}
                    aria-current={isActive ? "step" : undefined}
                    className="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-lg group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                        Step {s.step} • {s.duration}
                      </span>
                    </div>
                    <h3
                      className={`text-sm font-bold mt-0.5 truncate transition-colors ${
                        isActive
                          ? "text-primary-300"
                          : "text-white group-hover:text-primary-200"
                      }`}
                    >
                      {s.title}
                    </h3>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Active Step Detailed View */}
          <div className="lg:col-span-7 bg-neutral-800/70 border border-neutral-700 rounded-2xl p-6 sm:p-8 space-y-6">
            {(() => {
              const currentStep =
                config.migrationPlaybook.steps.find(
                  (s) => s.step === activeStep
                ) || config.migrationPlaybook.steps[0];

              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-500/20 text-primary-300 text-xs font-bold">
                      <FileCheck className="w-4 h-4" />
                      Step {currentStep.step} of{" "}
                      {config.migrationPlaybook.steps.length}
                    </div>
                    <span className="text-xs text-neutral-400 font-medium">
                      Est. time: {currentStep.duration}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {currentStep.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {currentStep.description}
                  </p>

                  {/* Checklist of sub-actions */}
                  <div className="space-y-2.5 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                      Playbook Action Items:
                    </span>
                    {currentStep.details.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-neutral-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA or Next Button */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-700">
                    {currentStep.actionLabel && currentStep.actionHref ? (
                      <Link
                        href={currentStep.actionHref}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold text-xs sm:text-sm transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        {currentStep.actionLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/auth/sign-up?source=${config.slug}&template=education-cohort`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold text-xs sm:text-sm transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        Launch Education Workspace
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}

                    <div className="flex items-center gap-2">
                      {activeStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setActiveStep((prev) => prev - 1)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-700"
                        >
                          Previous
                        </button>
                      )}
                      {activeStep < config.migrationPlaybook.steps.length && (
                        <button
                          type="button"
                          onClick={() => setActiveStep((prev) => prev + 1)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-700 hover:bg-neutral-600"
                        >
                          Next Step
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
