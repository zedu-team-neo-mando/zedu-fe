"use client";
import { useContext, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GetRequest } from "~/utils/request";
import { DataContext } from "~/store/GlobalState";

import { isAutoCreatedOrg } from "~/utils/organisation";

/** Welcome onboarding view allowing user to initiate organization creation. */
const Welcome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { org } = useParams<{ org: string }>();
  const [loading, setLoading] = useState(true);
  const { state } = useContext(DataContext);
  const { orgSlug } = state;

  // check if a user is onboarded
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token") || "";
      const userstatus = await GetRequest("/auth/onboard-status", token);

      if (userstatus?.data?.data?.status && !isAutoCreatedOrg()) {
        router.push(`/${org}`);
      } else {
        setLoading(false);
      }
    })();
  }, [router, org]);

  if (loading) return;

  //
  return (
    <div className="w-full">
      <section className="w-full max-w-2xl px-5 mx-auto">
        <div className="flex flex-col justify-center items-center mt-20">
          <div className="flex gap-2 justify-center">
            <Image src="/TelexIcon.svg" alt="Icon" width={40} height={40} />
            <h1 className="font-semibold text-4xl text-center flex justify-center items-center max-lg:text-2xl">
              Zedu
            </h1>
          </div>
        </div>

        <div className="mt-[50px] text-center">
          <h1 className="font-semibold mb-3 leading-8 text-[46px] max-lg:text-3xl max-lg:font-bold">
            Welcome to Zedu.
          </h1>
          <p className=" my-8 text-center text-md md:text-lg text-balance text-[rgba(110,110,111,1)]">
            Your intelligent workspace where AI agents and humans collaborate in
            real time to get things done.
          </p>

          <div>
            <Button
              onClick={() => {
                const template = searchParams.get("template");
                router.push(
                  `/${orgSlug}/welcome/create-organization${
                    template ? `?template=${encodeURIComponent(template)}` : ""
                  }`
                );
              }}
              className=" bg-blue-400 w-[180px] py-6 px-10 text-white text-base font-medium hover hover:bg-blue-300"
            >
              Get Started
            </Button>
          </div>

          <p className="text-sm md:text-md text-left sm:text-center text-[rgba(110,110,111,1)] my-6 lg:w-[450px] mx-auto">
            By continuing, you are agreeing to our Privacy Policy, Terms of
            Service, and Cookie Policy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
