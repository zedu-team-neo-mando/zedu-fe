"use client";
import React, { useContext } from "react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAcceptOrgInvite from "~/app/(accept_org_invitation)/accept_org_invitation/useAcceptOrgInvite";
import { DataContext } from "~/store/GlobalState";

const Welcome = () => {
  const router = useRouter();
  const { organization } = useAcceptOrgInvite();
  const { state } = useContext(DataContext);
  const { orgSlug } = state;

  //

  return (
    <div className="w-full">
      <section className="w-full max-w-2xl px-5 mx-auto">
        <div className="flex flex-col justify-center mt-20">
          <div className="flex gap-2">
            <Image src="/Zedu.png" alt="Icon" width={86} height={31} />
          </div>
        </div>

        <div className="mt-[50px]">
          <h1 className="text-[#1D2939] text-[2rem] font-semibold leading-[130%]">
            {organization?.orgName ? (
              <>
                Welcome to{" "}
                <span className="text-primary-500">{organization.orgName}</span>
              </>
            ) : (
              "Welcome"
            )}
          </h1>
          <p className="w-full max-w-[37.7rem] text-[#344054] text-base md:text-lg font-normal leading-normal mb-4 md:mb-6">
            Whether you’re managing classrooms, running bootcamp cohorts, or
            coordinating academic programs, Zedu adapts to your learning
            environment. Choose from pre-built solutions or customize workflows
            to support teaching, communication, and everyday operational tasks.
          </p>

          <div>
            <Button
              onClick={() => router.push(`/${orgSlug}/home/get-started`)}
              className=" bg-blue-400 w-[180px] py-6 px-10 text-white text-base font-medium hover:bg-blue-300"
            >
              Get Started
            </Button>
          </div>

          <p className="text-sm md:text-md text-left sm text-[rgba(110,110,111,1)] my-6">
            By continuing, you are agreeing to our Privacy Policy, Main Service
            Agreement, Terms of Service, and Cookie Policy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
