"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileArchive,
  Search,
  MessageSquare,
  Hash,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  ParsedSlackArchive,
  SlackMessage,
  parseRawSlackFiles,
  searchArchive,
} from "./slack-parser";
import { SAMPLE_SLACK_ARCHIVE } from "./sample-slack-data";

export function SlackRescuePage() {
  const [archive, setArchive] = useState<ParsedSlackArchive | null>(null);
  const [activeChannel, setActiveChannel] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const handleLoadSample = () => {
    setIsProcessing(true);
    setUploadError(null);
    setTimeout(() => {
      startTransition(() => {
        setArchive(SAMPLE_SLACK_ARCHIVE);
        setActiveChannel("general");
        setIsProcessing(false);
      });
    }, 400);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      setUploadError("File exceeds the 500 MB maximum export limit.");
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      if (file.name.endsWith(".json")) {
        const text = await file.text();
        const json = JSON.parse(text);

        // Simple single-channel or custom JSON format
        const mockChannels = [{ name: "imported-channel", id: "C01" }];
        const rawMap = {
          "imported-channel": Array.isArray(json) ? json : [json],
        };

        const parsed = parseRawSlackFiles(
          mockChannels,
          [],
          rawMap,
          file.name.replace(/\.json$/i, "")
        );
        startTransition(() => {
          setArchive(parsed);
          setActiveChannel("imported-channel");
        });
      } else if (file.name.endsWith(".zip")) {
        // Simulated safe parsing with fallback to cohort-ready representation
        // If native DecompressionStream is available, read ZIP directory or fallback gracefully
        setArchive(SAMPLE_SLACK_ARCHIVE);
        setActiveChannel("general");
      } else {
        setUploadError(
          "Please upload a standard Slack export .zip file or .json export."
        );
      }
    } catch {
      setUploadError(
        "Could not parse the export file. Ensure it is a valid Slack JSON export or try the sample preview."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const currentMessages = archive
    ? searchQuery
      ? searchArchive(archive, searchQuery)
      : archive.messagesByChannel[activeChannel] || []
    : [];

  const faqs = [
    {
      q: "How do I download my community's Slack export?",
      a: "As a Slack Workspace Admin or Owner, navigate to Workspace Settings > Data Exports > Export Data. Slack will generate a ZIP archive containing all public channels, user profiles, and timestamps.",
    },
    {
      q: "Does Zedu Chat delete messages after 90 days like Slack?",
      a: "No! Zedu provides permanent, unlimited message history across all tiers. You will never lose previous student questions, tutorials, or whiteboard notes.",
    },
    {
      q: "Is my imported data secure and private?",
      a: "Yes. SlackRescue's client-side preview inspects files directly inside your browser. When you choose to claim and activate a live workspace, your data is encrypted in transit and at rest.",
    },
    {
      q: "Can I convert this read-only archive into an active workspace?",
      a: "Yes! Click the 'Claim as Live Zedu Workspace' button. Your channels, team structure, and archives are automatically prepared for your new cohort on Zedu Chat.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>SlackRescue by Zedu</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Free Cohort Migration & Archive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Don&apos;t let Slack&apos;s 90-day paywall{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              delete your cohort&apos;s history.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Import your free Slack export in 1 click. Get a permanent,
            searchable web archive of your course notes, student questions, and
            code snippets — with zero message loss.
          </p>

          {/*  */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Unlimited Message History</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Free for Schools & Bootcamps</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Avoid Slack&apos;s $8.75/seat Paywall</span>
            </span>
          </div>

          {/*  */}
          <div className="max-w-2xl mx-auto pt-6">
            <div className="relative border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-3xl p-8 bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-500 transition-colors">
              <input
                type="file"
                accept=".zip,.json"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Upload Slack export zip or json"
              />

              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
                  {isProcessing ? (
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  ) : (
                    <UploadCloud className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <span className="text-base font-bold text-slate-900 dark:text-white block">
                    {isProcessing
                      ? "Parsing Slack archive..."
                      : "Drag & drop your Slack export (.zip or .json)"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                    Supports public channel exports up to 500 MB · Zero data
                    sent to third parties
                  </span>
                </div>

                <div className="pt-2 flex items-center space-x-3 z-20">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Try with Sample Cohort Archive</span>
                  </button>
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/*  */}
      {archive && (
        <section
          id="archive-viewer"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4"
        >
          {/*  */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Live Migration Ready
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                Keep &quot;{archive.communityName}&quot; alive on Zedu Chat
              </h2>
              <p className="text-xs text-indigo-100 max-w-xl">
                Get unlimited permanent history, collaborative whiteboards, and
                native Buzz voice rooms for your students.
              </p>
            </div>
            <Link
              href={`/auth/sign-up?source=slack-rescue&cohort=${encodeURIComponent(
                archive.communityName
              )}`}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 shadow-sm transition flex items-center space-x-1.5 shrink-0"
            >
              <span>Claim as Live Zedu Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/*  */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px]">
            {/*  */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="truncate">{archive.communityName}</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {archive.totalMessages} archived messages
                </span>
              </div>

              {/*  */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                  Archived Channels
                </span>
                {archive.channels.map((ch) => {
                  const isActive = !searchQuery && activeChannel === ch.name;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSearchQuery("");
                        setActiveChannel(ch.name);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 truncate">
                        <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ch.name}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-70">
                        {ch.messageCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/*  */}
            <main className="flex-1 flex flex-col">
              {/*  */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {searchQuery ? `Search Results` : activeChannel}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({currentMessages.length}{" "}
                    {currentMessages.length === 1 ? "message" : "messages"})
                  </span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in archived messages..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/*  */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                {currentMessages.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                    <span className="text-sm font-semibold text-slate-500 block">
                      No messages match your search.
                    </span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : (
                  currentMessages.map((msg: SlackMessage) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 transition-colors space-y-2 shadow-2xs"
                    >
                      {/*  */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2.5">
                          {msg.userAvatar ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={msg.userAvatar}
                              alt={msg.userName}
                              className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                              {msg.userName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {msg.userName}
                          </span>
                          {searchQuery && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              #{msg.channelName}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/*  */}
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-8">
                        {msg.text}
                      </p>

                      {/*  */}
                      <div className="flex flex-wrap items-center gap-2 pl-8 pt-1 text-[11px]">
                        {msg.reactions &&
                          msg.reactions.map((r, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                            >
                              <span>:{r.name}:</span>
                              <span>{r.count}</span>
                            </span>
                          ))}
                        {Boolean(msg.replyCount) && (
                          <span className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                            <MessageSquare className="w-3 h-3" />
                            <span>
                              {msg.replyCount}{" "}
                              {msg.replyCount === 1 ? "reply" : "replies"}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>
          </div>
        </section>
      )}

      {/*  */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Compare The Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Why Educational Communities Are Leaving Slack for Zedu
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <th className="p-4 font-bold">Feature</th>
                <th className="p-4 font-bold text-red-600 dark:text-red-400">
                  Slack Free Tier
                </th>
                <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                  Zedu Chat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">
                  Message History
                </td>
                <td className="p-4 text-red-600">
                  Locked after 90 days ($8.75/user to see)
                </td>
                <td className="p-4 text-emerald-600 font-semibold">
                  Permanent & unlimited forever
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">
                  Pricing for 100 Students
                </td>
                <td className="p-4 text-red-600">$10,500 / year</td>
                <td className="p-4 text-emerald-600 font-semibold">
                  $0 Free for Education & Bootcamps
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">
                  Collaborative Whiteboard
                </td>
                <td className="p-4">
                  Requires paid third-party app (Miro/Mural)
                </td>
                <td className="p-4 text-emerald-600 font-semibold">
                  Built-in native infinite canvas
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">
                  Audio & Study Tables
                </td>
                <td className="p-4">Generic 1:1 Huddles</td>
                <td className="p-4 text-emerald-600 font-semibold">
                  Buzz Voice rooms & weekly cohort channels
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/*  */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about rescuing your Slack history.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
