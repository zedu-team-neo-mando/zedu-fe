import React from "react";
import { Quote, Star, Award } from "lucide-react";
import type { CompetitorPageConfig } from "../_lib/competitorData";

type QuotesProps = {
  config: CompetitorPageConfig;
};

export const SocialProofQuotes: React.FC<QuotesProps> = ({ config }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold mb-3">
          <Award className="w-4 h-4 text-emerald-600" />
          Real Educator Testimonials
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Why Instructors &amp; Academies Switched from {config.name}
        </h2>
        <p className="mt-2 text-neutral-600 text-sm sm:text-base">
          Read direct feedback from directors, professors, and mentors who
          migrated their cohorts to Zedu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.testimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div>
              {/* Highlight Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold mb-4">
                <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                {t.highlight}
              </div>

              {/* Quote text */}
              <p className="text-neutral-700 text-sm leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0">
                {t.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  {t.author}
                </div>
                <div className="text-xs text-neutral-500">
                  {t.role} • {t.institution}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
