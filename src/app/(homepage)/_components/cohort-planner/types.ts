/** Identifier unions for the planner's selectable inputs. */
export type CohortSizeId =
  | "1-20"
  | "21-50"
  | "51-100"
  | "101-200"
  | "201-500"
  | "500+";

export type DurationId = "1-4" | "5-8" | "9-12" | "13-16" | "17-24" | "25+";

export type SessionId = "0" | "1" | "2" | "3" | "4+";

export type NeedId =
  | "announcements"
  | "discussions"
  | "assignments"
  | "sessions"
  | "resources"
  | "progress";

/** Raw form values; identical to the validated shape the generator receives. */
export interface CohortInputs {
  cohortSize: CohortSizeId;
  duration: DurationId;
  liveSessions: SessionId;
  needs: NeedId[];
  goal: string;
  topics: string;
}

/** A recommended channel with a paste-ready launch pack. */
export interface ChannelPack {
  key: string;
  name: string;
  purpose: string;
  description: string;
  guidelines: string[];
  pinnedMessage: string;
  ownerRole: string;
  why: string;
}

/** One week (or the pre-programme phase) of the roadmap. */
export interface RoadmapWeek {
  key: string;
  label: string;
  focus: string;
  topicBased: boolean;
  activities: string[];
  milestone: string;
  actions: string[];
  comms: string[];
}

/** A single suggested communication activity. */
export interface ScheduleActivity {
  day: string;
  activity: string;
  channel: string;
  purpose: string;
  owner: string;
}

/** Activities that only apply to a specific week (week 1, midpoint, final…). */
export interface WeekSpecial {
  label: string;
  weekKey: string;
  activities: ScheduleActivity[];
}

/** A suggested organising responsibility (a job to cover, not a person). */
export interface RoleItem {
  role: string;
  summary: string;
  responsibilities: string[];
}

export interface ChecklistGroup {
  phase: string;
  items: string[];
}

export interface CohortOverview {
  subject: string;
  durationLabel: string;
  weeks: number;
  cohortLabel: string;
  sessionsLabel: string;
  needsLabel: string;
  approach: string;
  notes: string[];
}

/** The complete generated plan — single source for screen, copy, download, print. */
export interface CohortPlan {
  isExample: boolean;
  overview: CohortOverview;
  channels: ChannelPack[];
  roadmap: RoadmapWeek[];
  schedulePattern: ScheduleActivity[];
  scheduleSpecials: WeekSpecial[];
  roles: RoleItem[];
  checklist: ChecklistGroup[];
}
