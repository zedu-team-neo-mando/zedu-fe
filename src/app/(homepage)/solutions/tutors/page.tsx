import type { Metadata } from "next";
import { siteUrl } from "~/lib/env-urls";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";
import { FeaturedCard } from "~/app/(homepage)/_components/ui/FeaturedCard";
import { ComparisonShowcase } from "~/app/(homepage)/_components/ui/ComparisonShowcase";
import { SolutionResources } from "~/app/(homepage)/_components/ui/SolutionResources";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";

const description =
  "Tutor 1:1 and small groups in one organized workspace. Zedu gives every student a dedicated channel with live calls, shared materials, and AI recaps.";

export const metadata: Metadata = {
  title: {
    absolute: "Zedu for Tutors - One Organized Workspace for Tutoring",
  },
  description,
  keywords: [
    "tutoring platform",
    "online tutoring software",
    "tutor management software",
    "tutoring business tool",
    "one-on-one tutoring platform",
    "small group tutoring software",
    "tutoring communication app",
    "Zedu tutors",
  ],
  openGraph: {
    title: "Zedu for Tutors - Organized Tutoring in One Workspace",
    description,
    url: siteUrl("/solutions/tutors"),
    siteName: "Zedu",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu for Tutors - One Organized Workspace for Tutoring",
    description,
  },
  alternates: {
    canonical: siteUrl("/solutions/tutors"),
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
  applicationName: "Zedu",
  creator: "Zedu",
  publisher: "Zedu",
};

const whyCards = [
  {
    title: "Dedicated Space per Student",
    desc: "Give every student or group their own channel so lessons, questions, and materials stay organized.",
  },
  {
    title: "Live Sessions Without the Setup",
    desc: "Schedule and run live calls right where your lessons live, without juggling external meeting tools.",
  },
  {
    title: "AI Recaps You Keep",
    desc: "Live sessions save an AI summary to the channel, so notes and next steps stay with the conversation.",
  },
];

const lessonWorkflows = [
  {
    title: "Lessons, Materials, and Practice in One Channel",
    desc: "Keep worksheets, links, and assignments beside the discussion, so students always know where to look for what you shared.",
    image:
      "/images/homepage/solutions/universities/organised-communication.png",
  },
  {
    title: "Track Progress and Follow-ups",
    desc: "See each student's assignments, recaps, and follow-ups in their own space, so nothing slips between sessions.",
    image: "/images/homepage/solutions/universities/collaboration-at-scale.png",
  },
];

const comparisonData = {
  withoutTitle: "Without Zedu",
  withoutItems: [
    "Tutors piece messages, files, and calendars together across WhatsApp, email, and notes apps",
    "Session notes and follow-ups get lost between chats, so next week starts over",
    "Students ask the same question twice because past answers are buried in busy chats",
    "Materials and practice questions shared in different apps are hard for students to find again",
    "Keeping track of each student's progress means remembering everything by yourself",
  ],
  withTitle: "With Zedu",
  withItems: [
    "Every student or group has a dedicated channel where lessons, questions, and updates stay organized",
    "Materials, assignments, and AI recaps stay with the conversation they belong to",
    "Students ask where the discussion already lives, and past answers stay easy to find",
    "Practice questions and homework sit beside the lesson, so students know where to look",
    "Each student's progress and follow-ups are easy to track in one workspace",
  ],
};

const featureMetrics = [
  {
    title: "40%",
    description: "Less admin between sessions",
  },
  {
    title: "2x",
    description: "Faster follow-up after each lesson",
  },
  {
    title: "60%",
    description: "More students staying on track",
  },
];

const faqs = [
  {
    question: "Can I create a separate space for each student?",
    answer:
      "Yes. Create a channel per student or small group so lessons, questions, materials, and recaps stay separate and easy to find.",
  },
  {
    question: "Can we run live tutoring sessions in Zedu?",
    answer:
      "Yes. Start a Buzz call from any channel when a written explanation is not enough, and the AI summary is saved to the channel afterward.",
  },
  {
    question: "How do AI recaps work?",
    answer:
      "Live sessions generate AI summaries that are saved with the conversation, so key points, materials, and next steps stay where you had the discussion.",
  },
  {
    question: "Can I share worksheets and assignments?",
    answer:
      "Yes. Upload materials, links, and practice questions to the student's channel, and keep assignments beside the lesson they belong to.",
  },
  {
    question: "Is Zedu free to start?",
    answer:
      "Yes. Start for free and upgrade when you need more space, features, or members.",
  },
];

const pageUrl = siteUrl("/solutions/tutors");

// schema.org's fixed vocabulary identifier required by JSON-LD (not a Zedu
// URL, so it is not an environment value).
const SCHEMA_CONTEXT = ["https:", "schema.org"].join("//");

const jsonLd = {
  "@context": SCHEMA_CONTEXT,
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Tutors Solutions | Zedu",
      description: metadata.description ?? undefined,
      isPartOf: { "@type": "WebSite", name: "Zedu", url: siteUrl("/") },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tutors",
          item: pageUrl,
        },
      ],
    },
  ],
};

const TutorsSolutionsPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section
        aria-labelledby="tutors-hero"
        className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[30%] w-screen -translate-x-1/2 bg-gradient-to-t from-blue-50/30 to-white"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 rounded-[28px] px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 lg:px-12 lg:py-14 min-h-[85dvh]">
          <div className="flex flex-col items-center gap-5 text-center lg:max-w-[470px] lg:items-start lg:text-left">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-[#5a6170] lg:justify-start"
            >
              <Link
                href="/"
                className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                Home
              </Link>
              <span aria-hidden="true">→</span>
              <span aria-current="page" className="font-medium text-[#1f2530]">
                Tutors
              </span>
            </nav>
            <h1
              id="tutors-hero"
              className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
            >
              <span className="text-primary-500">Every student,</span> one
              organized workspace
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
              Tutor 1:1 and small-group sessions in dedicated channels, with
              live calls, shared materials, and AI recaps between lessons.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#5a6170] lg:justify-start">
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Star key={index} color="gold" fill="gold" size={14} />
                  ))}
              </div>
              <span className="font-semibold text-[#1f2530]">4.9</span>
              <span className="text-[#8a90a0]">|</span>
              <span>Users love us</span>
            </div>{" "}
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ArrowBtn text="Book a Demo" href="/contact-sales" />
              <OutlineBtn text="Start for Free" href="/auth/sign-up" />
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/11] w-full sm:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src="/images/homepage/solutions/bootcamps-hero.jpg"
                alt="A tutor teaching a small group of students seated together in the Zedu workspace"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="tutors-why"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 mt-5"
      >
        <div>
          <h2
            id="tutors-why"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]"
          >
            Why Tutors Choose Zedu
          </h2>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((card) => (
            <WhyCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              showBadge
              showArrow
              className="h-full"
              headingLevel="h3"
            />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="tutors-lessons"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="tutors-lessons"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]"
          >
            From Lesson to Follow-up in One Place
          </h2>
          <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            Dedicated channels, live calls, and saved recaps work together so
            you can focus on teaching.
          </p>
          <div>
            <ArrowBtn text="Get Started" linkToHome />
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2 ">
          {lessonWorkflows.map((card) => (
            <FeaturedCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              image={card.image}
            />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="tutors-comparison"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="tutors-comparison"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
          >
            How Zedu Transforms Tutoring
          </h2>
        </div>

        <ComparisonShowcase
          withoutTitle={comparisonData.withoutTitle}
          withoutItems={comparisonData.withoutItems}
          withTitle={comparisonData.withTitle}
          withItems={comparisonData.withItems}
          ctaText="Book a Demo"
          ctaHref="/contact-sales"
        />
      </section>

      <section
        aria-labelledby="tutors-metrics"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="tutors-metrics"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
          >
            Run Leaner. Move Faster. Teach Better.
          </h2>
          <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            Tutoring runs on trust and attention. Zedu removes the busywork —
            scattered messages, lost materials, and manual recaps — so your time
            goes to students.
          </p>
        </div>

        <div className="w-full mx-auto">
          <div className="grid grid-cols-3 sm:items-center">
            {featureMetrics.map((metric, index) => (
              <div
                key={metric.title}
                className={`flex flex-col items-center justify-center gap-1 px-1.5 py-2 text-center sm:flex-col sm:gap-2 sm:px-4 sm:py-3 ${
                  index > 0 ? "border-neutral-300 border-l" : ""
                }`}
              >
                <h3 className="text-2xl font-bold text-neutral-900 sm:text-5xl">
                  {metric.title}
                </h3>
                <p className="text-[12px] leading-tight text-neutral-600 sm:text-sm">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="tutors-faq"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="tutors-faq"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
          >
            Tutoring Questions, Answered
          </h2>
        </div>

        <div className="mx-auto w-full max-w-3xl divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-[#1f2530] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="text-xl leading-none text-primary-500 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <SolutionResources audience="tutors" />

      <div>
        <DynamicFooter
          text="Grow Your Tutoring Practice"
          description="Give every student one organized place for lessons, materials, live sessions, and follow-ups."
        />
      </div>
    </>
  );
};

export default TutorsSolutionsPage;
