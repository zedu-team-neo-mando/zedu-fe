import Link from "next/link";
import { CheckIcon } from "../../_components/svgs";
import { contactSalesBenefits } from "./contactSalesData";

export const ContactSalesBenefits = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 text-left sm:gap-5 lg:h-full lg:justify-center lg:gap-8">
      <h1 className="text-3xl font-semibold leading-tight text-[#171717] sm:text-4xl lg:text-[clamp(2.75rem,3.6vw,3.5rem)] lg:font-bold lg:leading-[1.08]">
        Talk with our{" "}
        <span className="text-[#6f4ef6] lg:block">sales team</span>
      </h1>

      <p className="text-base text-[#4b4b4b] sm:text-lg lg:max-w-[480px] lg:text-[20px] lg:leading-[30px]">
        Get expert guidance to unlock the full potential of Zedu.
      </p>

      <ul className="ml-0 flex flex-col gap-2 text-sm leading-relaxed text-[#3f3f46] sm:ml-3 sm:gap-3 sm:text-base md:ml-0 lg:max-w-[480px] lg:gap-[22px] lg:text-[17px] lg:leading-[25px]">
        {contactSalesBenefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 lg:gap-4">
            <span className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-lg bg-[#6f4ef6]/10 lg:mt-1 lg:h-[30px] lg:w-[30px]">
              <CheckIcon />
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-[#e6e3f5] pt-5 text-sm text-[#3f3f46] sm:pt-6 sm:text-base lg:pt-8">
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
