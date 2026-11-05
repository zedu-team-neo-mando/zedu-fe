"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Volume2,
  PenTool,
} from "lucide-react";
import {
  getAllCredentials,
  type VerifiedCredential,
} from "./badge-credential-data";

export default function BadgeDirectoryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const allCredentials = getAllCredentials();

  const filtered = allCredentials.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.id.toLowerCase().includes(q) ||
      c.recipientName.toLowerCase().includes(q) ||
      c.cohortName.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
            <ShieldCheck className="size-3.5" />
            <span>Zedu Trust &amp; Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Verify Academic Micro-Credentials
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Authentic, verifiable proof-of-contribution badges awarded to
            students and teaching assistants for peer mentorship, collaborative
            debugging, and study room leadership.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipient, badge ID, or cohort..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="size-4 text-cyan-400" />
              <span>Verified Student Credentials ({filtered.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              Cryptographically signed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cred) => (
              <div
                key={cred.id}
                className="rounded-2xl bg-[#0C1322] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-4 transition shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                      {cred.id}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="size-3" /> Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {cred.recipientName}
                    </h3>
                    <p className="text-xs text-slate-400">{cred.cohortName}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Sparkles className="size-3.5 text-amber-400" />
                      <span>{cred.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {cred.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 pt-1">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white block">
                        {cred.metrics.solutionsProvided}
                      </span>
                      <span>Solutions</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white block">
                        {cred.metrics.buzzStudyHours}h
                      </span>
                      <span>Buzz Hours</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white block">
                        {cred.metrics.whiteboardTutorials}
                      </span>
                      <span>Boards</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {cred.issuedAt}
                  </span>
                  <Link
                    href={`/badges/verify/${cred.id}`}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <span>View Certificate</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viral Referral Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-lg">
            <h4 className="text-lg font-bold text-white">
              Launch your own student cohort or club on Zedu
            </h4>
            <p className="text-xs text-slate-300">
              Reward peer mentors with verifiable LinkedIn credentials. Boost
              retention and student engagement automatically.
            </p>
          </div>
          <Link
            href="/auth/sign-up?ref=badge_directory"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shrink-0"
          >
            Create Free Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
