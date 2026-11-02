import { SolutionResources } from "~/app/(homepage)/_components/ui/SolutionResources";
import type { Metadata } from "next";
import { siteUrl } from "~/lib/env-urls";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  Bot,
  Check,
  CircleCheck,
  Hash,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";
import { FeaturedCard } from "~/app/(homepage)/_components/ui/FeaturedCard";
import { ComparisonShowcase } from "~/app/(homepage)/_components/ui/ComparisonShowcase";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";

export const metadata: Metadata = {
  title: {
    absolute: "Zedu for Schools - Structured Communication for Classrooms",
  },
  description:
    "Improve classroom communication with Zedu. Give teachers and students structured channels for lessons, assignments, discussions, and school-wide updates in one platform.",
  keywords: [
    "school communication platform",
    "classroom communication software",
    "teacher student collaboration",
    "school announcements tool",
    "assignment communication platform",
    "K-12 communication software",
    "education collaboration platform",
    "Zedu schools",
  ],
  openGraph: {
    title: "Zedu for Schools - Structured Communication for Classrooms",
    description:
      "Bring teachers, students, and school staff into one organized workspace for announcements, assignments, and focused classroom discussions.",
    url: siteUrl("/solutions/schools"),
    siteName: "Zedu",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu for Schools - Structured Classroom Communication",
    description:
      "Create organized school communication where class discussions, updates, and assignments stay easy to follow for everyone.",
  },
  alternates: {
    canonical: siteUrl("/solutions/schools"),
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

const higherEducationCards = [
  {
    title: "Organised Classrooms",
    desc: "Teachers manage discussions, homework, and announcements in structured channels.",
  },
  {
    title: "Engaged Students",
    desc: "Students participate in discussions and collaborate easily.",
  },
  {
    title: "Less Administrative Overhead",
    desc: "Teachers spend less time managing communication.",
  },
];

const structuredCommunicationCards = [
  {
    title: "Organised Classroom Communication",
    desc: "Structure lessons, announcements, and discussions for easy access to information",
    image:
      "/images/homepage/solutions/schools/organised-classroom-communication.png",
  },
  {
    title: "Encourage Student Participation",
    desc: "Create spaces where students can ask questions, join discussions, and stay engaged",
    image:
      "/images/homepage/solutions/schools/encourage-student-participation.png",
  },
];

const comparisonData = {
  withoutTitle: "Without Zedu",
  withoutItems: [
    "Teachers rely on multiple tools like messaging apps, email, and school portals to communicate with students",
    "Important updates about homework, tests, or schedule changes can easily get lost in long messages or chats",
    "Students often don't know where to ask questions or get help about class topics.",
    "Assignments and feedback are shared across different tools, making it harder for students to stay organized.",
    "Many students hesitate to participate when classroom discussions are unstructured or difficult to follow.",
  ],
  withTitle: "With Zedu",
  withItems: [
    "Every class has its own structured space where teachers and students communicate clearly.",
    "Important updates are posted in visible channels where students can easily stay informed.",
    "Students ask questions in focused discussion threads for each subject or lesson.",
    "Assignments, feedback, and clarifications stay in one place for easy access.",
    "Students participate in discussions and collaborative learning activities throughout the class.",
  ],
};

const pageUrl = siteUrl("/solutions/schools");

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
      name: "Schools Solutions | Zedu",
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
          name: "Schools",
          item: pageUrl,
        },
      ],
    },
  ],
};

