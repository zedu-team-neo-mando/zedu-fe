import {
  CHANNEL_TEMPLATES,
  CHECKLIST_PHASES,
  DEFAULT_SUBJECT,
  DELEGATION_BY_SIZE,
  DURATION_OPTIONS,
  EXAMPLE_INPUTS,
  MODERATION_BY_SIZE,
  NEED_LABEL,
  ROLE_LIBRARY,
  SESSION_OPTIONS,
  SIZE_PHRASE,
  WEEKS_BY_DURATION,
} from "./content";
import type {
  ChannelPack,
  ChecklistGroup,
  CohortInputs,
  CohortPlan,
  NeedId,
  RoleItem,
  RoadmapWeek,
  ScheduleActivity,
  WeekSpecial,
} from "./types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const sessionCount = (id: CohortInputs["liveSessions"]): number =>
  id === "4+" ? 4 : Number(id);

const fill = (msg: string, vars: Record<string, string>): string =>
  msg.replace(/\{(subject|questions|main)\}/g, (_, key) => vars[key]);

interface ParsedTopics {
  slots: (string | null)[];
  provided: number;
  overflow: number;
  placed: number;
}

/** Parses "Week N: topic" lines (or plain lines) into slots for each week. */
export const parseTopics = (raw: string, weeks: number): ParsedTopics => {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const slots: (string | null)[] = Array<string | null>(weeks).fill(null);
  let overflow = 0;
  let cursor = 0;

  for (const line of lines) {
    const explicit = line.match(/^week\s*(\d+)\s*[:.\-–—]\s*(.+)$/i);
    if (explicit) {
      const n = Number(explicit[1]);
      if (n >= 1 && n <= weeks) slots[n - 1] = explicit[2].trim();
      else overflow += 1;
      continue;
    }
    const numbered = line.match(/^\d+\s*[).:\-–—]\s*(.+)$/);
    const topic = numbered ? numbered[1].trim() : line;
    while (cursor < weeks && slots[cursor] !== null) cursor += 1;
    if (cursor < weeks) {
      slots[cursor] = topic;
      cursor += 1;
    } else {
      overflow += 1;
    }
  }

  return {
    slots,
    provided: lines.length,
    overflow,
    placed: slots.filter(Boolean).length,
  };
};

/* ------------------------------------------------------------------ */
/* Section builders                                                    */
/* ------------------------------------------------------------------ */

const buildChannels = (
  inputs: CohortInputs,
  fillSubject: string
): { channels: ChannelPack[]; notes: string[] } => {
  const { needs, cohortSize, liveSessions } = inputs;
  const sessions = sessionCount(liveSessions);
  const small = cohortSize === "1-20";
  const notes: string[] = [];
  const questionsName = small
    ? "Questions & Discussion"
    : "Learner Questions & Support";
  const vars = {
    subject: fillSubject,
    questions: needs.includes("discussions")
      ? questionsName
      : "a direct message to the organisers",
    main: needs.includes("announcements")
      ? "Programme Announcements"
      : "the pinned welcome post",
  };

  const packs: ChannelPack[] = [];
  const push = (key: string): void => {
    const template = CHANNEL_TEMPLATES.find((c) => c.key === key);
    if (!template) return;
    const owner = template.ownerRole;
    const moderation = `${MODERATION_BY_SIZE[cohortSize]} ${owner} owns this channel.`;
    packs.push({
      key: template.key,
      name: fill(template.name, vars),
      purpose: fill(template.purpose, vars),
      description: fill(template.description, vars),
      guidelines: [...template.guidelines, moderation].map((g) =>
        fill(g, vars)
      ),
      pinnedMessage: fill(template.pinnedMessage, vars),
      ownerRole: owner,
      why: fill(template.why, vars),
    });
  };

  if (needs.includes("announcements")) push("announcements");
  push("intros");
  if (needs.includes("discussions")) {
    if (small) push("questions-merged");
    else {
      push("general");
      push("questions");
    }
  }
  if (needs.includes("assignments")) push("assignments");
  if (needs.includes("sessions")) {
    if (sessions > 0) push("live");
    else
      notes.push(
        "Live sessions are set to none, so no live-session channel or activities were generated even though live sessions are a selected coordination need."
      );
  }
  if (needs.includes("resources")) push("resources");
  if (needs.includes("progress")) push("progress");

  return { channels: packs, notes };
};

const findChannel = (channels: ChannelPack[], ...keys: string[]): string =>
  channels.find((c) => keys.includes(c.key))?.name ?? channels[0]?.name ?? "";

