"use client";

import Image from "next/image";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { showError, showSuccess } from "~/components/toast/sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { buildSnippets, buildTrackedUrl } from "./badge-utils";

const badges = [
  {
    id: "dark",
    name: "Dark",
    description: "Best on light backgrounds",
    path: "/badges/join-zedu-dark.svg",
    width: 216,
    height: 44,
  },
  {
    id: "light",
    name: "Light",
    description: "Best on dark backgrounds",
    path: "/badges/join-zedu-light.svg",
    width: 216,
    height: 44,
  },
  {
    id: "shield",
    name: "Compact",
    description: "Best for GitHub READMEs",
    path: "/badges/zedu-shield.svg",
    width: 142,
    height: 24,
  },
] as const;

type BadgeId = (typeof badges)[number]["id"];

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

function Snippet({
  label,
  value,
  disabled,
}: {
  label: string;
  value: string;
  disabled: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!(await copyToClipboard(value))) {
      showError("Could not copy the code");
      return;
    }
    setCopied(true);
    showSuccess(`${label} copied`);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-neutral-800">{label}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={handleCopy}
          className="gap-2 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="max-h-28 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-neutral-950 p-4 text-xs leading-5 text-neutral-100">
        <code>{value || "Add a valid invitation link to generate code."}</code>
      </pre>
    </div>
  );
}

export function BadgePage({
  configuredSiteUrl,
}: {
  configuredSiteUrl: string;
}) {
  const [siteBaseUrl, setSiteBaseUrl] = useState(configuredSiteUrl);
  const [selectedId, setSelectedId] = useState<BadgeId>("dark");
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    if (!configuredSiteUrl) setSiteBaseUrl(window.location.origin);
  }, [configuredSiteUrl]);

  const selectedBadge =
    badges.find((badge) => badge.id === selectedId) ?? badges[0];
  const tracked = useMemo(
    () => buildTrackedUrl(inviteUrl, siteBaseUrl),
    [inviteUrl, siteBaseUrl]
  );
  const imageUrl = tracked.url
    ? new URL(selectedBadge.path, siteBaseUrl).toString()
    : "";
  const snippets = tracked.url
    ? buildSnippets(tracked.url, imageUrl)
    : { html: "", markdown: "" };

  return (
    <main>
      <section className="border-b border-primary-100 bg-gradient-to-b from-primary-50 to-white px-4 py-16 text-center sm:px-8 sm:py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
          Grow your learning community
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
          Invite people to join you on Zedu
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
          Add a Zedu badge to your website, GitHub README, or newsletter. Every
          click can lead people to your community invitation.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-xl font-bold text-neutral-950">Live preview</h2>
          <p className="mt-1 text-sm text-neutral-600">
            This is what visitors will see and click.
          </p>
          <div
            className={cn(
              "mt-5 flex min-h-64 items-center justify-center rounded-2xl border p-8 shadow-sm transition-colors",
              selectedId === "light"
                ? "border-neutral-800 bg-neutral-950"
                : "border-neutral-200 bg-neutral-100"
            )}
          >
            {tracked.url ? (
              <a
                href={tracked.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Preview the Join us on Zedu badge link"
                className="rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
              >
                <Image
                  src={selectedBadge.path}
                  alt="Join us on Zedu"
                  width={selectedBadge.width}
                  height={selectedBadge.height}
                  priority
                />
              </a>
            ) : (
              <p className="text-sm text-neutral-500">Preview unavailable</p>
            )}
          </div>
          {tracked.url && (
            <a
              href={tracked.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              Test destination
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
          <fieldset>
            <legend className="text-xl font-bold text-neutral-950">
              1. Choose a badge
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {badges.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  aria-pressed={selectedId === badge.id}
                  onClick={() => setSelectedId(badge.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200",
                    selectedId === badge.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-primary-300"
                  )}
                >
                  <span className="block font-semibold text-neutral-900">
                    {badge.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-neutral-500">
                    {badge.description}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="invite-url"
              className="text-xl font-bold text-neutral-950"
            >
              2. Add your invitation link
            </label>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Optional. Leave this empty to send visitors to the Zedu homepage.
            </p>
            <Input
              id="invite-url"
              type="url"
              value={inviteUrl}
              onChange={(event) => setInviteUrl(event.target.value)}
              placeholder={
                siteBaseUrl
                  ? `${siteBaseUrl}/your-invitation`
                  : "Zedu invitation link"
              }
              aria-invalid={Boolean(inviteUrl && tracked.error)}
              aria-describedby={tracked.error ? "invite-url-error" : undefined}
              className="mt-3 h-12"
            />
            {inviteUrl && tracked.error && (
              <p
                id="invite-url-error"
                role="alert"
                className="mt-2 text-sm text-red-600"
              >
                {tracked.error}
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-950">
              3. Copy the code
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Use HTML for websites or newsletters. Use Markdown for GitHub.
            </p>
            <div className="mt-5 space-y-5">
              <Snippet
                label="HTML"
                value={snippets.html}
                disabled={!tracked.url}
              />
              <Snippet
                label="Markdown"
                value={snippets.markdown}
                disabled={!tracked.url}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <div className="rounded-2xl bg-neutral-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-neutral-950">
            Usage guidelines
          </h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-neutral-700 sm:grid-cols-2">
            <li>
              Use the badge as provided so it stays clear and recognizable.
            </li>
            <li>
              Choose the version with the strongest contrast on your background.
            </li>
            <li>
              Link to your Zedu invitation when you want people to join your
              space.
            </li>
            <li>
              Do not stretch, recolor, rotate, or place other graphics over the
              badge.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
