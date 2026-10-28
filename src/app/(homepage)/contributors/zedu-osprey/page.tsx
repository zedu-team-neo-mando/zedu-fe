import { Metadata } from "next";
import { siteUrl } from "~/lib/env-urls";
import { ContributorsDirectory } from "./_components/contributors-directory";
import { zeduOspreyContributors } from "./_lib/contributors";

export const metadata: Metadata = {
  title: "Zedu Osprey Team Contributors",
  description:
    "Meet the amazing members of the Zedu Osprey team who helped build Zedu.",
  alternates: {
    canonical: siteUrl("/contributors/zedu-osprey"),
  },
};

const ZeduOspreyContributorsPage = () => {
  return (
    <main className="relative isolate overflow-hidden pb-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-gradient-to-b from-primary-50/80 via-white to-white"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-20 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl"
        aria-hidden="true"
      />

      <section className="mx-auto mt-10 flex w-full max-w-4xl flex-col items-center gap-5 px-4 pb-12 pt-12 text-center sm:px-8 sm:pb-16 sm:pt-20">
        <span className="rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 shadow-sm backdrop-blur">
          Built together
        </span>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
          Meet <span className="text-primary-500">Zedu Osprey</span>
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600 sm:text-lg sm:leading-8">
          Celebrating the {zeduOspreyContributors.length} contributors who
          brought their ideas, craft, and energy to Zedu.
        </p>
        <p className="text-xs font-medium text-neutral-500 sm:text-sm">
          Hover over a profile — or tap it — to learn more.
        </p>
      </section>

      <ContributorsDirectory contributors={zeduOspreyContributors} />
    </main>
  );
};

export default ZeduOspreyContributorsPage;
