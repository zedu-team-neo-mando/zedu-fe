export interface FeatureComparison {
  category: string;
  items: {
    feature: string;
    zedu: {
      status: boolean | "partial";
      label: string;
      description?: string;
    };
    competitor: {
      status: boolean | "partial";
      label: string;
      description?: string;
    };
  }[];
}

export interface DeepDiveSection {
  title: string;
  subtitle: string;
  zeduHeading: string;
  zeduPoints: string[];
  competitorHeading: string;
  competitorPoints: string[];
}

export interface ComparisonFAQ {
  question: string;
  answer: string;
}

export interface ComparisonPageContent {
  slug: "zedu-vs-discord" | "zedu-vs-slack";
  competitorName: "Discord" | "Slack";
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  verdictTitle: string;
  verdictDescription: string;
  competitorSummary: {
    title: string;
    description: string;
    bestFor: string;
    strengths: string[];
    tradeoffs: string[];
  };
  zeduSummary: {
    title: string;
    description: string;
    bestFor: string;
    strengths: string[];
    tradeoffs: string[];
  };
  matrix: FeatureComparison[];
  deepDives: DeepDiveSection[];
  faqs: ComparisonFAQ[];
  ctaHeading: string;
  ctaDescription: string;
}

export const comparisonPages: Record<string, ComparisonPageContent> = {
  "zedu-vs-discord": {
    slug: "zedu-vs-discord",
    competitorName: "Discord",
    metaTitle: "Zedu vs Discord: Best Platform for Bootcamps & Cohorts",
    metaDescription:
      "Comparing Zedu and Discord for bootcamps, schools, and cohort learning. See how structured channels, built-in Buzz audio/video calling, and distraction-free spaces compare.",
    keywords: [
      "Discord alternative for bootcamps",
      "Discord vs Zedu",
      "cohort communication platform",
      "Discord alternative for education",
      "learning community software",
      "Discord for bootcamps",
      "education chat platform",
    ],
    heroBadge: "Platform Comparison",
    heroTitle: "Zedu vs Discord: The Better Platform for Bootcamps & Cohorts",
    heroSubtitle:
      "Discord revolutionized voice hangouts and gaming communities. But when running rigorous educational cohorts, bootcamps and schools need structured classrooms, noise-free learning, and dedicated cohort tooling.",
    verdictTitle: "The Quick Verdict",
    verdictDescription:
      "Choose Discord if you are hosting a casual gaming group or an open-ended hobbyist server where drop-in voice channels and bots take priority over organized cohorts. Choose Zedu if you run a bootcamp, academy, or school that requires organized cohort channels, built-in Buzz voice and video calls with screen sharing, centralized file management, and a professional distraction-free environment.",
    competitorSummary: {
      title: "Discord Overview",
      description:
        "Discord is a powerhouse for casual community hangouts and gaming servers, offering instantaneous voice chat and an extensive ecosystem of community bots.",
      bestFor: "Gaming guilds, hobbyist groups, and casual developer hangouts",
      strengths: [
        "Instant always-on drop-in voice and video channels",
        "Free tier with unlimited seats for general public servers",
        "Vast bot and webhook ecosystem for gaming and automation",
        "Widespread familiarity among younger digital natives",
      ],
      tradeoffs: [
        "Unstructured chat streams lead to lost lesson resources and missed announcements",
        "High-distraction environment with gaming status alerts, server noise, and side activities",
        "Lacks native cohort module organization and centralized file repositories",
        "Operates on an open community model with default direct messaging across servers",
      ],
    },
    zeduSummary: {
      title: "Zedu Overview",
      description:
        "Zedu is purpose-built for education, bootcamps, and cohort-based academies, uniting structured curriculum channels, built-in Buzz audio and video calls, and centralized file management in one workspace.",
      bestFor:
        "Bootcamps, online academies, university cohorts, and educational communities",
      strengths: [
        "Cohort channels organized by syllabus modules, lessons, and project teams",
        "Built-in Buzz live audio and video calling with screen sharing and in-call chat",
        "Noise-free, professional environment without gaming distractions or outside server alerts",
        "Role-based permissions designed for instructors, mentors, and students",
        "Centralized File Explorer for course documents, slides, and shared resources",
      ],
      tradeoffs: [
        "Focused exclusively on education and learning communities, not gaming servers",
        "Curated educational integration suite rather than endless hobbyist bot libraries",
      ],
    },
    matrix: [
      {
        category: "Learning & Cohort Structure",
        items: [
          {
            feature: "Cohort-Specific Module Channels",
            zedu: {
              status: true,
              label: "Built-in",
              description:
                "Channels map automatically to syllabus milestones and cohorts",
            },
            competitor: {
              status: "partial",
              label: "Manual Setup",
              description:
                "Requires tedious manual role gates and channel permission overrides",
            },
          },
          {
            feature: "Centralized File Management",
            zedu: {
              status: true,
              label: "Built-in File Explorer",
              description:
                "Centralized workspace repository to upload, organize, and share course documents and guides",
            },
            competitor: {
              status: false,
              label: "Not Available",
              description:
                "Files are shared only as inline chat attachments that get buried in fast-scrolling channels",
            },
          },
          {
            feature: "Noise-Free, Distraction-Free Workspace",
            zedu: {
              status: true,
              label: "100% Educational",
              description:
                "No game presence indicators, public server browsing, or off-topic social noise",
            },
            competitor: {
              status: false,
              label: "High Distraction",
              description:
                "Students are surrounded by game activity alerts, external server notifications, and friend lists",
            },
          },
        ],
      },
      {
        category: "Live Collaboration & Communication",
        items: [
          {
            feature: "Built-in Voice & Video Calls (Buzz)",
            zedu: {
              status: true,
              label: "Native Buzz Calls",
              description:
                "Real-time voice and video calls with screen sharing, call timers, and participant management in channels",
            },
            competitor: {
              status: true,
              label: "Voice Channels",
              description:
                "Always-on voice and video channels with screen sharing, subject to Nitro stream quality caps",
            },
          },
          {
            feature: "In-Call Screen Sharing & Chat",
            zedu: {
              status: true,
              label: "Included",
              description:
                "Share code, presentations, and browser tabs with integrated live text chat during calls",
            },
            competitor: {
              status: true,
              label: "Included",
              description:
                "Screen sharing and in-channel text chat available during voice channel sessions",
            },
          },
          {
            feature: "Moderation & Participant Controls",
            zedu: {
              status: true,
              label: "Education Roles",
              description:
                "Hand-raising indicator, channel moderation, and role-based permissions for instructors and learners",
            },
            competitor: {
              status: "partial",
              label: "Community Roles",
              description:
                "Server roles, mute/deafen permissions, and channel timeouts designed for online communities",
            },
          },
        ],
      },
      {
        category: "Administration, Privacy & Pricing",
        items: [
          {
            feature: "Institutional Privacy & Safety",
            zedu: {
              status: true,
              label: "Closed Workspace",
              description:
                "Private organization boundary where direct messaging is restricted to enrolled cohort members",
            },
            competitor: {
              status: "partial",
              label: "Open Server Model",
              description:
                "Direct messaging from server members is enabled by default unless individual privacy settings are configured",
            },
          },
          {
            feature: "Pricing Model for Cohorts",
            zedu: {
              status: true,
              label: "Predictable Education Pricing",
              description:
                "Flat, cohort-friendly plans without per-seat penalty for growing student counts",
            },
            competitor: {
              status: "partial",
              label: "Freemium + Server Boosts",
              description:
                "Free core tier, but high video quality and storage require expensive recurring server boosts",
            },
          },
        ],
      },
    ],
    deepDives: [
      {
        title: "Structure: Why Chat Feeds Fail Educational Cohorts",
        subtitle:
          "In a bootcamp, missing an announcement or lecture link directly hurts graduation rates.",
        zeduHeading: "Zedu's Cohort Architecture",
        zeduPoints: [
          "Cohorts are organized by modules and tracks, preventing lesson links from getting buried in conversation.",
          "Important announcements and course materials stay organized within their respective channels.",
          "Mentors and instructors can follow up on student discussions without searching through unstructured chat rooms.",
        ],
        competitorHeading: "Discord's General Chat Model",
        competitorPoints: [
          "Linear chat channels scroll rapidly; students can miss critical announcements and lesson links amidst general banter.",
          "Thread creation can be difficult to track and threads automatically archive after periods of inactivity.",
          "Organizers spend substantial effort configuring complex bot roles and permission overwrites across cohort cycles.",
        ],
      },
      {
        title: "Environment: Focus vs. Constant Gaming Distractions",
        subtitle:
          "Learning requires sustained concentration. Platforms designed for leisure undermine focus.",
        zeduHeading: "A Dedicated Learning Atmosphere",
        zeduPoints: [
          "Students sign into a clean, professional platform designed for academic and technical growth.",
          "No gaming activity badges, no popups from outside servers, and zero unrelated social distractions.",
          "Builds professional communication habits that prepare students for workplace engineering teams.",
        ],
        competitorHeading: "Discord's Entertainment Ecosystem",
        competitorPoints: [
          "Students receive notifications from dozens of gaming, meme, and hobbyist servers alongside school channels.",
          "Friend activity shows live gaming presence, drawing focus away from study sessions and group projects.",
          "Default open direct messaging on shared servers can expose learners to unsolicited messages unless manually restricted.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are bootcamps moving away from Discord to Zedu?",
        answer:
          "While Discord is cost-effective for informal groups, bootcamps struggle with distraction and disorganization. Important announcements get buried in high-speed chat, students are surrounded by gaming alerts, and instructors lack structured cohort hierarchies. Zedu solves this with purpose-built module channels, integrated Buzz audio/video calling with screen sharing, and a professional learning environment.",
      },
      {
        question:
          "How does Zedu compare to Discord voice channels for cohort calls?",
        answer:
          "Zedu includes Buzz, a built-in live audio and video calling feature directly in your channels. Buzz supports video feeds, screen sharing, hand-raising, in-call chat, and participant management without requiring external bots or Nitro upgrades.",
      },
      {
        question:
          "How do privacy and student safety compare between Zedu and Discord?",
        answer:
          "Discord uses an open community model where member lists and direct messaging are enabled across servers by default unless individual privacy settings are locked down. Zedu provides a closed, institutionally governed workspace where communication is strictly scoped to enrolled learners, mentors, and administrators.",
      },
      {
        question:
          "How difficult is it to migrate our bootcamp from Discord to Zedu?",
        answer:
          "Migration is straightforward. You can configure your cohort tracks, invite instructors, mentors, and students with one-click links or bulk email invites, and start hosting classes on day one without needing complex bot setups.",
      },
    ],
    ctaHeading: "Upgrade Your Bootcamp Beyond Discord",
    ctaDescription:
      "Join modern bootcamps and online academies giving students an organized, distraction-free environment to learn, build, and graduate.",
  },
  "zedu-vs-slack": {
    slug: "zedu-vs-slack",
    competitorName: "Slack",
    metaTitle: "Zedu vs Slack: The Smart Communication Choice for Bootcamps",
    metaDescription:
      "Comparing Zedu and Slack for cohort education and bootcamps. Discover why bootcamps switch from expensive per-user Slack seats to Zedu's education-first platform.",
    keywords: [
      "Slack alternative for bootcamps",
      "Slack alternative for learning communities",
      "Slack vs Zedu",
      "bootcamp communication platform",
      "Slack pricing for education",
      "cohort learning management",
      "Slack alternatives",
    ],
    heroBadge: "Platform Comparison",
    heroTitle: "Zedu vs Slack: Why Bootcamps & Academies Choose Zedu",
    heroSubtitle:
      "Slack is the gold standard for corporate enterprise teams. But for cohort-based bootcamps and learning communities, per-seat pricing and the 90-day history visibility limit on free plans create significant hurdles for ongoing cohorts.",
    verdictTitle: "The Quick Verdict",
    verdictDescription:
      "Choose Slack if you are an enterprise software company coordinating cross-functional corporate departments with extensive third-party SaaS integrations. Choose Zedu if you run a bootcamp, school, or learning community that benefits from predictable cohort-friendly pricing, full message and file history retention, and built-in Buzz audio/video calling.",
    competitorSummary: {
      title: "Slack Overview",
      description:
        "Slack is the industry leader for enterprise workplace collaboration, featuring rich third-party app integrations and polished conversational threading.",
      bestFor:
        "Enterprise corporate teams and established B2B knowledge-work companies",
      strengths: [
        "Unrivaled ecosystem of 2,600+ third-party SaaS integrations",
        "Polished threading model and fine-grained notification settings",
        "Enterprise-grade SOC2 compliance and single sign-on (SSO)",
        "Widely adopted standard across professional corporate workplaces",
      ],
      tradeoffs: [
        "Per-seat licensing models (Pro and Business+) scale steeply as student enrollment expands",
        "Free tier limits access to 90 days of message and file history, hiding older discussions unless upgraded",
        "Slack Huddles are designed for informal drop-in chats rather than structured cohort sessions",
        "No native educational channel hierarchies or centralized curriculum file management",
      ],
    },
    zeduSummary: {
      title: "Zedu Overview",
      description:
        "Zedu is engineered from the ground up for cohort learning and educational academies, offering predictable cohort-based pricing, full message history retention, and built-in Buzz audio and video calls.",
      bestFor:
        "Bootcamps, online academies, coding schools, and cohort learning programs",
      strengths: [
        "Predictable cohort-friendly pricing that avoids per-student seat penalties",
        "Full message and file history retention across all cohort channels",
        "Built-in Buzz live audio and video calls with screen sharing directly in channels",
        "Structured cohort channels mapped to curriculum modules and project sprints",
        "Designed specifically for the mentor-instructor-student dynamic",
      ],
      tradeoffs: [
        "Focused on education workflows rather than corporate HR/payroll integrations",
        "Specialized tool suite tailored for learning rather than generic enterprise office work",
      ],
    },
    matrix: [
      {
        category: "Pricing & Economic Scalability",
        items: [
          {
            feature: "Per-Student Seat Pricing",
            zedu: {
              status: true,
              label: "Flat / Cohort-Friendly",
              description:
                "Designed for education; student volume does not skyrocket your monthly bill",
            },
            competitor: {
              status: false,
              label: "$7.25–$15.00 /user/month",
              description:
                "Published list prices for Slack Pro ($7.25–$8.75) and Business+ ($12.50–$15.00) scale per seat, increasing overhead for large cohorts",
            },
          },
          {
            feature: "Message & Resource History Retention",
            zedu: {
              status: true,
              label: "Permanent History",
              description:
                "All cohort resources, discussions, and code snippets remain permanently accessible",
            },
            competitor: {
              status: false,
              label: "90-Day Access Window",
              description:
                "Free tier limits access to 90 days of message and file history; older content is hidden unless upgraded",
            },
          },
          {
            feature: "Integrated Voice & Video Calling",
            zedu: {
              status: true,
              label: "Included with Buzz",
              description:
                "Live voice and video calls with screen sharing, call timers, and participant management included directly in channels",
            },
            competitor: {
              status: "partial",
              label: "Slack Huddles",
              description:
                "Slack Huddles offer informal audio/video chats, while formal meetings often rely on external conferencing tools",
            },
          },
        ],
      },
      {
        category: "Learning Workflows & Structure",
        items: [
          {
            feature: "Cohort & Module Channel Layout",
            zedu: {
              status: true,
              label: "Native Structure",
              description:
                "Channels logically organized by cohort intake, module, and study group",
            },
            competitor: {
              status: "partial",
              label: "Generic Channels",
              description:
                "Flat channel lists easily become cluttered with hundreds of stale channels",
            },
          },
          {
            feature: "Cohort File Sharing & Resource Management",
            zedu: {
              status: true,
              label: "Built-in File Explorer",
              description:
                "Centralized file repository to organize, preview, and share syllabi, guides, and learning resources across channels",
            },
            competitor: {
              status: "partial",
              label: "Channel Attachments",
              description:
                "Files are shared as inline chat attachments that can get lost in active conversation threads",
            },
          },
          {
            feature: "Structured Channel Communication",
            zedu: {
              status: true,
              label: "Cohort Channels",
              description:
                "Module channels allow mentors and learners to collaborate openly and keep discussions focused by topic",
            },
            competitor: {
              status: "partial",
              label: "General Channels",
              description:
                "Channels often mix general company discussions with team chats without educational structure",
            },
          },
        ],
      },
      {
        category: "Administration & Operations",
        items: [
          {
            feature: "Automated Cohort Onboarding & Archiving",
            zedu: {
              status: true,
              label: "Channel Archiving",
              description:
                "Archive completed cohort channels while preserving access to past discussions and materials",
            },
            competitor: {
              status: "partial",
              label: "Manual Management",
              description:
                "Admins must manually archive channels and manage member licenses to avoid per-seat fees",
            },
          },
          {
            feature: "Enterprise App Integrations",
            zedu: {
              status: "partial",
              label: "Education-Focused",
              description:
                "Integrates with modern learning and development workflows",
            },
            competitor: {
              status: true,
              label: "2,600+ Integrations",
              description:
                "Unmatched library of corporate enterprise productivity software",
            },
          },
        ],
      },
    ],
    deepDives: [
      {
        title: "Cost Analysis: Why Slack Becomes Unaffordable for Bootcamps",
        subtitle:
          "Per-seat SaaS models make sense for corporate staff, but fail drastically with rolling student intakes.",
        zeduHeading: "Zedu's Scalable Education Pricing",
        zeduPoints: [
          "Flat, predictable pricing models tailored to educational programs and community sizes.",
          "Onboard hundreds of students per cohort without recalculating monthly overhead per head.",
          "Keep alumni in read-only or community channels without incurring ongoing per-seat charges.",
        ],
        competitorHeading: "Slack's Per-Seat Billing Penalty",
        competitorPoints: [
          "Published list pricing for Slack Pro ($7.25–$8.75/seat/month) and Business+ ($12.50–$15.00/seat/month) means 200 active students can cost $1,450 to $3,000 every month in recurring seat licenses.",
          "Admins frequently manage member access for graduating cohorts to prevent ongoing per-seat charges.",
          "The free tier restricts access to 90 days of message and file history, hiding earlier module discussions and files unless upgraded.",
        ],
      },
      {
        title:
          "Learning Experience: Built for Students, Not Corporate Executives",
        subtitle:
          "Corporate knowledge-work software does not address the pedagogical needs of instructors and learners.",
        zeduHeading: "A Purpose-Built Learning Platform",
        zeduPoints: [
          "Built-in Buzz video calls allow students and mentors to jump directly into screen sharing and group discussions within channels.",
          "Cohort channels keep lesson discussions, resources, and study groups cleanly compartmentalized.",
          "Instructors and mentors can maintain clear, focused group discussions rather than juggling fragmented threads.",
        ],
        competitorHeading: "Slack's Corporate Focus",
        competitorPoints: [
          "Slack is optimized for corporate meetings, sales notifications, and executive announcements.",
          "Slack Huddles are lightweight informal chats, not full-featured interactive lecture halls.",
          "Students feel like they are navigating a corporate office rather than an engaging educational campus.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why should our bootcamp choose Zedu over Slack?",
        answer:
          "Slack is built for corporate teams and charges per active user ($7.25–$15.00/user/month on standard Pro and Business+ list pricing), which can scale up quickly when managing cohorts of 50 to 500+ students. Furthermore, Slack's free plan restricts access to the most recent 90 days of message and file history. Zedu offers predictable cohort-friendly pricing, full history retention, and built-in Buzz voice and video calling directly in channels.",
      },
      {
        question:
          "Does Zedu have a 90-day message history limit like Slack's free plan?",
        answer:
          "No. While Slack's free plan restricts access to the past 90 days of message and file history, Zedu retains your cohort discussions, shared links, and learning resources without hiding older materials as cohorts progress.",
      },
      {
        question:
          "Does Zedu support live voice and video calling like Slack Huddles?",
        answer:
          "Yes. Zedu includes Buzz, a built-in live audio and video calling feature with screen sharing, call timers, in-call chat, and participant controls. Learners and mentors can launch live calls directly from their channels without coordinating external meeting links.",
      },
      {
        question: "Can we migrate our existing Slack channels to Zedu?",
        answer:
          "Yes. Setting up your cohort tracks and channels on Zedu takes only a few minutes. You can invite your instructors, teaching assistants, and students with one click.",
      },
    ],
    ctaHeading: "Stop Paying Corporate Per-Seat Tax on Students",
    ctaDescription:
      "Switch to Zedu and give your bootcamp an organized, affordable platform with full history retention and built-in Buzz calling.",
  },
};

export const allComparisonSlugs = Object.keys(comparisonPages);
