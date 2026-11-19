"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqs = [
  {
    question: "How does the Zedu referral program work?",
    answer:
      "When someone registers using your unique referral link (?ref=your-handle), they are linked to your advocate account. Both you and the invitee automatically receive onboarding points, and confirmed sign-ups count directly toward your milestone tier perks.",
  },
  {
    question: "What rewards do I earn per referral?",
    answer:
      "You earn 100 points as soon as an invited member creates their account. When they become an active participant in channels or Buzz calls, you earn an additional 150 points. At 3, 5, 10, and 25 referrals, you unlock milestone tier bonuses including up to 5,000 bonus points, exclusive profile badges, custom workspace themes, and VIP status.",
  },
  {
    question: "Where can I share my referral link?",
    answer:
      "You can share your link anywhere! Use the quick social share buttons for X (Twitter), LinkedIn, Telegram, and WhatsApp, embed your QR code in presentation slides, or share via direct messages and cohort emails.",
  },
  {
    question:
      "How does the onboarding bonus work for someone who clicks my link?",
    answer:
      "When a new user visits Zedu through your link, they are greeted by an onboarding welcome banner explaining the community. When they finish sign-up, they receive an initial advocate welcome bonus of 100 starter points to kick off their workspace experience.",
  },
  {
    question: "Can I customize my referral link handle?",
    answer:
      "Yes! On your referral dashboard, click the edit icon next to your referral handle to set a custom alias (e.g., your name, school, or community nickname).",
  },
];

export const ReferralFAQ: React.FC = () => {
  return (
    <section aria-labelledby="referral-faq-heading" className="w-full">
      <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2
            id="referral-faq-heading"
            className="text-lg font-bold text-neutral-900 sm:text-xl"
          >
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-4 w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm font-semibold text-neutral-800 hover:text-primary-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
