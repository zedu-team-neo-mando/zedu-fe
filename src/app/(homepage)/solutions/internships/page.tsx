import type { Metadata } from "next";
import Image from "next/image";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";
import { FeaturedCard } from "~/app/(homepage)/_components/ui/FeaturedCard";
import { ComparisonShowcase } from "~/app/(homepage)/_components/ui/ComparisonShowcase";

export const metadata: Metadata = {
  title: "Chat App for Internship Teams",
  description:
    "Run your internship cohort in one place. Channels for each team, DMs for mentors, shared files and calls, so interns stop losing context across WhatsApp, email and Drive.",
  keywords: [
    "chat app for internship teams",
    "internship cohort software",
    "remote internship communication",
    "internship program platform",
    "mentor communication tool",
    "cohort chat app",
    "internship management software",
    "Zedu for internships",
  ],
  openGraph: {
    title: "Zedu for Internship Teams - One Workspace for the Whole Cohort",
    description:
      "Give every intern team a channel, keep mentors reachable, and hand over the work cleanly at the end of the program.",
    url: siteUrl("/solutions/internships"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu internship teams solution page preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu for Internship Teams - Chat, Files and Calls in One Place",
    description:
      "Run internship cohorts without stitching together WhatsApp, email and Drive. Every team gets a channel, every mentor stays reachable.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/solutions/internships"),
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
    title: "One channel per team",
    desc: "Each team gets its own channel and the cohort gets one space for announcements. Nobody scrolls through three group chats to find the kickoff link.",
  },
  {
    title: "Mentors answer where the work happens",
    desc: "Interns ask in the channel instead of a DM that dies with one person. The answer stays findable for the next team that hits the same problem.",
  },
  {
    title: "Handover stops being archaeology",
    desc: "Files, specs and recordings stay in the cohort workspace, so the next team starts from the last team's work instead of rebuilding it.",
  },
];

const featuredCards = [
  {
    title: "Give every team its own space",
    desc: "Channels keep a team's questions, files and decisions together. The cohort channel carries what everyone needs: schedule, deadlines and demo times.",
    image:
      "/images/homepage/solutions/bootcamps/manage-cohorts-with-structure.png",
  },
  {
    title: "Run standups and demos in the channel",
    desc: "Start a call where the team already talks. There is no link to paste and no recording that nobody can find a week later.",
    image:
      "/images/homepage/solutions/bootcamps/collaboration-and-project-learning.png",
  },
];

const comparisonData = {
  withoutTitle: "Without Zedu",
  withoutItems: [
    "Kickoff links, recordings and specs are spread across WhatsApp, email and Drive",
    "A mentor answers the same question in five separate DMs",
    "Each new team starts from zero because the last team's context left with them",
    "Nobody knows which team is behind until demo day",
    "Interns who miss a day come back to hundreds of unread messages",
  ],
  withTitle: "With Zedu",
  withItems: [
    "Every team has a channel, and the cohort has one place for announcements",
    "Answers stay in the channel, where the next team can find them",
    "Files and decisions stay with the cohort when people move on",
    "Mentors see where each team is without booking a status meeting",
    "Late joiners catch up from channel history instead of a summary",
  ],
};

const steps = [
  {
    title: "Create the cohort and add your teams",
    desc: "Set up one workspace for the program and a channel for each team. Invite mentors once and they have access to every team they support.",
  },
  {
    title: "Run the program in the open",
    desc: "Standups, questions, files and demos happen in the channels your teams already use. Nothing important lives in a private DM.",
  },
  {
    title: "Hand over cleanly",
    desc: "When the cohort ends, the work stays where the next intake can find it, including the decisions that never made it into a doc.",
  },
];

const InternshipsLandingPage = () => {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[30%] w-screen -translate-x-1/2 bg-gradient-to-t from-blue-50/30 to-white"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 rounded-[28px] px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 lg:px-12 lg:py-14 min-h-[85dvh]">
          <div className="flex flex-col items-center gap-5 text-center lg:max-w-[470px] lg:items-start lg:text-left">
            <h1 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
              <span className="text-primary-500">
                The chat app for internship teams
              </span>{" "}
              that keeps the work findable
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
              Give every team a channel, every mentor a way to answer once, and
              every intern one place to find the files and decisions that
              usually disappear into WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ArrowBtn text="Start for Free" href="/auth/sign-up" />
              <OutlineBtn text="Book a Demo" href="/contact-sales" />
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/11] w-full sm:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src="/images/homepage/solutions/bootcamps-hero.png"
                alt="A cohort team collaborating together inside the Zedu workspace"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 mt-5">
        <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
          Why internship teams move to Zedu
        </h2>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((card) => (
            <WhyCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              showBadge
              className="h-full"
            />
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
            Built around how a cohort actually runs
          </h2>
          <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            A program is a set of teams working in parallel. Zedu gives each
            team its own room and the cohort one shared space.
          </p>
          <div>
            <ArrowBtn text="Get Started" href="/auth/sign-up" />
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2">
          {featuredCards.map((card) => (
            <FeaturedCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              image={card.image}
            />
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
          What changes when the cohort lives in Zedu
        </h2>

        <ComparisonShowcase
          withoutTitle={comparisonData.withoutTitle}
          withoutItems={comparisonData.withoutItems}
          withTitle={comparisonData.withTitle}
          withItems={comparisonData.withItems}
          ctaText="Start for Free"
          ctaHref="/auth/sign-up"
        />
      </section>

      <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
            How it works
          </h2>

          <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-base font-semibold text-primary-500"
                >
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-[#1f2530]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#5a6170]">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex flex-col items-center gap-5 bg-blue-50/30 px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
          Start your internship cohort on Zedu
        </h2>
        <p className="max-w-2xl text-base text-neutral-600">
          Set up the workspace, invite your mentors and give every team a
          channel before the first standup.
        </p>
        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-2">
          <ArrowBtn
            text="Start for free"
            className="w-full sm:w-auto"
            href="/auth/sign-up"
          />
          <OutlineBtn
            text="Book a Demo"
            className="w-full sm:w-auto"
            href="/contact-sales"
          />
        </div>
      </section>
    </>
  );
};

export default InternshipsLandingPage;
