import type { HomeFAQ } from "./faqData";

export type ComparisonRow = {
  label: string;
  whatsapp: string;
  telegram: string;
  zedu: string;
};

export type ComparisonLink = {
  label: string;
  href: string;
};

/** External sources have no `href`; they're cited as plain text. */
export type ComparisonSource = {
  label: string;
  href?: string;
};

export const comparisonRows: ComparisonRow[] = [
  {
    label: "Best for",
    whatsapp: "Quick chat in small groups",
    telegram: "Very large, open communities",
    zedu: "Running structured cohorts and programmes",
  },
  {
    label: "Group size",
    whatsapp: "Up to 1,024 members per group; Communities link several groups",
    telegram:
      "Up to 200,000 members per group; channels have unlimited subscribers",
    zedu: "Limits by plan: up to 100 members in total on Starter, up to 500 students per cohort on Pro, custom on Enterprise",
  },
  {
    label: "Announcements",
    whatsapp:
      "Admin-only posting setting in any group; admin-only announcement group in a Community",
    telegram: "Channels, or group permissions that stop members posting",
    zedu: "Announcement channels; teachers and mentors post inside the relevant channel",
  },
  {
    label: "Conversation structure",
    whatsapp: "One timeline per group; Communities bundle groups",
    telegram: "Topics inside a group, replies, mentions",
    zedu: "Channels per course, cohort or topic, with threaded replies",
  },
  {
    label: "Files",
    whatsapp: "Up to 2 GB per file",
    telegram:
      "Up to 2 GB per file (4 GB with Premium); search filters by sender",
    zedu: "Organised by course, department or cohort; searchable; attached to assignments",
  },
  {
    label: "Live sessions",
    whatsapp: "Group voice and video calls",
    telegram: "Group calls up to 200 participants; voice chats in groups",
    zedu: "Buzz voice sessions inside channels, with an automatic AI summary afterwards",
  },
  {
    label: "Admin roles",
    whatsapp:
      "Group and Community admins; Communities add admin tools for announcements and which groups are included",
    telegram:
      "Admins with granular privileges, mass delete, membership control",
    zedu: "Role-based permissions; admin moderation tools on Pro; institution-level workspace control on Enterprise",
  },
  {
    label: "Cohorts as a concept",
    whatsapp: "No: one group per cohort",
    telegram: "No: one group per cohort",
    zedu: "Yes: cohort limits and cohort management are part of the plans",
  },
  {
    label: "Price",
    whatsapp: "Free to use",
    telegram: "Free; optional Premium subscription",
    zedu: "Starter ₦0/month (up to 3 cohorts); Pro ₦20K/month (unlimited cohorts); Enterprise: contact sales",
  },
];

export const comparisonSources: ComparisonSource[] = [
  { label: "WhatsApp Blog (announcement of 512-member groups)" },
  { label: "GSMArena (Communities and the 1,024-member group limit)" },
  { label: "The News Minute (Communities admin tools)" },
  { label: "How-To Geek (admin-only posting in WhatsApp groups)" },
  { label: "Telegram FAQ" },
  { label: "Zedu pricing", href: "/pricing" },
  { label: "Channels", href: "/products/channels" },
  { label: "Buzz", href: "/products/buzz" },
  { label: "File Management", href: "/products/file-management" },
];

export const relatedLinks: (ComparisonLink & { description?: string })[] = [
  {
    label: "Zedu for bootcamps",
    href: "/solutions/bootcamps",
    description: "how cohort-based programmes use Zedu",
  },
  {
    label: "Channels",
    href: "/products/channels",
    description: "structured, threaded communication",
  },
  {
    label: "Buzz",
    href: "/products/buzz",
    description: "instant voice sessions with AI summaries",
  },
  {
    label: "File Management",
    href: "/products/file-management",
    description: "course materials in one place",
  },
  {
    label: "Pricing",
    href: "/pricing",
    description: "Starter, Pro and Enterprise plans",
  },
  { label: "Zedu for schools", href: "/solutions/schools" },
  { label: "Zedu for universities", href: "/solutions/universities" },
  {
    label: "More guides in Resources",
    href: "/resources",
    description: "guides for running learning communities",
  },
];

export const zeduVsWhatsappTelegramFAQs: HomeFAQ[] = [
  {
    id: "item-1",
    question: "Is Zedu better than WhatsApp for bootcamps?",
    answer:
      "For running a structured cohort, yes. WhatsApp is hard to beat for quick, informal chat that everyone already has. Zedu adds channels, threaded replies, files organised by cohort and Buzz sessions with AI summaries.",
  },
  {
    id: "item-2",
    question: "Is Zedu better than Telegram for online learning?",
    answer:
      "Telegram has real strengths: very large groups, topics and strong search. Zedu is the better fit when you need cohorts, announcements, files and live sessions in one place. If you run one very large open community, Telegram channels may suit that better.",
  },
  {
    id: "item-3",
    question: "Can I run a bootcamp using only WhatsApp or Telegram?",
    answer:
      "Yes. The question is how much instructor time goes into organising it. The five signs above show when that cost is rising.",
  },
  {
    id: "item-4",
    question: "Do I need to stop using WhatsApp or Telegram to use Zedu?",
    answer:
      "No. Keep the old group while you move over, then restrict it to admin-only posting so it points people to Zedu. The switching steps above show the order to follow.",
  },
  {
    id: "item-5",
    question: "How much does Zedu cost?",
    answer:
      "The Starter plan is ₦0/month with no credit card needed, with up to 3 cohorts, up to 100 members in total and limited AI assistance. Pro is ₦20K/month with unlimited cohorts. Enterprise pricing is on request. See the pricing page for current details.",
  },
  {
    id: "item-6",
    question: "Do students need to install an app?",
    answer:
      "No. Zedu works in the browser, and there are iOS and Android apps on the download page if students prefer them.",
  },
  {
    id: "item-7",
    question: "Does Zedu summarise discussions and sessions?",
    answer:
      "Buzz generates a summary automatically after each session, and Zedu's AI assistants can summarise discussions and answer questions. Starter includes limited AI assistance, and Pro adds AI study assistants.",
  },
  {
    id: "item-8",
    question: "Is Zedu only for bootcamps?",
    answer: "No. Zedu also serves schools and universities.",
  },
];
