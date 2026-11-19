import type { Metadata } from "next";
import Image from "next/image";
import { FolderOpen, MessageSquare, Users, Video } from "lucide-react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";
import { ComparisonShowcase } from "~/app/(homepage)/_components/ui/ComparisonShowcase";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";

export const metadata: Metadata = {
  title: "Zedu for Study Groups | Group Chat, Live Sessions and Shared Files",
  description:
    "Create a study group, chat in organized channels, hop into live Buzz sessions, and keep notes, past questions, and resources in one shared workspace.",
  keywords: [
    "study group app",
    "online study group",
    "group study platform",
    "student collaboration tool",
    "study group chat",
    "shared study files",
    "live study sessions",
    "Zedu study groups",
  ],
  openGraph: {
    title: "Zedu for Study Groups - Study Together in One Workspace",
    description:
      "Bring group chat, live study sessions, shared files, and course discussions together in one organized workspace.",
    url: siteUrl("/solutions/study-groups"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu study groups solution page preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu for Study Groups - Group Chat, Live Sessions and Files",
    description:
      "Create a study group, keep discussions organized, and study together with shared files and live Buzz sessions.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/solutions/study-groups"),
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
    title: "One Place for Every Conversation",
    desc: "Keep course questions, exam prep, and project work in separate channels so your group always knows where to look.",
  },
  {
    title: "Help When Someone Gets Stuck",
    desc: "Ask in the group channel or send a direct message when you need a quick answer without derailing the main discussion.",
  },
  {
    title: "Study Sessions Without the Setup",
    desc: "Start a Buzz voice session when typing is too slow, then catch up with an AI summary of what your group discussed.",
  },
];

const features = [
  {
    title: "Channels",
    desc: "Organize each course, project, or exam prep topic in its own channel so discussions stay easy to follow.",
    icon: MessageSquare,
  },
  {
    title: "Direct Messages",
    desc: "Ask a classmate a quick question or share a resource privately without leaving the group workspace.",
    icon: Users,
  },
  {
    title: "Buzz Live Sessions",
    desc: "Start a voice session when your group needs to talk it through, then keep the AI summary with the conversation.",
    icon: Video,
  },
  {
    title: "Shared Files",
    desc: "Keep notes, past questions, slides, and recordings together so everyone studies from the same materials.",
    icon: FolderOpen,
  },
];

const comparisonData = {
  withoutTitle: "Without Zedu",
  withoutItems: [
    "Study group chats get buried under unrelated messages",
    "Notes, past questions, and slides are scattered across different apps",
    "Someone misses a live session and has no way to catch up",
    "Questions go unanswered because nobody knows where to ask",
  ],
  withTitle: "With Zedu",
  withItems: [
    "Each course, project, or exam prep topic has its own channel",
    "Files and study materials live beside the conversation",
    "Buzz sessions keep their summary in the same workspace",
    "Everyone can see where to ask and where to find answers",
  ],
};

const steps = [
  {
    title: "Create your group",
    desc: "Set up a workspace for your study group in a few minutes.",
  },
  {
    title: "Invite your members",
    desc: "Bring in classmates, project partners, or your whole cohort.",
  },
  {
    title: "Set up channels",
    desc: "Create spaces for each course, project, or exam prep topic.",
  },
  {
    title: "Study together",
    desc: "Chat, share files, and start a Buzz session whenever you need.",
  },
];

const faqs = [
  {
    question: "Can I create a private study group?",
    answer:
      "Yes. Create a workspace for your group and invite only the people who should have access.",
  },
  {
    question: "Can we use Zedu on mobile?",
    answer:
      "Yes. Zedu works on the web and on mobile, so your group can keep studying wherever they are.",
  },
  {
    question: "Do Buzz sessions work for small groups?",
    answer:
      "Yes. Start a Buzz from a channel when your group needs to talk it through, and the AI summary stays with the conversation.",
  },
  {
    question: "Can we keep notes and past questions together?",
    answer:
      "Yes. Shared files and channels keep notes, past questions, slides, and recordings in one place beside the discussion.",
  },
  {
    question: "Is Zedu free to start?",
    answer:
      "Yes. Start for free and upgrade when your group needs more space, features, or members.",
  },
];

const StudyGroupsSolutionsPage = () => {
  return (
    <>
      <section
        aria-labelledby="study-groups-hero"
        className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[30%] w-screen -translate-x-1/2 bg-gradient-to-t from-blue-50/30 to-white"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 rounded-[28px] px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 lg:px-12 lg:py-14 min-h-[85dvh]">
          <div className="flex flex-col items-center gap-5 text-center lg:max-w-[470px] lg:items-start lg:text-left">
            <h1
              id="study-groups-hero"
              className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
            >
              <span className="text-primary-500">Study together</span> in one
              organized workspace
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
              Create a study group, chat in focused channels, jump into live
              Buzz sessions, and keep notes, past questions, and resources in
              one shared space.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ArrowBtn text="Start a Study Group" href="/auth/sign-up" />
              <OutlineBtn text="Book a Demo" href="/contact-sales" />
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/11] w-full sm:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src="/images/homepage/solutions/bootcamps-hero.jpg"
                alt="Students collaborating in a shared Zedu study group workspace"
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
        aria-labelledby="study-groups-why"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 mt-5"
      >
        <div>
          <h2
            id="study-groups-why"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]"
          >
            Built for the Way Study Groups Actually Work
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
        aria-labelledby="study-groups-features"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="study-groups-features"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]"
          >
            Everything Your Study Group Needs
          </h2>
          <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            Channels, direct messages, live sessions, and shared files work
            together so your group can focus on learning.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="flex h-full flex-col gap-4 rounded-2xl bg-[#F9F7FD] p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-500 text-white">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
                </span>
                <h3 className="text-lg font-semibold text-[#1f2530] sm:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {feature.desc}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="study-groups-comparison"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="study-groups-comparison"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
          >
            Make Study Time Feel Less Scattered
          </h2>
        </div>

        <ComparisonShowcase
          withoutTitle={comparisonData.withoutTitle}
          withoutItems={comparisonData.withoutItems}
          withTitle={comparisonData.withTitle}
          withItems={comparisonData.withItems}
          ctaText="Start a Study Group"
          ctaHref="/auth/sign-up"
        />
      </section>

      <section
        aria-labelledby="study-groups-steps"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="study-groups-steps"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
          >
            From First Question to Final Exam
          </h2>
          <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            Set up your group once, then keep everything your group needs in the
            same workspace.
          </p>
        </div>

        <ol className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-primary-500"
              >
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-[#1f2530]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="study-groups-faq"
        className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="study-groups-faq"
            className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]"
          >
            Study Group Questions, Answered
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

      <div>
        <DynamicFooter
          text="Make Study Time Feel Less Scattered"
          description="Bring your group chat, live sessions, notes, and study files into one shared Zedu workspace."
        />
      </div>
    </>
  );
};

export default StudyGroupsSolutionsPage;
