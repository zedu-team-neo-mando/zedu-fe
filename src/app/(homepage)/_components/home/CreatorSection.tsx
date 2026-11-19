import { Clapperboard, Handshake, MessagesSquare } from "lucide-react";
import { ArrowBtn } from "../ui/Button";
import {
  creatorFeatures,
  creatorJourney,
  creatorSectionCopy,
} from "../../_lib/creatorSectionData";

const creatorFeatureIcons = [Clapperboard, MessagesSquare, Handshake];

// Desktop only: the section is hidden below the lg breakpoint.
export const CreatorSection = () => {
  return (
    <section
      aria-labelledby="creator-section-heading"
      className="relative isolate hidden w-full flex-col items-center gap-12 overflow-hidden bg-primary-50 px-12 py-20 text-center lg:flex"
    >
      <div className="flex flex-col items-center gap-3">
        <h2
          id="creator-section-heading"
          className="max-w-4xl text-4xl font-semibold leading-tight text-neutral-900"
        >
          Train the Next Wave of{" "}
          <span className="text-primary-500">YouTube Creators</span> on Zedu
        </h2>
        <p className="max-w-[65%] text-lg text-neutral-600">
          {creatorSectionCopy.description}
        </p>
      </div>

      <div className="grid w-full max-w-7xl grid-cols-3 gap-6">
        {creatorFeatures.map((feature, index) => {
          const Icon = creatorFeatureIcons[index];
          return (
            <article
              key={feature.title}
              className="flex flex-col items-start rounded-2xl border border-primary-100 bg-white px-8 pb-10 pt-9 text-left"
            >
              <span
                aria-hidden="true"
                className="mb-7 flex size-[52px] items-center justify-center rounded-xl bg-primary-500 text-white"
              >
                <Icon className="size-6" strokeWidth={2} />
              </span>
              <h3 className="mb-3 text-xl font-bold leading-snug text-blue-500">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-neutral-600">{feature.desc}</p>
            </article>
          );
        })}
      </div>

      <div className="flex w-full max-w-7xl flex-col items-center gap-6 rounded-2xl border border-primary-100 bg-white px-8 py-10">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold text-neutral-900">
            {creatorSectionCopy.journeyHeading}
          </h3>
          <p className="max-w-2xl text-neutral-600">
            {creatorSectionCopy.journeyDescription}
          </p>
        </div>
        <ol className="grid w-full grid-cols-4">
          {creatorJourney.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col items-center gap-3 px-4 text-center"
            >
              {index < creatorJourney.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] top-5 h-0.5 bg-primary-100"
                />
              )}
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white"
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-900">
                  {step.title}
                </span>
                <span className="text-sm text-neutral-600">{step.desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ArrowBtn text={creatorSectionCopy.ctaText} linkToHome />
    </section>
  );
};
