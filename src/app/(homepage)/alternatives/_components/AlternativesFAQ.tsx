"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import type { CompetitorPageConfig } from "../_lib/competitorData";

type FAQProps = {
  config: CompetitorPageConfig;
};

export const AlternativesFAQ: React.FC<FAQProps> = ({ config }) => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs sm:text-sm font-semibold mb-3">
          <HelpCircle className="w-4 h-4 text-neutral-500" />
          Frequently Asked Questions
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Common Questions About Switching from {config.name}
        </h2>
        <p className="mt-2 text-neutral-600 text-sm sm:text-base">
          Everything you need to know about pricing, message history, migration,
          and student onboarding.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {config.faqs.map((faq, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-${idx}`}
            className="border border-neutral-200 rounded-xl px-5 py-1 bg-white shadow-sm data-[state=open]:border-primary-300"
          >
            <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-neutral-900 hover:text-primary-600 hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-neutral-600 leading-relaxed pb-4 pt-1">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
