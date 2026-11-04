import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  CalendarX,
  FileText,
  FolderX,
  MessagesSquare,
  Star,
} from "lucide-react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { FAQSection } from "~/app/(homepage)/_components/home/FAQSection";
import type { HomeFAQ } from "~/app/(homepage)/_lib/faqData";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";

const PAGE_DESCRIPTION =
  "Run your tutoring in one workspace. Use channels for each student, direct messages for quick questions, Buzz for live lessons and shared files that stay organised.";

export const metadata: Metadata = {
  title: "Zedu for Tutors | Live Lessons, Student Chat and Shared Files",
  description: PAGE_DESCRIPTION,
  keywords: [
    "tutor platform",
    "online tutoring software",
    "tutor communication platform",
    "live lessons for tutors",
    "student chat for tutors",
    "share files with students",
    "Zedu tutors",
  ],
  openGraph: {
    title: "Zedu for Tutors | Live Lessons, Student Chat and Shared Files",
    description: PAGE_DESCRIPTION,
    url: siteUrl("/solutions/tutors"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu tutors solution page preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu for Tutors | Live Lessons, Student Chat and Shared Files",
    description: PAGE_DESCRIPTION,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/solutions/tutors"),
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
  applicationName: "Zedu",
  creator: "Zedu",
  publisher: "Zedu",
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tutors",
      item: siteUrl("/solutions/tutors"),
    },
  ],
};

const problemCards = [
  {
    icon: MessagesSquare,
    title: "Scattered messages",
    desc: "Questions from students and parents arrive across personal chats, texts and email, mixed in with everything else.",
  },
  {
    icon: FolderX,
    title: "Lost lesson materials",
    desc: "Worksheets, notes and homework get buried in old threads, so you send the same file again and again.",
  },
  {
    icon: CalendarX,
    title: "Scheduling chaos",
    desc: "Lesson times, rescheduled sessions and meeting links change hands in different places, and someone always has the wrong one.",
  },
];

const steps = [
  {
    title: "Create your workspace",
    desc: "Sign up and name your tutoring workspace. It's your own space, separate from your personal apps.",
  },
  {
    title: "Invite your students",
    desc: "Send each student an invite to join. They can use Zedu on the web or the mobile app.",
  },
  {
    title: "Organise channels",
    desc: "Create a channel per student, subject or group, and share the materials each one needs.",
  },
  {
    title: "Teach",
    desc: "Go live with Buzz, share files and follow up by message, all from the same place.",
  },
];

const tutorFAQs: HomeFAQ[] = [
  {
    id: "tutors-independent",
    question: "Can I use Zedu as an independent tutor?",
    answer:
      "Yes. You don’t need to be a school or academy. Create your own workspace, invite your students and start teaching with channels, direct messages, Buzz live sessions and shared files.",
  },
  {
    id: "tutors-pricing",
    question: "How much does Zedu cost for tutors?",
    answer:
      "You can start on the free Starter plan. Pro is ₦20K per month and Enterprise is priced on request. Plans are not priced per student, so adding learners doesn’t change your price.",
  },
  {
    id: "tutors-separate-work",
    question: "Can I keep each student’s work separate?",
    answer:
      "Yes. Give each student or group their own private channel, so their messages, lesson notes and files stay together and away from other learners.",
  },
  {
    id: "tutors-live-lessons",
    question: "How do live lessons work?",
    answer:
      "Start a Buzz live session from the student’s channel and they join from the same place. There’s no separate meeting link to send or lose.",
  },
  {
    id: "tutors-mobile",
    question: "Can my students use Zedu on their phones?",
    answer:
      "Yes. Zedu has mobile apps for iOS and Android, so students can join lessons, reply to messages and open shared files from their phones.",
  },
];

const SectionHeading = ({
  title,
  desc,
  children,
}: {
  title: ReactNode;
  desc: string;
  children?: ReactNode;
}) => (
  <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
    <h2 className="text-[26px] font-bold leading-tight tracking-tight text-[#17171C] sm:text-3xl lg:text-[40px]">
      {title}
    </h2>
    <p className="max-w-[620px] text-[15px] leading-relaxed text-[#474753]">
      {desc}
    </p>
    {children}
  </div>
);

const Avatar = ({
  initials,
  className,
}: {
  initials: string;
  className: string;
}) => (
  <span
    className={`inline-flex shrink-0 items-center justify-center rounded-full font-black ${className}`}
  >
    {initials}
  </span>
);

