"use client";

import { ArrowBtn, OutlineBtn } from "../ui/Button";
import { useCelebration } from "../home/CelebrationThemeContext";
import { CelebrationThemeIcon } from "../home/CelebrationBanner";
import { cn } from "~/lib/utils";

export const DynamicFooter = ({
  text,
  description,
  backgroundClassName = "bg-blue-50/30",
}: {
  text: string;
  description: string;
  backgroundClassName?: string;
}) => {
  const { celebration } = useCelebration();

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16 transition-colors",
        celebration ? celebration.footerBgClass : backgroundClassName
      )}
    >
      {celebration && (
        <span className="inline-flex items-center justify-center p-2 rounded-full bg-white/60 shadow-sm border border-neutral-100">
          <CelebrationThemeIcon id={celebration.id} className="w-8 h-8" />
        </span>
      )}
      <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
        {celebration ? celebration.footerHeadline : text}
      </h2>
      <p className="max-w-2xl text-base text-neutral-600">
        {celebration ? celebration.footerDescription : description}
      </p>
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-2">
        <ArrowBtn
          text="Get started for free"
          className={cn(
            "w-full sm:w-auto shadow-md",
            celebration && celebration.footerBtnClass
          )}
          linkToHome
        />
        <OutlineBtn
          text="Contact Sales"
          className={cn(
            "w-full sm:w-auto",
            celebration && celebration.heroOutlineBtnClass
          )}
          href="/contact-sales"
        />
      </div>
    </div>
  );
};
