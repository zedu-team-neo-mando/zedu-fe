import type { Metadata } from "next";
import { ContributorCard } from "../../_components/contributors/ContributorCard";
import { zeduQuetzalContributors } from "./zedu-quetzal-contributors";
import { siteUrl } from "~/lib/env-urls";

export const metadata: Metadata = {
  title: "Team Quetzal Contributors",
  description:
    "Meet the members of Team Quetzal who helped build Zedu during HNG 15.",
  alternates: {
    canonical: siteUrl("/contributors/zedu-quetzal"),
  },
};

const QuetzalContributorsPage = () => {
  return (
    <div className="space-y-12 pb-20">
      <section className="relative isolate mt-10 flex w-full flex-col items-center gap-4 overflow-hidden px-4 pt-10 text-center sm:gap-6 sm:px-8 sm:pt-16 lg:px-12">
        <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
          Meet <span className="text-primary-500">Team Quetzal</span>
        </h1>
        <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
          The {zeduQuetzalContributors.length} contributors who came together to
          build and improve Zedu during HNG 15.
        </p>
      </section>

      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {zeduQuetzalContributors.map((contributor) => (
            <ContributorCard key={contributor.username} {...contributor} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuetzalContributorsPage;
