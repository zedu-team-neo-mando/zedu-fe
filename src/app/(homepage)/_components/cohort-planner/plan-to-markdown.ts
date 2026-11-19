import type { ChannelPack, CohortPlan } from "./types";

const cell = (value: string): string =>
  value.replace(/\|/g, "\\|").replace(/\n/g, " ");

const blockquote = (value: string): string[] =>
  value.split("\n").map((line) => `> ${line}`);

const packMarkdown = (pack: ChannelPack): string[] => [
  `### ${pack.name}`,
  "",
  `**Purpose:** ${pack.purpose}`,
  "",
  `**Responsible role:** ${pack.ownerRole}`,
  "",
  `**Why this channel is recommended:** ${pack.why}`,
  "",
  "**Channel description (paste into your platform):**",
  "",
  ...blockquote(pack.description),
  "",
  "**Posting guidelines and permissions:**",
  "",
  ...pack.guidelines.map((g) => `- ${g}`),
  "",
  "**Sample pinned welcome message:**",
  "",
  ...blockquote(pack.pinnedMessage),
  "",
];

/** Serialises a single channel launch pack (used for individual copy actions). */
export const channelPackToMarkdown = (pack: ChannelPack): string =>
  packMarkdown(pack).join("\n").trim();

/** Serialises the full plan; powers both the .md download and copy-all. */
export const planToMarkdown = (plan: CohortPlan): string => {
  const {
    overview,
    channels,
    roadmap,
    schedulePattern,
    scheduleSpecials,
    roles,
    checklist,
  } = plan;
  const out: string[] = [];

  out.push(`# Cohort Playbook${plan.isExample ? " (Example)" : ""}`, "");
  out.push(
    `Generated locally with the Zedu Cohort Communication Planner${
      plan.isExample ? " — example content, not your plan" : ""
    }.`,
    ""
  );

  out.push("## 1. Cohort overview", "");
  out.push(`- **Programme / subject:** ${overview.subject || "Not provided"}`);
  out.push(`- **Duration:** ${overview.durationLabel}`);
  out.push(`- **Expected learners:** ${overview.cohortLabel}`);
  out.push(`- **Live sessions:** ${overview.sessionsLabel}`);
  out.push(`- **Coordination needs:** ${overview.needsLabel}`);
  out.push("", overview.approach, "");
  if (overview.notes.length > 0) {
    out.push("**Planning notes:**", "");
    for (const note of overview.notes) out.push(`- ${note}`);
    out.push("");
  }

  out.push("## 2. Recommended communication channels", "");
  channels.forEach((pack, index) => {
    out.push(`### 2.${index + 1}. ${pack.name}`, "");
    out.push(...packMarkdown(pack));
  });

  out.push("## 3. Week-by-week programme roadmap", "");
  out.push(
    "*Milestones below are recommended targets, not guarantees — learners may progress at different speeds.*",
    ""
  );
  for (const week of roadmap) {
    out.push(`### ${week.label} — ${week.focus}`, "");
    out.push(`**Intended milestone:** ${week.milestone}`);
    out.push("");
    out.push("**Suggested activities:**");
    for (const a of week.activities) out.push(`- ${a}`);
    out.push("");
    out.push("**Important organiser actions:**");
    for (const a of week.actions) out.push(`- ${a}`);
    out.push("");
    out.push("**Relevant communication activities:**");
    for (const c of week.comms) out.push(`- ${c}`);
    out.push("");
  }

  out.push("## 4. Weekly communication schedule", "");
  out.push("### Recurring weekly rhythm", "");
  out.push("| Day | Activity | Channel | Purpose | Owner |");
  out.push("| --- | --- | --- | --- | --- |");
  for (const a of schedulePattern)
    out.push(
      `| ${cell(a.day)} | ${cell(a.activity)} | ${cell(a.channel)} | ${cell(a.purpose)} | ${cell(a.owner)} |`
    );
  if (schedulePattern.length === 0)
    out.push(
      "| — | No recurring activities for the selected needs | — | — | — |"
    );
  out.push("");

  out.push("### Week-specific additions", "");
  out.push("| Applies to | Day | Activity | Channel | Purpose | Owner |");
  out.push("| --- | --- | --- | --- | --- | --- |");
  for (const special of scheduleSpecials)
    for (const a of special.activities)
      out.push(
        `| ${cell(special.label)} | ${cell(a.day)} | ${cell(a.activity)} | ${cell(a.channel)} | ${cell(a.purpose)} | ${cell(a.owner)} |`
      );
  out.push("");

  out.push("## 5. Roles and responsibilities", "");
  out.push(
    "*These are responsibilities to cover, not people — one person may hold several of them.*",
    ""
  );
  for (const role of roles) {
    out.push(`### ${role.role}`, "");
    out.push(role.summary, "");
    for (const r of role.responsibilities) out.push(`- ${r}`);
    out.push("");
  }

  out.push("## 6. Important planning checklist", "");
  for (const group of checklist) {
    out.push(`### ${group.phase}`, "");
    for (const item of group.items) out.push(`- [ ] ${item}`);
    out.push("");
  }

  return out.join("\n");
};
