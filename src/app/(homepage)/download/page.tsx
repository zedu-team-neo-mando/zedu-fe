import type { Metadata } from "next";
import Image from "next/image";

import { ArrowBtn, DownloadAppBtn } from "../_components/ui/Button";
import FeatureCard from "../_components/FeatureCard";
import { DynamicFooter } from "../_components/footer/dynamic-footer";
import { appStoreUrl, playStoreUrl } from "~/lib/env-urls";

const APP_STORE_URL = appStoreUrl();
const PLAY_STORE_URL = playStoreUrl();

export const metadata: Metadata = {
  title: "Download Zedu App | Mobile and Desktop Learning Workspace",
  description:
    "Download Zedu on iOS, Android, and desktop. Join classes, chat with peers, manage files, and stay updated in one connected learning workspace.",
  keywords: [
    "Zedu app download",
    "download Zedu",
    "student collaboration app",
    "learning workspace",
    "class communication app",
    "iOS learning app",
    "Android learning app",
    "desktop learning app",
  ],
  alternates: {
    canonical: "/download",
  },
  openGraph: {
    title: "Download Zedu App | Mobile and Desktop Learning Workspace",
    description:
      "Get Zedu for mobile and desktop. Learn anywhere with classes, chat, files, and real-time updates in one place.",
    url: "/download",
    type: "website",
    images: [
      {
        url: "/images/homepage/download/download-hero.png",
        width: 1200,
        height: 630,
        alt: "Zedu app preview on mobile devices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Zedu App | Mobile and Desktop Learning Workspace",
    description:
      "Download Zedu for iOS, Android, and desktop to learn, collaborate, and stay updated from anywhere.",
    images: ["/images/homepage/download/download-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const DownLoadPage = () => {
  const features = [
    {
      icon: "buzz",
      title: "Buzz (Live Huddles)",
      description:
        "Jump into real-time conversations with your class — ask questions, share ideas, and stay connected instantly.",
    },
    {
      icon: "channel",
      title: "Channels",
      description:
        "Organize discussions by topics, classes, or projects so everyone stays on the same page.",
    },
    {
      icon: "files",
      title: "File Management",
      description:
        "Access lectures, assignments, and resources anytime — keep everything organized and easy to find.",
    },
    {
      icon: "book",
      title: "Assignments & Updates",
      description:
        "Stay on top of tasks, deadlines, and announcements — never miss important updates from educators.",
    },
  ];

  return (
    <div className="min-h-screen">
      {" "}
      <section className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden px-4 pt-10 text-center sm:gap-6 sm:px-8 sm:pt-16  lg:gap-8 lg:px-12 text-white bg-primary-500 rounded-b-[3rem] mt-5">
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl text-center">
          Learn anywhere with Zedu
        </h1>
        <p className="max-w-[95%] text-xs text-neutral-100 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
          Join your classes, connect with others, and access everything right
          from your phone.
        </p>
        <div className="flex w-full max-w-xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {" "}
          <DownloadAppBtn
            text="Download on the"
            description="App Store"
            leftIcon="apple"
            href={APP_STORE_URL}
          />
          <DownloadAppBtn
            text="GET IT ON"
            description="Google Play"
            leftIcon="google"
            href={PLAY_STORE_URL}
          />
        </div>

        <div className="flex w-full max-w-md flex-col items-center justify-center gap-2 sm:gap-3">
          <div>
            <Image
              src={"/images/homepage/download/users-image.png"}
              width={150}
              height={10}
              alt="People already using zedu"
            />
          </div>
          <p className="text-neutral-100 text-center">
            Join 10,000+ students already learning
          </p>
        </div>
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/10]  w-full sm:aspect-[16/9] lg:aspect-[2/1] ">
            <Image
              src="/images/homepage/download/download-hero.png"
              alt="Preview of the Zedu Application interfaces on mobile devices"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1200px"
              className="object-contain object-center "
            />
          </div>
        </div>
      </section>
      <section className="relative isolate flex w-full flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16 lg:gap-8 lg:px-12">
        <div className="flex flex-col gap-3 items-center">
          <h1 className=" text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl text-center">
            Everything you need, In One App
          </h1>
          <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[85%] lg:max-w-[65%] lg:text-lg">
            Zedu combines communication, file sharing, and scheduling into a
            single, easy-to-use platform.
          </p>
        </div>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2">
          {features.map((f) => (
            <div className="w-full" key={f.icon}>
              <FeatureCard
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            </div>
          ))}
        </div>{" "}
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 text-left lg:grid-cols-2 lg:gap-12 mt-20">
          <div className="flex flex-col gap-6">
            <h2 className="max-w-sm text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
              Download Zedu on Your Phone
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
              Get the full experience. Join classes, chat with peers, and access
              files instantly.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <DownloadAppBtn
                text="Download on the"
                description="App Store"
                leftIcon="apple"
                href={APP_STORE_URL}
                dark
                iconColor="#FFFFFF"
              />
              <DownloadAppBtn
                text="GET IT ON"
                description="Google Play"
                leftIcon="google"
                href={PLAY_STORE_URL}
                dark
                iconColor="#FFFFFF"
              />
            </div>

            <div className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-neutral-200 px-4 py-3">
              <div className="size-[68px] bg-slate-400 rounded-sm animate-pulse"></div>

              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Scan to download instantly
                </p>
                <p className="text-xs text-neutral-500 sm:text-sm">
                  Point your camera at the QR code
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/homepage/download/mobile-app-showcase.png"
                width={768}
                height={833}
                alt="Zedu mobile chat interface preview"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
        <div className="mt-20 flex w-full max-w-6xl flex-col items-center gap-4 sm:gap-5">
          <h2 className="text-center text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
            Download Zedu for Desktop
          </h2>
          <p className="text-center text-xs text-neutral-500 sm:text-sm">
            Stay focused with a full learning workspace on your computer
          </p>
          <ArrowBtn
            text="Download for Desktop"
            hideArrow={false}
            className="!px-6 !py-2.5"
          />

          <div className="w-full">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/8]">
              <Image
                src="/images/homepage/download/desktop-app-preview.png"
                alt="Desktop and mobile preview of the Zedu workspace"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1200px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>
      <DynamicFooter
        text="Start Learning with Zedu Today!"
        description="Join your classes, connect with others, and access everything in one place"
      />
    </div>
  );
};

export default DownLoadPage;
