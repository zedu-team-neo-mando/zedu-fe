import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";
import { ApplyButton } from "~/app/(homepage)/_components/ambassadors/apply-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const title = "Zedu Ambassadors | Bring Zedu to Your Campus or Community";
const description =
  "Help bring Zedu to your school, bootcamp or community. Apply to become a Zedu ambassador and introduce your group to a better way to communicate.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl("/ambassadors"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu Ambassadors page preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/ambassadors"),
  },
};

const ambassadorTasks = [
  {
    title: "Introduce Zedu",
    desc: "Tell your class, cohort or community what Zedu is and how it can help them communicate.",
  },
  {
    title: "Help your group get set up",
    desc: "Guide your group through creating a workspace and finding their way around.",
  },
  {
    title: "Share feedback",
    desc: "Pass on what your group likes and what could be better to the Zedu team.",
  },
];

const steps = [
  {
    title: "Apply",
    desc: "Fill in the short application form. It only takes a few minutes.",
  },
  {
    title: "We review",
    desc: "The Zedu team reads through your application.",
  },
  {
    title: "We get in touch",
    desc: "We contact you with the next steps.",
  },
];

const applicants = [
  "Students who want to bring Zedu to their class or campus.",
  "Teachers who want a better way to talk with their students.",
  "Bootcamp leaders who run a cohort or programme.",
  "Community leaders who look after an active group.",
];

const faqs = [
  {
    question: "Does it cost anything to become an ambassador?",
    answer: "No. Applying and being an ambassador is free.",
  },
  {
    question: "How much time does it take?",
    answer:
      "It is up to you. You decide how much time you can give to introducing Zedu to your group.",
  },
  {
    question: "How are applications reviewed?",
    answer:
      "The Zedu team reads each application and contacts the people it would like to work with.",
  },
  {
    question: "Do I need to belong to a school or community?",
    answer:
      "Ambassadors introduce Zedu to a group they are part of, such as a class, bootcamp or community.",
  },
];

const sectionClass =
  "relative isolate space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16";
const headingClass =
  "text-center text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]";
const outlineLinkClass =
  "rounded-full border border-primary-500 px-4 py-2.5 font-medium text-blue-100 transition-colors duration-100 ease-in hover:bg-primary-500 hover:text-white sm:px-6 sm:py-3";
const subheadingClass =
  "max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg";

const AmbassadorsPage = () => {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[30%] w-screen -translate-x-1/2 bg-gradient-to-t from-blue-50/30 to-white"
        />
        <div className="relative mx-auto grid min-h-[85dvh] w-full max-w-7xl items-center gap-10 rounded-[28px] px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 lg:px-12 lg:py-14">
          <div className="flex flex-col items-center gap-5 text-center lg:max-w-[470px] lg:items-start lg:text-left">
            <h1 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
              <span className="text-primary-500">Bring Zedu </span>to Your
              Campus or Community
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
              Help your class, bootcamp or community discover a better way to
              communicate, as a Zedu ambassador.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ApplyButton />
              <Link href="#how-it-works" className={outlineLinkClass}>
                How it works
              </Link>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/11] w-full sm:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src="/images/homepage/solutions/schools-hero.jpg"
                alt="Students seated together while collaborating in a Zedu workspace"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} mt-5 overflow-hidden`}>
        <h2 className={headingClass}>What Ambassadors Do</h2>
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ambassadorTasks.map((task) => (
            <WhyCard
              key={task.title}
              title={task.title}
              desc={task.desc}
              showBadge
              showArrow
              className="h-full"
            />
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className={`${sectionClass} scroll-mt-20 overflow-hidden`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className={headingClass}>How It Works</h2>
          <p className={subheadingClass}>
            Three simple steps from applying to starting out with your group.
          </p>
          <ApplyButton />
        </div>
        <ol className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col items-center gap-4 rounded-2xl bg-[#F9F7FD] px-6 py-8 text-center"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-500 font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-[#1f2530] sm:text-xl">
                {step.title}
              </h3>
              <p className="mx-auto max-w-[34ch] text-sm leading-relaxed text-neutral-600 sm:text-base">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="who-can-apply"
        className={`${sectionClass} scroll-mt-20 overflow-hidden`}
      >
        <h2 className={headingClass}>Who Can Apply</h2>
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid w-full grid-cols-1 gap-4 overflow-hidden rounded-3xl bg-primary-500 p-3 sm:px-6 sm:py-4 md:grid-cols-2 md:gap-0">
            <div className="space-y-3 px-6 py-8 text-white">
              <h3 className="text-lg font-semibold">
                Anyone who leads or belongs to a group
              </h3>
              <ul className="ml-2 space-y-3">
                {applicants.map((applicant) => (
                  <li key={applicant} className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{applicant}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 rounded-3xl border border-neutral-200 bg-white px-6 py-8">
              <h3 className="text-lg font-semibold text-[#1f2530]">
                Common questions
              </h3>
              <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="text-sm text-neutral-900">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-neutral-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="pt-4">
                <ApplyButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-5 bg-blue-50/30 px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
          Ready to Bring Zedu to Your Group?
        </h2>
        <p className="max-w-2xl text-base text-neutral-600">
          Tell us about your class, bootcamp or community and we will get in
          touch.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-2">
          <ApplyButton />
          <Link href="/policy" className={outlineLinkClass}>
            Read our Privacy Policy
          </Link>
        </div>
      </section>
    </>
  );
};

export default AmbassadorsPage;
