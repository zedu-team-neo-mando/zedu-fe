import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";
import { FAQSection } from "~/app/(homepage)/_components/home/FAQSection";
import { DynamicFooter } from "~/app/(homepage)/_components/footer/dynamic-footer";
import type { HomeFAQ } from "~/app/(homepage)/_lib/faqData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export const metadata: Metadata = {
  title: "Google Classroom Alternative for Schools and Bootcamps",
  description:
    "Compare Zedu with Google Classroom: structured class channels, live voice and video calls, and organised course files in one workspace for educators and cohorts.",
  keywords: [
    "Google Classroom alternative",
    "Zedu vs Google Classroom",
    "classroom communication platform",
    "school communication software",
    "bootcamp learning platform",
    "cohort management software",
    "live class calls",
    "education file management",
  ],
  openGraph: {
    title: "Zedu vs Google Classroom - A Structured Alternative for Educators",
    description:
      "See how Zedu compares with Google Classroom for class communication, live calls, community channels and pricing.",
    url: siteUrl("/alternatives/google-classroom"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu as an alternative to Google Classroom for educators and cohorts",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu vs Google Classroom - A Structured Alternative",
    description:
      "Compare Zedu with Google Classroom for structured class channels, live calls, community channels and pricing.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/alternatives/google-classroom"),
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

const whyTeamsSwitch = [
  {
    title: "Channels",
    desc: "Give every class, cohort and department its own space, so announcements, questions and resources stay in the right conversation instead of one long class stream.",
  },
  {
    title: "Buzz voice and video calls",
    desc: "Start a voice or video call from inside the channel where the discussion is happening, then review an AI-generated summary of the session afterwards.",
  },
  {
    title: "File Management",
    desc: "Keep lecture slides, assignments and course resources organised in folders that stay attached to the class or cohort they belong to.",
  },
];

const comparisonRows = [
  {
    feature: "Class communication",
    zedu: "Every class or cohort has its own structured channels, so announcements, questions and resources stay together instead of piling up in one class stream.",
    classroom:
      "A class stream for announcements, assignments and comments on class posts, organised one class at a time.",
  },
  {
    feature: "Live calls",
    zedu: "Start a Buzz voice or video call directly from any channel, with no separate meeting link, and get an AI-generated summary after the session.",
    classroom:
      "Classes can join video meetings through Google Meet, with availability depending on the Google Workspace for Education edition in use.",
  },
  {
    feature: "Community channels",
    zedu: "Keep persistent channels for cohorts, subjects, projects and departments, so program-wide updates do not live inside a single class.",
    classroom:
      "Communication is organised per class, with no standalone community channels for programs, departments or cross-class projects.",
  },
  {
    feature: "Pricing",
    zedu: "Free Starter plan with no credit card, covering up to 3 cohorts, 100 members and 5 teachers or admins. Pro is ₦20,000 a month for the whole workspace, with annual billing on request.",
    classroom:
      "Free for schools, educators and students with a Google account. Paid Google Workspace for Education editions add features and higher limits.",
  },
];

const googleClassroomFAQs: HomeFAQ[] = [
  {
    id: "google-classroom-item-1",
    question: "How is Zedu different from Google Classroom?",
    answer:
      "Google Classroom is organised around individual classes and their assignments. Zedu adds structured channels for each class, cohort or department, live voice and video calls from inside a channel, and course files kept in the same workspace.",
  },
  {
    id: "google-classroom-item-2",
    question: "Does Zedu support live voice and video calls?",
    answer:
      "Yes. Buzz lets educators and learners start a voice or video call from a channel, and an AI-generated summary is created afterwards so anyone who missed the session can catch up.",
  },
  {
    id: "google-classroom-item-3",
    question: "How does Zedu pricing compare with Google Classroom?",
    answer:
      "Zedu has a free Starter plan that needs no credit card and covers up to 3 cohorts, 100 members and 5 teachers or admins. Pro is ₦20,000 a month for the whole workspace, with unlimited cohorts, up to 500 students per cohort and up to 50 teachers or admins. Google Classroom is free for schools and individuals, while paid Google Workspace for Education editions add features.",
  },
  {
    id: "google-classroom-item-4",
    question: "Can we start free on Zedu and upgrade later?",
    answer:
      "Yes. You can begin on the free Starter plan and move to Pro from the workspace billing settings when you need more cohorts, members or teachers, or want live classes and AI study assistants. Annual billing is available on request.",
  },
];

const pageUrl = siteUrl("/alternatives/google-classroom");

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
      name: "Google Classroom Alternative | Zedu",
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
          name: "Google Classroom Alternative",
          item: pageUrl,
        },
      ],
    },
  ],
};

const GoogleClassroomAlternativePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[30%] w-screen -translate-x-1/2 bg-gradient-to-t from-blue-50/30 to-white"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 rounded-[28px] px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 lg:px-12 lg:py-14 min-h-[85dvh]">
          <div className="flex flex-col items-center gap-5 text-center lg:max-w-[470px] lg:items-start lg:text-left">
            <h1 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
              <span className="text-primary-500">A Structured </span> Google
              Classroom Alternative
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
              Zedu brings structured class channels, live voice and video calls,
              and organised course files into one workspace for schools,
              bootcamps and cohort-based programs.
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
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ArrowBtn text="Get Started Free" href="/auth/sign-up" />
              <OutlineBtn text="Book a Demo" href="/contact-sales" />
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/11] w-full sm:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src="/images/homepage/solutions/schools-hero.jpg"
                alt="A student wearing a backpack and holding a binder outside a school building"
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
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
            Why Teams Switch from Google Classroom
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#5a6170] sm:text-base">
            Google Classroom covers assignments for individual classes. Zedu
            adds the spaces, live conversations and shared files that keep a
            whole school, bootcamp or cohort working together.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyTeamsSwitch.map((card) => (
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

      <section
        id="comparison"
        className="relative isolate scroll-mt-24 overflow-hidden space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
            Zedu vs Google Classroom
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#5a6170] sm:text-base">
            A side-by-side look at how both tools handle class communication,
            live calls, community channels and pricing.
          </p>
        </div>

        <div className="mx-auto hidden w-full max-w-5xl md:block">
          <Table
            aria-label="Zedu and Google Classroom feature comparison"
            className="min-w-[720px] table-fixed"
          >
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[39%]" />
              <col className="w-[39%]" />
            </colgroup>
            <TableHeader>
              <TableRow className="border-b border-neutral-200 hover:bg-transparent">
                <TableHead className="border-r border-neutral-200 px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Feature
                </TableHead>
                <TableHead className="border-r border-neutral-200 px-4 py-3 text-left text-sm font-semibold text-primary-500">
                  Zedu
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-semibold text-neutral-900">
                  Google Classroom
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonRows.map((row, index) => (
                <TableRow
                  key={row.feature}
                  className={
                    index % 2 === 1 ? "bg-neutral-100 hover:bg-neutral-100" : ""
                  }
                >
                  <TableCell className="border-r border-neutral-200 px-4 py-4 align-top text-sm font-semibold text-neutral-900">
                    {row.feature}
                  </TableCell>
                  <TableCell className="border-r border-neutral-200 px-4 py-4 align-top text-sm text-neutral-700">
                    {row.zedu}
                  </TableCell>
                  <TableCell className="px-4 py-4 align-top text-sm text-neutral-700">
                    {row.classroom}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 md:hidden">
          {comparisonRows.map((row) => (
            <div
              key={row.feature}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#1f2530]">
                {row.feature}
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                    Zedu
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                    {row.zedu}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Google Classroom
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                    {row.classroom}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto max-w-5xl text-xs leading-relaxed text-neutral-500">
          Google Classroom is a trademark of Google LLC. Google Classroom and
          Google Meet details reflect Google&apos;s publicly documented
          offerings at the time of writing and may change.
        </p>
      </section>

      <FAQSection faqs={googleClassroomFAQs} headingLevel="h2" />

      <DynamicFooter
        text="Ready to Try a More Structured Classroom?"
        description="Bring channels, live calls and course files together in one workspace for your school, bootcamp or cohort."
      />
    </>
  );
};

export default GoogleClassroomAlternativePage;