const buildSchedule = (
  inputs: CohortInputs,
  channels: ChannelPack[],
  weeks: number
): { pattern: ScheduleActivity[]; specials: WeekSpecial[] } => {
  const { needs, liveSessions } = inputs;
  const sessions = sessionCount(liveSessions);
  const ann = findChannel(channels, "announcements");
  const disc = findChannel(
    channels,
    "questions",
    "questions-merged",
    "general"
  );
  const asg = findChannel(channels, "assignments");
  const res = findChannel(channels, "resources");
  const prog = findChannel(channels, "progress");
  const live = findChannel(channels, "live");
  const intro = findChannel(channels, "intros");
  const main = channels[0]?.name ?? "";

  const pattern: ScheduleActivity[] = [];
  if (needs.includes("announcements"))
    pattern.push({
      day: "Monday",
      activity:
        "Beginning-of-week announcement: focus, objectives, and key dates",
      channel: ann,
      purpose: "Set the tone and make the week legible at a glance.",
      owner: "Programme lead",
    });
  if (needs.includes("assignments"))
    pattern.push({
      day: "Tuesday",
      activity: "Assignment reminder with due date and submission details",
      channel: asg,
      purpose: "Give learners a full week to plan around the deadline.",
      owner: "Assignment coordinator",
    });
  if (needs.includes("discussions")) {
    pattern.push({
      day: "Wednesday",
      activity: "Mid-week discussion prompt",
      channel: disc,
      purpose: "Keep participation alive between sessions.",
      owner: "Community moderator",
    });
    pattern.push({
      day: "Friday",
      activity: "Weekly recap and open floor",
      channel: disc,
      purpose: "Close the loop and surface anything unresolved.",
      owner: "Community moderator",
    });
  }
  if (needs.includes("resources"))
    pattern.push({
      day: "Thursday",
      activity: "Learning resource share, posted with context",
      channel: res,
      purpose: "Point learners at what matters this week.",
      owner: "Learning-resource coordinator",
    });
  if (needs.includes("progress"))
    pattern.push({
      day: weeks > 8 ? "Wednesday (every other week)" : "Wednesday",
      activity: "Learner progress check-in",
      channel: prog,
      purpose: "Spot blockers early while there is still time to help.",
      owner: "Programme lead",
    });
  if (needs.includes("sessions") && sessions > 0) {
    pattern.push({
      day: "Day before each live session",
      activity: "Live-session reminder with agenda and joining details",
      channel: live,
      purpose: "Maximise attendance with a predictable reminder.",
      owner: "Session coordinator",
    });
    if (needs.includes("discussions"))
      pattern.push({
        day: "After the first live session each week",
        activity: "Post-session follow-up prompt",
        channel: live,
        purpose: "Turn the session into discussion while it is fresh.",
        owner: "Session coordinator",
      });
  }

  const mid = Math.max(2, Math.floor(weeks / 2));
  const midActive = mid > 2;
  const specials: WeekSpecial[] = [
    {
      weekKey: "pre",
      label: "Pre-programme launch",
      activities: [
        {
          day: "1–2 weeks before start",
          activity:
            "Create the recommended channels and publish welcome messages",
          channel: main,
          purpose: "Give learners somewhere to land on day one.",
          owner: "Programme lead",
        },
        {
          day: "1 week before start",
          activity:
            "Share the programme schedule and expectations with enrolled learners",
          channel: ann,
          purpose: "Set expectations before week 1 begins.",
          owner: "Programme lead",
        },
      ],
    },
    {
      weekKey: "w1",
      label: "Week 1 — Orientation",
      activities: [
        {
          day: "Monday",
          activity: "Welcome and orientation post",
          channel: intro,
          purpose: "Start onboarding and set the tone for the programme.",
          owner: "Programme lead",
        },
        ...(needs.includes("discussions")
          ? [
              {
                day: "Tuesday",
                activity: "Prompt learners to post introductions",
                channel: intro,
                purpose: "Get every learner speaking early.",
                owner: "Community moderator",
              },
            ]
          : []),
      ],
    },
    ...(midActive && needs.includes("progress")
      ? [
          {
            weekKey: `w${mid}`,
            label: "Midpoint",
            activities: [
              {
                day: "Mid-programme",
                activity: "Progress review and feedback request",
                channel: prog,
                purpose: "Catch blockers while there is still time to act.",
                owner: "Programme lead",
              },
            ],
          },
        ]
      : []),
    {
      weekKey: `w${weeks}`,
      label: "Programme completion",
      activities: [
        {
          day: "Final week",
          activity: "Programme completion announcement with next steps",
          channel: ann,
          purpose: "Confirm what happens after the programme ends.",
          owner: "Programme lead",
        },
        ...(needs.includes("progress")
          ? [
              {
                day: "Final week",
                activity: "Programme feedback survey",
                channel: prog,
                purpose: "Capture what worked while it is still fresh.",
                owner: "Programme lead",
              },
            ]
          : []),
      ],
    },
  ];

  return { pattern, specials };
};

