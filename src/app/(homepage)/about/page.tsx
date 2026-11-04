import { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import Image from "next/image";
import { ArrowBtn, OutlineBtn } from "../_components/ui/Button";
import { WhyCard } from "../_components/ui/WhyCard";
import { BoardIcon, BookIcon, SchoolIcon } from "../_components/svgs";
import { DynamicFooter } from "../_components/footer/dynamic-footer";
import { Building2, ShieldCheck, UserRoundCog } from "lucide-react";

export const metadata: Metadata = {
  title: "About Zedu - Structured Learning Communication Built for Education",
  description:
    "Learn how Zedu helps schools, universities, and bootcamps run structured, AI-assisted learning communication with organized channels, collaboration tools, and educator-first workflows.",
  keywords: [
    "about Zedu",
    "education communication platform",
    "AI learning collaboration",
    "structured learning workspace",
    "bootcamp communication tools",
    "university collaboration software",
    "school learning platform",
    "educator-first technology",
  ],
  icons: {
    icon: "/TelexIcon.svg",
  },
  openGraph: {
    title: "About Zedu - Structured Learning Communication Built for Education",
    description:
      "See Zedu's mission, product philosophy, and approach to building secure, organized, and AI-assisted communication for modern learning teams.",
    url: siteUrl("/about"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "About Zedu and its education-first platform philosophy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Zedu - Built for Structured Learning",
    description:
      "Discover how Zedu helps educators and learners communicate clearly with structured channels, AI assistance, and secure collaboration.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/about"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const philosophyCards = [
  {
    title: "Structure Drives Clarity",
    desc: "Learning environments should be organized. Channels should have meaning. Communication should feel intentional.",
  },
  {
    title: "AI Should Assist, Not Replace",
    desc: "AI should reduce admin work, summarize discussions, and support learners - not overwhelm them.",
  },
  {
    title: "Educators Deserve Better Tools",
    desc: "Bootcamps, institutions, and cohort programs need tools built around how learning actually works.",
  },
];

const learningTeamCards = [
  {
    title: "Bootcamps",
    desc: "Run structured cohorts with clear communication. Keep students engaged without the noise of traditional chat apps.",
    Icon: BoardIcon,
  },
  {
    title: "Universities",
    desc: "Organize programs, departments, and study groups in a secure educator-controlled environment.",
    Icon: SchoolIcon,
  },
  {
    title: "Online Learning platforms",
    desc: "Scale learning communities without chaos. Manage thousands of learners with AI-assisted moderation.",
    Icon: BookIcon,
  },
];

const modernLearningPoints = [
  "Structured workspaces designed to manage cohorts, instructors, and students.",
  "Dedicated channels for subjects and topics that keep lessons, discussions, and resources clearly organized.",
  "AI tools that help summarize discussions, answer questions, and support student learning.",
  "Easily support large classes, lecture groups, and active learning communities without losing structure.",
  "Designed to support expanding institutions, programs, and cohorts as learning communities grow.",
];

const privacyCards = [
  {
    title: "Secure data infrastructure",
    Icon: ShieldCheck,
    iconClassName: "text-emerald-500",
  },
  {
    title: "Role-based permissions",
    Icon: UserRoundCog,
    iconClassName: "text-primary-500",
  },
  {
    title: "Educator-controlled environments",
    Icon: Building2,
    iconClassName: "text-primary-500",
  },
];

const AboutPage = () => {
  return (
    <div className="space-y-20">
      <section className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden px-4 py-10 text-center sm:gap-6 sm:px-8 sm:py-16  lg:gap-8 lg:px-12 mt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[30%] bg-gradient-to-t from-blue-50/30 to-white"
        />
        <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl text-center">
          Built for Structured{" "}
          <span className="text-primary-500">Learning</span> Not Noise
        </h1>
        <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
          Zedu was created to help educators and learning teams run organized,
          distraction-free communication for modern cohorts.
        </p>
        <div className="flex w-full max-w-md flex-col  justify-center gap-2 sm:flex-row items-center sm:gap-3">
          <ArrowBtn
            text="Explore the product"
            href="/auth/login"
            className="w-full justify-center sm:w-auto max-w-[240px]"
          />
          <OutlineBtn
            text="View Pricing"
            href="/pricing"
            className=" sm:w-auto w-[209px]"
          />
        </div>
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl sm:mt-0 mt-5">
          <div className="relative aspect-[16/10]  w-full sm:aspect-[16/9] lg:aspect-[2/1] ">
            <Image
              src="/images/homepage/about-hero-img.png"
              alt="Preview of the learning communication interface"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1200px"
              className="object-contain object-center "
            />
          </div>
        </div>
      </section>
      <section className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden px-4 pt-10 text-center sm:gap-6 sm:px-8 sm:pt-16  lg:gap-8 lg:px-12">
        <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl text-center">
          Our Philosophy
        </h1>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {philosophyCards.map((card) => (
            <WhyCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              showBadge
              showArrow
              className="h-full"
            />
          ))}
        </div>
      </section>

      <section className="w-full px-4 pt-6 mt-10 sm:px-8 sm:pt-16 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          <div className="flex flex-col items-start gap-5 text-left">
            <h2 className="max-w-xl text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
              Move quickly from ideas to execution
            </h2>

            <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
              Modern learning programs were forced to rely on tools built for
              workplaces or social chat. Important messages got buried. Cohort
              discussions became messy. Structure was missing.
            </p>

            <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
              We built Zedu to give educators a workspace designed specifically
              for organized learning where every channel, cohort, and
              conversation has purpose.
            </p>

            <ArrowBtn text="Contact Sales" href="/contact-sales" inverted />
          </div>

          <div className="relative w-full overflow-hidden rounded-md">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/images/homepage/about/product-show.png"
                alt="Zedu meetings and calls interface preview"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 524px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden px-4 py-10 text-center sm:gap-6 sm:px-8 sm:py-16  lg:gap-8 lg:px-12">
        <h1 className="text-xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl text-center">
          Designed for Modern Learning Teams{" "}
        </h1>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learningTeamCards.map((card) => (
            <article
              key={card.title}
              className="flex h-full flex-col items-start gap-3 rounded-xl border border-neutral-200 p-4 text-left"
            >
              <card.Icon />
              <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                {card.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="order-2 relative w-full overflow-hidden rounded-xl lg:order-1">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/images/homepage/about/product-show-2.png"
                alt="Zedu structured classroom workspace preview"
                fill
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-contain object-center"
              />
            </div>
          </div>

          <div className="order-1 flex flex-col items-start gap-5 text-left lg:order-2">
            <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
              Built for Modern Learning
            </h2>
            <p className="text-sm text-neutral-600 sm:text-base">
              Stay aligned, where your teams are.
            </p>

            <ul className="space-y-2.5">
              {modernLearningPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500" />
                  <span className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <ArrowBtn text="Get Started" linkToHome inverted />
          </div>
        </div>
      </section>

      <section className="relative mx-4 flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-primary-500 px-4 py-12 text-center sm:mx-8 sm:min-h-[320px] sm:px-8 sm:py-16 lg:mx-12 lg:min-h-[360px] lg:px-12">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/images/homepage/about-svg-bg.png"
            alt="Decorative stars background"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center gap-3 text-center text-white sm:gap-4">
          <h1 className="text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
            Our Vision
          </h1>
          <p className="max-w-[95%] text-sm leading-relaxed text-neutral-100 sm:max-w-[90%] sm:text-base md:max-w-[75%] lg:max-w-[60%] lg:text-lg">
            We believe the future of education is structured, AI-assisted, and
            built for engagement. Zedu exists to make organized learning the
            standard not the exception.
          </p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl rounded-2xl  px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <h2 className="text-center text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Built with Privacy and Protection in Mind
          </h2>

          <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {privacyCards.map((card) => (
              <article
                key={card.title}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-left"
              >
                <card.Icon className={card.iconClassName} size={16} />
                <p className="text-sm font-medium text-neutral-700">
                  {card.title}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DynamicFooter
        text="Start Building Structured Learning Today"
        description="Create organized channels, manage cohorts, and bring AI into your learning environment.
      "
      />
    </div>
  );
};

export default AboutPage;
