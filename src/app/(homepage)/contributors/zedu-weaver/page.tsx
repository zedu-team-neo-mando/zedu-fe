import type { Metadata } from "next";
import { ContributorCard } from "~/app/(homepage)/_components/contributors/ContributorCard";
import { zeduWeaverContributors } from "~/app/(homepage)/contributors/zedu-weaver/contributors";
import { siteUrl } from "~/lib/env-urls";

export const metadata: Metadata = {
  title: "Zedu-Weaver — Our Team",
  description: `Meet the ${zeduWeaverContributors.length} members of the Zedu-Weaver team.`,
  alternates: {
    canonical: siteUrl("/contributors/zedu-weaver"),
  },
};

/** Renders the Weaver team roster using shared contributor cards. */
export default function ContributorsPage() {
  return (
    <main className="min-h-screen bg-[#f4f1fb] font-[Arial,Helvetica,sans-serif] text-[#1c1230] antialiased [color-scheme:light]">
      <div className="mx-auto max-w-[1280px] px-5 py-6 sm:px-6 sm:py-7 md:p-8 lg:px-14 lg:pb-8 lg:pt-11">
        <header className="pb-8 pt-[18px] md:pb-[42px]">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#713bf3]">
            Our team
          </p>
          <h1 className="break-words text-[clamp(2.5rem,7.5vw,6rem)] font-medium leading-[1.08] tracking-[-0.065em]">
            Zedu-Weaver
            <span className="text-[#713bf3]" aria-hidden="true">
              .
            </span>
          </h1>
        </header>

        <section aria-labelledby="members-heading">
          <div className="flex items-center justify-between gap-4 border-t border-[#e5dff1] py-[22px]">
            <h2 id="members-heading" className="text-lg font-medium">
              Team members
            </h2>
            <span className="text-sm text-[#6c617e]">
              {zeduWeaverContributors.length} members
            </span>
          </div>
          <ol className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
            {zeduWeaverContributors.map((contributor) => (
              <li key={contributor.name}>
                <ContributorCard {...contributor} />
              </li>
            ))}
          </ol>
        </section>

        <footer className="flex justify-between gap-4 pt-8 text-sm text-[#6c617e]">
          <span>Zedu-Weaver</span>
          <span className="tracking-[0.16em] text-[#713bf3]" aria-hidden="true">
            ZW / {zeduWeaverContributors.length}
          </span>
        </footer>
      </div>
    </main>
  );
}