const buildRoadmap = (
  inputs: CohortInputs,
  pattern: ScheduleActivity[],
  specials: WeekSpecial[],
  topics: ParsedTopics,
  weeks: number
): RoadmapWeek[] => {
  const { needs, liveSessions } = inputs;
  const sessions = sessionCount(liveSessions);
  const mid = Math.max(2, Math.floor(weeks / 2));
  const midActive = mid > 2;
  const firstAssignment = Math.max(3, Math.round(weeks / 4));
  const q1 = Math.floor(weeks / 4);
  const q3 = Math.floor((weeks * 3) / 4);

  const focusFor = (i: number, topic: string | null): string => {
    if (topic) return topic;
    if (i === 1) return "Orientation";
    if (midActive && i === mid) return "Midpoint review";
    if (i === weeks) return "Programme completion";
    if (i === weeks - 1) return "Final preparation";
    if (i === 2) return "Getting started";
    if (i < weeks / 2) return "Building foundations";
    if (i < weeks * 0.75) return "Practical application";
    return "Consolidation & wrap-up";
  };

  const milestoneFor = (i: number, topic: string | null): string => {
    if (i === 1)
      return "Learners understand the programme expectations and can find everything they need.";
    if (i === weeks) return "Programme completion and evaluation completed.";
    if (i === weeks - 1)
      return needs.includes("assignments")
        ? "Final submissions prepared."
        : "Final activities and completion steps confirmed.";
    if (midActive && i === mid)
      return topic
        ? `Midpoint checkpoint: progress through "${topic}" reviewed.`
        : "Progress reviewed and feedback collected.";
    if (needs.includes("assignments") && i === firstAssignment)
      return "First assignment submitted by the cohort.";
    if (i === 2) return "First learning activity completed.";
    if (weeks > 12 && (i === q1 || i === q3))
      return "Structured checkpoint: progress reviewed and next phase confirmed.";
    if (topic) {
      if (i < weeks / 2)
        return `Learners get started with "${topic}" and complete the first activities.`;
      if (i < weeks * 0.75) return `Learners apply "${topic}" in practice.`;
      return `Learners consolidate "${topic}" ahead of completion.`;
    }
    if (i < weeks / 2)
      return "Learners are keeping pace with the scheduled learning.";
    if (i < weeks * 0.75)
      return "Learners are applying what they have learned in practice.";
    return "Learners are consolidating their learning ahead of completion.";
  };

  const activitiesFor = (i: number, topic: string | null): string[] => {
    const base = topic
      ? `Complete the planned learning activities for ${topic}`
      : i === 1
        ? "Attend orientation and set up your workspace"
        : i === weeks
          ? "Take part in the final activities and evaluation"
          : i === weeks - 1
            ? "Prepare final activities and submissions"
            : "Work through the week's scheduled learning activities";
    const list = [base];
    if (sessions > 0)
      list.push(
        sessions === 1
          ? "Attend this week's live session"
          : "Attend this week's live sessions"
      );
    if (needs.includes("discussions"))
      list.push("Take part in the week's discussion");
    if (needs.includes("assignments") && i === firstAssignment)
      list.push("Submit the assignment scheduled for this week");
    else if (needs.includes("assignments") && i === weeks)
      list.push("Submit final work before the deadline");
    return list;
  };

  const actionsFor = (i: number): string[] => {
    const list = [
      i === 1
        ? "Post the welcome message and confirm every channel is ready."
        : "Post the week's focus so learners know what good looks like.",
    ];
    if (sessions > 0 && i === 1)
      list.push("Confirm the live-session schedule and joining details.");
    if (needs.includes("assignments") && i === firstAssignment)
      list.push("Release the assignment brief and confirm the deadline.");
    if (needs.includes("resources"))
      list.push("Publish this week's learning resources.");
    if (midActive && i === mid)
      list.push("Review progress and follow up with learners who are behind.");
    if (i === weeks - 1)
      list.push("Check that final activities and submissions are on track.");
    if (i === weeks)
      list.push(
        "Complete evaluations and prepare the completion announcement."
      );
    return list.slice(0, 4);
  };

  const commsFor = (i: number): string[] => {
    const here = specials.filter((s) => s.weekKey === `w${i}`);
    const specialItems = here.flatMap((s) =>
      s.activities.map((a) => a.activity)
    );
    const recurring = pattern.length
      ? here.length
        ? "Plus the recurring weekly rhythm from section 4."
        : `Recurring weekly rhythm (${pattern.length} activities — see section 4).`
      : "No recurring activities apply to this week.";
    return [...specialItems, recurring];
  };

  const weeks_out: RoadmapWeek[] = [];
  const preSpecials = specials.find((s) => s.weekKey === "pre");
  weeks_out.push({
    key: "pre",
    label: "Pre-programme",
    focus: "Preparation",
    topicBased: false,
    activities: [
      "Set up the communication workspace and create the recommended channels",
      "Prepare the welcome message and programme schedule",
    ],
    milestone: "Learners receive onboarding information before day one.",
    actions: [
      "Create every recommended channel and pin its welcome message.",
      "Share the schedule and expectations with enrolled learners.",
    ],
    comms: (preSpecials?.activities ?? []).map((a) => a.activity),
  });

  for (let i = 1; i <= weeks; i += 1) {
    const topic = topics.slots[i - 1];
    weeks_out.push({
      key: `w${i}`,
      label: `Week ${i}`,
      focus: focusFor(i, topic),
      topicBased: Boolean(topic),
      activities: activitiesFor(i, topic),
      milestone: milestoneFor(i, topic),
      actions: actionsFor(i),
      comms: commsFor(i),
    });
  }
  return weeks_out;
};

