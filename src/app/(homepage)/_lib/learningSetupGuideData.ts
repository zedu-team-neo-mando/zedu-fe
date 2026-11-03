import type { LucideIcon } from "lucide-react";
import {
  FolderOpen,
  GraduationCap,
  Hash,
  MessageCircle,
  PenTool,
  Phone,
  Presentation,
  School,
  Share2,
  Users,
  Video,
} from "lucide-react";
import { features, otherFeatures } from "./featureSectionData";

export type LearningSetupId = "bootcamp" | "institution" | "community";

export type GuideFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type LearningSetup = {
  id: LearningSetupId;
  label: string;
  hint: string;
  icon: LucideIcon;
  productLink: {
    href: string;
    label: string;
  };
  features: GuideFeature[];
};

const verifiedFeatures = [...features, ...otherFeatures];

/**
 * Pulls a feature from the existing homepage feature data so the guide only
 * ever shows copy that is already published elsewhere on the site.
 */
const pickFeature = (title: string, icon: LucideIcon): GuideFeature => {
  const feature = verifiedFeatures.find((item) => item.title === title);

  if (!feature) {
    throw new Error(
      `learningSetupGuideData: "${title}" no longer exists in featureSectionData. ` +
        "Update the guide so it only recommends verified features."
    );
  }

  return { title: feature.title, description: feature.description, icon };
};

export const learningSetups: LearningSetup[] = [
  {
    id: "bootcamp",
    label: "Running a bootcamp or cohort",
    hint: "Cohort-based programs with set start dates, mentors, and a shared curriculum.",
    icon: GraduationCap,
    productLink: { href: "/products/channels", label: "Explore Channels" },
    features: [
      pickFeature("Organized Channels", Hash),
      pickFeature("Cohort Communication", Users),
      pickFeature("Class Recordings", Video),
    ],
  },
  {
    id: "institution",
    label: "Coordinating a class or educational institution",
    hint: "Schools, universities, and training providers running classes at scale.",
    icon: School,
    productLink: {
      href: "/products/file-management",
      label: "Explore File Management",
    },
    features: [
      pickFeature("Live Teaching", Presentation),
      pickFeature("File Management", FolderOpen),
      pickFeature("Whiteboard", PenTool),
    ],
  },
  {
    id: "community",
    label: "Managing an online learning community",
    hint: "Ongoing groups where members learn, discuss, and collaborate together.",
    icon: MessageCircle,
    productLink: { href: "/products/buzz", label: "Explore Buzz" },
    features: [
      pickFeature("Messaging System", MessageCircle),
      pickFeature("Conversation Mesh", Share2),
      pickFeature("Calls & Collaboration", Phone),
    ],
  },
];
