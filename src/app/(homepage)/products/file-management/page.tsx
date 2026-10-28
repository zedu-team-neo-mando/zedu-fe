import { Metadata } from "next";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import Image from "next/image";
import { ArrowBtn } from "../../_components/ui/Button";
import { FeaturedCard } from "../../_components/ui/FeaturedCard";
import { DynamicFooter } from "../../_components/footer/dynamic-footer";
import { FAQSection } from "../../_components/home/FAQSection";
import type { HomeFAQ } from "../../_lib/faqData";

export const metadata: Metadata = {
  title: "File Management",
  description:
    "Manage course files in one structured workspace with Zedu File Management. Organize resources, share securely, and collaborate across classes, cohorts, and departments.",
  keywords: [
    "Zedu file management",
    "education file sharing",
    "course material organization",
    "classroom resource management",
    "secure academic file collaboration",
    "cohort learning documents",
    "school file workspace",
    "university course files",
  ],
  openGraph: {
    title: "Zedu File Management - Organize and Share Learning Materials",
    description:
      "Store lectures, assignments, and class resources in organized spaces while keeping collaboration connected to the right learning context.",
    url: siteUrl("/products/file-management"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu file management for structured learning resources",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu File Management - Structured Learning Resources",
    description:
      "Keep course files organized, searchable, and secure with a collaboration-ready workspace built for education.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/products/file-management"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const featureCards = [
  {
    image: "/images/homepage/products/files/image-1.png",
    title: "Store Course Materials in Organized Spaces",
    points: [
      "Organize files by courses, departments, or cohorts for easy access",
      "Store lectures, assignments, and resources in one central workspace",
    ],
  },
  {
    image: "/images/homepage/products/files/image-2.png",
    title: "Collaborate on Files with Your Class",
    points: [
      "Share files directly in channels to keep context and discussions connected",
      "Collaborate on group projects with shared documents and resources",
    ],
  },
];

const securedFilesCards = [
  {
    title: "Find Files Instantly",
    desc: "Search across courses, topics, and files in seconds",
    image: "/images/homepage/products/files/find-files.png",
  },
  {
    title: "Share Files Securely",
    desc: "Control all access and keep resources protected",
    image: "/images/homepage/products/files/share-files.png",
  },
  {
    title: "Built for Learning Workflows",
    desc: "Manage coursework and collaboration all in one place",
    image: "/images/homepage/products/files/workflow-files.png",
  },
];

const otherFeatures = [
  {
    title: "Buzz",
    description: "Discuss documents live with voice conversations.",
    icon: "/images/homepage/icons/buzz.png",
  },
  {
    title: "Channels",
    description: "Share course files directly inside class discussions.",
    icon: "/images/homepage/icons/file-management.png",
  },
  {
    icon: "/images/homepage/icons/AI-class-note.png",
    title: "Ai Agents",
    description: "Summarize documents and highlight key information.",
  },
  {
    icon: "/images/homepage/icons/whiteboard.png",
    title: "Assignments",
    description: "Attach files to coursework and project submissions.",
  },
];

const fileManagementFAQs: HomeFAQ[] = [
  {
    id: "file-management-item-1",
    question: "How should I organize files for multiple classes?",
    answer:
      "Use folders by course, department, or cohort so each class has a clear structure and students can quickly find the right materials.",
  },
  {
    id: "file-management-item-2",
    question: "Can I share files directly inside class discussions?",
    answer:
      "Yes. You can share files inside channels and conversations, so context stays attached to the lesson or discussion where the file is used.",
  },
  {
    id: "file-management-item-3",
    question: "Can students collaborate on shared resources?",
    answer:
      "Yes. Teams can work with shared documents and class resources while educators keep collaboration organized across assignments and projects.",
  },
  {
    id: "file-management-item-4",
    question: "How can I find a file quickly later?",
    answer:
      "Search across your learning workspace by topic, class context, and file name to locate resources quickly, even as your content library grows.",
  },
];

const FileManagementProductsPage = () => {
  return (
    <>
      <section className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden px-4 py-10 text-center sm:gap-6 sm:px-8 sm:py-16  lg:gap-8 lg:px-12 mt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[30%] bg-gradient-to-t from-blue-50/30 to-white"
        />
        <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl text-center">
          Organize Learning <span className="text-primary-500">Materials</span>{" "}
          In One Place
        </h1>
        <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
          Store, share, and collaborate on course materials, assignments, and
          resources directly inside Zedu. Everything stays connected to the
          conversations and classes where it belongs.
        </p>
        <div className="flex w-full max-w-md flex-row items-center justify-center gap-2 sm:gap-3">
          <ArrowBtn
            text="Start Organizing Files"
            linkToHome
            className="justify-center"
          />
        </div>
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/10]  w-full sm:aspect-[16/9] lg:aspect-[2/1] ">
            <Image
              src="/images/homepage/products/files-hero.png"
              alt="Preview of the learning communication interface"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1200px"
              className="object-contain object-center "
            />
          </div>
        </div>
      </section>
      <section className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden px-4 py-10 text-center sm:gap-6 sm:px-8 sm:py-16  lg:gap-8 lg:px-12">
        <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl text-center">
          Organize and Collaborate on Learning Files
        </h1>
        <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
          Structure course materials and work together seamlessly in one
          connected workspace
        </p>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:gap-12 lg:gap-16 mt-6">
          {featureCards.map((card, index) => (
            <div
              key={card.title}
              className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10"
            >
              <div
                className={`relative w-full ${index % 2 !== 0 ? "lg:order-2" : ""}`}
              >
                <div className="relative aspect-[16/11] w-full">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center"
                  />
                </div>
              </div>

              <div
                className={`flex flex-col items-start gap-5 text-left ${index % 2 !== 0 ? "lg:order-1" : ""}`}
              >
                <h2 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                  {card.title}
                </h2>

                <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 marker:text-primary-500 sm:text-base">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <ArrowBtn text={"Get Started"} linkToHome />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden px-4 py-10 text-center sm:gap-6 sm:px-8 sm:py-16  lg:gap-8 lg:px-12">
        <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-5xl text-center">
          Smart, Secure, and Scalable File Management
        </h1>
        <p className="max-w-[95%] text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
          Zedu brings together powerful search, secure sharing, and education
          focused workflows into one system
        </p>

        <div>
          <ArrowBtn text="Get Started" linkToHome />
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {securedFilesCards.map((card) => (
            <FeaturedCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              image={card.image}
            />
          ))}
        </div>
      </section>
      <section className="relative isolate overflow-hidden space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 mt-5 bg-blue-50/30">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-semibold leading-tight text-[#1f2530] sm:text-4xl lg:text-[44px] text-center lg:leading-[1.12]">
            Connected to the{" "}
            <span className="text-primary-500">Rest of Zedu</span>
          </h1>
          <p className="max-w-[95%] text-center text-xs text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[65%] lg:max-w-[45%] lg:text-lg">
            File management integrates seamlessly with other features.
          </p>
        </div>

        <div className="grid max-w-7xl mx-auto gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {otherFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex h-full flex-col justify-center gap-3 rounded-2xl bg-white p-4 sm:gap-4 sm:rounded-3xl sm:p-6"
            >
              <Image
                src={feature.icon}
                alt={`${feature.title} icon`}
                height={40}
                width={40}
                preload
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <FAQSection faqs={fileManagementFAQs} />

      <DynamicFooter
        text="Manage Learning Materials Without the Chaos"
        description="Keep course resources organized, searchable, and accessible for every student and educator."
      />
    </>
  );
};

export default FileManagementProductsPage;
