import { siteUrl } from "~/lib/env-urls";
import { buildChangelogFeed } from "~/app/(homepage)/_components/changelog/changelog-feed";
import {
  changelogDescription,
  changelogEntries,
  changelogTypeLabels,
} from "~/app/(homepage)/_components/changelog/entries";

// The entries ship with the code, so the feed is built once at build time.
export const dynamic = "force-static";

export function GET() {
  const feed = buildChangelogFeed({
    siteUrl: siteUrl(),
    title: "What's new in Zedu",
    description: changelogDescription,
    entries: changelogEntries,
    typeLabels: changelogTypeLabels,
  });

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
