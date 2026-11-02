import Link from "next/link";
import { CheckIcon } from "../../_components/svgs";
import { contactSalesBenefits } from "./contactSalesData";

export const ContactSalesBenefits = ({
  booking = false,
}: {
  booking?: boolean;
}) => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 text-left sm:gap-5 lg:pl-4">
      <h1 className="text-3xl font-semibold leading-tight text-[#171717] sm:text-4xl lg:text-5xl">
        {booking ? (
          <>
            Let’s explore how <span className="text-[#6f4ef6]">Zedu</span> can
            work for you.
          </>
        ) : (
          <>
            Talk with our <span className="text-[#6f4ef6]">sales team</span>
          </>
        )}
      </h1>

      <p className="text-base text-[#4b4b4b] sm:text-lg">
        {booking
          ? "Book a demo with our team to see how Zedu helps educational organisations manage learning, people and impact — all in one place."
          : "Get expert guidance to unlock the full potential of Zedu."}
      </p>

      <ul className="ml-0 flex flex-col gap-2 text-sm leading-relaxed text-[#3f3f46] sm:ml-3 sm:gap-3 sm:text-base">
        {booking
          ? [
              [
                "Tailored to your needs",
                "See how Zedu can be configured for your organisation’s goals.",
              ],
              [
                "Get your questions answered",
                "Talk through your use cases with our team of education experts.",
              ],
              [
                "Discover what’s possible",
                "Explore features, integrations and next steps for your institution.",
              ],
            ].map(([title, description]) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#6f4ef6]/10">
                  <CheckIcon />
                </span>
                <div>
                  <h2 className="font-semibold text-[#171717]">{title}</h2>
                  <p className="mt-1">{description}</p>
                </div>
              </li>
            ))
          : contactSalesBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span className="mt-1 shrink-0">
                  <CheckIcon />
                </span>
                <span>{benefit}</span>
              </li>
            ))}
      </ul>

      <p className="text-sm text-[#595959] sm:text-base">
        Looking for product or customer support? Visit our{" "}
        <Link
          href="/pricing#help-center"
          className="text-[#6f4ef6] underline underline-offset-4"
        >
          Help Center.
        </Link>
      </p>
    </div>
  );
};
