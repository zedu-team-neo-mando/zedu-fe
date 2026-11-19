export type ChangelogEntryType = "feature" | "improvement" | "fix";

export type ChangelogEntry = {
  date: string;
  type: ChangelogEntryType;
  title: string;
  description: string;
};

// Newest first. Add an entry here when something ships.
export const changelogEntries: ChangelogEntry[] = [
  {
    date: "2026-11-01",
    type: "feature",
    title: "Zedu Ambassadors",
    description:
      "A new page for students and community leaders who want to bring Zedu to their campus or group.",
  },
  {
    date: "2026-11-01",
    type: "improvement",
    title: "Invite links show the workspace",
    description:
      "Invite links now show the workspace name and how many people are already in it.",
  },
  {
    date: "2026-11-01",
    type: "fix",
    title: "Colored store icons",
    description:
      "The download bar now uses the colored App Store and Google Play icons.",
  },
];
