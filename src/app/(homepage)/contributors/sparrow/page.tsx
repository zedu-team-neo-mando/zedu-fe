import type { Metadata } from "next";
import { Crown, Github, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TEAM } from "./team";
import { siteUrl } from "~/lib/env-urls";

export const metadata: Metadata = {
  title: `${TEAM.name} Contributors`,
  description: `Meet the ${TEAM.name} team contributing to Zedu.`,
  alternates: {
    canonical: siteUrl("/contributors/sparrow"),
  },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ZeduSparrowTeamContributorsPage = () => {
  const teamLead = TEAM.contributors.find(
    (contributor) => contributor.role === "Team Lead"
  );

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-20 pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        <section className="flex flex-col items-center text-center">
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
            <Users className="h-3.5 w-3.5" />
            Contributors
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {TEAM.name}
          </h1>
          <p className="mt-3 max-w-xl text-base text-slate-600">
            The people building Zedu as part of team {TEAM.name}
            {teamLead ? `, led by ${teamLead.fullName}` : ""}.
          </p>
        </section>

        <section className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Team members
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {TEAM.contributors.length}{" "}
              {TEAM.contributors.length === 1 ? "member" : "members"}
            </span>
          </div>

          {/* Mobile: card layout */}
          <div className="divide-y divide-slate-100 sm:hidden">
            {TEAM.contributors.map((contributor, index) => (
              <div
                key={contributor.githubUsername}
                className="flex items-start gap-4 p-4"
              >
                <span className="mt-1 w-5 shrink-0 text-sm text-slate-400">
                  {index + 1}
                </span>
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                    {getInitials(contributor.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900">
                      {contributor.fullName}
                    </span>
                    {contributor.role === "Team Lead" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                        <Crown className="h-3 w-3" />
                        Team Lead
                      </span>
                    )}
                  </div>
                  {contributor.field && (
                    <p className="mt-0.5 text-sm text-slate-500">
                      {contributor.field}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {contributor.zeduUsername && (
                      <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700">
                        @{contributor.zeduUsername}
                      </code>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                      <Github className="h-3.5 w-3.5 shrink-0" />
                      {contributor.githubUsername}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-14 px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    #
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full name
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Field
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Zedu username
                  </TableHead>
                  <TableHead className="px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    GitHub
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TEAM.contributors.map((contributor, index) => (
                  <TableRow key={contributor.githubUsername}>
                    <TableCell className="px-6 text-slate-400">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                            {getInitials(contributor.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {contributor.fullName}
                          </span>
                          {contributor.role === "Team Lead" && (
                            <span className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                              <Crown className="h-3 w-3" />
                              Team Lead
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contributor.field ? (
                        <span className="text-sm text-slate-600">
                          {contributor.field}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contributor.zeduUsername ? (
                        <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                          @{contributor.zeduUsername}
                        </code>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Github className="h-4 w-4 shrink-0" />
                        <span className="break-all">
                          {contributor.githubUsername}
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption className="mb-4">
                Team {TEAM.name} · Zedu contributors
              </TableCaption>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ZeduSparrowTeamContributorsPage;
