import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteUrl } from "~/lib/env-urls";
import { contributors } from "./_lib/contributors";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_CLIENT_URL
    ? new URL(siteUrl())
    : undefined,
  title: "Team Zedu-Gannet Contributors",
  description:
    "Meet Team Zedu-Gannet — contributors building collaborative learning experiences on Zedu.",
  alternates: {
    canonical: siteUrl("/contributors/zedu-gannet"),
  },
};

export default function ZeduGannetContributorsPage() {
  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <section className="relative isolate mt-10 flex w-full flex-col items-center gap-4 overflow-hidden px-4 pt-10 text-center sm:gap-5 sm:px-8 sm:pt-16 lg:px-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-500 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>TEAM ZEDU-GANNET</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
          Team <span className="text-primary-500">Zedu-Gannet</span>
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          The {contributors.length} contributors building and contributing to
          Zedu.
        </p>
      </section>

      {/* Contributor Cards Section (2 per row, rectangular, simple and professional) */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          {contributors.map((member) => (
            <article
              key={member.id}
              className="flex min-h-[100px] flex-col justify-center rounded-xl border border-neutral-200 bg-white px-7 py-6 shadow-xs transition-all duration-200 hover:border-primary-300 hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-neutral-900">
                {member.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-blue-600">
                {member.username}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="flex w-full flex-col items-center gap-4 px-4 text-center sm:px-8 lg:px-12">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-3xl">
          Want to See Your Name Here?
        </h2>
        <p className="max-w-md text-xs text-neutral-600 sm:text-base">
          Zedu is built by people like you. Join the platform and be part of
          what we build next.
        </p>
        <Link
          href="/auth/login"
          className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-400 hover:shadow-lg"
        >
          <span>Get Started</span>
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </section>
    </div>
  );
}
