"use client";

import { useState } from "react";
import { ArrowBtn, OutlineBtn } from "../ui/Button";
import { cn } from "~/lib/utils";

type SetupId = "bootcamp" | "class" | "community";

interface SetupOption {
  id: SetupId;
  label: string;
  description: string;
  features: Array<{ title: string; desc: string }>;
  productPage: { label: string; href: string };
}

/**
 * Existing, verified Zedu features only — no fabricated stats or testimonials.
 */
const SETUPS: SetupOption[] = [
  {
    id: "bootcamp",
    label: "Bootcamp or Cohort",
    description:
      "Run a time-bound program with cohorts, modules, and milestone tracking.",
    features: [
      {
        title: "Channels",
        desc: "Organize discussions by cohort, module, or week.",
      },
      {
        title: "Buzz",
        desc: "Instant voice sessions for live office hours and cohort check-ins.",
      },
      {
        title: "File Management",
        desc: "Store syllabi, assignments, and resources in one place.",
      },
    ],
    productPage: { label: "Explore Channels", href: "/products/channels" },
  },
  {
    id: "class",
    label: "Class or Institution",
    description:
      "Coordinate a school class or university course with structured communication.",
    features: [
      {
        title: "Channels",
        desc: "Threaded discussions by subject, class, or department.",
      },
      {
        title: "Buzz",
        desc: "Voice sessions for office hours and live Q&A.",
      },
      {
        title: "File Management",
        desc: "Share lectures, assignments, and readings securely.",
      },
    ],
    productPage: { label: "Explore Channels", href: "/products/channels" },
  },
  {
    id: "community",
    label: "Online Learning Community",
    description:
      "Grow a community of learners with ongoing discussions and shared resources.",
    features: [
      {
        title: "Channels",
        desc: "Topic-based discussions for community members.",
      },
      {
        title: "Buzz",
        desc: "Community voice events and live gatherings.",
      },
      {
        title: "File Management",
        desc: "Community resource library everyone can access.",
      },
    ],
    productPage: { label: "Explore Channels", href: "/products/channels" },
  },
];

export const ChooseSetupGuide = () => {
  const [selectedId, setSelectedId] = useState<SetupId | null>(null);

  const selected = selectedId ? SETUPS.find((s) => s.id === selectedId) : null;

  return (
    <section
      className="relative isolate flex w-full flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16 lg:gap-8 lg:px-12"
      aria-labelledby="choose-setup-heading"
    >
      <div className="flex flex-col gap-3 items-center max-w-3xl">
        <h2
          id="choose-setup-heading"
          className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl"
        >
          Choose Your Learning Setup
        </h2>
        <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base lg:max-w-[65%] lg:text-lg">
          Tell us how you run learning, and we&apos;ll show you which Zedu
          features fit best.
        </p>
      </div>

      {/* Three use-case selection chips (keyboard accessible via native <button>) */}
      <div
        className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center sm:gap-2 lg:gap-4"
        role="radiogroup"
        aria-label="Choose your learning setup"
      >
        {SETUPS.map((setup) => (
          <button
            key={setup.id}
            type="button"
            role="radio"
            aria-checked={selectedId === setup.id}
            onClick={() => setSelectedId(setup.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200",
              selectedId === setup.id
                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            {setup.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 w-full max-w-5xl" aria-live="polite">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            {/* Description + CTA column */}
            <div className="flex w-full flex-col gap-3 lg:w-2/5">
              <h3 className="text-xl font-bold text-neutral-900">
                {selected.label}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {selected.description}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <ArrowBtn
                  text={selected.productPage.label}
                  href={selected.productPage.href}
                  className="w-full sm:w-auto"
                />
                <OutlineBtn
                  text="Start for Free"
                  href="/auth/sign-up"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>

            {/* Feature cards grid */}
            <div className="w-full grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-3/5">
              {selected.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-neutral-200 bg-white p-4 text-left hover:border-primary-500/50 transition-colors"
                >
                  <h4 className="text-sm font-semibold text-neutral-900">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
