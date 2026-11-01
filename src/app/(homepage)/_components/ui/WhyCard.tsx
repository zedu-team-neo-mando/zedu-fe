import { PurpleVerifiedBadge } from "../svgs";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import React from "react";

type WhyCardProps = {
  title: string;
  desc: string;
  showBadge?: boolean;
  showArrow?: boolean;
  className?: string;
  cta?: React.ReactNode;
  /** Solution pages nest these cards under an h2, so their titles need to be h3. */
  headingLevel?: "h2" | "h3";
};

export const WhyCard = ({
  title,
  desc,
  showBadge = true,
  showArrow = false,
  className = "",
  cta,
  headingLevel = "h2",
}: WhyCardProps) => {
  const Heading = headingLevel;

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-5 rounded-xl bg-neutral-100 p-6",
        className
      )}
    >
      <Heading className="text-xl font-bold text-neutral-900 text-left flex w-full gap-2 items-center justify-between">
        {title}
        {showBadge ? <PurpleVerifiedBadge /> : <div className="size-10" />}
      </Heading>
      <p className="text-left   text-neutral-600">{desc}</p>

      {cta}

      {showArrow && (
        <div className="py-2">
          <ArrowRight strokeWidth={2} height={20} width={24} />
        </div>
      )}
    </div>
  );
};