const buildRoles = (
  inputs: CohortInputs,
  channels: ChannelPack[],
  cohortSize: CohortInputs["cohortSize"]
): RoleItem[] => {
  const { needs, liveSessions } = inputs;
  const sessions = sessionCount(liveSessions);
  const hasDiscussion = channels.some((c) =>
    ["general", "questions", "questions-merged"].includes(c.key)
  );
  const roles: RoleItem[] = [
    {
      ...ROLE_LIBRARY.lead,
      responsibilities: [...ROLE_LIBRARY.lead.responsibilities],
    },
  ];
  if (hasDiscussion)
    roles.push({
      ...ROLE_LIBRARY.moderator,
      responsibilities: [
        ...ROLE_LIBRARY.moderator.responsibilities,
        MODERATION_BY_SIZE[cohortSize],
      ],
    });
  if (needs.includes("assignments"))
    roles.push({
      ...ROLE_LIBRARY.assignments,
      responsibilities: [...ROLE_LIBRARY.assignments.responsibilities],
    });
  if (needs.includes("sessions") && sessions > 0)
    roles.push({
      ...ROLE_LIBRARY.sessions,
      responsibilities: [...ROLE_LIBRARY.sessions.responsibilities],
    });
  if (needs.includes("resources"))
    roles.push({
      ...ROLE_LIBRARY.resources,
      responsibilities: [...ROLE_LIBRARY.resources.responsibilities],
    });
  return roles;
};

const buildChecklist = (
  inputs: CohortInputs,
  channels: ChannelPack[],
  cohortSize: CohortInputs["cohortSize"]
): ChecklistGroup[] => {
  const { needs, liveSessions } = inputs;
  const sessions = sessionCount(liveSessions);
  const hasDiscussion = channels.some((c) =>
    ["general", "questions", "questions-merged"].includes(c.key)
  );
  const intro = findChannel(channels, "intros");
  const channelNames = channels.map((c) => c.name).join(", ");

  const before = [
    `Prepare the communication workspace and agree the role split (${DELEGATION_BY_SIZE[cohortSize].toLowerCase()}).`,
    `Create the recommended channels: ${channelNames}.`,
    `Publish the welcome message and pin it in ${intro}.`,
  ];
  if (hasDiscussion)
    before.push(
      "Share participation guidelines and expectations with learners."
    );
  before.push(
    needs.includes("announcements")
      ? "Share the programme schedule and key dates in the announcements channel."
      : "Share the programme schedule and key dates in your welcome message."
  );
  if (sessions > 0)
    before.push("Set up a repeatable reminder for every live session.");
  if (needs.includes("assignments"))
    before.push("Schedule assignment reminders ahead of each deadline.");

  const during: string[] = [];
  if (needs.includes("announcements"))
    during.push("Publish the beginning-of-week announcement every week.");
  else during.push("Post the week's focus in your main channel every week.");
  if (hasDiscussion)
    during.push(
      "Monitor learner questions and respond within one working day."
    );
  if (needs.includes("assignments"))
    during.push(
      "Communicate every deadline and remind learners before it passes."
    );
  if (needs.includes("progress"))
    during.push("Run progress check-ins and collect feedback at the midpoint.");
  during.push(
    "Compare progress against the roadmap milestones and adjust if you are falling behind."
  );

  const completion = [
    "Communicate completion instructions and final programme information.",
  ];
  if (needs.includes("resources"))
    completion.push(
      "Publish a final learning-resources roundup so learners keep access."
    );
  completion.push(
    needs.includes("progress")
      ? "Collect programme feedback with a short survey."
      : "Gather informal feedback from a few learners before you close."
  );
  completion.push(
    "Publish a closing message that celebrates outcomes and next steps."
  );

  return [
    { phase: CHECKLIST_PHASES[0], items: before },
    { phase: CHECKLIST_PHASES[1], items: during },
    { phase: CHECKLIST_PHASES[2], items: completion },
  ];
};

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */

