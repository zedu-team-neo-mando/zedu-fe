"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "~/components/ui/toaster";
import { PostRequest } from "~/utils/request";
import Loading from "~/components/ui/loading";
import { showSuccess } from "~/components/toast/sonner";

function MagicLink() {
  const router = useRouter();
  const [buttonloading, setButtonloading] = useState(false);
  const [loading, setloading] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [orgSlug, setOrgSlug] = useState("");

  // This ref will track whether the token has been verified
  const hasVerifiedRef = React.useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("not-verified");
      setloading(false);
      return;
    }
    if (!hasVerifiedRef.current) {
      const VerifyToken = async () => {
        hasVerifiedRef.current = true; // Set ref to true to prevent re-running

        const res = await PostRequest("/auth/magick-link/verify", { token });

        if (res?.status === 200 || res?.status === 201) {
          // check the status of the user if its a new user or existing user

          setUserStatus(res?.data?.data?.user?.is_onboarded);

          localStorage.setItem("token", res?.data?.data?.access_token);
          localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
          localStorage.setItem("orgId", res?.data?.data?.user?.current_org);
          const nextOrgSlug = res.data.data.user.current_organisation_slug;
          if (nextOrgSlug) {
            localStorage.setItem("orgSlug", nextOrgSlug);
          }
          setOrgSlug(nextOrgSlug);

          showSuccess(res?.data?.message);
          setStatus("verified");
        } else {
          setStatus("not-verified");
        }

        setloading(false);
      };

      VerifyToken();
    }
  }, [token]);

  const handleDashboard = async () => {
    setButtonloading(true);

    setTimeout(() => {
      if (status === "verified") {
        if (userStatus) {
          router.push(`/${orgSlug}`);
        } else {
          router.push(`/${orgSlug}/welcome`);
        }
      } else {
        router.push("/auth/login");
      }
    }, 2000);
  };

  //

  return (
    <>
      <Toaster />
      <main className="w-full min-h-screen flex flex-col">
        {loading ? (
          <section className="w-full text-center md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start pt-[30px]">
            <div className="w-full flex flex-col justify-center mt-[100px] md:mt-[160px] items-center gap-[8px] mb-[32px] ">
              <Loading height="60" width="60" color="#7141F8" />
            </div>
          </section>
        ) : (
          <>
            {status === "verified" ? (
              <section className="w-full text-center md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start pt-[30px]">
                <Link href="/">
                  <Image
                    src="/logomobile.svg"
                    alt="logo_mobile"
                    width={86}
                    height={31}
                    className="w-full sm:block md:block mx-auto lg:hidden flex"
                  />
                </Link>

                <div className="w-full flex flex-col justify-center mt-[100px] md:mt-[160px] items-center gap-[8px] mb-[32px] ">
                  <h1 className="w-full text-center text-[18px] md:text-[22px] font-[600] leading-[30px] md:leading-[35px]">
                    Login Successful
                  </h1>
                  <p className="w-full text-center text-[14px] md:text-[16px] text-[#344054] font-[400] leading-[21px] md:leading-[27px]">
                    Please click the button below to proceed to your dashboard
                  </p>
                </div>

                <div className="w-full text-center">
                  <Button
                    type="submit"
                    variant="default"
                    className="py-6 bg-[#7141F8] hover:bg-[#8760f8] text-white mx-auto"
                    onClick={handleDashboard}
                  >
                    {buttonloading ? (
                      <span className="flex items-center gap-x-2">
                        <span className="animate-pulse">Loading...</span>{" "}
                        <Loading width="20" height="20" />
                      </span>
                    ) : (
                      "Proceed to dashboard"
                    )}
                  </Button>
                </div>
              </section>
            ) : (
              <section className="w-full text-center md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start pt-[30px]">
                <Link href="/">
                  <Image
                    src="/logomobile.svg"
                    alt="logo_mobile"
                    width={86}
                    height={31}
                    className="w-full sm:block md:block mx-auto lg:hidden flex"
                  />
                </Link>

                <div className="w-full flex flex-col justify-center mt-[100px] md:mt-[160px] items-center gap-[8px] mb-[32px] ">
                  <h1 className="w-full text-center text-[18px] md:text-[22px] font-[600] leading-[30px] md:leading-[35px]">
                    Token Invalid or Expired
                  </h1>
                  <p className="w-full text-center text-[14px] md:text-[16px] text-[#344054] font-[400] leading-[21px] md:leading-[27px]">
                    Please go to the magic link page and try again
                  </p>
                </div>

                <div className="w-full text-center">
                  <Button
                    type="submit"
                    variant="default"
                    className="py-6 bg-[#7141F8] hover:bg-[#8760f8] text-white mx-auto"
                    onClick={handleDashboard}
                  >
                    {buttonloading ? (
                      <span className="flex items-center gap-x-2">
                        <span className="animate-pulse">Loading...</span>{" "}
                        <Loading width="20" height="20" />
                      </span>
                    ) : (
                      "Proceed to Login"
                    )}
                  </Button>

                  <p className="text-[14px] mt-4 font-[400] leading-[21px] text-center">
                    Don’t have an account?{" "}
                    <Link href="/auth/sign-up">
                      <span className="text-[14px] font-[500] leading-[21px] text-[#7141F8] hover:text-[#0A0A0A]">
                        Sign up
                      </span>
                    </Link>
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default MagicLink;
