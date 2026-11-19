"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  Mail,
  Search,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

type Status = "Confirmed" | "Needs follow-up" | "Completed" | "Cancelled";
type Filter = "All bookings" | "Upcoming" | "Completed" | "Cancelled";
type Booking = {
  id: string;
  name: string;
  email: string;
  organisation: string;
  interests?: string;
  start: string;
  end: string;
  host: string;
  status: Status;
  meeting: boolean;
  calendar: boolean;
};

const bookings: Booking[] = [
  "ZD-1048|Amara Okafor|amara@greenfield.example.com|Greenfield Learning Centre|2026-11-05T09:30:00+01:00|2026-11-05T10:00:00+01:00|Chika Okafor|Confirmed|yes|yes|Cohorts, learner progress, and parent updates",
  "ZD-1047|David Adebayo|david@brightpath.example.com|BrightPath Academy|2026-11-05T13:00:00+01:00|2026-11-05T13:30:00+01:00|Tomi Adeyemi|Needs follow-up|no|no|Running multiple learning cohorts",
  "ZD-1045|Musa Bello|musa@northstar.example.com|Northstar Learning Hub|2026-10-29T14:00:00+01:00|2026-10-29T14:30:00+01:00|Tomi Adeyemi|Completed|no|yes|Organisation setup and role permissions",
  "ZD-1044|Zainab Yusuf|zainab@cedarhouse.example.com|Cedar House School|2026-10-28T10:00:00+01:00|2026-10-28T10:30:00+01:00|Chika Okafor|Cancelled|no|no|Staff communication across campuses",
].map((row) => {
  const [
    id,
    name,
    email,
    organisation,
    start,
    end,
    host,
    status,
    meeting,
    calendar,
    interests,
  ] = row.split("|");
  return {
    id: id ?? "",
    name: name ?? "",
    email: email ?? "",
    organisation: organisation ?? "",
    start: start ?? "",
    end: end ?? "",
    host: host ?? "",
    status: (status as Status) ?? "Needs follow-up",
    meeting: meeting === "yes",
    calendar: calendar === "yes",
    interests,
  };
});

const filters: Filter[] = [
  "All bookings",
  "Upcoming",
  "Completed",
  "Cancelled",
];
const statusStyles: Record<Status, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  "Needs follow-up": "bg-amber-50 text-amber-800 ring-amber-600/20",
  Completed: "bg-slate-100 text-slate-700 ring-slate-500/15",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

const date = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(value));
const time = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  }).format(new Date(value));

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-3.5 last:border-0">
      <Icon
        size={18}
        className="mt-0.5 shrink-0 text-violet-700"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <div className="mt-1 break-words text-sm font-medium text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DemoBookingsDashboard() {
  const [filter, setFilter] = useState<Filter>("All bookings");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(bookings[0].id);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus =
        filter === "All bookings" ||
        (filter === "Upcoming" &&
          (booking.status === "Confirmed" ||
            booking.status === "Needs follow-up")) ||
        booking.status === filter;
      const matchesSearch =
        !needle ||
        `${booking.id} ${booking.name} ${booking.email} ${booking.organisation}`
          .toLowerCase()
          .includes(needle);
      return matchesStatus && matchesSearch;
    });
  }, [filter, query]);
  const selected =
    visible.find((booking) => booking.id === selectedId) ?? visible[0];

  return (
    <main className="min-h-screen bg-[#faf9fc] px-4 pb-12 pt-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-7 flex flex-col gap-4 border-b border-violet-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              Prototype · sample data
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Demo bookings
            </h1>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Booking list
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a booking to view its details.
              </p>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search bookings</span>
              <Search
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, organisation or ID"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3 sm:px-5">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                  filter === item
                    ? "bg-violet-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-800"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid min-h-[500px] lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
              {visible.length ? (
                <ul aria-label="Demo bookings">
                  {visible.map((booking) => (
                    <li key={booking.id}>
                      <button
                        type="button"
                        aria-pressed={selected?.id === booking.id}
                        onClick={() => setSelectedId(booking.id)}
                        className={cn(
                          "grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-slate-100 px-4 py-4 text-left last:border-0 hover:bg-violet-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 sm:grid-cols-[minmax(0,1.35fr)_minmax(120px,0.9fr)_auto] sm:items-center sm:gap-4 sm:px-5",
                          selected?.id === booking.id && "bg-violet-50"
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {booking.name}
                          </span>
                          <span className="mt-1 block truncate text-xs text-slate-500">
                            {booking.organisation}
                          </span>
                          <span className="mt-1 block text-xs text-slate-400 sm:hidden">
                            {date(booking.start)} · {time(booking.start)}
                          </span>
                        </span>
                        <span className="hidden text-sm text-slate-600 sm:block">
                          <span className="block">{date(booking.start)}</span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {time(booking.start)}–{time(booking.end)}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 sm:justify-end">
                          <StatusBadge status={booking.status} />
                          <ChevronRight
                            size={16}
                            className="hidden text-slate-400 sm:block"
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
                  <Search
                    size={22}
                    className="mb-3 text-violet-500"
                    aria-hidden="true"
                  />
                  <h3 className="font-semibold">No bookings found</h3>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Try another search or status filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setFilter("All bookings");
                    }}
                    className="mt-4 text-sm font-semibold text-violet-700 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {selected ? (
              <aside
                aria-label={`Details for ${selected.name}`}
                className="p-4 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                      Booking details
                    </p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight">
                      {selected.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Booking ID {selected.id}
                    </p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="mt-3">
                  <Detail icon={Building2} label="Organisation">
                    {selected.organisation}
                  </Detail>
                  <Detail icon={Mail} label="Customer email">
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-violet-700 underline decoration-violet-200 underline-offset-4 hover:decoration-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                      {selected.email}
                    </a>
                  </Detail>
                  <Detail icon={CalendarDays} label="Date">
                    {date(selected.start)}
                  </Detail>
                  <Detail icon={Clock3} label="Time and timezone">
                    {time(selected.start)}–{time(selected.end)}
                    <span className="mt-1 block text-xs font-normal text-slate-500">
                      Africa/Lagos (GMT+1)
                    </span>
                  </Detail>
                  <Detail icon={UserRound} label="Sales host">
                    {selected.host || "Not assigned"}
                  </Detail>
                  <Detail icon={Building2} label="Interests">
                    {selected.interests || "Not provided"}
                  </Detail>
                </div>
                <Detail icon={Video} label="Meeting link">
                  {selected.meeting ? "Included in sample" : "Not available"}
                </Detail>
                <Detail icon={CalendarDays} label="Calendar invite">
                  {selected.calendar ? "Included in sample" : "Not available"}
                </Detail>
              </aside>
            ) : (
              <div className="hidden items-center justify-center p-8 text-sm text-slate-500 lg:flex">
                Select a booking to view details.
              </div>
            )}
          </div>
        </section>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Prototype only. Names, organisations, appointments, and provider
          states are illustrative; this view is not connected to live booking or
          calendar data.
        </p>
      </div>
    </main>
  );
}
