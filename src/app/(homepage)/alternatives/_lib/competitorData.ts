export type CompetitorKey = "slack" | "discord";

export type FeatureComparisonItem = {
  feature: string;
  category:
    | "collaboration"
    | "organization"
    | "pricing"
    | "security"
    | "communication";
  tooltip: string;
  zedu: {
    status: "yes" | "no" | "partial";
    label: string;
    description: string;
  };
  competitor: {
    status: "yes" | "no" | "partial";
    label: string;
    description: string;
  };
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  institution: string;
  avatarUrl?: string;
  highlight: string;
};

export type MigrationStep = {
  step: number;
  title: string;
  duration: string;
  description: string;
  details: string[];
  actionLabel?: string;
  actionHref?: string;
};

export type CompetitorFAQ = {
  question: string;
  answer: string;
};

export type CompetitorPageConfig = {
  key: CompetitorKey;
  slug: string;
  name: string;
  headline: string;
  subheadline: string;
  tagline: string;
  badgeText: string;
  heroHighlight: string;
  stats: {
    value: string;
    label: string;
    sublabel: string;
  }[];
  painPoints: {
    title: string;
    description: string;
    icon: "clock" | "dollar" | "alert" | "lock" | "layout";
  }[];
  zeduWins: {
    title: string;
    description: string;
    icon: "sparkles" | "board" | "users" | "shield" | "folder";
  }[];
  features: FeatureComparisonItem[];
  tco: {
    competitorName: string;
    competitorCostPerUserMonthly: number;
    competitorCostPerUserAnnual: number;
    zeduCohortFlatAnnual: number;
    hiddenCostsDescription: string;
  };
  budgetEliminations: string[];
  migrationPlaybook: {
    title: string;
    subtitle: string;
    steps: MigrationStep[];
  };
  testimonials: Testimonial[];
  faqs: CompetitorFAQ[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
  };
};

