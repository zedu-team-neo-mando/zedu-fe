import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { ogImageUrl, siteUrl } from "~/lib/env-urls";
import { changelogEntryId, changelogFeedPath } from "./changelog-feed";
import {
  changelogDescription as description,
  changelogEntries,
  changelogTypeLabels as typeLabels,
} from "./entries";

const title = "What's new in Zedu | Changelog";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl("/changelog"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu changelog page preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/changelog"),
    types: { "application/rss+xml": siteUrl(changelogFeedPath) },
  },
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export default function ChangelogPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
        What&apos;s new in Zedu
      </h1>
      <p className="mt-3 text-base text-neutral-600">{description}</p>
      <a
        href={changelogFeedPath}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-medium text-primary-500 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <Rss className="h-4 w-4" aria-hidden="true" />
        Follow via RSS
      </a>
      <ol className="mt-8 flex flex-col gap-8">
        {changelogEntries.map((entry) => (
          <li
            key={changelogEntryId(entry)}
            id={changelogEntryId(entry)}
            className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700">
                {typeLabels[entry.type]}
              </span>
              <time dateTime={entry.date} className="text-neutral-500">
                {formatDate(entry.date)}
              </time>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-neutral-900">
              {entry.title}
            </h2>
            <p className="mt-1 text-neutral-600">{entry.description}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
