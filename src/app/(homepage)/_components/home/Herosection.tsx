"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ArrowBtn, OutlineBtn } from "../ui/Button";
import { useCelebration } from "./CelebrationThemeContext";
import { cn } from "~/lib/utils";
import {
  NigerianFlagIcon,
  EagleIcon,
  JollofRiceIcon,
  ChristmasTreeIcon,
  GiftBoxIcon,
  SnowflakeIcon,
  EasterEggIcon,
  ChampagneToastIcon,
} from "./CelebrationIcons";

interface Metric {
  text: string;
  /** The display value, e.g. "10,000+" or "98%" */
  amount: string;
  /** Numeric target to count up to */
  target: number;
  /** Suffix to append after the number, e.g. "+" or "%" */
  suffix: string;
  /** Whether the number should be formatted with commas */
  useCommas: boolean;
}

const metrics: Metric[] = [
  {
    text: "Learners supported",
    amount: "10,000+",
    target: 10000,
    suffix: "+",
    useCommas: true,
  },
  {
    text: "Conversations powered by AI",
    amount: "15,000+",
    target: 15000,
    suffix: "+",
    useCommas: true,
  },
  {
    text: "Educator satisfaction",
    amount: "98%",
    target: 98,
    suffix: "%",
    useCommas: false,
  },
];

const DURATION_MS = 2000;

function useCountUp(target: number, enabled: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled]);

  return count;
}

function MetricCard({
  metric,
  cardClass,
  icon,
}: {
  metric: Metric;
  cardClass?: string;
  icon?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const count = useCountUp(metric.target, hasTriggered);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const formatted = metric.useCommas
    ? count.toLocaleString("en-US")
    : count.toString();

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full max-w-[260px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 sm:px-4 sm:py-3 transition-all",
        cardClass
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="inline-flex items-center">{icon}</span>}
        <p
          className="text-lg font-bold text-neutral-900 sm:text-3xl"
          aria-label={metric.amount}
        >
          {formatted}
          {metric.suffix}
        </p>
      </div>
      <p className="text-[11px] font-medium leading-tight text-neutral-600 sm:text-sm">
        {metric.text}
      </p>
    </div>
  );
}

const HeroSection = () => {
  const { celebration } = useCelebration();

  const getMetricIcon = (index: number) => {
    if (!celebration) return null;
    switch (celebration.id) {
      case "independence": {
        const icons = [
          <NigerianFlagIcon key="flag" className="h-4 w-6 shadow-sm" />,
          <EagleIcon key="eagle" className="w-5 h-5 text-green-800" />,
          <JollofRiceIcon key="jollof" className="w-5 h-5" />,
        ];
        return icons[index];
      }
      case "christmas": {
        const icons = [
          <ChristmasTreeIcon key="tree" className="w-5 h-5" />,
          <GiftBoxIcon key="gift" className="w-5 h-5" />,
          <SnowflakeIcon key="snow" className="w-5 h-5 text-blue-500" />,
        ];
        return icons[index];
      }
      case "easter": {
        const icons = [
          <EasterEggIcon key="egg1" className="w-5 h-5" />,
          <EasterEggIcon key="egg2" className="w-5 h-5" />,
          <EasterEggIcon key="egg3" className="w-5 h-5" />,
        ];
        return icons[index];
      }
      case "newyear": {
        const icons = [
          <ChampagneToastIcon key="toast" className="w-5 h-5" />,
          <SnowflakeIcon key="star" className="w-5 h-5 text-amber-500" />,
          <ChampagneToastIcon key="toast2" className="w-5 h-5" />,
        ];
        return icons[index];
      }
      default:
        return null;
    }
  };

  return (
    <section className="relative isolate flex w-full flex-col items-center gap-5 overflow-hidden px-4 py-8 text-center sm:gap-6 sm:px-8 sm:py-14 lg:gap-8 lg:px-12">
      {/* Background celebration glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[45%] transition-all duration-500 ${
          celebration
            ? celebration.heroGlowClass
            : "bg-gradient-to-t from-blue-50/30 to-white"
        }`}
      />

      <h1 className="text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl text-center max-w-5xl">
        Built for Bootcamps and{" "}
        <span
          className={`transition-colors duration-300 ${
            celebration ? celebration.heroSpanClass : "text-primary-500"
          }`}
        >
          Learning
        </span>{" "}
        Communities
      </h1>

      <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[50%] lg:text-lg">
        {celebration
          ? `${celebration.description} Bring learners and educators together with organized channels, AI cohort assistants, and seamless collaboration.`
          : "Bring learners and educators together with organized conversations, seamless cohort collaboration, and affordable communication tools built for learning communities."}
      </p>

      {/* Hero CTA buttons */}
      <div className="flex w-full max-w-md flex-row items-center justify-center gap-2.5 sm:gap-4">
        <ArrowBtn
          text="Try for free"
          linkToHome
          loggedInText="Go to Dashboard"
          className={cn(
            "justify-center shadow-md",
            celebration && celebration.heroButtonClass
          )}
        />
        <OutlineBtn
          text="Contact sales"
          href="/contact-sales"
          className={cn(celebration && celebration.heroOutlineBtnClass)}
        />
      </div>

      <div className="flex w-full max-w-[90%] flex-col items-center justify-center gap-1 text-center text-xs text-neutral-500 sm:max-w-2xl sm:flex-row sm:gap-2 sm:text-sm">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5" aria-hidden="true">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star key={i} color="gold" fill="gold" size={16} />
              ))}
          </div>
          <span className="font-semibold text-neutral-700">4.9</span>
        </div>
        <span className="hidden sm:inline" aria-hidden="true">
          |
        </span>
        <p className="leading-relaxed sm:leading-normal">
          Trusted by most modern educators and learners worldwide
        </p>
      </div>

      {/* Metric Cards with festive SVG icons */}
      <div className="grid w-full max-w-4xl grid-cols-3 place-items-center gap-2 sm:gap-6 md:gap-8 pt-2">
        {metrics.map((metric, i) => (
          <MetricCard
            key={i}
            metric={metric}
            icon={getMetricIcon(i)}
            cardClass={celebration ? celebration.heroCardClass : ""}
          />
        ))}
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-neutral-200/80 shadow-lg">
        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9] lg:aspect-[2/1]">
          <Image
            src="/images/homepage/hero-img.png"
            alt="Preview of the learning communication interface"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1200px"
            className="object-contain object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
