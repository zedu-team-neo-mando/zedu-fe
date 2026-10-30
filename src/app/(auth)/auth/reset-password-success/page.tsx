"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";

function ResetPasswordSuccess() {
  return (
    <>
      <main className="w-full min-h-screen flex flex-col md:flex-row">
        <section className="w-full md:w-[45%] bg-[#F9FAFB] px-[20px] md:px-[40px] py-[20px] hidden lg:block">
          <Link href="/">
            <Image
              src="/login_logo.svg"
              alt="Zedu home"
              width={86}
              height={31}
            />
          </Link>
          <div>
            <div className="w-full flex flex-col gap-[12px] mb-[40px] md:mb-[71px]">
              <h1 className="w-full text-center mt-[40px] md:mt-[70px] text-[24px] md:text-[28px] font-[600] leading-[30px] md:leading-[35px]">
                All Your{" "}
                <span className="text-[24px] md:text-[28px] font-[600] leading-[30px] md:leading-[35px] bg-gradient-to-t from-[#8860F8] to-[#7141F8] bg-clip-text text-transparent">
                  Workflows
                </span>{" "}
                In One Place!!!
              </h1>
              <p className="w-full text-center text-[12px] md:text-[14px] text-[#344054] font-[400] leading-[18px] md:leading-[21px] px-[20px] md:px-[90px]">
                Bring learners and educators together with organized channels,
                cohort collaboration, and AI support, all in one learning
                workspace.
              </p>
            </div>
            <Image
              src="/login_img.png"
              alt="loginImg"
              width={320}
              height={320}
              className="flex justify-center items-center mx-auto md:w-[420px] md:h-[420px]"
            />
          </div>
        </section>
        <section className="w-full md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-center justify-center pt-[20px] md:pt-[30px]">
          <Link href="/">
            <Image
              src="/logomobile.svg"
              alt="logo_mobile"
              width={86}
              height={31}
              className="sm:block md:block lg:hidden pt-[30px] flex"
            />
          </Link>
          <div className="w-full flex flex-col justify-center mt-0 md:mt-[80px] items-center gap-[8px] mb-[32px]">
            <Image
              src="/success_check.webp"
              alt="success_check"
              width={200}
              height={400}
              className="sm:block md:block flex"
            />
            <p className="w-full text-center text-[14px] md:text-[16px] text-[#344054] font-[400] leading-[21px] md:leading-[27px]">
              Password reset successfully
            </p>
          </div>

          <div className=" w-full flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[16px]">
              <Link href="/auth/login">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full py-6 bg-[#7141F8] hover:bg-[#8760f8] text-white"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ResetPasswordSuccess;
