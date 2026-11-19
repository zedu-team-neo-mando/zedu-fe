import { Copy, Info, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { ChannelPack, CohortPlan } from "./types";

interface PlanPreviewProps {
  plan: CohortPlan;
  onCopyPack: (pack: ChannelPack) => void;
}

const sectionCard =
  "rounded-xl border border-neutral-200 bg-white p-5 text-left shadow-sm sm:p-6";

const sectionTitle =
  "text-xl font-semibold leading-tight text-neutral-900 sm:text-2xl break-after-avoid";

const fieldLabel =
  "text-xs font-medium uppercase tracking-wide text-neutral-500";

const tableHead =
  "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500";

const tableCell = "px-3 py-2 align-top text-sm text-neutral-700";

/** Renders the generated plan in all six document sections (screen + print). */
export const PlanPreview = ({ plan, onCopyPack }: PlanPreviewProps) => {
  const { overview } = plan;

  return (
    <div className="flex flex-col gap-6">
      {/* 1 — Overview */}
      <section id="cohort-overview" className={sectionCard}>
        <h2 className={sectionTitle}>1. Cohort overview</h2>
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className={fieldLabel}>Programme / subject</dt>
            <dd className="text-sm text-neutral-800">
              {overview.subject || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className={fieldLabel}>Duration</dt>
            <dd className="text-sm text-neutral-800">
              {overview.durationLabel}
            </dd>
          </div>
          <div>
            <dt className={fieldLabel}>Expected learners</dt>
            <dd className="text-sm text-neutral-800">{overview.cohortLabel}</dd>
          </div>
          <div>
            <dt className={fieldLabel}>Live sessions</dt>
            <dd className="text-sm text-neutral-800">
              {overview.sessionsLabel}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className={fieldLabel}>Coordination needs</dt>
            <dd className="text-sm text-neutral-800">{overview.needsLabel}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-neutral-700">
          {overview.approach}
        </p>
        {overview.notes.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2 rounded-lg bg-amber-50 p-3">
            {overview.notes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-2 text-sm text-amber-900"
              >
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 2 — Channels */}
      <section id="recommended-channels" className={sectionCard}>
        <h2 className={sectionTitle}>2. Recommended communication channels</h2>
        <p className="mt-2 text-sm text-neutral-600">
          {plan.channels.length}{" "}
          {plan.channels.length === 1
            ? "channel recommended"
            : "channels recommended"}{" "}
          for your selections. Each launch pack is ready to copy into your
          platform — Zedu never creates channels for you.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {plan.channels.map((pack) => (
            <article
              key={pack.key}
              className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50/60 p-4 break-inside-avoid"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    {pack.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{pack.purpose}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="no-print shrink-0"
                  aria-label={`Copy launch pack for ${pack.name}`}
                  onClick={() => onCopyPack(pack)}
                >
                  <Copy className="mr-1.5 size-3.5" aria-hidden="true" />
                  Copy pack
                </Button>
              </div>
              <div>
                <p className={fieldLabel}>Channel description</p>
                <p className="mt-1 text-sm text-neutral-700">
                  {pack.description}
                </p>
              </div>
              <div>
                <p className={fieldLabel}>
                  Posting guidelines &amp; permissions
                </p>
                <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-sm text-neutral-700">
                  {pack.guidelines.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={fieldLabel}>Sample pinned welcome message</p>
                <blockquote className="mt-1 rounded-lg border-l-4 border-primary-500 bg-white p-3 text-sm text-neutral-700">
                  {pack.pinnedMessage}
                </blockquote>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-600">
                  {pack.ownerRole}
                </span>
                <span className="text-neutral-500">Why: {pack.why}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3 — Roadmap */}
      <section id="programme-roadmap" className={sectionCard}>
        <h2 className={sectionTitle}>3. Week-by-week programme roadmap</h2>
        <p className="mt-2 text-sm italic text-neutral-600">
          Milestones are recommended targets, not guarantees — learners may
          progress at different speeds.
        </p>
        <ol className="mt-4 flex flex-col gap-3">
          {plan.roadmap.map((week) => (
            <li
              key={week.key}
              className="rounded-lg border border-neutral-200 p-4 break-inside-avoid"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {week.label}
                </span>
                <span className="text-sm font-medium text-neutral-900">
                  {week.focus}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    week.topicBased
                      ? "bg-primary-50 text-primary-600"
                      : "bg-neutral-100 text-neutral-600"
                  )}
                >
                  {week.topicBased
                    ? "From your topics"
                    : "Operational milestone"}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-800">
                <span className="font-semibold">Intended milestone:</span>{" "}
                {week.milestone}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <p className={fieldLabel}>Activities</p>
                  <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-sm text-neutral-700">
                    {week.activities.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={fieldLabel}>Organiser actions</p>
                  <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-sm text-neutral-700">
                    {week.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={fieldLabel}>Communication</p>
                  <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-sm text-neutral-700">
                    {week.comms.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 4 — Schedule */}
      <section id="communication-schedule" className={sectionCard}>
        <h2 className={sectionTitle}>4. Weekly communication schedule</h2>
        <p className="mt-2 text-sm text-neutral-600">
          What to communicate and when — filtered to your coordination needs and
          live session frequency.
        </p>
        <h3 className="mt-4 text-base font-semibold text-neutral-900 break-after-avoid">
          Recurring weekly rhythm
        </h3>
        <div className="table-scroll mt-2 overflow-x-auto rounded-lg border border-neutral-200 print:overflow-visible">
          <table className="w-full min-w-[36rem] border-collapse print:min-w-0">
            <thead className="bg-neutral-50">
              <tr>
                <th className={tableHead} scope="col">
                  Day
                </th>
                <th className={tableHead} scope="col">
                  Activity
                </th>
                <th className={tableHead} scope="col">
                  Channel
                </th>
                <th className={tableHead} scope="col">
                  Purpose
                </th>
                <th className={tableHead} scope="col">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {plan.schedulePattern.length === 0 ? (
                <tr>
                  <td className={tableCell} colSpan={5}>
                    No recurring activities apply to your selections — see the
                    week-specific additions below.
                  </td>
                </tr>
              ) : (
                plan.schedulePattern.map((a) => (
                  <tr key={`${a.day}-${a.activity}`}>
                    <td
                      className={cn(tableCell, "font-medium text-neutral-900")}
                    >
                      {a.day}
                    </td>
                    <td className={tableCell}>{a.activity}</td>
                    <td className={tableCell}>{a.channel}</td>
                    <td className={tableCell}>{a.purpose}</td>
                    <td className={tableCell}>{a.owner}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 className="mt-5 text-base font-semibold text-neutral-900 break-after-avoid">
          Week-specific additions
        </h3>
        <div className="table-scroll mt-2 overflow-x-auto rounded-lg border border-neutral-200 print:overflow-visible">
          <table className="w-full min-w-[36rem] border-collapse print:min-w-0">
            <thead className="bg-neutral-50">
              <tr>
                <th className={tableHead} scope="col">
                  Applies to
                </th>
                <th className={tableHead} scope="col">
                  Day
                </th>
                <th className={tableHead} scope="col">
                  Activity
                </th>
                <th className={tableHead} scope="col">
                  Channel
                </th>
                <th className={tableHead} scope="col">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {plan.scheduleSpecials.flatMap((special) =>
                special.activities.map((a) => (
                  <tr key={`${special.weekKey}-${a.activity}`}>
                    <td
                      className={cn(tableCell, "font-medium text-neutral-900")}
                    >
                      {special.label}
                    </td>
                    <td className={tableCell}>{a.day}</td>
                    <td className={tableCell}>{a.activity}</td>
                    <td className={tableCell}>{a.channel}</td>
                    <td className={tableCell}>{a.owner}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5 — Roles */}
      <section id="roles-responsibilities" className={sectionCard}>
        <h2 className={sectionTitle}>5. Roles and responsibilities</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Responsibilities to cover, not people — one person may hold several of
          these.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plan.roles.map((role) => (
            <article
              key={role.role}
              className="rounded-lg border border-neutral-200 p-4 break-inside-avoid"
            >
              <h3 className="text-base font-semibold text-neutral-900">
                {role.role}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">{role.summary}</p>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-sm text-neutral-700">
                {role.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 6 — Checklist */}
      <section id="planning-checklist" className={sectionCard}>
        <h2 className={sectionTitle}>6. Important planning checklist</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plan.checklist.map((group) => (
            <div key={group.phase} className="break-inside-avoid">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-600 break-after-avoid">
                {group.phase}
              </h3>
              <ul className="mt-2 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-neutral-700"
                  >
                    <Square
                      className="mt-0.5 size-3.5 shrink-0 text-neutral-400"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
