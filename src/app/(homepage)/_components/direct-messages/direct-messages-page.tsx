import Link from "next/link";
import Image from "next/image";
import { ArrowBtn } from "../ui/Button";
import { CommunitiesIcon, FilesIcon, MessagesIcon, ShareIcon } from "../svgs";
import { FAQSection } from "../home/FAQSection";
import { DynamicFooter } from "../footer/dynamic-footer";
import type { HomeFAQ } from "../../_lib/faqData";

const featuresData = [
  {
    title: "Talk one to one with mentors and teammates",
    icon: MessagesIcon,
    desc: "Learners can message an instructor, a mentor or a teammate directly when a question doesn't belong in a busy channel.",
    image: "/images/homepage/products/direct-messages/dm-one-to-one.png",
    alt: "A direct message conversation between a learner and a mentor in Zedu",
  },
  {
    title: "Bring a small group together",
    icon: CommunitiesIcon,
    desc: "Start a group conversation with a few people for project work, study partners or a quick check-in with your team.",
    image: "/images/homepage/products/direct-messages/dm-group.png",
    alt: "A group direct message with several teammates in Zedu",
  },
  {
    title: "Keep notes and drafts to yourself",
    icon: FilesIcon,
    desc: "Message yourself to save links, keep track of tasks or draft a message before you post it to a channel. Only you can see it.",
    image: "/images/homepage/products/direct-messages/dm-notes.png",
    alt: "A user's own space in Zedu, used for notes and drafts",
  },
  {
    title: "Reply in threads, share files and find things again",
    icon: ShareIcon,
    desc: "Reply in threads to keep answers together, share files, save important messages for later, and search your conversations when you need something.",
    image: "/images/homepage/products/direct-messages/dm-saved-search.png",
    alt: "Saved messages and search results in Zedu",
  },
];

const otherFeatures = [
  {
    title: "Buzz",
    description: "Start a voice call when a conversation needs one.",
    icon: "/images/homepage/icons/buzz.png",
    href: "/products/buzz",
  },
  {
    title: "Channels",
    description: "Organise class and cohort discussions by topic.",
    icon: "/images/homepage/icons/conversation-mesh.png",
    href: "/products/channels",
  },
  {
    title: "File Management",
    description: "Share and organise learning materials and resources.",
    icon: "/images/homepage/icons/file-management.png",
    href: "/products/file-management",
  },
];

const dmFAQs: HomeFAQ[] = [
  {
    id: "dms-item-1",
    question: "Who can I message?",
    answer:
      "You can send a direct message to anyone in your Zedu workspace, such as a mentor, an instructor or a fellow learner.",
  },
  {
    id: "dms-item-2",
    question: "Can I message more than one person at once?",
    answer:
      "Yes. Start a group conversation with a few people for project work, study groups or team check-ins.",
  },
  {
    id: "dms-item-3",
    question: "Can I message myself?",
    answer:
      "Yes. Your own space is private to you, so you can keep notes, save links and draft messages before posting them.",
  },
  {
    id: "dms-item-4",
    question: "Can I find an old message again?",
    answer:
      "Yes. Save any message for later, or search your conversations to find what someone sent you.",
  },
];

const DirectMessagesProductPage = () => {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[30%] w-screen -translate-x-1/2 bg-gradient-to-t from-blue-50/30 to-white"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 rounded-[28px] px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 lg:px-12 lg:py-14 min-h-[420px]">
          <div className="flex flex-col items-center gap-5 text-center lg:max-w-[470px] lg:items-start lg:text-left">
            <h1 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
              <span className="text-primary-500">Personal Conversations</span>{" "}
              for Every Learner.
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
              Direct messages let learners reach mentors, instructors and
              teammates one to one or in small groups, right next to their
              classes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ArrowBtn text="Get started free" href="/auth/sign-up" />
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/11] w-full sm:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src="/images/homepage/products/direct-messages/dm-hero.png"
                alt="Zedu direct messages, showing a conversation list and an open chat"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-visible space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 mt-5">
        <div>
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
            Help That Reaches the Right Person
          </h2>
        </div>
        <div className="mx-auto grid w-full place-items-center max-w-7xl grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8">
          {featuresData.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="flex h-full w-full max-w-[560px] flex-col gap-5 rounded-2xl bg-blue-50/10 p-4 sm:p-6 lg:p-8"
              >
                <div className="flex flex-col gap-3 text-left">
                  <div className="flex h-10 w-10 items-center">
                    <Icon />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-[#1f2530] sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5a6170] sm:text-base">
                    {feature.desc}
                  </p>
                </div>
                <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl md:mx-0 md:max-w-none">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={feature.image}
                      alt={feature.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 48vw, 560px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mx-auto flex items-center justify-center">
          <ArrowBtn text="Get started free" href="/auth/sign-up" />
        </div>
      </section>

      <section className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 mt-5 bg-blue-50/30">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
            Part of the <span className="text-primary-500">Zedu</span> Workspace
          </h2>
          <p className="max-w-[95%] text-center text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            Direct messages sit alongside the rest of Zedu, so conversations can
            move to a call, a channel or a shared file.
          </p>
        </div>

        <div className="grid max-w-5xl mx-auto gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-4 lg:gap-6">
          {otherFeatures.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="flex h-full flex-col justify-center gap-3 rounded-2xl bg-white p-4 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <Image
                src={feature.icon}
                alt=""
                aria-hidden="true"
                height={40}
                width={40}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <FAQSection faqs={dmFAQs} />
      <DynamicFooter
        text="Give Every Learner a Direct Line to Help"
        description="Bring mentors, instructors and learners together in one workspace with Zedu."
      />
    </>
  );
};

export default DirectMessagesProductPage;
