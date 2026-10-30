import type {
  CohortInputs,
  CohortSizeId,
  DurationId,
  NeedId,
  SessionId,
} from "./types";

/* ------------------------------------------------------------------ */
/* Form options                                                        */
/* ------------------------------------------------------------------ */

export const COHORT_SIZE_IDS = [
  "1-20",
  "21-50",
  "51-100",
  "101-200",
  "201-500",
  "500+",
] as const;

export const DURATION_IDS = [
  "1-4",
  "5-8",
  "9-12",
  "13-16",
  "17-24",
  "25+",
] as const;

export const SESSION_IDS = ["0", "1", "2", "3", "4+"] as const;

export const NEED_IDS = [
  "announcements",
  "discussions",
  "assignments",
  "sessions",
  "resources",
  "progress",
] as const;

interface Option<T extends string> {
  id: T;
  label: string;
  hint?: string;
}

export const COHORT_SIZE_OPTIONS: Option<CohortSizeId>[] = [
  { id: "1-20", label: "1–20 learners" },
  { id: "21-50", label: "21–50 learners" },
  { id: "51-100", label: "51–100 learners" },
  { id: "101-200", label: "101–200 learners" },
  { id: "201-500", label: "201–500 learners" },
  { id: "500+", label: "500+ learners" },
];

export const DURATION_OPTIONS: Option<DurationId>[] = [
  { id: "1-4", label: "1–4 weeks" },
  { id: "5-8", label: "5–8 weeks" },
  { id: "9-12", label: "9–12 weeks" },
  { id: "13-16", label: "13–16 weeks" },
  { id: "17-24", label: "17–24 weeks" },
  { id: "25+", label: "25+ weeks" },
];

export const SESSION_OPTIONS: Option<SessionId>[] = [
  { id: "0", label: "No live sessions" },
  { id: "1", label: "1 session" },
  { id: "2", label: "2 sessions" },
  { id: "3", label: "3 sessions" },
  { id: "4+", label: "4+ sessions" },
];

export const NEED_OPTIONS: (Option<NeedId> & { hint: string })[] = [
  {
    id: "announcements",
    label: "Programme announcements",
    hint: "Weekly updates, deadlines, and official news",
  },
  {
    id: "discussions",
    label: "Learner questions and discussions",
    hint: "Q&A, study discussion, and peer help",
  },
  {
    id: "assignments",
    label: "Assignments and submissions",
    hint: "Releasing work, reminders, and submissions",
  },
  {
    id: "sessions",
    label: "Live sessions and reminders",
    hint: "Scheduling, reminders, and follow-ups",
  },
  {
    id: "resources",
    label: "Learning resources",
    hint: "Sharing readings, links, and materials",
  },
  {
    id: "progress",
    label: "Progress tracking and feedback",
    hint: "Check-ins, progress reviews, and feedback",
  },
];

/* ------------------------------------------------------------------ */
/* Input-derived phrases                                               */
/* ------------------------------------------------------------------ */

export const SIZE_PHRASE: Record<CohortSizeId, string> = {
  "1-20": "a small cohort of up to 20 learners",
  "21-50": "a focused cohort of 21–50 learners",
  "51-100": "a mid-sized cohort of 51–100 learners",
  "101-200": "a large cohort of 101–200 learners",
  "201-500": "a very large cohort of 201–500 learners",
  "500+": "a cohort of 500 or more learners",
};

/** Upper-bound representation of each duration range, stated openly in the plan. */
export const WEEKS_BY_DURATION: Record<DurationId, number> = {
  "1-4": 4,
  "5-8": 8,
  "9-12": 12,
  "13-16": 16,
  "17-24": 24,
  "25+": 26,
};

export const NEED_LABEL: Record<NeedId, string> = {
  announcements: "Programme announcements",
  discussions: "Learner questions and discussions",
  assignments: "Assignments and submissions",
  sessions: "Live sessions and reminders",
  resources: "Learning resources",
  progress: "Progress tracking and feedback",
};

/* ------------------------------------------------------------------ */
/* Moderation guidance by cohort size                                  */
/* ------------------------------------------------------------------ */