export const slackConfig: CompetitorPageConfig = {
  key: "slack",
  slug: "slack-for-education",
  name: "Slack",
  headline:
    "The Modern Slack Alternative Built Specifically for Education & Bootcamps",
  subheadline:
    "Stop paying $8.75/student/month and losing semester discussions after 90 days. Zedu gives instructors and bootcamps unlimited message history, structured cohort channels, native whiteboards, and lightweight Buzz audio rooms—at 90% lower total cost.",
  tagline: "Built for teaching, not corporate boardrooms.",
  badgeText: "High-Intent Migration Hub",
  heroHighlight: "Save $15,000+ per cohort / year vs. Slack Pro",
  stats: [
    {
      value: "90 Days",
      label: "Slack's Free Message Cutoff",
      sublabel: "Zedu keeps all history permanently free",
    },
    {
      value: "$8.75",
      label: "Slack Cost / Student / Mo",
      sublabel: "Zedu offers flat cohort pricing with no per-seat penalty",
    },
    {
      value: "5 Mins",
      label: "Migration Switch Time",
      sublabel: "Import channels and start your class today",
    },
    {
      value: "100%",
      label: "Education First",
      sublabel: "Native whiteboards & week-by-week cohort structure",
    },
  ],
  painPoints: [
    {
      title: "The 90-Day Message Paywall",
      description:
        "Slack hides student homework discussions, code walkthroughs, and instructor answers after 90 days on free tiers, forcing educators to pay or lose institutional knowledge.",
      icon: "clock",
    },
    {
      title: "Extortionate Per-Seat Student Pricing",
      description:
        "At $8.75 per seat per month, a 150-student cohort costs $15,750 per year. Bootcamps and universities are penalised simply for growing their student body.",
      icon: "dollar",
    },
    {
      title: "No Native Collaborative Whiteboard",
      description:
        "Explaining algorithms, math equations, or system design requires paying an extra $16/seat for third-party tools like Miro or Mural.",
      icon: "board" as any,
    },
    {
      title: "Chaotic Channel Sprawl",
      description:
        "Slack's flat list of channels becomes an unorganized mess as courses advance, making it hard for students to track week-by-week curriculum materials.",
      icon: "layout",
    },
  ],
  zeduWins: [
    {
      title: "Permanent Message Retention & Search",
      description:
        "Never lose a class solution, resource link, or lecture recording. Search all cohort archives effortlessly across every semester.",
      icon: "sparkles",
    },
    {
      title: "Flat Cohort-Based Pricing",
      description:
        "Never pay per student seat. Add 50, 150, or 500 students to your cohort without ballooning SaaS bills.",
      icon: "dollar" as any,
    },
    {
      title: "Native Built-in Whiteboard",
      description:
        "Brainstorm, draw system architectures, write code snippets, and solve equations collaboratively with students live inside any channel.",
      icon: "board",
    },
    {
      title: "Structured Week-by-Week Cohort Channels",
      description:
        "Organize your workspace hierarchically: Cohort > Module > Week > Discussions. Keep students focused on current learning objectives.",
      icon: "folder",
    },
  ],
  features: [
    {
      feature: "Message History & Search",
      category: "organization",
      tooltip:
        "Free Slack plans lock messages older than 90 days. Zedu preserves your entire academic history.",
      zedu: {
        status: "yes",
        label: "Unlimited Forever",
        description:
          "Full message history, files, and code snippets permanently searchable.",
      },
      competitor: {
        status: "no",
        label: "90-Day Limit (Free)",
        description:
          "Old messages, links, and homework submissions disappear after 3 months unless on Pro ($8.75/user).",
      },
    },
    {
      feature: "Pricing Model for Students",
      category: "pricing",
      tooltip:
        "Slack charges monthly per student seat, whereas Zedu charges flat cohort pricing.",
      zedu: {
        status: "yes",
        label: "Flat Cohort Pricing",
        description:
          "Scale from 10 to 500 students without paying per-seat fees.",
      },
      competitor: {
        status: "no",
        label: "$8.75 / seat / month",
        description: "High costs: 150 students = $15,750/year for chat alone.",
      },
    },
    {
      feature: "Native Whiteboard Collaboration",
      category: "collaboration",
      tooltip:
        "Built-in interactive canvas for diagrams, mathematical proofs, and system designs.",
      zedu: {
        status: "yes",
        label: "Built-in Native Whiteboard",
        description:
          "Interactive infinite canvas with real-time multiplayer drawing inside channels.",
      },
      competitor: {
        status: "no",
        label: "Not Included",
        description:
          "Requires third-party integrations (Miro, Mural) with extra per-seat licenses.",
      },
    },
    {
      feature: "Cohort & Curriculum Structure",
      category: "organization",
      tooltip:
        "Group discussions by cohorts, syllabi, and weekly learning milestones.",
      zedu: {
        status: "yes",
        label: "Week-by-Week Cohorts",
        description:
          "Hierarchical channel groups tailored to course progression and cohorts.",
      },
      competitor: {
        status: "partial",
        label: "Flat Channel List",
        description:
          "Single flat list creates notification overwhelm and scattered course files.",
      },
    },
    {
      feature: "Buzz Live Audio & Screen Share",
      category: "communication",
      tooltip:
        "Lightweight audio rooms designed for drop-in office hours and lecture discussions.",
      zedu: {
        status: "yes",
        label: "Native Buzz Rooms",
        description:
          "Instant drop-in voice rooms with crisp screen sharing and instructor controls.",
      },
      competitor: {
        status: "partial",
        label: "Slack Huddles",
        description:
          "Huddles are voice-only on free tier and struggle with large classroom sizes.",
      },
    },
    {
      feature: "Student Privacy & Moderation",
      category: "security",
      tooltip:
        "Dedicated role-based permissions, privacy safeguards, and instructor oversight.",
      zedu: {
        status: "yes",
        label: "Academic Role Hierarchy",
        description:
          "Instructors, Teaching Assistants, Mentors, and Students with granular permissions.",
      },
      competitor: {
        status: "partial",
        label: "Corporate Admin",
        description:
          "Built for enterprise business hierarchy, lacking educational roles and moderation workflows.",
      },
    },
    {
      feature: "File Storage & Course Materials",
      category: "organization",
      tooltip:
        "Centralized repository for lecture notes, slides, code repos, and recordings.",
      zedu: {
        status: "yes",
        label: "Structured File Hub",
        description:
          "Organized by week and subject with instant previews and pinning.",
      },
      competitor: {
        status: "partial",
        label: "5GB Workspace Total (Free)",
        description:
          "Shared file storage cap quickly exceeded by student homework and lecture slides.",
      },
    },
  ],
  tco: {
    competitorName: "Slack Pro",
    competitorCostPerUserMonthly: 8.75,
    competitorCostPerUserAnnual: 105.0,
    zeduCohortFlatAnnual: 480.0,
    hiddenCostsDescription:
      "Plus Slack requires third-party Miro licenses ($16/mo/seat) and Zoom integrations ($15/mo) for whiteboard and large lectures.",
  },
  budgetEliminations: [
    "No $8.75/seat student tax",
    "Free native whiteboard ($16/seat Miro saved)",
    "Unlimited permanent message history",
    "Built-in Buzz live class audio (no Zoom needed)",
  ],
  migrationPlaybook: {
    title: "Migrate Your Class from Slack in Under 5 Minutes",
    subtitle:
      "Switching your bootcamp or classroom to Zedu is frictionless. No lost data, no complex onboarding.",
    steps: [
      {
        step: 1,
        title: "Export Channel Structure & Roster",
        duration: "1 min",
        description:
          "Export your public channels or student email list from your Slack workspace settings, or start clean with our education presets.",
        details: [
          "Navigate to Slack Workspace Settings > Export Data",
          "Download student email roster or CSV",
          "Zero downtime for active students",
        ],
      },
      {
        step: 2,
        title: "Create Zedu Workspace with Education Template",
        duration: "1 min",
        description:
          "Pick the 'Bootcamp & Education Cohort' preset when creating your Zedu organization. We auto-scaffold recommended channel structures.",
        details: [
          "Pre-configured #announcements and #general channels",
          "Automated Week 1 through Week 12 channels",
          "Pre-linked Buzz voice lounge for live sessions",
        ],
        actionLabel: "Start Free Workspace",
        actionHref:
          "/auth/sign-up?source=slack-alternative&template=education-cohort",
      },
      {
        step: 3,
        title: "1-Click Channel Provisioning",
        duration: "1 min",
        description:
          "Customize your weekly modules, pin your syllabus, and attach your first whiteboard template for day one.",
        details: [
          "Rename modules to match your exact course curriculum",
          "Pin lecture slides and GitHub repos in channel resources",
          "Set up T.A. and student roles in two clicks",
        ],
      },
      {
        step: 4,
        title: "Send 1-Click Magic Link Invites",
        duration: "1 min",
        description:
          "Invite your students and TAs using a shareable class link or upload a CSV. Students join immediately without friction.",
        details: [
          "Instant Google and Apple sign-in options",
          "Students land directly in their assigned cohort channels",
          "No credit card required for students",
        ],
      },
      {
        step: 5,
        title: "Host Your First Buzz & Whiteboard Session",
        duration: "1 min",
        description:
          "Click 'Start Buzz' in your lecture channel to begin live voice and open the collaborative whiteboard. Class is now in session!",
        details: [
          "Zero external software or Zoom links required",
          "Students sketch solutions collaboratively in real time",
          "All board drawings auto-saved for review",
        ],
      },
    ],
  },
  testimonials: [
    {
      quote:
        "Slack's 90-day message limit was breaking our bootcamp. Students in Week 10 couldn't access their own code discussions from Week 2! Switching to Zedu saved us $14,000 this year and our students love the built-in whiteboard.",
      author: "David Chen",
      role: "Director of Curriculum",
      institution: "DevPath Fullstack Academy",
      highlight: "Saved $14,000/year",
    },
    {
      quote:
        "We used to pay for Slack, Miro, and Zoom for every single cohort. Zedu replaced all three into one organized workspace with flat cohort pricing. It is a no-brainer for any educator.",
      author: "Dr. Sarah Mitchell",
      role: "Computer Science Professor",
      institution: "Metropolitan Technical Institute",
      highlight: "Replaced 3 apps in 1",
    },
    {
      quote:
        "The migration took literally 4 minutes. We imported our channel topics, sent out the join link, and our 120 students were chatting and collaborating on the whiteboard the same afternoon.",
      author: "Amina Yusuf",
      role: "Lead Bootcamp Mentor",
      institution: "CodeCraft Africa",
      highlight: "4-minute seamless switch",
    },
  ],
  faqs: [
    {
      question: "Why is Slack not ideal for education and bootcamps?",
      answer:
        "Slack was built as a corporate workplace chat tool, not an educational platform. Its free tier locks message history after 90 days, which wipes out student homework help and lesson records mid-semester. Furthermore, Slack charges $8.75/student/month, making it cost-prohibitive for schools with 100+ students, and lacks essential teaching tools like collaborative whiteboards and week-by-week cohort grouping.",
    },
    {
      question:
        "How does Zedu pricing compare to Slack for a cohort of 150 students?",
      answer:
        "On Slack Pro, a 150-student cohort costs $1,312.50 per month ($15,750 per year). On Zedu, you get flat cohort pricing with no per-seat student penalties, saving you over $15,000 annually while giving you unlimited message history, collaborative whiteboards, and lightweight Buzz audio rooms.",
    },
    {
      question:
        "Can I migrate my active students from Slack without losing momentum?",
      answer:
        "Yes! Migrating takes under 5 minutes. You can create your Zedu workspace using our Education Cohort template, customize your weekly channel modules, and share a 1-click magic invite link with your students. Students can sign in with Google or Apple in one tap and start collaborating immediately.",
    },
    {
      question: "Do students have to pay anything to use Zedu?",
      answer:
        "Never. Students never pay or enter payment details to join your Zedu workspace. The institution or bootcamp manages the workspace, and student seats are unrestricted.",
    },
    {
      question: "Does Zedu include a whiteboard, or do we need Miro/Mural?",
      answer:
        "Zedu includes a high-performance native collaborative whiteboard built directly into channels and calls. You can sketch system architectures, draw algorithms, write math equations, and annotate notes with students live without paying for separate tools.",
    },
  ],
  meta: {
    title: "Slack Alternative for Education & Bootcamps | Zedu",
    description:
      "Replace Slack's $8.75/student paywall and 90-day history limit. Zedu offers unlimited history, native whiteboards, week-by-week cohort channels, and flat pricing.",
    keywords: [
      "slack alternative for education",
      "slack alternative for bootcamps",
      "slack vs zedu",
      "best classroom communication platform",
      "free slack alternative for schools",
      "cohort communication software",
      "bootcamp collaboration tools",
      "slack 90 day limit workaround",
    ],
    canonical: "/alternatives/slack-for-education",
  },
};

