import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  School,
  Building2,
  Sparkles,
  Layers,
  Video,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { DynamicFooter } from "~/app/(homepage)/_components/footer/dynamic-footer";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";

export const metadata: Metadata = {
  title: "Platform Comparisons: Zedu vs. Discord & Slack | Zedu",
  description:
    "Compare Zedu with Discord and Slack for bootcamps, schools, and cohort learning. See how structured channels, built-in Buzz calling, and cohort-friendly pricing compare.",
  keywords: [
    "Discord alternative for bootcamps",
    "Slack alternative for learning communities",
    "bootcamp communication platform",
    "Zedu comparisons",
    "education chat software",
    "cohort management platform",
  ],
  icons: {
    icon: "/TelexIcon.svg",
  },
  openGraph: {
    title: "Platform Comparisons: Zedu vs. Discord & Slack | Zedu",
    description:
      "Explore how Zedu's education-first platform stacks up against Discord and Slack for bootcamps, schools, and cohort communities.",
    url: siteUrl("/compare"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu platform comparisons overview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Comparisons: Zedu vs. Discord & Slack | Zedu",
    description:
      "Compare Zedu with Discord and Slack for cohort education and bootcamps.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/compare"),
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

export default function ComparePage() {
  return (
    <div className="relative isolate w-full bg-white text-[#1f2530]">
      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-10 pb-14 text-center sm:px-6 sm:pt-16 sm:pb-20 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600 sm:text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Platform Comparisons</span>
        </div>

        <h1 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight text-[#1f2530] sm:text-4xl md:text-5xl lg:text-5xl">
          The Right Communication Platform for Modern Education
        </h1>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#5a6170] sm:text-base md:text-lg">
          General-purpose chat tools were built for gaming servers and corporate
          offices. See how Zedu provides the purpose-built structure, built-in
          calling, and cohort-friendly economics that bootcamps and academies
          need.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <ArrowBtn text="Start Free Cohort" linkToHome />
          <OutlineBtn text="Book a Demo" href="/contact-sales" />
        </div>
      </section>

      {/* Comparison Cards Hub */}
      <section className="border-t border-neutral-100 bg-[#FAFAFF] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Select a Comparison
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              Unbiased, factual breakdowns of features, pricing, and student
              experience
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Zedu vs Discord */}
            <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    Discord Alternative
                  </span>
                  <span className="text-xs font-medium text-neutral-400">
                    Community & Voice
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-neutral-900 sm:text-2xl">
                  Zedu vs. Discord
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  Discord is great for casual hangout servers and gaming clans,
                  but bootcamps struggle with scattered resources, gaming
                  alerts, and noise. See why structured cohorts thrive on Zedu.
                </p>

                <div className="mt-6 space-y-2.5">
                  <div className="flex items-start gap-2 text-xs text-neutral-700 sm:text-sm">
                    <span className="font-semibold text-primary-600">
                      Zedu:
                    </span>{" "}
                    Dedicated cohort module channels & File Explorer
                  </div>
                  <div className="flex items-start gap-2 text-xs text-neutral-700 sm:text-sm">
                    <span className="font-semibold text-primary-600">
                      Zedu:
                    </span>{" "}
                    Built-in Buzz audio/video calls with screen sharing
                  </div>
                  <div className="flex items-start gap-2 text-xs text-neutral-700 sm:text-sm">
                    <span className="font-semibold text-primary-600">
                      Zedu:
                    </span>{" "}
                    Distraction-free, safe educational boundary
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-neutral-100 pt-5">
                <Link
                  href="/compare/zedu-vs-discord"
                  className="inline-flex w-full items-center justify-between rounded-xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-100"
                >
                  <span>Read Full Discord Comparison</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Zedu vs Slack */}
            <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Slack Alternative
                  </span>
                  <span className="text-xs font-medium text-neutral-400">
                    Enterprise SaaS
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-neutral-900 sm:text-2xl">
                  Zedu vs. Slack
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  Slack is the corporate office standard, but per-seat
                  subscriptions ($7.25–$15.00/user/month list pricing) and the
                  90-day history limit on free plans create challenges for
                  cohorts. Discover Zedu's cohort-friendly platform.
                </p>

                <div className="mt-6 space-y-2.5">
                  <div className="flex items-start gap-2 text-xs text-neutral-700 sm:text-sm">
                    <span className="font-semibold text-primary-600">
                      Zedu:
                    </span>{" "}
                    Predictable cohort pricing — no per-student seat penalties
                  </div>
                  <div className="flex items-start gap-2 text-xs text-neutral-700 sm:text-sm">
                    <span className="font-semibold text-primary-600">
                      Zedu:
                    </span>{" "}
                    Full message & shared resource retention
                  </div>
                  <div className="flex items-start gap-2 text-xs text-neutral-700 sm:text-sm">
                    <span className="font-semibold text-primary-600">
                      Zedu:
                    </span>{" "}
                    Built-in Buzz voice and video calls with screen sharing
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-neutral-100 pt-5">
                <Link
                  href="/compare/zedu-vs-slack"
                  className="inline-flex w-full items-center justify-between rounded-xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-100"
                >
                  <span>Read Full Slack Comparison</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Education Needs Dedicated Software */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Why Bootcamps Choose Purpose-Built Education Software
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              The four foundational pillars separating Zedu from general-purpose
              workplace chat
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-neutral-900">
                Cohort Organization
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                Channels automatically map to syllabus milestones, cohorts, and
                project groups without manual role headaches.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-neutral-900">
                Built-in Buzz Calling
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                Real-time audio and video calls with screen sharing, call
                timers, and participant controls directly inside your channels.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-neutral-900">
                Predictable Economics
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                Predictable cohort-based pricing designed for education so
                expanding enrollment doesn&apos;t penalize your budget.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-neutral-900">
                Focused & Distraction-Free
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                A professional environment without outside gaming popups, public
                advertising, or default open server direct messages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Navigation to Solutions */}
      <section className="border-t border-neutral-100 bg-[#FAFAFF] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Explore Zedu for Your Organization
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              Tailored solutions for modern educators, mentors, and
              administrators
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/solutions/bootcamps"
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
            >
              <div>
                <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-neutral-900 transition group-hover:text-primary-600">
                  Bootcamps
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Run structured cohorts with lesson channels, live calls,
                  files, and mentor feedback.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                Learn more{" "}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/solutions/schools"
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
            >
              <div>
                <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <School className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-neutral-900 transition group-hover:text-primary-600">
                  K-12 & Schools
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Safe, organized communication connecting teachers, students,
                  and administration.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                Learn more{" "}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/solutions/universities"
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
            >
              <div>
                <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-neutral-900 transition group-hover:text-primary-600">
                  Universities
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Campus-wide collaboration with department channels and secure
                  academic spaces.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                Learn more{" "}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/pricing"
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
            >
              <div>
                <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-neutral-900 transition group-hover:text-primary-600">
                  Pricing Plans
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  Predictable cohort plans designed to scale without per-seat
                  penalty fees.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                View Pricing{" "}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic CTA Footer Banner */}
      <DynamicFooter
        text="Ready to Experience Education-First Communication?"
        description="Launch your next cohort with organized channels, built-in live video classrooms, and predictable pricing."
      />
    </div>
  );
}