export const MODERATION_BY_SIZE: Record<CohortSizeId, string> = {
  "1-20":
    "Small cohort — informal, direct moderation works: the organiser checks in daily and keeps threads in one place.",
  "21-50":
    "Nominate one discussion moderator; a daily sweep of open questions is enough to keep things healthy.",
  "51-100":
    "Assign a named moderator per active channel and agree a daily check-in rhythm with clear escalation to the organiser.",
  "101-200":
    "Run a weekly moderation rota so every active channel has a named owner, and publish response-time expectations.",
  "201-500":
    "Stand up a small moderation team with a lead, daily handovers, and pinned community rules in every channel.",
  "500+":
    "Organise moderation into shifts with a named duty lead per day; agree escalation paths and approval rules before launch.",
};

/** How responsibility is shared at each scale (used in roles and channels). */
export const DELEGATION_BY_SIZE: Record<CohortSizeId, string> = {
  "1-20":
    "One organiser can personally cover these duties alongside the rest of the programme work.",
  "21-50":
    "Split duties across one or two helpers; moderation should take under an hour a day.",
  "51-100":
    "Assign named owners per area and review the split at the midpoint.",
  "101-200":
    "Form a small organising team with rota-based coverage and a single decision-maker.",
  "201-500":
    "Organise into specialised sub-teams with a lead per area and scheduled handovers.",
  "500+":
    "Run dedicated shifts per area with a duty lead per day and documented escalation paths.",
};

/* ------------------------------------------------------------------ */
/* Channel launch-pack templates                                       */
/* ------------------------------------------------------------------ */

export interface ChannelTemplate {
  key: string;
  name: string;
  purpose: string;
  description: string;
  guidelines: string[];
  pinnedMessage: string;
  ownerRole: string;
  why: string;
}

