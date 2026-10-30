"use client";

import { useState } from "react";
import { homeFAQs, type HomeFAQ } from "../../_lib/faqData";
import { Accordion } from "~/components/ui/accordion";
import { FAQAccordionItem } from "./faq/FAQAccordionItem";

type FAQSectionProps = {
  faqs?: HomeFAQ[];
};

export const FAQSection = ({ faqs = homeFAQs }: FAQSectionProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleToggle = (value: string) => {
    setOpenItem(value || null);
  };

  return (
    <section className="relative isolate flex w-full flex-col items-center gap-10 overflow-hidden px-4 py-12 text-center sm:gap-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <h1 className="text-center text-3xl font-bold leading-tight text-[#101828] sm:text-4xl lg:text-5xl">
          Got a Question?{" "}
          <span className="text-primary-500">We Have an Answer</span>
        </h1>
        <p className="text-base text-[#475467] sm:text-lg">
          Need clarity? We have clear, practical answers to help you move
          forward with confidence.
        </p>
      </div>
      <div className="w-full max-w-5xl text-left">
        <Accordion
          type="single"
          collapsible
          value={openItem || ""}
          onValueChange={handleToggle}
          className="space-y-4"
        >
          {faqs.map((faq) => (
            <FAQAccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openItem === faq.id}
            />
          ))}
        </Accordion>
      </div>
    </section>
  );
};
