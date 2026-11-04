"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { Toaster } from "~/components/ui/toaster";
import { PostRequest } from "~/utils/request";
import Loading from "~/components/ui/loading";
import { showSuccess } from "~/components/toast/sonner";

function MagicLink() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const router = useRouter();
  const [buttonloading, setButtonloading] = useState(false);

  const validateForm = () => {
    const newErrors = { email: "" };
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return !newErrors.email;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setButtonloading(true);

      const res = await PostRequest("/auth/magick-link", { email });

      if (res?.status === 200 || res?.status === 201) {
        showSuccess(res?.data?.message);
        router.push(`/auth/success?email=${encodeURIComponent(email)}`);
      } else {
        setButtonloading(false);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  return (
    <>
      <Toaster />
      <main className="w-full min-h-screen flex flex-col  items-center ">
        <div className="flex items-center justify-between w-full py-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image src="/Zedu.png" alt="Zedu home" width={86} height={31} />
          </Link>
          <div>
            Already have an account?{" "}
            <Link href={"/auth/login"} className="text-[#7141F8]">
              Sign In
            </Link>
          </div>
        </div>

        <section className="w-full md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start pt-[20px] md:pt-[30px]">
          <div className="w-full flex flex-col justify-center mt-[60px] md:mt-[80px] items-center gap-[8px] mb-[32px] ">
            <h1 className="w-full text-center text-[18px] md:text-[22px] font-[600] leading-[30px] md:leading-[35px]">
              Login with email link
            </h1>
            <p className="w-full text-center text-[14px] md:text-[16px] text-[#344054] font-[400] leading-[21px] md:leading-[27px]">
              Please provide your email address to receive the magic link for
              accessing your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-[16px] mb-[32px]">
              <div className="w-full flex flex-col gap-[8px]">
                <label
                  htmlFor="email"
                  className="text-[15px] font-[400] leading-[21px]"
                >
                  Email address
                </label>
                <div className="w-full flex flex-col gap-[2px]">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className={`w-full text-[14px] text-[#667085] leading-[15.12px] font-[500] h-[48px] border ${
                      errors.email ? "border-[#F81404]" : "border-[#D0D0FD]"
                    } outline-none rounded-md py-[13px] pl-[13px]`}
                  />
                  {errors.email && (
                    <small className="text-[12px] text-[#F81404]">
                      {errors.email}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[16px]">
                <Button
                  type="submit"
                  variant="default"
                  className="py-6 bg-[#7141F8] hover:bg-[#8760f8] text-white"
                >
                  {buttonloading ? (
                    <span className="flex items-center gap-x-2">
                      <span className="animate-pulse">Generating...</span>{" "}
                      <Loading width="20" height="20" />
                    </span>
                  ) : (
                    "Generate magic link"
                  )}
                </Button>

                <div className="flex justify-center items-center">
                  <p className="text-[14px] font-[400] leading-[21px]">
                    Don’t have an account?{" "}
                    <Link href="/auth/sign-up">
                      <span className="text-[14px] font-[500] leading-[21px] text-[#7141F8] hover:text-[#0A0A0A]">
                        Sign up
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default MagicLink;
