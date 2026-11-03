"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  learningSetups,
  type LearningSetupId,
} from "../../_lib/learningSetupGuideData";
import { ArrowBtn, OutlineBtn } from "../ui/Button";

export const LearningSetupGuide = () => {
  const [selectedId, setSelectedId] = useState<LearningSetupId | null>(null);
  const selected =
    learningSetups.find((setup) => setup.id === selectedId) ?? null;

  return (
    <section className="relative isolate flex w-full flex-col items-center gap-6 overflow-hidden bg-blue-50/30 px-4 py-12 sm:gap-6 sm:px-8 sm:py-16 lg:gap-8 lg:px-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
          Choose Your <span className="text-primary-500">Learning Setup</span>
        </h2>
        <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[85%] lg:max-w-[65%] lg:text-lg">
          Tell us how you run your learning and we&apos;ll point you to the Zedu
          features that fit. Switch anytime to explore other setups.
        </p>
      </div>

      <fieldset className="w-full max-w-6xl">
        <legend className="sr-only">Choose your learning setup</legend>
        <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-5">
          {learningSetups.map((setup) => {
            const isSelected = selectedId === setup.id;
            const SetupIcon = setup.icon;

            return (
              <label key={setup.id} className="block h-full cursor-pointer">
                <input
                  type="radio"
                  name="learning-setup"
                  value={setup.id}
                  checked={isSelected}
                  onChange={() => setSelectedId(setup.id)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex h-full flex-col gap-2 rounded-2xl border bg-white p-4 transition-colors sm:p-5",
                    "border-neutral-200 hover:border-primary-300",
                    "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2",
                    isSelected &&
                      "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      <SetupIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        isSelected ? "border-primary-500" : "border-neutral-300"
                      )}
                    >
                      {isSelected && (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                      )}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-neutral-900 sm:text-base">
                    {setup.label}
                  </span>
                  <span className="text-xs text-neutral-600 sm:text-sm">
                    {setup.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="w-full max-w-6xl">
        <p className="sr-only" role="status">
          {selected
            ? `Showing recommendations for ${selected.label}.`
            : "No learning setup selected yet."}
        </p>

        <div
          className={cn(
            "rounded-2xl bg-white p-4 sm:p-6",
            selected
              ? "border border-neutral-200"
              : "border border-dashed border-neutral-300"
          )}
        >
          {selected ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                Recommended for {selected.label.toLowerCase()}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {selected.features.map((feature) => {
                  const FeatureIcon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex h-full flex-col rounded-2xl bg-[#f6f4fc] p-4 sm:p-5"
                    >
                      <FeatureIcon
                        className="h-6 w-6 text-primary-500"
                        aria-hidden="true"
                      />
                      <h3 className="mt-3 text-sm font-semibold text-neutral-900 sm:text-base">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-neutral-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <OutlineBtn
                  text={selected.productLink.label}
                  href={selected.productLink.href}
                />
                <ArrowBtn text="Get started for free" linkToHome />
              </div>
            </>
          ) : (
            <p className="p-2 text-center text-sm text-neutral-600 sm:p-4 sm:text-base">
              Select your learning setup above to see the Zedu features that
              match how you run it.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