const HeroMockup = () => (
  <div className="relative min-w-0 flex-[1_1_460px]" aria-hidden="true">
    <div className="rounded-[14px] bg-[#E4E0FB] p-3.5 sm:p-6 lg:p-8">
      <div className="flex min-h-[330px] overflow-hidden rounded-[10px] bg-white shadow-[0_12px_32px_rgba(40,24,120,0.12)]">
        <div className="flex min-w-0 basis-[36%] flex-col gap-0.5 bg-[#2E2A78] px-2.5 py-4 text-xs text-white">
          <div className="px-2 pb-3 pt-0.5 text-[13px] font-black">
            Ama&apos;s Tutoring
          </div>
          <div className="px-2 pb-1 pt-1.5 text-[10px] uppercase tracking-[0.08em] text-[#C9C6EC]">
            Channels
          </div>
          <div className="rounded-md bg-white/15 px-2 py-1.5 font-bold">
            #&nbsp; maths-tolu
          </div>
          <div className="px-2 py-1.5">#&nbsp; ielts-group</div>
          <div className="px-2 py-1.5">#&nbsp; physics-chidi</div>
          <div className="px-2 pb-1 pt-3 text-[10px] uppercase tracking-[0.08em] text-[#C9C6EC]">
            Direct messages
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <span className="size-[7px] rounded-full bg-[#4ADE80]" />
            Tolu
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <span className="size-[7px] rounded-full border border-[#C9C6EC]" />
            Chidi
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 text-xs leading-normal">
          <div className="flex items-center justify-between border-b border-[#EFEFF3] pb-2.5">
            <strong className="text-[13px]"># maths-tolu</strong>
            <span className="text-[11px] text-[#63636E]">GCSE Maths</span>
          </div>
          <div className="flex items-center justify-between gap-2.5 rounded-lg border border-[#E9E2FF] bg-[#F9F6FD] px-3 py-2.5">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#5B21B6]">
                <span className="size-[7px] rounded-full bg-[#E11D48]" />
                Buzz · Live now
              </span>
              <span className="font-bold text-[#2A2A33]">Algebra revision</span>
            </div>
            <span className="inline-flex h-[26px] shrink-0 items-center rounded-full bg-primary-500 px-3 text-[11px] font-bold text-white">
              Join
            </span>
          </div>
          <div className="flex gap-2.5">
            <Avatar
              initials="AK"
              className="size-7 bg-[#FDE7D4] text-[11px] text-[#9A3412]"
            />
            <div className="min-w-0">
              <div>
                <strong>Ama · Tutor</strong>{" "}
                <span className="text-[11px] text-[#63636E]">16:02</span>
              </div>
              <div className="text-[#474753]">
                Today&apos;s worksheet is attached. Try questions 1–6 before
                Thursday.
              </div>
              <div className="mt-1.5 inline-flex items-center gap-2 rounded-lg border border-[#E6E6EC] px-2.5 py-1.5 text-[11px] text-[#2A2A33]">
                <FileText size={12} className="text-primary-500" />
                quadratics-worksheet.pdf
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Avatar
              initials="TO"
              className="size-7 bg-[#DCEBFF] text-[11px] text-[#1E40AF]"
            />
            <div className="min-w-0">
              <div>
                <strong>Tolu</strong>{" "}
                <span className="text-[11px] text-[#63636E]">16:10</span>
              </div>
              <div className="text-[#474753]">
                Got it, thank you! I&apos;ll send my answers tomorrow.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-9 left-2 flex w-[230px] flex-col gap-2.5 rounded-[10px] bg-white px-3.5 py-3 shadow-[0_10px_28px_rgba(30,20,80,0.14)] md:-bottom-8 md:-left-5">
      <div className="flex items-center gap-1.5 text-[13px] font-black">
        Zedu
        <span className="rounded-full bg-[#EFEAFE] px-[7px] py-px text-[10px] font-bold text-[#5B21B6]">
          AI
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
        <span className="rounded bg-[#FDECEF] px-2 py-0.5 text-[#A4204F]">
          Lessons
        </span>
        <span className="rounded bg-[#EEF0FF] px-2 py-0.5 text-[#3730A3]">
          Homework
        </span>
        <span className="rounded bg-[#F3E8FF] px-2 py-0.5 text-[#6B21A8]">
          Files
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-[22px] rounded-full bg-[#DCEBFF]" />
        <span className="h-1.5 flex-1 rounded-[3px] bg-[#E8E8EE]" />
      </div>
    </div>
  </div>
);

const mockFrame =
  "mt-[18px] h-[170px] w-full max-w-[420px] overflow-hidden rounded-t-[10px] text-left";

const ChannelsMockup = () => (
  <div
    aria-hidden="true"
    className={`${mockFrame} flex bg-white shadow-[0_8px_24px_rgba(40,24,120,0.10)]`}
  >
    <div className="flex basis-[44%] flex-col gap-0.5 bg-[#2E2A78] px-2.5 py-3.5 text-xs text-white">
      <div className="rounded-md bg-white/15 px-2 py-[5px] font-bold">
        # maths-tolu
      </div>
      <div className="px-2 py-[5px]"># ielts-group</div>
      <div className="px-2 py-[5px]"># physics-chidi</div>
      <div className="px-2 py-[5px]"># sat-prep-zara</div>
      <div className="px-2 py-[5px] text-[#C9C6EC]">+ New channel</div>
    </div>
    <div className="flex flex-1 flex-col gap-2.5 p-3.5 text-xs text-[#474753]">
      <strong className="text-[#17171C]"># maths-tolu</strong>
      <span>Lesson 8 notes: completing the square</span>
      <span>Homework due Thursday</span>
      <span className="h-1.5 w-4/5 rounded-[3px] bg-[#E8E8EE]" />
      <span className="h-1.5 w-3/5 rounded-[3px] bg-[#E8E8EE]" />
    </div>
  </div>
);

const MessagesMockup = () => (
  <div
    aria-hidden="true"
    className={`${mockFrame} flex flex-col gap-2.5 bg-white p-4 text-xs leading-normal shadow-[0_8px_24px_rgba(40,24,120,0.10)]`}
  >
    <div className="flex items-center gap-2 border-b border-[#EFEFF3] pb-2">
      <Avatar
        initials="CN"
        className="size-[22px] bg-[#E9E2FF] text-[10px] text-[#5B21B6]"
      />
      <strong className="text-[#17171C]">Chidi</strong>
    </div>
    <div className="max-w-[78%] self-start rounded-[10px_10px_10px_2px] bg-[#F3F3F6] px-2.5 py-2 text-[#2A2A33]">
      Is Newton&apos;s third law on Friday&apos;s quiz?
    </div>
    <div className="max-w-[78%] self-end rounded-[10px_10px_2px_10px] bg-primary-500 px-2.5 py-2 text-white">
      Yes — review the notes in #physics-chidi.
    </div>
  </div>
);

const BuzzMockup = () => (
  <div
    aria-hidden="true"
    className={`${mockFrame} flex flex-col gap-2.5 bg-[#1F1B4D] p-3.5 shadow-[0_8px_24px_rgba(40,24,120,0.14)]`}
  >
    <div className="flex items-center justify-between text-[11px] text-white">
      <span className="inline-flex items-center gap-1.5 font-black">
        <span className="size-[7px] rounded-full bg-[#F43F5E]" />
        Buzz · Live
      </span>
      <span className="text-[#C9C6EC]">Algebra revision</span>
    </div>
    <div className="grid flex-1 grid-cols-2 gap-2">
      <div className="flex items-center justify-center rounded-lg bg-[#3A3480]">
        <Avatar
          initials="AK"
          className="size-10 bg-[#FDE7D4] text-[13px] text-[#9A3412]"
        />
      </div>
      <div className="flex items-center justify-center rounded-lg bg-[#3A3480]">
        <Avatar
          initials="TO"
          className="size-10 bg-[#DCEBFF] text-[13px] text-[#1E40AF]"
        />
      </div>
    </div>
    <div className="flex justify-center gap-2">
      <span className="size-7 rounded-full bg-white/15" />
      <span className="size-7 rounded-full bg-white/15" />
      <span className="size-7 rounded-full bg-[#E11D48]" />
    </div>
  </div>
);

const files = [
  {
    tag: "PDF",
    name: "quadratics-worksheet.pdf",
    className: "bg-[#FDECEF] text-[#A4204F]",
  },
  {
    tag: "DOC",
    name: "lesson-8-notes.docx",
    className: "bg-[#EEF0FF] text-[#3730A3]",
  },
  {
    tag: "IMG",
    name: "homework-answers.jpg",
    className: "bg-[#F3E8FF] text-[#6B21A8]",
  },
];

const FilesMockup = () => (
  <div
    aria-hidden="true"
    className={`${mockFrame} flex flex-col gap-1 bg-white px-4 py-3.5 text-xs shadow-[0_8px_24px_rgba(40,24,120,0.10)]`}
  >
    <strong className="pb-1.5 text-[#17171C]">Files · # maths-tolu</strong>
    {files.map((file) => (
      <div
        key={file.name}
        className="flex items-center gap-2.5 border-t border-[#F1F1F4] py-[7px]"
      >
        <span
          className={`inline-flex size-[26px] items-center justify-center rounded-md text-[9px] font-black ${file.className}`}
        >
          {file.tag}
        </span>
        <span className="flex-1 text-[#2A2A33]">{file.name}</span>
      </div>
    ))}
  </div>
);

const featureCards = [
  {
    title: "Tutor channels",
    desc: "Give each student or small group a private channel, so every lesson note, question and update for that learner lives in one place.",
    mockup: <ChannelsMockup />,
  },
  {
    title: "Direct messages",
    desc: "Answer quick questions one-to-one without handing out your personal number, and keep tutoring conversations apart from your private chats.",
    mockup: <MessagesMockup />,
  },
  {
    title: "Buzz live sessions",
    desc: "Start a live lesson right from the student's channel. There are no outside meeting links to send, so nobody ends up in the wrong room.",
    mockup: <BuzzMockup />,
  },
  {
    title: "Shared files",
    desc: "Share worksheets, notes and past papers once. Students can find every file later, right where the conversation happened.",
    mockup: <FilesMockup />,
  },
];

const TutorsSolutionsPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      {/* Hero */}
      <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_55%,#EFEEFC_100%)] px-4 pb-[72px] pt-10 sm:px-6 lg:pb-[104px] lg:pt-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-12 lg:gap-[72px]">
          <div className="flex min-w-0 flex-[1_1_440px] flex-col items-center gap-5 text-center md:items-start md:text-left">
            <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight text-[#17171C] sm:text-4xl lg:text-5xl">
              <span className="text-primary-500">Tutor Smarter</span> with Live
              Lessons, Chat and Files in One Place
            </h1>
            <p className="max-w-[480px] text-[15px] leading-relaxed text-[#474753] sm:text-base">
              Zedu gives independent tutors one workspace for every student: a
              channel for each learner or group, direct messages for quick
              questions, Buzz for live lessons and shared files that stay where
              you left them.
            </p>
            <div className="flex items-center gap-2.5 text-[13px] text-[#474753]">
              <span
                className="inline-flex gap-0.5"
                role="img"
                aria-label="Rated 4.9 out of 5"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={14}
                    color="#F5B301"
                    fill="#F5B301"
                    aria-hidden="true"
                  />
                ))}
              </span>
              <strong className="text-[#17171C]">4.9</strong>
              <span aria-hidden="true" className="h-3.5 w-px bg-[#CFCFD8]" />
              <span>Users love us</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-1 md:justify-start">
              <ArrowBtn text="Start Tutoring on Zedu" href="/auth/sign-up" />
              <OutlineBtn text="Book a Demo" href="/contact-sales" />
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* Problem */}
      <section className="px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          title="Tutoring Shouldn't Live in Five Different Apps"
          desc="Most tutors piece their work together from messaging apps, email, video links and cloud folders. That's where things slip."
        />
        <div className="mx-auto mt-7 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 lg:mt-11">
          {problemCards.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="flex flex-col items-center gap-3 rounded-lg border border-[#E6E6EC] px-6 py-7 text-center"
            >
              <Icon
                size={28}
                strokeWidth={1.8}
                className="text-primary-500"
                aria-hidden="true"
              />
              <h3 className="text-[17px] font-bold text-[#17171C]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#474753]">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-16 sm:px-6 lg:pb-24">
        <SectionHeading
          title="Everything Your Tutoring Needs in One Workspace"
          desc="Teach, follow up and share materials without switching apps."
        >
          <ArrowBtn text="Get Started" linkToHome />
        </SectionHeading>
        <div className="mx-auto mt-7 grid max-w-7xl grid-cols-1 gap-5 lg:mt-11 lg:grid-cols-2">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col items-center gap-2.5 overflow-hidden rounded-xl bg-[#F9F6FD] px-7 pt-8 text-center"
            >
              <h3 className="text-lg font-bold text-[#17171C]">{card.title}</h3>
              <p className="max-w-[380px] text-sm leading-relaxed text-[#474753]">
                {card.desc}
              </p>
              {card.mockup}
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-16 sm:px-6 lg:pb-24">
        <SectionHeading
          title="How It Works"
          desc="Set up your tutoring workspace in four steps."
        />
        <ol className="mx-auto mt-7 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-11 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-lg bg-[#F5F5F5] p-6"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary-500 text-[15px] font-black text-white">
                {index + 1}
              </span>
              <h3 className="text-[17px] font-bold text-[#17171C]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#474753]">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <FAQSection
        faqs={tutorFAQs}
        title={
          <>
            Questions from Tutors,{" "}
            <span className="text-primary-500">Answered</span>
          </>
        }
        subtitle="What independent tutors ask before moving their lessons to Zedu."
      />

      <DynamicFooter
        text="Bring Your Tutoring Together on Zedu"
        description="Live lessons, student chat and shared files in one workspace built for teaching."
      />
    </>
  );
};

export default TutorsSolutionsPage;
