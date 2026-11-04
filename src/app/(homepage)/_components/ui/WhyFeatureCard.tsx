import { Sparkles } from "lucide-react";
import { cn } from "~/lib/utils";

type WhyFeatureCardProps = {
  title: string;
  desc: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  className?: string;
  cta?: React.ReactNode;
};

export const WhyFeatureCard = ({
  title,
  desc,
  icon: Icon = Sparkles,
  className = "",
  cta,
}: WhyFeatureCardProps) => {
  return (
    <article
      className={cn(
        "flex flex-col items-start rounded-2xl border border-primary-100 bg-white px-6 pb-8 pt-7 text-left sm:px-8 sm:pb-10 sm:pt-9",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary-500 text-white sm:mb-7 sm:size-[52px]"
      >
        <Icon className="size-6" strokeWidth={2} />
      </span>
      <h2 className="mb-3 text-xl font-bold leading-snug text-blue-500">
        {title}
      </h2>
      <p className="leading-relaxed text-neutral-600">{desc}</p>
      {cta}
    </article>
  );
};
