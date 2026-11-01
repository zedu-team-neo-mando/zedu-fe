import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Public config: read straight from the environment (kept out of `~/lib/env-urls`).
const formUrl = (process.env.NEXT_PUBLIC_AMBASSADOR_FORM_URL ?? "").trim();

const buttonClass =
  "h-auto min-h-[46px] rounded-full bg-primary-500 px-4 py-2.5 text-base font-medium text-white duration-200 hover:bg-primary-400 sm:min-h-[50px] sm:px-6 sm:py-3";

export const ApplyButton = ({ className }: { className?: string }) => {
  if (!formUrl) {
    return (
      <Button
        disabled
        className={cn(
          buttonClass,
          "disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100",
          className
        )}
      >
        Applications open soon
      </Button>
    );
  }

  return (
    <Button asChild className={cn(buttonClass, "gap-3", className)}>
      <a href={formUrl} target="_blank" rel="noopener noreferrer">
        Apply to be an ambassador
        <span
          aria-hidden="true"
          className="flex size-[26px] items-center justify-center rounded-full bg-white text-primary-500"
        >
          <ArrowRight size={16} />
        </span>
      </a>
    </Button>
  );
};
