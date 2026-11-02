import type { ChangelogEntry, ChangelogEntryType } from "./entries";

export const changelogFeedPath = "/changelog/rss.xml";

// Stable per entry, so a feed item and a shared link always land on the same
// entry of /changelog.
export function changelogEntryId({
  date,
  title,
}: Pick<ChangelogEntry, "date" | "title">): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${date}-${slug}`;
}

const xmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => xmlEntities[char]);
}

// RSS dates use RFC 822, e.g. "Sun, 01 Nov 2026 00:00:00 GMT".
function rssDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

type ChangelogFeedOptions = {
  siteUrl: string;
  title: string;
  description: string;
  entries: ChangelogEntry[];
  typeLabels: Record<ChangelogEntryType, string>;
};

// Builds the changelog as an RSS 2.0 feed. Dates come from the entries, not
// the clock, so the same entries always produce the same feed.
export function buildChangelogFeed({
  siteUrl,
  title,
  description,
  entries,
  typeLabels,
}: ChangelogFeedOptions): string {
  const pageUrl = `${siteUrl}/changelog`;
  const items = entries.map((entry) => {
    const link = `${pageUrl}#${changelogEntryId(entry)}`;
    return [
      "    <item>",
      `      <title>${escapeXml(entry.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `      <description>${escapeXml(entry.description)}</description>`,
      `      <category>${escapeXml(typeLabels[entry.type])}</category>`,
      `      <pubDate>${rssDate(entry.date)}</pubDate>`,
      "    </item>",
    ].join("\n");
  });
  const lastBuildDate = entries.length
    ? [`    <lastBuildDate>${rssDate(entries[0].date)}</lastBuildDate>`]
    : [];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(pageUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    "    <language>en-us</language>",
    ...lastBuildDate,
    `    <atom:link href="${escapeXml(`${siteUrl}${changelogFeedPath}`)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