/** Pinned messages may reference {subject}, {questions}, or {main}. */
export const CHANNEL_TEMPLATES: ChannelTemplate[] = [
  {
    key: "announcements",
    name: "Programme Announcements",
    purpose:
      "One official source for programme news, schedule changes, and weekly updates.",
    description:
      "This is the official channel for the programme. Everything learners need to act on — weekly updates, schedule changes, and deadlines — is posted here so nothing gets lost in discussion.",
    guidelines: [
      "Post official updates only; move discussion to the discussion channel.",
      "Include dates, owners, and a clear next step in every message.",
      "Pin the current week's update and unpin the previous one.",
    ],
    pinnedMessage:
      "Welcome to {subject}! 📌 This channel carries official announcements only: weekly updates, schedule changes, and deadlines. Turn on notifications so you never miss one. Questions belong in {questions}.",
    ownerRole: "Programme lead",
    why: "Keeps official information separate from discussion noise so important notices stay findable.",
  },
  {
    key: "intros",
    name: "Introductions & Welcome",
    purpose:
      "A dedicated space for learners to introduce themselves and meet the cohort before week one ends.",
    description:
      "Use this channel to welcome learners and help them meet each other. Everyone posts a short introduction, and the organising team introduces itself so learners know who to reach.",
    guidelines: [
      "Open this channel before the programme starts and pin the welcome prompt.",
      "Ask each learner for a short intro: name, background, and what they hope to gain.",
      "Close or archive the channel after week 1 so it doesn't become noise.",
    ],
    pinnedMessage:
      "Welcome to {subject}! 👋 Introduce yourself in a short post: who you are, your background, and what you hope to get from this programme. The organising team is here — reach out any time in {questions}.",
    ownerRole: "Programme lead",
    why: "Structured onboarding gives every learner an early win and makes the cohort feel real before day one.",
  },
  {
    key: "general",
    name: "General Discussion",
    purpose:
      "A casual space for cohort-wide conversation that doesn't belong in a topic channel.",
    description:
      "A relaxed channel for conversation that doesn't fit elsewhere: wins, resources learners found, study logistics, and peer encouragement. Keep official news in {main}.",
    guidelines: [
      "Allow organic conversation; step in only for guideline violations.",
      "Redirect off-topic requests for official help to {questions}.",
      "Highlight useful learner posts in the weekly recap.",
    ],
    pinnedMessage:
      "This is the cohort's open floor — share wins, useful links, and study updates here. For official news see {main}; for help with the programme ask in {questions}.",
    ownerRole: "Community moderator",
    why: "Larger cohorts need a general outlet or topic channels fill up with unrelated chatter.",
  },
  {
    key: "questions",
    name: "Learner Questions & Support",
    purpose:
      "One clear place to ask for help so questions are seen and answered instead of lost.",
    description:
      "Ask anything about the programme here — content questions, deadlines, logistics, and access issues. Answers stay visible so the next learner benefits from them.",
    guidelines: [
      "Answer within one working day; flag anything that needs the organiser.",
      "Learners should answer peers where they can before the team steps in.",
      "Turn repeated questions into a pinned FAQ entry.",
    ],
    pinnedMessage:
      "Ask your questions here — no question is too small. Aim for answers within one working day. If your question is private, reach out to the organising team directly.",
    ownerRole: "Community moderator",
    why: "A single support channel prevents questions from scattering across DMs and other channels.",
  },
  {
    key: "questions-merged",
    name: "Questions & Discussion",
    purpose:
      "One combined space for learner questions, discussion, and peer support.",
    description:
      "This channel covers both discussion and support for the cohort: ask programme questions, discuss the week's topic, and help peers. Keep official news in {main}.",
    guidelines: [
      "Questions and discussion both belong here in a cohort this size.",
      "Answer questions within one working day; encourage peer answers.",
      "Pin answers that come up repeatedly.",
    ],
    pinnedMessage:
      "This is the cohort's shared space: ask questions, discuss the week's topic, and help each other out. Official news lives in {main}. Introductions are in the welcome post above.",
    ownerRole: "Programme lead",
    why: "A cohort this size doesn't need separate discussion and support channels — one active channel keeps everyone in the same room.",
  },
  {
    key: "assignments",
    name: "Assignments & Submissions",
    purpose:
      "A dedicated channel for releasing work, reminders, and submission confirmations.",
    description:
      "All assignment-related traffic lives here: briefs when work is released, reminders ahead of deadlines, and confirmation when submissions close. Post clarifications as threads under each brief.",
    guidelines: [
      "Post every brief in the same format: task, deadline, and how it's assessed.",
      "Send reminders ahead of time, not on the deadline day only.",
      "Confirm when submissions close and who to contact about extensions.",
    ],
    pinnedMessage:
      "Assignment briefs, reminders, and deadline updates are posted here. Check the pinned post for the current task and due date, and use a thread under the brief for questions.",
    ownerRole: "Assignment coordinator",
    why: "Selected assignments as something to coordinate — a dedicated channel keeps deadlines visible and submissions traceable.",
  },
  {
    key: "resources",
    name: "Learning Resources",
    purpose:
      "A curated stream of readings, links, and materials that support each week.",
    description:
      "One place for everything learners should read, watch, or download each week. Posts include a line on why the resource matters, so learners know where to spend their time.",
    guidelines: [
      "Share resources with context: what it is and why it's worth the time.",
      "Keep resources grouped by week or topic so the archive stays usable.",
      "Remove or replace broken links promptly.",
    ],
    pinnedMessage:
      "This week's readings, links, and materials are posted here with a short note on why each one matters. Everything is organised by week — check here before asking for materials in DMs.",
    ownerRole: "Learning-resource coordinator",
    why: "Selected learning resources as something to coordinate — a dedicated channel stops useful materials from being buried in chat.",
  },
  {
    key: "live",
    name: "Live Sessions",
    purpose:
      "Session logistics: schedules, reminders, joining details, and post-session follow-ups.",
    description:
      "Everything about live sessions appears here — the recurring schedule, reminders before each session, and recordings or follow-up materials afterwards. Pin the current schedule so it's always one click away.",
    guidelines: [
      "Pin the recurring schedule and keep joining details current.",
      "Post reminders before each session and follow-ups after it.",
      "Keep session logistics out of other channels to avoid confusion.",
    ],
    pinnedMessage:
      "📅 Live session schedule is pinned here. Reminders go out before every session, and recordings or follow-up materials land here afterwards. Post session questions in {questions}.",
    ownerRole: "Session coordinator",
    why: "Live sessions are part of your coordination needs — a dedicated channel gives every reminder a predictable home.",
  },
  {
    key: "progress",
    name: "Progress & Feedback",
    purpose:
      "Check-ins, progress reviews, and two-way feedback between learners and organisers.",
    description:
      "Use this channel for progress check-ins, midpoint reviews, and feedback requests. Learners can also post feedback here at any time — it tells the team what to fix while the programme is still running.",
    guidelines: [
      "Post check-in prompts with a clear question, not a vague “how's it going?”.",
      "Share back what changed because of the feedback you received.",
      "Keep individual performance conversations private, in direct messages.",
    ],
    pinnedMessage:
      "Progress check-ins and feedback requests are posted here. Your feedback shapes the programme while it's running — the team will share back what we change because of it.",
    ownerRole: "Programme lead",
    why: "Selected progress tracking as something to coordinate — a dedicated channel makes feedback a routine part of the programme, not an afterthought.",
  },
];

