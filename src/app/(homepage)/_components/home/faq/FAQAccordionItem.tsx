import { Minus, Plus } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { cn } from "~/lib/utils";
import type { HomeFAQ } from "../../../_lib/faqData";

type FAQAccordionItemProps = {
  faq: HomeFAQ;
  isOpen: boolean;
};

export const FAQAccordionItem = ({ faq, isOpen }: FAQAccordionItemProps) => {
  return (
    <AccordionItem
      value={faq.id}
      className="overflow-hidden rounded-xl border border-[#E5E8FF] bg-white shadow-sm"
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
      </AccordionContent>
    </AccordionItem>
  );
};