export const discordConfig: CompetitorPageConfig = {
  key: "discord",
  slug: "discord-for-schools",
  name: "Discord",
  headline: "The Distraction-Free Discord Alternative for Bootcamps & Schools",
  subheadline:
    "Keep students focused on learning, not gaming. Zedu replaces Discord's chaotic server noise, gaming notifications, Nitro spam, and FERPA privacy risks with structured cohort channels, native whiteboards, and verified academic roles.",
  tagline: "Academic focus and cohort structure without the gaming noise.",
  badgeText: "Education First Migration Hub",
  heroHighlight: "Zero Gamer Distractions • 100% Academic Focus",
  stats: [
    {
      value: "0 Distractions",
      label: "No Gamer Statuses or Streams",
      sublabel: "Students focus strictly on coursework and peer coding",
    },
    {
      value: "FERPA",
      label: "Academic Privacy Ready",
      sublabel: "Protected student data and verified institutional identities",
    },
    {
      value: "Native",
      label: "Built-in Whiteboard",
      sublabel: "Interactive diagramming without external bots",
    },
    {
      value: "5 Mins",
      label: "Switch Time",
      sublabel: "Instant cohort template & 1-click class join links",
    },
  ],
  painPoints: [
    {
      title: "Pervasive Gaming Distractions",
      description:
        "Discord actively surfaces gaming activity ('Playing League of Legends'), live Twitch streams, and meme culture inside servers, breaking student focus during study sessions.",
      icon: "alert",
    },
    {
      title: "Student Privacy & Safety Vulnerabilities",
      description:
        "Discord's open consumer network allows unsolicited DMs, crypto spam, and phishing links. Pseudonymous accounts make attendance and academic accountability impossible.",
      icon: "lock",
    },
    {
      title: "No Structured Curriculum Hierarchy",
      description:
        "Discord servers become bloated categories of random text channels with zero timeline progression, confusing students seeking week-by-week lecture notes.",
      icon: "layout",
    },
    {
      title: "No Educational Whiteboard or Tools",
      description:
        "Teaching computer science or math on Discord requires duct-taping third-party web apps and bots that break constantly.",
      icon: "board" as any,
    },
  ],
  zeduWins: [
    {
      title: "Distraction-Free Learning Space",
      description:
        "Clean, professional UI dedicated solely to education. No gaming statuses, no Nitro upsells, and no unrelated server notifications.",
      icon: "sparkles",
    },
    {
      title: "Verified Student & Instructor Profiles",
      description:
        "Ensure academic integrity with official student names, verified university/bootcamp domains, and role-based channel access.",
      icon: "shield",
    },
    {
      title: "Curriculum-Aligned Week-by-Week Channels",
      description:
        "Structure channels by cohort progression (Week 1, Week 2, Capstone Project) so students always know exactly where course materials live.",
      icon: "folder",
    },
    {
      title: "Native Collaborative Whiteboard",
      description:
        "Solve problems visually together in real time. Instructors and students can draw, add notes, and sketch diagrams right inside the channel.",
      icon: "board",
    },
  ],
  features: [
    {
      feature: "Workspace Focus & Environment",
      category: "organization",
      tooltip: "Discord's gamer notifications vs Zedu's academic focus.",
      zedu: {
        status: "yes",
        label: "100% Academic Focus",
        description:
          "Zero gaming alerts, gamer tags, or consumer server distractions.",
      },
      competitor: {
        status: "no",
        label: "Consumer Gaming Platform",
        description:
          "Displays gaming status, streams, server invites, and Nitro popups.",
      },
    },
    {
      feature: "Student Privacy & FERPA Alignment",
      category: "security",
      tooltip: "Institutional control over student data and identity.",
      zedu: {
        status: "yes",
        label: "FERPA-Aligned & Secure",
        description:
          "Institutional domain authentication, audit logs, and verified student rosters.",
      },
      competitor: {
        status: "no",
        label: "Consumer Identity",
        description:
          "Public profiles, unverified pseudonyms, and open unsolicited direct messaging.",
      },
    },
    {
      feature: "Native Whiteboard Collaboration",
      category: "collaboration",
      tooltip:
        "Live digital whiteboard for teaching math, logic, code architectures, and diagrams.",
      zedu: {
        status: "yes",
        label: "Native Whiteboard Built-in",
        description:
          "Real-time interactive canvas with shape tools, freehand sketch, and text notes.",
      },
      competitor: {
        status: "no",
        label: "No Native Whiteboard",
        description:
          "Must use buggy third-party bot integrations or redirect students off-platform.",
      },
    },
    {
      feature: "Course & Cohort Hierarchy",
      category: "organization",
      tooltip: "Organize by cohorts, modules, and weekly curriculum.",
      zedu: {
        status: "yes",
        label: "Structured Cohort Channels",
        description:
          "Organized by week and subject milestone to keep classes aligned.",
      },
      competitor: {
        status: "partial",
        label: "Unstructured Channels",
        description:
          "Disorganized channel clutter with no native curriculum progression.",
      },
    },
    {
      feature: "Voice & Class Audio (Buzz)",
      category: "communication",
      tooltip: "Voice channels with teacher moderation and screen sharing.",
      zedu: {
        status: "yes",
        label: "Academic Buzz Rooms",
        description:
          "Moderated stages, screen share, and instant whiteboard integration.",
      },
      competitor: {
        status: "partial",
        label: "Discord Voice Channels",
        description:
          "Good audio quality, but lacks educational controls and whiteboard ties.",
      },
    },
    {
      feature: "File Sharing & Limits",
      category: "organization",
      tooltip:
        "File sharing limits for lecture slides, datasets, and recordings.",
      zedu: {
        status: "yes",
        label: "Generous Course Storage",
        description:
          "Share large slide decks, zip projects, and video walkthroughs with ease.",
      },
      competitor: {
        status: "no",
        label: "25MB File Cap (Free)",
        description:
          "Students cannot upload assignments or slide decks without paid Nitro upgrades.",
      },
    },
    {
      feature: "Administrative Control & Moderation",
      category: "security",
      tooltip: "Educator tools to mute, moderate, and manage cohorts.",
      zedu: {
        status: "yes",
        label: "Instructor & T.A. Roles",
        description:
          "Granular academic roles with syllabus pinning and announcement locks.",
      },
      competitor: {
        status: "partial",
        label: "Discord Roles & Bots",
        description:
          "Complex permission setup requiring community bot configurations.",
      },
    },
    {
      feature: "Pricing Model & Hidden Add-ons",
      category: "pricing",
      tooltip:
        "Discord requires costly server boosts, Nitro subscriptions, and third-party bot fees.",
      zedu: {
        status: "yes",
        label: "Flat Cohort Rate (Free Tier Available)",
        description:
          "Predictable flat cohort pricing with no required server boosts or student subscriptions.",
      },
      competitor: {
        status: "partial",
        label: "Free with Hidden Costs ($1,200+/yr)",
        description:
          "Requires Level 3 Server Boosts ($100/mo) for audio quality and 3rd-party whiteboard tools.",
      },
    },
  ],
  tco: {
    competitorName: "Discord Server + Add-ons",
    competitorCostPerUserMonthly: 0,
    competitorCostPerUserAnnual: 0,
    zeduCohortFlatAnnual: 480.0,
    hiddenCostsDescription:
      "While Discord is free, schools spend $1,200+/year on Server Boosts, Nitro storage, third-party whiteboard subscriptions, and lose hours managing bot permissions.",
  },
  budgetEliminations: [
    "No $1,200/yr Server Boosts required",
    "Free native whiteboard (no third-party tool fees)",
    "Zero gaming distractions or Nitro popups",
    "Large file sharing without Nitro paywalls",
  ],
  migrationPlaybook: {
    title: "Switch from Discord to Zedu in Under 5 Minutes",
    subtitle:
      "Give your cohort a serious, professional learning environment with zero friction.",
    steps: [
      {
        step: 1,
        title: "Create Zedu Education Workspace",
        duration: "1 min",
        description:
          "Sign up and choose the 'Cohort & Academy' preset. Your workspace is configured immediately with classroom-ready channels.",
        details: [
          "Pre-built #announcements, #assignments, and weekly channels",
          "Dedicated Buzz voice room for lecture hours",
          "Clean, professional UI with no gaming clutter",
        ],
        actionLabel: "Launch Education Workspace",
        actionHref:
          "/auth/sign-up?source=discord-alternative&template=education-cohort",
      },
      {
        step: 2,
        title: "Configure Cohort Roles & TAs",
        duration: "1 min",
        description:
          "Assign Instructor and Teaching Assistant roles in one click without complicated Discord role matrices or permissions bot commands.",
        details: [
          "Clear role badges: Instructor, T.A., Student",
          "Permissions automatically tuned for education safety",
          "Announcement-only channels ready out of the box",
        ],
      },
      {
        step: 3,
        title: "Setup Whiteboard & Week 1 Resources",
        duration: "1 min",
        description:
          "Open your native whiteboard and pin your Week 1 syllabus, slide decks, and code starter files.",
        details: [
          "No third-party bots or Miro accounts required",
          "Large file uploads supported without Nitro",
          "All pinned files appear in the channel resource drawer",
        ],
      },
      {
        step: 4,
        title: "Share Magic Invite Link in Discord",
        duration: "1 min",
        description:
          "Post an announcement in your current Discord server with the 1-click Zedu join link.",
        details: [
          "Students join with Google, Apple, or email in seconds",
          "No gaming tags or gamer usernames—real student names only",
          "Direct redirect into their active cohort channel",
        ],
      },
      {
        step: 5,
        title: "Host Your First Buzz Lecture",
        duration: "1 min",
        description:
          "Start your live session on Buzz. Enjoy crisp audio, smooth screen sharing, and interactive whiteboard problem-solving.",
        details: [
          "Students stay 100% focused on class content",
          "Zero gamer status interruptions or stream popups",
          "Instant class feedback and structured student Q&A",
        ],
      },
    ],
  },
  testimonials: [
    {
      quote:
        "Our coding bootcamp was running on Discord, and it was a nightmare. Students were constantly distracted by gaming statuses, Twitch streams, and meme bots. Moving to Zedu transformed student focus and project completion rates within two weeks.",
      author: "Marcus Vance",
      role: "Head of Education",
      institution: "NextGen Software Academy",
      highlight: "Transformed student focus",
    },
    {
      quote:
        "As a university lecturer, Discord was a FERPA compliance liability. Zedu gave us the real-time chat and voice features our students love, but with verified institutional identity and zero gaming distractions.",
      author: "Elena Rostova",
      role: "Associate Dean of Computing",
      institution: "State Polytechnic University",
      highlight: "Institutional compliance solved",
    },
    {
      quote:
        "The built-in whiteboard alone makes Zedu 10x better than Discord for bootcamps. Our TAs solve algorithms with students visually without juggling five different browser tabs.",
      author: "Tunde Bakare",
      role: "Senior Engineering Instructor",
      institution: "Apex Bootcamp",
      highlight: "10x better for code reviews",
    },
  ],
  faqs: [
    {
      question: "Why should bootcamps and schools switch from Discord to Zedu?",
      answer:
        "Discord is designed for gaming and casual communities, not structured education. It lacks curriculum hierarchy, shows distracting gamer activity ('Playing Valorant') during study hours, caps file sharing at 25MB without paid Nitro, and lacks native educational tools like collaborative whiteboards. Zedu provides a professional, distraction-free environment built around cohorts, structured channels, and real-time whiteboard collaboration.",
    },
    {
      question: "Is Discord FERPA compliant for schools and universities?",
      answer:
        "No. Discord is a consumer platform with open direct messaging, public profiles, and minimal administrative audit controls, posing substantial privacy risks under FERPA and academic compliance regulations. Zedu is purpose-built for education, giving institutions full ownership of their communications, verified student roles, and secure workspaces.",
    },
    {
      question: "Does Zedu have voice channels like Discord?",
      answer:
        "Yes! Zedu includes Buzz, a lightweight, high-performance voice and screen-sharing system designed specifically for classes, office hours, and breakout discussions, tightly integrated with our collaborative whiteboard.",
    },
    {
      question:
        "Can we upload large files and course recordings to Zedu without paying for Nitro?",
      answer:
        "Yes. Unlike Discord, which imposes a strict 25MB file limit to push Nitro subscriptions, Zedu supports generous file uploads for presentations, datasets, and code zip archives directly within your cohort channels.",
    },
    {
      question: "How long does it take to migrate a class from Discord?",
      answer:
        "Less than 5 minutes. Select the education cohort template, copy the 1-click invite link into your old Discord server, and your students can transition into Zedu with Google or Apple SSO instantly.",
    },
  ],
  meta: {
    title: "Discord Alternative for Schools & Bootcamps | Zedu",
    description:
      "A distraction-free, academic-first alternative to Discord for schools and bootcamps. Get structured cohort channels, native whiteboards, verified student roles, and zero gaming noise.",
    keywords: [
      "discord alternative for schools",
      "discord alternative for bootcamps",
      "discord vs zedu for classroom",
      "distraction free student chat",
      "ferpa compliant discord alternative",
      "best communication tool for bootcamps",
      "classroom chat software",
    ],
    canonical: "/alternatives/discord-for-schools",
  },
};