const sessionLabel = (id: CohortInputs["liveSessions"]): string => {
  const label = SESSION_OPTIONS.find((o) => o.id === id)?.label ?? "";
  return id === "0" ? "No live sessions" : `${label} per week`;
};

/** True when the given values exactly match the built-in example inputs. */
export const isExampleInputs = (inputs: CohortInputs): boolean =>
  (Object.keys(EXAMPLE_INPUTS) as (keyof CohortInputs)[]).every((key) =>
    Array.isArray(EXAMPLE_INPUTS[key])
      ? JSON.stringify(EXAMPLE_INPUTS[key]) === JSON.stringify(inputs[key])
      : EXAMPLE_INPUTS[key] === inputs[key]
  );

/**
 * Deterministically turns validated form values into a complete CohortPlan.
 * Pure: no network, no storage, identical inputs → identical plan.
 */
export const generatePlan = (
  raw: CohortInputs,
  opts: { isExample?: boolean } = {}
): CohortPlan => {
  const goal = raw.goal.trim().slice(0, 240);
  const needs: NeedId[] = [...new Set(raw.needs)];
  const notes: string[] = [];

  if (needs.length === 0) {
    needs.push("announcements");
    notes.push(
      "No coordination needs were selected, so a basic announcements setup was assumed."
    );
  }

  const inputs: CohortInputs = { ...raw, goal, needs };
  const weeks = WEEKS_BY_DURATION[inputs.duration];
  const durationLabel =
    (DURATION_OPTIONS.find((o) => o.id === inputs.duration)?.label ?? "") +
    ` (modelled as ${weeks} weeks)`;
  const fillSubject = goal || DEFAULT_SUBJECT;
  const topics = parseTopics(raw.topics, weeks);

  if (topics.provided > 0 && topics.overflow > 0)
    notes.push(
      `${topics.overflow} topic ${topics.overflow === 1 ? "line falls" : "lines fall"} beyond the modelled ${weeks}-week duration and ${topics.overflow === 1 ? "was" : "were"} not scheduled.`
    );
  if (topics.provided > 0 && topics.placed < weeks)
    notes.push(
      `${weeks - topics.placed} of ${weeks} weeks have no topic provided, so general operational milestones are used for those weeks.`
    );

  const { channels, notes: channelNotes } = buildChannels(inputs, fillSubject);
  notes.push(...channelNotes);

  const { pattern, specials } = buildSchedule(inputs, channels, weeks);
  const roadmap = buildRoadmap(inputs, pattern, specials, topics, weeks);
  const roles = buildRoles(inputs, channels, inputs.cohortSize);
  const checklist = buildChecklist(inputs, channels, inputs.cohortSize);

  const sessionsText = sessionLabel(inputs.liveSessions);
  const channelNames = channels.map((c) => c.name).join(", ");
  const approach =
    `A setup of ${channels.length} ${channels.length === 1 ? "channel fits" : "channels fits"} ${SIZE_PHRASE[inputs.cohortSize]}: ${channelNames}. ` +
    `${DELEGATION_BY_SIZE[inputs.cohortSize]} ` +
    `The weekly schedule assumes ${sessionsText.toLowerCase()} and sticks to the coordination needs you selected (${needs.map((n) => NEED_LABEL[n]).join(", ")}).`;

  return {
    isExample: opts.isExample ?? false,
    overview: {
      subject: goal || "",
      durationLabel,
      weeks,
      cohortLabel:
        SIZE_PHRASE[inputs.cohortSize][0].toUpperCase() +
        SIZE_PHRASE[inputs.cohortSize].slice(1),
      sessionsLabel: sessionsText,
      needsLabel: needs.map((n) => NEED_LABEL[n]).join(", "),
      approach,
      notes,
    },
    channels,
    roadmap,
    schedulePattern: pattern,
    scheduleSpecials: specials,
    roles,
    checklist,
  };
};
