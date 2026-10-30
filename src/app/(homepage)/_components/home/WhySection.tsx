"use client";

import { WhyFeatureCard } from "../ui/WhyFeatureCard";
import { WhyCard } from "../ui/WhyCard";
import { ArrowBtn } from "../ui/Button";
import { otherReasons, whyCardsData } from "../../_lib";
import Image from "next/image";
import { ArrowRight, GraduationCap, Users } from "lucide-react";

const whyCardIcons = [GraduationCap, Users];

export const WhySection = () => {
  return (
    <>
      <section className="relative isolate flex w-full flex-col items-center gap-8 overflow-hidden bg-primary-50 px-4 py-12 text-center sm:gap-10 sm:px-8 sm:py-16 lg:gap-12 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-3 items-center">
          <h1 className=" text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl text-center">
            Why Educators Choose Zedu
          </h1>
          <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[85%] lg:max-w-[65%] lg:text-lg">
            Built specifically for structured learning environments — not
            corporate teams or casual group chats.
          </p>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {whyCardsData.map((card, index) => (
            <WhyFeatureCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              icon={whyCardIcons[index]}
              cta={
                card.title === "No Per-Seat Fees" ? (
                  <button
                    type="button"
                    onClick={(e) =>
                      window.dispatchEvent(
                        new CustomEvent("open-zedu-calculator", {
                          detail: e.currentTarget,
                        })
                      )
                    }
                    className="group mt-1 inline-flex items-center gap-1.5 rounded-full border border-primary-500 bg-transparent px-4 py-1.5 text-sm font-semibold text-primary-500 transition-colors duration-150 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    Calculate Your Savings
                    <ArrowRight
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                      size={15}
                      strokeWidth={2.5}
                    />
                  </button>
                ) : undefined
              }
            />
          ))}
        </div>
      </section>

      <section className="relative isolate flex w-full flex-col items-center gap-6 overflow-hidden bg-gradient-to-r from-white to-blue-50/30 px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16   lg:gap-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src={"/images/homepage/svg-bg.png"}
            alt="A wavy decorative background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-top"
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl space-y-10 px-4 py-6 sm:space-y-12  sm:px-8 sm:py-8 lg:space-y-16 lg:px-10 lg:py-10">
          <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-2xl flex-col gap-3 text-left md:w-7/12">
              <h2 className="max-w-xl text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                Built For Secure, Structured Learning
              </h2>
            </div>
            <div className="mt-1">
              <ArrowBtn text="Get started for free" linkToHome />
            </div>
          </div>

          <div className="grid w-full max-w-7xl grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherReasons.map((card, index) => (
              <WhyCard
                key={index}
                title={card.title}
                desc={card.desc}
                className="bg-white"
                showBadge={false}
                showArrow
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
