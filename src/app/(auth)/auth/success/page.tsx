"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Success: React.FC = () => {
  const logo: string = "/logomobile.svg";
  const desklogo: string = "/login_img.svg";
  const success: string = "/success.png";

  return (
    <section className="w-full min-h-screen flex flex-col ">
      <div className="flex items-center justify-between w-full py-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image src="/Zedu.png" alt="Zedu home" width={86} height={31} />
        </Link>
        <div>
          Go back to Login?{" "}
          <Link href={"/auth/login"} className="text-[#7141F8]">
            Sign In
          </Link>
        </div>
      </div>

      <div className="w-full md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-center justify-center pt-[30px] md:pt-[50px]">
        <main className="flex flex-col gap-6 mx-auto md:mx-auto items-center">
          <div className="flex flex-col gap-[32px] items-center">
            <h3 className="font-semibold text-2xl text-[#1D2939] text-center">
              Awesome! Email sent.
            </h3>
            <Image src={success} alt="success" width={120} height={120} />
            <Suspense fallback={<p>Loading email...</p>}>
              <SuccessContent />
            </Suspense>
          </div>
        </main>
      </div>
    </section>
  );
};
const SuccessContent: React.FC = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <p className="font-normal text-lg text-[#344054] text-center">
      We&apos;ve just sent an email to <strong>{email}</strong> with detailed
      instructions on how to access your account.
    </p>
  );
};
export default Success;
