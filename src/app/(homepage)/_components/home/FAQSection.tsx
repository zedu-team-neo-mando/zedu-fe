"use client";

import { useEffect, useState } from "react";
import { homeFAQs, type HomeFAQ } from "../../_lib/faqData";
import { Accordion } from "~/components/ui/accordion";
import { FAQAccordionItem } from "./faq/FAQAccordionItem";

type FAQSectionProps = {
  faqs?: HomeFAQ[];
  title?: React.ReactNode;
  subtitle?: string;
  answerFragments?: Record<string, string>;
  headingLevel?: "h1" | "h2";
};

export const FAQSection = ({
  faqs = homeFAQs,
  title,
  subtitle = "Need clarity? We have clear, practical answers to help you move forward with confidence.",
  answerFragments,
  headingLevel = "h2",
}: FAQSectionProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const Heading = headingLevel;

  useEffect(() => {
    if (!answerFragments) return;

    let scrollFrame: number | undefined;

    const openLinkedAnswer = () => {
      if (scrollFrame !== undefined) {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = undefined;
      }

      let fragment: string;

      try {
        fragment = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }

      const faq = faqs.find(
        (item) => answerFragments[item.id] === fragment && fragment !== ""
      );

      if (!faq) return;

      setOpenItem(faq.id);

      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = requestAnimationFrame(() => {
          document.getElementById(fragment)?.scrollIntoView({
            behavior: "auto",
            block: "start",
          });
        });
      });
    };

    openLinkedAnswer();
    window.addEventListener("hashchange", openLinkedAnswer);

    return () => {
      window.removeEventListener("hashchange", openLinkedAnswer);

      if (scrollFrame !== undefined) {
        cancelAnimationFrame(scrollFrame);
      }
    };
  }, [answerFragments, faqs]);

  const handleToggle = (value: string) => {
    setOpenItem(value || null);
  };

  return (
    <section className="relative isolate flex w-full flex-col items-center gap-10 overflow-hidden px-4 py-12 text-center sm:gap-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <Heading className="text-center text-3xl font-bold leading-tight text-[#101828] sm:text-4xl lg:text-5xl">
          {title ?? (
            <>
              Got a Question?{" "}
              <span className="text-primary-500">We Have an Answer</span>
            </>
          )}
        </Heading>
        <p className="text-base text-[#475467] sm:text-lg">{subtitle}</p>
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
              answerFragment={answerFragments?.[faq.id]}
            />
          ))}
        </Accordion>
      </div>
    </section>
  );
};
