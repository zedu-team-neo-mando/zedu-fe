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
};

export const WhyCard = ({
  title,
  desc,
  showBadge = true,
  showArrow = false,
  className = "",
  cta,
}: WhyCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-5 rounded-xl bg-neutral-100 p-6",
        className
      )}
    >
      <h2 className="text-xl font-bold text-neutral-900 text-left flex w-full gap-2 items-center justify-between">
        {title}
        {showBadge ? <PurpleVerifiedBadge /> : <div className="size-10" />}
      </h2>
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
