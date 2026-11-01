import { ArrowBtn, OutlineBtn } from "../ui/Button";

export const DynamicFooter = ({
  text,
  description,
}: {
  text: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-5 bg-blue-50/30 px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16">
      <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
        {text}
      </h2>
      <p className="max-w-2xl text-base text-neutral-600">{description}</p>
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-2">
        <ArrowBtn
          text="Get started for free"
          className="w-full sm:w-auto"
          linkToHome
        />
        <OutlineBtn
          text="Contact Sales"
          className="w-full sm:w-auto"
          href="/contact-sales"
        />
      </div>
    </div>
  );
};
