import type { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import Image from "next/image";
import { ArrowBtn } from "../../_components/ui/Button";
import { FAQSection } from "../../_components/home/FAQSection";
import type { HomeFAQ } from "../../_lib/faqData";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";

export const metadata: Metadata = {
  title: "AI Assistant - Smarter Learning and Teaching | Zedu",
  description:
    "Discover Zedu's AI-powered learning tools, including AI Study Assistant, AI Message Summaries, AI Class Notes, and AI Moderation.",
  keywords: [
    "Zedu AI Assistant",
    "AI for education",
    "AI study assistant",
    "AI message summaries",
    "AI class notes",
    "AI moderation",
    "AI learning tools",
    "education technology",
    "AI-powered learning",
  ],
  openGraph: {
    title: "Zedu AI Assistant - Smarter Learning and Teaching",
    description:
      "Explore AI-powered tools that support teaching, learning, and collaboration on Zedu.",
    url: siteUrl("/products/ai"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu AI Assistant for teaching and learning",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu AI Assistant - Smarter Learning and Teaching",
    description:
      "Discover AI tools that support educators and learners throughout their learning journey.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/products/ai"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const aiFeatures = [
  {
    title: "AI Message Summaries",
    desc: "Keep up with important conversations without having to read every message. AI Message Summaries help learners and educators review key points from discussions and stay informed.",
    image: "/images/homepage/features/ai-agents.png",
    alt: "AI assistants supporting learning conversations",
  },
  {
    title: "AI Study Assistant",
    desc: "Give learners access to AI-powered study support as they work through their learning journey. The AI Study Assistant is designed to support understanding and make learning more approachable.",
    image: "/images/homepage/solutions/universities/AI-powered-learning.png",
    alt: "AI-powered learning support",
  },
  {
    title: "AI Class Notes",
    desc: "Make learning resources easier to work with. AI Class Notes support learners in exploring concepts, reviewing information, and building a clearer understanding of their lessons.",
    image: "/images/homepage/icons/AI-class-note.png",
    alt: "AI class notes feature",
  },
  {
    title: "AI Moderation",
    desc: "Support better-managed learning communities with AI Moderation tools. These tools form part of Zedu's AI-powered offering for learning environments.",
    image: "/images/homepage/features/ai-agents.png",
    alt: "AI tools for learning environments",
  },
];

const aiFAQs: HomeFAQ[] = [
  {
    id: "ai-item-1",
    question: "What is Zedu's AI Assistant?",
    answer:
      "Zedu's AI-powered tools support learning and teaching through features such as AI Study Assistant, AI Message Summaries, AI Class Notes, and AI Moderation.",
  },
  {
    id: "ai-item-2",
    question: "Does AI replace educators on Zedu?",
    answer:
      "No. Zedu's AI tools are designed to support teaching and learning. They provide additional assistance while educators continue to guide their learners.",
  },
  {
    id: "ai-item-3",
    question: "Which AI features are available on each plan?",
    answer:
      "AI feature availability varies by plan. You can review the comparison table on this page or visit the Zedu pricing page for more information.",
  },
  {
    id: "ai-item-4",
    question: "Is AI Moderation available on every plan?",
    answer:
      "According to Zedu's current pricing comparison, AI Moderation is included in the Enterprise plan.",
  },
];

const aiPlanComparison = [
  {
    feature: "AI Study Assistant",
    starter: "Limited",
    pro: "Included",
    enterprise: "Advanced",
  },
  {
    feature: "AI Message Summaries",
    starter: "Not included",
    pro: "Included",
    enterprise: "Included",
  },
  {
    feature: "AI Learning Assistants",
    starter: "Limited",
    pro: "Included",
    enterprise: "Advanced",
  },
  {
    feature: "Workflow Automation",
    starter: "Not included",
    pro: "Not included",
    enterprise: "Included",
  },
  {
    feature: "AI Moderation",
    starter: "Not included",
    pro: "Not included",
    enterprise: "Included",
  },
];

const AiProductsPage = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-primary-600">
              AI-powered learning
            </span>

            <h1 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[52px] lg:leading-[1.12]">
              AI that supports teaching,{" "}
              <span className="text-primary-500">not replaces it.</span>
            </h1>

            <p className="max-w-[48ch] text-sm leading-relaxed text-[#5a6170] sm:text-base lg:text-lg">
              Bring more support to every learning experience with AI-powered
              tools that help learners study, make sense of conversations, and
              engage with their learning journey.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ArrowBtn text="Get Started" linkToHome />
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl bg-white p-3 shadow-xl shadow-blue-900/5 sm:p-5">
            <div className="relative aspect-[16/11] w-full">
              <Image
                src="/images/homepage/solutions/universities/AI-powered-learning.png"
                alt="AI-powered learning on Zedu"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-4 py-14 text-center sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
          <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
            Make room for more meaningful learning
          </h2>

          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
            Teaching and learning involve more than sharing information. Zedu's
            AI-powered tools provide additional support for learners and
            educators, helping make everyday learning activities easier to
            manage.
          </p>
        </div>
      </section>

      {/* AI Features */}
      <section className="relative isolate flex w-full flex-col items-center gap-10 overflow-hidden px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 sm:gap-16 lg:gap-20">
          {aiFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
            >
              <div
                className={`relative w-full rounded-3xl bg-blue-50/40 p-6 py-8 ${
                  index % 2 !== 0 ? "lg:order-2" : ""
                }`}
              >
                <div className="relative aspect-[16/11] w-full">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center"
                  />
                </div>
              </div>

              <div
                className={`flex flex-col items-start gap-5 text-left ${
                  index % 2 !== 0 ? "lg:order-1" : ""
                }`}
              >
                <span className="text-sm font-semibold text-primary-500">
                  AI FEATURE 0{index + 1}
                </span>

                <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                  {feature.title}
                </h2>

                <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {feature.desc}
                </p>

                <ArrowBtn text="Get Started" linkToHome />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#f8faff] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              Supporting both sides of the learning experience
            </h2>

            <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
              AI works best as a support system. Zedu brings useful tools
              together to support the people who teach and the people who learn.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-blue-100 bg-white p-7 sm:p-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                <span aria-hidden="true">✦</span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-neutral-900 sm:text-2xl">
                For Educators
              </h3>

              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                Get additional support for managing learning conversations,
                supporting students, and keeping important information
                accessible.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-white p-7 sm:p-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                <span aria-hidden="true">✧</span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-neutral-900 sm:text-2xl">
                For Students
              </h3>

              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                Access learning support, review important discussions, and
                explore class information with tools designed to complement your
                studies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Plan Comparison */}
      <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              Find the right AI tools for your plan
            </h2>

            <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
              Explore how AI-related features vary across Zedu's Starter, Pro,
              and Enterprise plans.
            </p>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-neutral-200">
            <table className="w-full min-w-[650px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-5 py-5 font-semibold text-neutral-900">
                    AI Features
                  </th>
                  <th className="px-5 py-5 font-semibold text-neutral-900">
                    Starter
                  </th>
                  <th className="px-5 py-5 font-semibold text-neutral-900">
                    Pro
                  </th>
                  <th className="px-5 py-5 font-semibold text-neutral-900">
                    Enterprise
                  </th>
                </tr>
              </thead>

              <tbody>
                {aiPlanComparison.map((item) => (
                  <tr
                    key={item.feature}
                    className="border-t border-neutral-200"
                  >
                    <td className="px-5 py-5 font-medium text-neutral-800">
                      {item.feature}
                    </td>
                    <td className="px-5 py-5 text-neutral-600">
                      {item.starter}
                    </td>
                    <td className="px-5 py-5 text-neutral-600">{item.pro}</td>
                    <td className="px-5 py-5 text-neutral-600">
                      {item.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center">
            <ArrowBtn text="Explore Pricing" href="/pricing" />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQSection faqs={aiFAQs} headingLevel="h2" />

      {/* Final CTA */}
      <DynamicFooter
        text="Make Learning Smarter with Zedu AI"
        description="Discover AI-powered tools designed to support educators and learners."
      />
    </>
  );
};

export default AiProductsPage;
