import { useState } from "react";
import { Link, Minus, Plus } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { HomeFAQ } from "../../../_lib/faqData";

type FAQAccordionItemProps = {
  faq: HomeFAQ;
  isOpen: boolean;
  answerFragment?: string;
};

export const FAQAccordionItem = ({
  faq,
  isOpen,
  answerFragment,
}: FAQAccordionItemProps) => {
  const [copyStatus, setCopyStatus] = useState({
    message: "",
    attempt: 0,
  });

  const copyAnswerLink = async () => {
    if (!answerFragment) return;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      const url = new URL(window.location.href);
      url.hash = answerFragment;

      await navigator.clipboard.writeText(url.toString());

      setCopyStatus(({ attempt }) => ({
        message: "Answer link copied to clipboard.",
        attempt: attempt + 1,
      }));
    } catch {
      setCopyStatus(({ attempt }) => ({
        message: "Could not copy the answer link. Please try again.",
        attempt: attempt + 1,
      }));
    }
  };

  return (
    <AccordionItem
      id={answerFragment}
      value={faq.id}
      className="scroll-mt-28 overflow-hidden rounded-xl border border-[#E5E8FF] bg-white shadow-sm"
    >
      <AccordionTrigger
        className={cn(
          "items-center px-6 py-5 text-lg font-semibold text-[#101828] hover:no-underline sm:px-8 sm:py-6 sm:text-xl",
          isOpen && "bg-primary-50"
        )}
      >
        {faq.question}
        <span className="ml-4 shrink-0 text-primary-500">
          {isOpen ? (
            <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </span>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-6 pt-2 text-base leading-relaxed text-[#475467] sm:px-8 sm:pb-8 sm:pt-3 sm:text-lg">
        {faq.answer}

        {answerFragment && (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={copyAnswerLink}
            aria-label={`Copy link to answer: ${faq.question}`}
            className="mt-3 h-auto px-0 py-0 text-primary-500 hover:text-primary-400"
          >
            <Link aria-hidden="true" className="h-4 w-4" />
            <span className="ml-2">Copy link to this answer</span>
          </Button>
        )}
      </AccordionContent>

      {answerFragment && (
        <span
          key={copyStatus.attempt}
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {copyStatus.message}
        </span>
      )}
    </AccordionItem>
  );
};
