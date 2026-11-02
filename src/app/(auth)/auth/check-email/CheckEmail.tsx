"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { showError, showSuccess } from "~/components/toast/sonner";
import { formatTime } from "~/utils";

const RESEND_COOLDOWN_SECONDS = 60;

const secondsUntil = (deadline: number) =>
  Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

const CheckEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  // When the cooldown ends, as a timestamp. The countdown is recalculated from
  // the clock, so it stays correct if the browser pauses the tab's timers.
  const [cooldownEndsAt, setCooldownEndsAt] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldownEndsAt) return;
    const update = () => setCooldown(secondsUntil(cooldownEndsAt));
    update();
    const timerId = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timerId);
      document.removeEventListener("visibilitychange", update);
    };
  }, [cooldownEndsAt]);

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    if (!email) {
      showError(
        "We couldn't find your email address. Please request a password reset again."
      );
      return;
    }

    setResending(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/email-request`,
        { email }
      );
      setCooldownEndsAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
      showSuccess(res?.data?.message || "Email sent. Check your inbox.");
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      showError(
        message ||
          "Couldn't resend the email. Check your connection and try again."
      );
    } finally {
      setResending(false);
    }
  };

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
                Get real-time notifications per deliverables and achieve
                efficient communication with teammates and your deployed
                solutions.
              </p>
            </div>
            <Image
              src="/login_img.svg"
              alt="loginImg"
              width={320}
              height={320}
              className="flex justify-center items-center mx-auto md:w-[420px] md:h-[420px]"
            />
          </div>
        </section>
        <section className="w-full md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start justify-center pt-[20px] md:pt-[30px]">
          <Link href="/">
            <Image
              src="/logomobile.svg"
              alt="logo_mobile"
              width={86}
              height={31}
              className="sm:block md:block lg:hidden flex"
            />
          </Link>
          <div className="w-full flex flex-col justify-center mt-[60px] md:mt-[80px] items-center gap-[8px] mb-[10px]">
            <h1 className="w-full text-left text-[24px] md:text-[28px] font-[600] leading-[30px] md:leading-[35px]">
              Check your Email
            </h1>
            <p className="w-full text-left text-[14px] md:text-[16px] text-[#344054] font-[400] leading-[21px] md:leading-[27px] mb-[32px]">
              We have sent an email with the password reset information to{" "}
              {email
                ? email.replace(/(.{2}).+(@.+)/, "$1***$2")
                : "your email address"}
              .
            </p>
            <p className="w-full text-center text-[12px] md:text-[14px] text-[#344054] font-[400] leading-[18px] md:leading-[21px]">
              Didn’t receive the email? Check your spam folder or
            </p>
          </div>
          <div className="w-full flex flex-col gap-[16px]">
            <Button
              type="button"
              variant="default"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="py-6 bg-[#7141F8] hover:bg-[#8760f8] text-white"
            >
              {cooldown > 0 ? (
                `Resend Email in ${formatTime(cooldown)}`
              ) : (
                <>Resend Email {resending && <Loading />}</>
              )}
            </Button>
            <Link href="/auth/login">
              <Button
                type="button"
                variant="outline"
                className="w-full py-6 border border-[#8760f8] text-[#8760f8] bg-white hover:bg-[#7141F8] hover:text-white"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default CheckEmail;
