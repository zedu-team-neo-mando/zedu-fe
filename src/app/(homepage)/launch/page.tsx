import { Metadata } from "next";
import { CourseLaunchPage } from "../_components/launch/course-launch-page";

export const metadata: Metadata = {
  title: "Syllabus-to-Workspace AI — 1-Click Course Launcher | Zedu",
  description:
    "Upload your course syllabus (PDF, DOCX, Markdown) and instantly generate a production Zedu academic workspace with chronological weekly channels, assignment milestones, and Buzz voice office hours.",
  keywords: [
    "syllabus to workspace",
    "course launcher",
    "academic chat",
    "bootcamp communication",
    "slack alternative for education",
    "automated channel creation",
    "buzz voice office hours",
  ],
  openGraph: {
    title: "Syllabus-to-Workspace AI — Launch Your Class in 10 Seconds | Zedu",
    description:
      "Transform any PDF or DOCX syllabus into a structured academic workspace with weekly channels, assignments, and voice rooms.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syllabus-to-Workspace AI | Zedu Chat",
    description:
      "Transform any syllabus into a live academic workspace in 10 seconds. Weekly channels, assignments, and voice office hours.",
  },
};

export default function LaunchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Zedu Syllabus-to-Workspace AI Launcher",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "Automated syllabus parser converting raw course documents into structured academic workspaces with weekly channels, assignments, and Buzz voice rooms.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CourseLaunchPage />
    </>
  );
}
