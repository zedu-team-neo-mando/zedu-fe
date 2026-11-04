export const SHIPPED_HASHTAG = "#ShippedOnZedu";
export const SHIPPED_TRACKER_KEY = "zedu:shipped-on-zedu:tracker";

export const SHIPPED_TRACKS = [
  "Frontend",
  "Design",
  "Backend",
  "Marketing",
] as const;

export type ShippedTrack = (typeof SHIPPED_TRACKS)[number];

export type ShippedCardInput = {
  title: string;
  name: string;
  track: string;
  cohort: string;
  before: string;
  after: string;
};

export type ShippedCaption = {
  id: "linkedin" | "x" | "portfolio";
  label: string;
  text: string;
};

export type ShippedTrackerRow = {
  date: string;
  intern: string;
  track: string;
  cohort: string;
  ticket: string;
  platform: string;
  postUrl: string;
  likes: string;
  reposts: string;
  signups: string;
};

export const SHIPPED_TRACKER_HEADERS = [
  "date",
  "intern",
  "track",
  "cohort",
  "ticket",
  "platform",
  "post_url",
  "likes",
  "reposts",
  "signups",
] as const;

const MAX_FIELD = 140;

export function cleanField(value: string, max = MAX_FIELD): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export function cardFields(input: ShippedCardInput): ShippedCardInput {
  return {
    title: cleanField(input.title) || "Fixed: describe the change you shipped",
    name: cleanField(input.name) || "Your name",
    track: cleanField(input.track, 40) || "Frontend",
    cohort: cleanField(input.cohort, 60) || "Your cohort",
    before: cleanField(input.before),
    after: cleanField(input.after),
  };
}

export function captionTemplates(input: ShippedCardInput): ShippedCaption[] {
  const card = cardFields(input);
  const credit = `${card.name} · ${card.track} · ${card.cohort}`;
  const change =
    card.before && card.after
      ? `Before: ${card.before}\nAfter: ${card.after}\n\n`
      : "";

  return [
    {
      id: "linkedin",
      label: "LinkedIn",
      text: `I shipped a fix on Zedu.\n\n${card.title}\n\n${change}${credit}\n\n${SHIPPED_HASHTAG}`,
    },
    {
      id: "x",
      label: "X",
      text: `Shipped on Zedu: ${card.title}\n${card.track} · ${card.cohort}\n${SHIPPED_HASHTAG}`,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      text: `Another fix is live on Zedu: ${card.title}\nI contributed on the ${card.track} track in ${card.cohort}.\n${SHIPPED_HASHTAG}`,
    },
  ];
}

function csvCell(value: string): string {
  const clean = cleanField(value, 500);
  if (/[",\n]/.test(clean)) return `"${clean.replace(/"/g, '""')}"`;
  return clean;
}

export function trackerCsv(rows: ShippedTrackerRow[]): string {
  const lines = [
    SHIPPED_TRACKER_HEADERS.join(","),
    ...rows.map((row) =>
      [
        row.date,
        row.intern,
        row.track,
        row.cohort,
        row.ticket,
        row.platform,
        row.postUrl,
        row.likes,
        row.reposts,
        row.signups,
      ]
        .map(csvCell)
        .join(",")
    ),
  ];
  return `${lines.join("\n")}\n`;
}