/* ------------------------------------------------------------------ */
/* Roles library                                                       */
/* ------------------------------------------------------------------ */

export const ROLE_LIBRARY = {
  lead: {
    role: "Programme lead",
    summary:
      "Owns the programme end-to-end and is the single source of truth for decisions.",
    responsibilities: [
      "Post the beginning-of-week announcement and keep the schedule accurate.",
      "Review progress at the midpoint and decide any adjustments.",
      "Own the completion announcement and the closing message.",
      "Have the final say when responsibilities overlap between roles.",
    ],
  },
  moderator: {
    role: "Community moderator",
    summary:
      "Keeps discussion healthy: questions answered, guidelines followed, noise contained.",
    responsibilities: [
      "Check open questions daily and respond within one working day.",
      "Enforce the participation guidelines and escalate sensitive issues.",
      "Pin durable answers so recurring questions stay solved.",
      "Run a weekly sweep of quiet or unanswered threads.",
    ],
  },
  assignments: {
    role: "Assignment coordinator",
    summary:
      "Owns the assignment lifecycle from release to submission confirmation.",
    responsibilities: [
      "Publish every brief in a consistent format with a clear deadline.",
      "Send reminders ahead of each deadline, not just on the day.",
      "Track submissions and follow up on missing work before the deadline.",
      "Agree extensions with the programme lead and communicate them once.",
    ],
  },
  sessions: {
    role: "Session coordinator",
    summary:
      "Owns live-session logistics so sessions start on time and nothing gets lost.",
    responsibilities: [
      "Maintain the recurring schedule and pin it in the session channel.",
      "Post the reminder with agenda and joining details before each session.",
      "Record attendance issues and follow up with absent learners.",
      "Publish recordings or follow-up materials after each session.",
    ],
  },
  resources: {
    role: "Learning-resource coordinator",
    summary:
      "Curates the materials learners need each week and keeps the archive usable.",
    responsibilities: [
      "Collect the week's readings, links, and downloads ahead of time.",
      "Post each resource with a line on why it's worth the time.",
      "Check links weekly and replace anything broken.",
      "Assemble the final resource roundup when the programme completes.",
    ],
  },
} as const;

export type RoleId = keyof typeof ROLE_LIBRARY;

/* ------------------------------------------------------------------ */
/* Checklist library (phases are populated with gated items)           */
/* ------------------------------------------------------------------ */

export const CHECKLIST_PHASES = [
  "Before the programme",
  "During the programme",
  "At programme completion",
] as const;

/* ------------------------------------------------------------------ */
/* Example inputs                                                      */
/* ------------------------------------------------------------------ */

export const EXAMPLE_INPUTS: CohortInputs = {
  cohortSize: "21-50",
  duration: "5-8",
  liveSessions: "2",
  needs: [
    "announcements",
    "discussions",
    "assignments",
    "sessions",
    "progress",
  ],
  goal: "An eight-week web development bootcamp",
  topics: [
    "Week 1: Introduction to web development",
    "Week 2: HTML and CSS",
    "Week 3: JavaScript fundamentals",
    "Week 4: Working with APIs",
    "Week 5: Building a project",
    "Week 6: State and data management",
    "Week 7: Testing and code quality",
    "Week 8: Deployment and showcase",
  ].join("\n"),
};

/** Fallback subject when the organiser leaves the goal empty. */
export const DEFAULT_SUBJECT = "your programme";
