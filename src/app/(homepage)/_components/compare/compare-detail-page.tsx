import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Check,
  X,
  ArrowRight,
  GraduationCap,
  School,
  Building2,
  Sparkles,
  ShieldCheck,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { DynamicFooter } from "~/app/(homepage)/_components/footer/dynamic-footer";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { comparisonPages, allComparisonSlugs } from "./comparisonData";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allComparisonSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = comparisonPages[slug];

  if (!data) {
    return {
      title: "Comparison Not Found | Zedu",
    };
  }

  const pageUrl = siteUrl(`/compare/${slug}`);

  return {
    title: `${data.metaTitle} | Zedu`,
    description: data.metaDescription,
    keywords: data.keywords,
    icons: {
      icon: "/TelexIcon.svg",
    },
    openGraph: {
      title: `${data.metaTitle} | Zedu`,
      description: data.metaDescription,
      url: pageUrl,
      siteName: "Zedu",
      images: [
        {
          url: ogImageUrl("og-image-5.png"),
          width: 1200,
          height: 630,
          alt: `${data.heroTitle} preview`,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.metaTitle} | Zedu`,
      description: data.metaDescription,
      images: [ogImageUrl("og-image-5.png")],
    },
    alternates: {
      canonical: pageUrl,
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
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = comparisonPages[slug];

  if (!data) {
    notFound();
  }

  const otherSlug =
    slug === "zedu-vs-discord" ? "zedu-vs-slack" : "zedu-vs-discord";
  const otherName = slug === "zedu-vs-discord" ? "Slack" : "Discord";

  return (
    <div className="relative isolate w-full bg-white text-[#1f2530]">
      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-10 pb-14 text-center sm:px-6 sm:pt-16 sm:pb-20 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600 sm:text-sm">
          <Sparkles className="h-4 w-4" />
          <span>{data.heroBadge}</span>
        </div>

        <h1 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight text-[#1f2530] sm:text-4xl md:text-5xl lg:text-5xl">
          {data.heroTitle}
        </h1>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#5a6170] sm:text-base md:text-lg">
          {data.heroSubtitle}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <ArrowBtn text="Start Free Cohort" linkToHome />
          <OutlineBtn text="Book a Demo" href="/contact-sales" />
        </div>

        {/* Quick Verdict Banner */}
        <div className="mt-12 w-full max-w-4xl rounded-2xl border border-blue-100 bg-[#F8F9FE] p-6 text-left shadow-sm sm:p-8">
          <div className="flex items-center gap-2.5 text-primary-600">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-base font-semibold uppercase tracking-wide">
              {data.verdictTitle}
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
            {data.verdictDescription}
          </p>
        </div>
      </section>

      {/* Competitor Overview Cards */}
      <section className="border-t border-neutral-100 bg-[#FAFAFF] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Platform Philosophy at a Glance
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              Comparing product priorities, strengths, and intended use cases
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Competitor Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-neutral-900">
                    {data.competitorSummary.title}
                  </h3>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    General Purpose
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {data.competitorSummary.description}
                </p>

                <div className="mt-5 rounded-lg bg-neutral-50 p-3">
                  <span className="text-xs font-semibold uppercase text-neutral-500">
                    Best For:
                  </span>
                  <p className="text-sm font-medium text-neutral-800">
                    {data.competitorSummary.bestFor}
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Key Strengths
                  </h4>
                  <ul className="mt-2.5 space-y-2">
                    {data.competitorSummary.strengths.map((str, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-neutral-700 sm:text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                    Trade-offs for Education
                  </h4>
                  <ul className="mt-2.5 space-y-2">
                    {data.competitorSummary.tradeoffs.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-neutral-700 sm:text-sm"
                      >
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Zedu Card */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-primary-500 bg-white p-6 shadow-md sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-neutral-900">
                    {data.zeduSummary.title}
                  </h3>
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                    Built for Learning
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {data.zeduSummary.description}
                </p>

                <div className="mt-5 rounded-lg bg-primary-50/50 p-3">
                  <span className="text-xs font-semibold uppercase text-primary-600">
                    Best For:
                  </span>
                  <p className="text-sm font-medium text-neutral-900">
                    {data.zeduSummary.bestFor}
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                    Native Education Advantages
                  </h4>
                  <ul className="mt-2.5 space-y-2">
                    {data.zeduSummary.strengths.map((str, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-neutral-700 sm:text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Considerations
                  </h4>
                  <ul className="mt-2.5 space-y-2">
                    {data.zeduSummary.tradeoffs.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-neutral-600 sm:text-sm"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-neutral-100 pt-5">
                <Link
                  href="/solutions/bootcamps"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 sm:text-sm"
                >
                  Explore Bootcamp Solutions{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Side-by-Side Feature Matrix
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              Detailed comparison between Zedu and {data.competitorName}
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {data.matrix.map((section) => (
              <div
                key={section.category}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
              >
                <div className="border-b border-neutral-200 bg-neutral-50/80 px-6 py-4">
                  <h3 className="text-base font-bold text-neutral-800">
                    {section.category}
                  </h3>
                </div>

                <div className="divide-y divide-neutral-100">
                  {section.items.map((row) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-1 p-4 sm:grid-cols-12 sm:gap-4 sm:px-6 sm:py-5"
                    >
                      <div className="sm:col-span-4">
                        <span className="text-sm font-semibold text-neutral-900 sm:text-base">
                          {row.feature}
                        </span>
                      </div>

                      {/* Zedu Value */}
                      <div className="mt-3 sm:col-span-4 sm:mt-0 sm:border-l sm:border-neutral-100 sm:pl-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 sm:text-sm">
                            Zedu: {row.zedu.label}
                          </span>
                        </div>
                        {row.zedu.description && (
                          <p className="mt-1 text-xs text-neutral-600 sm:pl-7">
                            {row.zedu.description}
                          </p>
                        )}
                      </div>

                      {/* Competitor Value */}
                      <div className="mt-3 sm:col-span-4 sm:mt-0 sm:border-l sm:border-neutral-100 sm:pl-4">
                        <div className="flex items-center gap-2">
                          {row.competitor.status === true ? (
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          ) : row.competitor.status === "partial" ? (
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                              ~
                            </span>
                          ) : (
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                              <X className="h-3.5 w-3.5" />
                            </span>
                          )}
                          <span className="text-xs font-semibold text-neutral-800 sm:text-sm">
                            {data.competitorName}: {row.competitor.label}
                          </span>
                        </div>
                        {row.competitor.description && (
                          <p className="mt-1 text-xs text-neutral-500 sm:pl-7">
                            {row.competitor.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="border-t border-neutral-100 bg-[#FAFAFF] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Deep Dives: Key Educational Differences
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              Why general-purpose chat tools struggle with cohort-based learning
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {data.deepDives.map((deep, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">
                  {deep.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">{deep.subtitle}</p>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-primary-200 bg-primary-50/30 p-5">
                    <h4 className="text-sm font-semibold text-primary-700 sm:text-base">
                      {deep.zeduHeading}
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {deep.zeduPoints.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs text-neutral-700 sm:text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
                    <h4 className="text-sm font-semibold text-neutral-800 sm:text-base">
                      {deep.competitorHeading}
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {deep.competitorPoints.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs text-neutral-600 sm:text-sm"
                        >
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Navigation to Solutions */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Explore Zedu for Your Organization
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              See how our learning infrastructure adapts to your specific
              educational model
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
                  Transparent Pricing
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

      {/* Frequently Asked Questions */}
      <section className="border-t border-neutral-100 bg-[#FAFAFF] py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2530] sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-[#5a6170] sm:text-base">
              Common questions about switching from {data.competitorName} to
              Zedu
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {data.faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-primary-200 open:border-primary-300 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-neutral-900 sm:text-base">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 rounded-full p-1 text-neutral-400 transition-transform group-open:rotate-180 group-open:text-primary-600">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          {/* Cross comparison link */}
          <div className="mt-12 text-center">
            <p className="text-xs text-neutral-500 sm:text-sm">
              Also considering other platforms?{" "}
              <Link
                href={`/compare/${otherSlug}`}
                className="font-semibold text-primary-600 underline hover:text-primary-700"
              >
                Check out Zedu vs. {otherName}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic CTA Footer Banner */}
      <DynamicFooter text={data.ctaHeading} description={data.ctaDescription} />
    </div>
  );
}
