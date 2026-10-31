"use client";

import { ArrowBtn, OutlineBtn } from "./Button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { PLAN_CTA } from "../../_lib/pricingData";
type PricingFeature = {
  text: string;
  enabled: boolean;
};

type PricingCardProps = {
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

export const CheckIcon = () => {
  return (
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
};

export const PricingCard = ({
  title,
  description,
  amount,
  periodLabel,
  footnote,
  features,
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
        "relative flex h-full w-full max-w-[350px] flex-col gap-5 rounded-2xl bg-white p-6 shadow-md sm:p-8",
        isPopular && "bg-[#f6f3ff] sm:scale-[1.01]"
      )}
    >
      {badgeText ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
          {badgeText}
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[90%] flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>

      <div className="flex flex-col gap-1 text-center">
        <h3 className="flex items-end justify-center gap-2">
          <span className="text-4xl font-bold text-neutral-900">{amount}</span>
          {periodLabel ? (
            <span className="text-sm text-neutral-700">{periodLabel}</span>
          ) : null}
        </h3>
        {footnote ? (
          <p className="text-sm text-neutral-600">{footnote}</p>
        ) : null}
      </div>

      {ctaVariant === "filled" ? (
        <ArrowBtn
          text={ctaText}
          href={isPlanCta ? undefined : ctaHref}
          linkToPlan={isPlanCta}
          className="w-full justify-center"
          hideArrow
        />
      ) : (
        <OutlineBtn
          text={ctaText}
          className="w-full"
          onClick={() => {
            if (ctaHref) router.push(ctaHref);
          }}
        />
      )}

      <div className="flex flex-1 flex-col gap-2 text-left">
        {features.map((feature) => (
          <p
            key={feature.text}
            className={cn(
              "flex items-center gap-2 text-sm",
              feature.enabled ? "text-neutral-600" : "text-neutral-400"
            )}
          >
            <CheckIcon />
            <span>{feature.text}</span>
          </p>
        ))}
      </div>
    </article>
  );
};
