"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { SessionRequest } from "~/utils/new-request";

const AutoLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [failed, setFailed] = useState(false);

  // verify the session id
  useEffect(() => {
    if (!sessionId) {
      setFailed(true);
      return;
    }
    const verifySession = async () => {
      const res = await SessionRequest("/users/me", sessionId as string);
      if (res.status === 200 || res.status === 201) {
        const user = res?.data?.data?.user;
        localStorage.setItem("token", sessionId as string);
        localStorage.setItem("useremail", user?.email);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("orgId", user?.current_org);
        const orgSlug = user?.current_organisation_slug;
        if (orgSlug) {
          localStorage.setItem("orgSlug", orgSlug);
        }
        router.push(orgSlug ? `/${orgSlug}` : "/client");
      } else {
        setFailed(true);
      }
    };
    verifySession();
  }, [sessionId, router]);

  if (failed) {
    return (
      <section className="w-full text-center md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start pt-[30px]">
        <div className="w-full flex flex-col justify-center mt-[100px] md:mt-[160px] items-center gap-[8px] mb-[32px] ">
          <h1 className="w-full text-center text-[18px] md:text-[22px] font-[600] leading-[30px] md:leading-[35px]">
            Session Invalid or Expired
          </h1>
          <p className="w-full text-center text-[14px] md:text-[16px] text-[#344054] font-[400] leading-[21px] md:leading-[27px]">
            Please go to the login page and try again
          </p>
        </div>

        <div className="w-full text-center">
          <Button
            type="button"
            variant="default"
            className="py-6 bg-[#7141F8] hover:bg-[#8760f8] text-white mx-auto"
            onClick={() => router.push("/auth/login")}
          >
            Proceed to Login
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
    );
  }

  return (
    <section className="w-full text-center md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start pt-[30px]">
      <div className="w-full flex flex-col justify-center mt-[100px] md:mt-[160px] items-center gap-[8px] mb-[32px] ">
        <Loading height="60" width="60" color="#7141F8" />
        <p className="text-gray-600 text-sm">Authenticating...</p>
      </div>
    </section>
  );
};

export default AutoLogin;
