import { Quote } from "lucide-react";
import {
  testimonials,
  testimonialsAreSamples,
} from "../../_lib/testimonialsData";

export const TestimonialsSection = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="flex w-full flex-col items-center gap-8 px-4 py-12 text-center sm:gap-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="flex flex-col items-center gap-3">
        <h2
          id="testimonials-heading"
          className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl"
        >
          What Educators Say About Zedu
        </h2>
        {testimonialsAreSamples && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            Sample content
          </span>
        )}
      </div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <figure
            key={item.name}
            className="flex flex-col items-start gap-4 rounded-2xl border border-primary-100 bg-white px-6 py-7 text-left sm:px-8"
          >
            <Quote aria-hidden="true" className="size-6 text-primary-500" />
            <blockquote className="leading-relaxed text-neutral-600">
              {item.quote}
            </blockquote>
            <figcaption className="mt-auto flex flex-col">
              <span className="font-semibold text-neutral-900">
                {item.name}
              </span>
              <span className="text-sm text-neutral-600">
                {item.role}, {item.school}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
