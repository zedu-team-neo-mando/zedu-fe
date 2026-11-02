import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("./changelog-feed.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const { buildChangelogFeed, changelogEntryId, changelogFeedPath } =
  await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );

// The builder only prefixes this to paths, so any origin string works here.
const site = "zedu.test";
const typeLabels = { feature: "New", improvement: "Improved", fix: "Fixed" };
const entries = [
  {
    date: "2026-11-01",
    type: "feature",
    title: "Zedu Ambassadors",
    description: "A page for students & community leaders.",
  },
  {
    date: "2026-10-28",
    type: "fix",
    title: 'Links with "quotes" and <tags>',
    description: "Fixed Tom's preview.",
  },
];
const feed = (overrides = {}) =>
  buildChangelogFeed({
    siteUrl: site,
    title: "What's new in Zedu",
    description: "Latest changes.",
    entries,
    typeLabels,
    ...overrides,
  });

test("entry ids are stable, lower-case and URL safe", () => {
  assert.equal(changelogEntryId(entries[0]), "2026-11-01-zedu-ambassadors");
  assert.equal(
    changelogEntryId(entries[1]),
    "2026-10-28-links-with-quotes-and-tags"
  );
});

test("the feed is RSS 2.0 with a self link to the feed path", () => {
  const xml = feed();
  assert.match(
    xml,
    /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<rss version="2\.0"/
  );
  assert.ok(
    xml.includes(
      `<atom:link href="${site}${changelogFeedPath}" rel="self" type="application/rss+xml" />`
    )
  );
  assert.ok(xml.includes(`<link>${site}/changelog</link>`));
  assert.ok(xml.includes("<title>What&apos;s new in Zedu</title>"));
});

test("one item per entry, in order, linking to its anchor on /changelog", () => {
  const xml = feed();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g);
  assert.equal(items.length, 2);
  assert.ok(
    items[0].includes(
      `<link>${site}/changelog#2026-11-01-zedu-ambassadors</link>`
    )
  );
  assert.ok(
    items[0].includes(
      `<guid isPermaLink="true">${site}/changelog#2026-11-01-zedu-ambassadors</guid>`
    )
  );
  assert.ok(items[0].includes("<category>New</category>"));
  assert.ok(items[1].includes("<category>Fixed</category>"));
});

test("dates are RFC 822 and lastBuildDate is the newest entry", () => {
  const xml = feed();
  assert.ok(xml.includes("<pubDate>Sun, 01 Nov 2026 00:00:00 GMT</pubDate>"));
  assert.ok(xml.includes("<pubDate>Wed, 28 Oct 2026 00:00:00 GMT</pubDate>"));
  assert.ok(
    xml.includes("<lastBuildDate>Sun, 01 Nov 2026 00:00:00 GMT</lastBuildDate>")
  );
});

test("text is XML-escaped", () => {
  const xml = feed();
  assert.ok(
    xml.includes(
      "<title>Links with &quot;quotes&quot; and &lt;tags&gt;</title>"
    )
  );
  assert.ok(
    xml.includes(
      "<description>A page for students &amp; community leaders.</description>"
    )
  );
  assert.ok(
    xml.includes("<description>Fixed Tom&apos;s preview.</description>")
  );
});

test("an empty changelog still gives a valid channel with no items", () => {
  const xml = feed({ entries: [] });
  assert.ok(!xml.includes("<item>"));
  assert.ok(!xml.includes("<lastBuildDate>"));
  assert.ok(xml.includes("</channel>\n</rss>\n"));
});
