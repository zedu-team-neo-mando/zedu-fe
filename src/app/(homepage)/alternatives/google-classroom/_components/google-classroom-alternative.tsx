import { ArrowBtn, OutlineBtn } from "~/app/(homepage)/_components/ui/Button";
import { WhyCard } from "~/app/(homepage)/_components/ui/WhyCard";
import { FAQSection } from "~/app/(homepage)/_components/home/FAQSection";
import { DynamicFooter } from "~/app/(homepage)/_components/footer/dynamic-footer";
import type { HomeFAQ } from "~/app/(homepage)/_lib/faqData";

const switchReasons = [
  {
    title: "Channels",
    desc: "Give every class, cohort or club its own channel with threaded discussions, so questions and answers stay together instead of getting lost in a stream.",
  },
  {
    title: "Buzz Voice & Video",
    desc: "Start a voice or video call from the same workspace your students already chat in, without sending them to another app.",
  },
  {
    title: "File Management",
    desc: "Share lesson notes, slides and resources inside the conversation they belong to, and find them again later.",
  },
];

// Every row must stay verifiable. Zedu values come from
// src/app/(homepage)/_lib/pricingData.ts and pricingComparisonData.ts;
// Google Classroom values come from Google's public Classroom and
// Workspace for Education pages.
const comparisonRows = [
  {
    feature: "Class communication",
    zedu: "Channels with threaded discussions and direct messages",
    googleClassroom: "Announcements and discussion posts in each class stream",
  },
  {
    feature: "Live calls",
    zedu: "Buzz voice and video calls inside the workspace (Pro and Enterprise)",
    googleClassroom: "Video calls run in Google Meet, a separate Google app",
  },
  {
    feature: "Community channels",
    zedu: "Channels for cohorts, announcements and groups in one workspace",
    googleClassroom:
      "Organised around individual classes; group chat runs in Google Chat, a separate app",
  },
  {
    feature: "Assignments & grading",
    zedu: "Assignment discussions on every plan; assignment and cohort management on Pro",
    googleClassroom: "Built in assignments, grading and feedback",
  },
  {
    feature: "Pricing",
    zedu: "Starter is ₦0/month with no credit card; Pro is ₦20K/month",
    googleClassroom:
      "Free with Google Workspace for Education Fundamentals for qualifying institutions; Education Plus is paid",
  },
];

const googleClassroomFAQs: HomeFAQ[] = [
  {
    id: "item-1",
    question: "Is Zedu a replacement for Google Classroom?",
    answer:
      "Zedu focuses on day to day communication: channels, threads, direct messages and Buzz calls. If your school relies on Google Classroom for grading, you can keep it for coursework and run class conversations in Zedu.",
  },
  {
    id: "item-2",
    question: "Is Zedu free to use?",
    answer:
      "Yes. The Starter plan costs ₦0/month, needs no credit card and includes up to 3 cohorts, learning channels, messaging and file sharing. Buzz voice and video calls are part of the Pro plan.",
  },
  {
    id: "item-3",
    question: "Who is Zedu built for?",
    answer:
      "Zedu is built for schools, bootcamps, universities and training programs that want one organised place for teachers, students and staff to communicate.",
  },
  {
    id: "item-4",
    question: "Can I run live classes on Zedu?",
    answer:
      "Yes. On the Pro and Enterprise plans, Buzz gives you voice and video calls, screen sharing and class recordings inside your Zedu workspace.",
  },
];

const GoogleClassroomAlternativePage = () => {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[30%] w-screen -translate-x-1/2 bg-gradient-to-t from-blue-50/30 to-white"
        />
        <div className="mx-auto flex min-h-[60dvh] w-full max-w-4xl flex-col items-center justify-center gap-5 text-center">
          <h1 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
            <span className="text-primary-500">Zedu vs Google Classroom:</span>{" "}
            Communication Built for Learning Communities
          </h1>
          <p className="max-w-[56ch] text-sm leading-relaxed text-[#5a6170] sm:text-base">
            Google Classroom is great for handing out and grading coursework.
            Zedu gives your classes, cohorts and staff live channels, Buzz calls
            and shared files in one workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ArrowBtn text="Get Started Free" href="/auth/sign-up" />
            <OutlineBtn text="See Pricing" href="/pricing" />
          </div>
        </div>
      </section>

      <section className="relative isolate space-y-10 overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <h2 className="text-center text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
          Why Teams Switch to Zedu
        </h2>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {switchReasons.map((reason) => (
            <WhyCard
              key={reason.title}
              title={reason.title}
              desc={reason.desc}
              showBadge
              className="h-full"
            />
          ))}
        </div>
      </section>

      <section className="relative isolate space-y-10 overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
            Zedu and Google Classroom Compared
          </h2>
          <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            A side by side look at how each platform handles the parts of
            teaching that happen outside the gradebook.
          </p>
        </div>

        <div className="mx-auto w-full max-w-5xl overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm sm:text-base">
            <thead className="bg-neutral-100">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-neutral-900"
                >
                  Feature
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-primary-500"
                >
                  Zedu
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-neutral-900"
                >
                  Google Classroom
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-t border-neutral-200">
                  <th
                    scope="row"
                    className="px-4 py-3 align-top font-medium text-neutral-900"
                  >
                    {row.feature}
                  </th>
                  <td className="px-4 py-3 align-top text-neutral-600">
                    {row.zedu}
                  </td>
                  <td className="px-4 py-3 align-top text-neutral-600">
                    {row.googleClassroom}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FAQSection faqs={googleClassroomFAQs} />

      <DynamicFooter
        text="Bring Your Classes Together on Zedu"
        description="Start free with channels, messaging and file sharing for up to 3 cohorts. No credit card needed."
      />
    </>
  );
};

export default GoogleClassroomAlternativePage;
