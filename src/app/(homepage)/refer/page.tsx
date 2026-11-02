import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "~/lib/env-urls";
import { ReferProgramForm } from "./refer-program-form";

export const metadata: Metadata = {
  title: "Refer a Learning Program to Zedu",
  description:
    "Know a school, bootcamp, or learning community that could benefit from Zedu? Introduce the team and help them discover a better way to learn together.",
  alternates: { canonical: siteUrl("/refer") },
  openGraph: {
    title: "Refer a Learning Program to Zedu",
    description: "Introduce a school, bootcamp, or learning community to Zedu.",
    url: siteUrl("/refer"),
    siteName: "Zedu",
    type: "website",
  },
};

const steps = [
  {
    number: "01",
    title: "Tell us about them",
    description:
      "Share a few details about the program and who we can contact.",
  },
  {
    number: "02",
    title: "We make the introduction",
    description: "Our team will reach out to learn about their community.",
  },
  {
    number: "03",
    title: "We keep you in the loop",
    description: "We’ll follow up with you as the conversation progresses.",
  },
];

export default function ReferProgramPage() {
  return (
    <main className="relative mt-20 overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-gradient-to-b from-[#efecff]/80 via-[#f6f4ff]/40 to-transparent"
      />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-neutral-600">
          <Link href="/" className="hover:text-primary-600 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            ›
          </span>
          <span aria-current="page" className="font-medium text-neutral-900">
            Refer a program
          </span>
        </nav>

        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#6042EC]/10 px-4 py-2 text-sm font-semibold text-[#6042EC]">
            Help another learning community thrive
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1f2530] sm:text-5xl">
            Know a program that could use Zedu?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
            Introduce us to a school, bootcamp, or learning community. We’ll
            reach out, learn what they need, and keep you updated.
          </p>
          <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-[#6042EC]/15 bg-white/80 p-5 text-left shadow-sm sm:p-6">
            <p className="font-semibold text-[#1f2530]">
              A thank-you for making the connection
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Referral reward details are being finalized. We’ll share the
              approved terms with you before any referral reward is offered.
            </p>
          </div>
        </section>

        <section
          className="mt-14 grid gap-5 sm:grid-cols-3 sm:gap-6"
          aria-labelledby="how-it-works"
        >
          <h2 id="how-it-works" className="sr-only">
            How it works
          </h2>
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <span className="text-sm font-bold tracking-wider text-[#6042EC]">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-[#1f2530]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {step.description}
              </p>
            </article>
          ))}
        </section>

        <section
          className="mx-auto mt-14 grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
          aria-labelledby="referral-form-title"
        >
          <div className="pt-3">
            <h2
              id="referral-form-title"
              className="text-3xl font-bold text-[#1f2530]"
            >
              Make an introduction
            </h2>
            <p className="mt-4 leading-7 text-neutral-600">
              Share the best way to reach you and the program. We’ll use these
              details only to follow up on this introduction.
            </p>
            <p className="mt-4 text-sm leading-6 text-neutral-500">
              Please only share someone’s contact details if you have their
              permission for Zedu to contact them.
            </p>
          </div>
          <ReferProgramForm />
        </section>
      </div>
    </main>
  );
}