const SchoolsSolutionsPage = () => {
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
              <span className="text-primary-500">A Smarter </span> Communication
              for Schools
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
              Connect teachers, students, and school staff in one organized
              workspace designed for modern classrooms.
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
        <div>
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
            Built for Modern School Communication
          </h2>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {higherEducationCards.map((card) => (
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
      <section className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
            Better Communication for Every Classroom
          </h2>
          <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            Keep lessons organized and create an environment where students can
            actively participate
          </p>
          <div>
            <ArrowBtn text="Get Started" linkToHome />
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2 ">
          {structuredCommunicationCards.map((card) => (
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
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
            How Zedu Transforms Schools
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

      <section className="relative isolate overflow-hidden bg-blue-50/30 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-9 sm:gap-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
              Run Leaner. Move Faster. Teach Better.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base lg:text-lg">
              Schools often juggle countless disconnected tools for
              communication. Zedu unifies everything into one seamless
              workspace, letting teachers and students focus entirely on
              learning.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <article className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <p className="text-4xl font-bold tracking-tight text-primary-500 sm:text-5xl">
                    50%
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[#1f2530] sm:text-lg">
                    Reduction in communication clutter
                  </h3>
                </div>
                <span className="rounded-xl bg-purple-50 p-2.5 text-primary-500">
                  <Hash aria-hidden="true" size={21} />
                </span>
              </div>
              <div className="mt-auto flex min-h-28 items-center justify-center rounded-2xl bg-[#F9F7FD] p-4">
                <div
                  className="flex w-full items-center justify-center gap-3"
                  aria-hidden="true"
                >
                  <div className="flex -space-x-2">
                    <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-rose-100 text-rose-600">
                      <MessageCircle size={15} />
                    </span>
                    <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-amber-700">
                      <MessageCircle size={15} />
                    </span>
                    <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-sky-100 text-sky-700">
                      <MessageCircle size={15} />
                    </span>
                  </div>
                  <ArrowRight className="shrink-0 text-neutral-400" size={19} />
                  <div className="flex items-center gap-2 rounded-xl bg-primary-500 px-3 py-2 text-white shadow-sm">
                    <Hash size={16} />
                    <span className="text-xs font-semibold">Class channel</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Many conversations, organized in one place
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <p className="text-4xl font-bold tracking-tight text-primary-500 sm:text-5xl">
                    2x
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[#1f2530] sm:text-lg">
                    Faster homework &amp; task coordination
                  </h3>
                </div>
                <span className="rounded-xl bg-purple-50 p-2.5 text-primary-500">
                  <CircleCheck aria-hidden="true" size={21} />
                </span>
              </div>
              <div
                className="mt-auto min-h-28 rounded-2xl bg-[#F9F7FD] p-4"
                aria-label="Example homework assignment progressing through a classroom task workflow"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    Assignment workflow
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
                    In progress
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-primary-500 shadow-sm">
                    <Check aria-hidden="true" size={15} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#1f2530]">
                    Science worksheet
                  </span>
                  <span className="text-[10px] text-neutral-500">Due Fri</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                  <div className="h-full w-2/3 rounded-full bg-primary-500" />
                </div>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Assignment shared with a clear progress state
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:col-span-2 sm:p-6 lg:col-span-1">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <p className="text-4xl font-bold tracking-tight text-primary-500 sm:text-5xl">
                    65%
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[#1f2530] sm:text-lg">
                    Higher overall student engagement
                  </h3>
                </div>
                <span className="rounded-xl bg-purple-50 p-2.5 text-primary-500">
                  <Users aria-hidden="true" size={21} />
                </span>
              </div>
              <div className="mt-auto min-h-28 rounded-2xl bg-[#F9F7FD] p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <Bot aria-hidden="true" size={17} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#1f2530]">
                        Class helper
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        Discussion activity
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <div className="flex -space-x-2">
                    <span className="size-6 rounded-full border-2 border-white bg-sky-200" />
                    <span className="size-6 rounded-full border-2 border-white bg-amber-200" />
                    <span className="size-6 rounded-full border-2 border-white bg-rose-200" />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-600">
                    <MessageCircle aria-hidden="true" size={13} />
                    Replies and reactions
                  </span>
                  <ArrowDownRight
                    aria-hidden="true"
                    className="text-primary-500"
                    size={15}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                A helper and learners in an active class discussion
              </p>
            </article>
          </div>

          <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-neutral-500">
            The figures above are illustrative examples of the kind of change
            Zedu is designed to deliver, not measured results. Actual outcomes
            vary by school.
          </p>
        </div>
      </section>

      <SolutionResources audience="schools" />

      <DynamicFooter
        text="Transform Communication in Your School"
        description="Give teachers and students a structured platform designed for modern classrooms."
        backgroundClassName="bg-white"
      />
    </>
  );
};

export default SchoolsSolutionsPage;
