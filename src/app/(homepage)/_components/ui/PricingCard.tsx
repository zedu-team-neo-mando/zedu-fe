"use client";

import { ArrowBtn, OutlineBtn } from "./Button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { PLAN_CTA } from "../../_lib/pricingData";

export type PricingFeature = {
  text: string;
  enabled: boolean;
};

export type PricingCardProps = {
  title: string;
  description: string;
  amount: string;
  periodLabel?: string;
  footnote?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaHref?: string;
  ctaVariant: "outline" | "filled";
  variant: "starter" | "popular" | "enterprise";
  badgeText?: string;
};

export const CheckIcon = () => (
  <svg
    width="13"
    height="9"
    viewBox="0 0 13 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12.354 0.854028L4.35403 8.85403C4.30759 8.90052 4.25245 8.9374 4.19175 8.96256C4.13105 8.98772 4.06599 9.00067 4.00028 9.00067C3.93457 9.00067 3.86951 8.98772 3.80881 8.96256C3.74811 8.9374 3.69296 8.90052 3.64653 8.85403L0.146528 5.35403C0.0527077 5.26021 0 5.13296 0 5.00028C0 4.8676 0.0527077 4.74035 0.146528 4.64653C0.240348 4.55271 0.367596 4.5 0.500278 4.5C0.63296 4.5 0.760208 4.55271 0.854028 4.64653L4.00028 7.7934L11.6465 0.146528C11.7403 0.0527074 11.8676 -9.88557e-10 12.0003 0C12.133 9.88558e-10 12.2602 0.0527074 12.354 0.146528C12.4478 0.240348 12.5006 0.367596 12.5006 0.500278C12.5006 0.63296 12.4478 0.760208 12.354 0.854028Z"
      fill="#7141F8"
    />
  </svg>
);

export const PricingCard = ({
  title,
  description,
  amount,
  periodLabel,
  footnote,
  features = [],
  ctaText,
  ctaHref,
  ctaVariant,
  variant,
  badgeText,
}: PricingCardProps) => {
  const isPopular = variant === "popular";
  const isPlanCta = ctaHref === PLAN_CTA;
  const router = useRouter();

  return (
    <article
      className={cn(
        "relative flex h-full w-full max-w-[360px] flex-col justify-between rounded-2xl border p-6 transition-all duration-200 sm:p-8",
        isPopular
          ? "border-purple-300 bg-white shadow-xl ring-2 ring-purple-500/20 lg:-translate-y-2"
          : "border-neutral-200 bg-white shadow-sm hover:shadow-md"
      )}
    >
      {badgeText ? (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3.5 py-1 text-xs font-semibold tracking-wide text-white shadow-sm">
          {badgeText}
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        {/* Title & Description */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
          <p className="min-h-[40px] text-sm text-neutral-500">{description}</p>
        </div>

        {/* Amount & Period */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
              {amount}
            </span>
            {periodLabel ? (
              <span className="text-sm font-medium text-neutral-500">
                {periodLabel}
              </span>
            ) : null}
          </div>
          {footnote ? (
            <p className="text-xs font-medium text-neutral-600">{footnote}</p>
          ) : (
            <div className="h-4" aria-hidden="true" />
          )}
        </div>

        {/* CTA Button */}
        <div>
          {ctaVariant === "filled" ? (
            <ArrowBtn
              text={ctaText}
              href={isPlanCta ? undefined : ctaHref}
              linkToPlan={isPlanCta}
              className="w-full justify-center py-2.5 shadow-sm"
              hideArrow
            />
          ) : (
            <OutlineBtn
              text={ctaText}
              className="w-full py-2.5"
              onClick={() => {
                if (ctaHref) router.push(ctaHref);
              }}
            />
          )}
        </div>

        <div className="border-t border-neutral-100" />

        {/* Features List */}
        <div className="flex flex-col gap-3 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Included features
          </span>
          {features.map((feature) => (
            <div
              key={feature.text}
              className={cn(
                "flex items-start gap-2.5 text-sm",
                feature.enabled ? "text-neutral-700" : "text-neutral-400"
              )}
            >
              <span className="mt-1 shrink-0">
                {feature.enabled ? (
                  <CheckIcon />
                ) : (
                  <span className="inline-block h-2 w-2 rounded-full bg-neutral-300" />
                )}
              </span>
              <span
                className={cn(!feature.enabled && "line-through opacity-70")}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
