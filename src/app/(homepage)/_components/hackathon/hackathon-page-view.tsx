"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Users,
  LifeBuoy,
  Trophy,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  Lock,
  Hash,
  Volume2,
  PenTool,
  Clock,
  ArrowRight,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Radio,
  Plus,
  Send,
  Eye,
  Calendar,
  MessageSquare,
} from "lucide-react";
import {
  DEFAULT_HACKATHON_CATEGORIES,
  INITIAL_MENTOR_REQUESTS,
  SPONSORSHIP_TRACKS,
  generateHackathonSlug,
  validateSponsorshipApplication,
  generateTeamChannels,
  type MentorRequest,
  type SponsorshipApplication,
} from "./hackathon-data";

export default function HackathonPageView() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    "provisioner" | "mentor-queue" | "whiteboard" | "sponsorship"
  >("provisioner");

  // Provisioner state
  const [eventName, setEventName] = useState("HackZedu 2026");
  const [teamCount, setTeamCount] = useState(10);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployedSlug, setDeployedSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mentor Helpdesk state
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>(
    INITIAL_MENTOR_REQUESTS
  );
  const [mentorFilter, setMentorFilter] = useState<
    "all" | "open" | "claimed" | "resolved"
  >("all");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTeam, setNewTeam] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newCategory, setNewCategory] =
    useState<MentorRequest["category"]>("Frontend");
  const [newUrgency, setNewUrgency] =
    useState<MentorRequest["urgency"]>("medium");
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<string | null>(null);

  // Whiteboard state
  const [boardPrivacy, setBoardPrivacy] = useState<"private" | "public">(
    "private"
  );
  const [stickyNotes, setStickyNotes] = useState([
    {
      id: 1,
      text: "Next.js 15 Client UI + Tailwind Grid",
      color: "bg-cyan-900/60 border-cyan-500/40 text-cyan-200",
      x: "10%",
      y: "25%",
    },
    {
      id: 2,
      text: "FastAPI Backend + Pgvector Embeddings",
      color: "bg-emerald-900/60 border-emerald-500/40 text-emerald-200",
      x: "40%",
      y: "35%",
    },
    {
      id: 3,
      text: "Gemini 1.5 Pro Hackathon Assistant Bot",
      color: "bg-purple-900/60 border-purple-500/40 text-purple-200",
      x: "68%",
      y: "22%",
    },
  ]);
  const [newNoteInput, setNewNoteInput] = useState("");

  // Sponsorship state
  const [sponsorshipForm, setSponsorshipForm] = useState<
    Partial<SponsorshipApplication>
  >({
    eventName: "CalHacks AI Buildfest",
    organization: "UC Berkeley AI Club",
    attendees: 350,
    eventDate: "2026-11-20",
    organizerName: "Alex Rivera",
    organizerEmail: "alex@berkeley.edu",
    track: "ai-track",
  });
  const [sponsorshipErrors, setSponsorshipErrors] = useState<
    Record<string, string>
  >({});
  const [sponsorshipSubmitted, setSponsorshipSubmitted] = useState(false);

  // Handle Provisioning simulation (< 5s)
  const handleDeployWorkspace = () => {
    setIsDeploying(true);
    setDeployStep(1);

    setTimeout(() => setDeployStep(2), 1000);
    setTimeout(() => setDeployStep(3), 2200);
    setTimeout(() => setDeployStep(4), 3400);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployedSlug(generateHackathonSlug(eventName));
    }, 4500);
  };

  // Copy shareable link
  const handleCopyLink = () => {
    if (!deployedSlug) return;
    const link = `/join/${deployedSlug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Mentor claim action
  const handleClaimRequest = (id: string) => {
    setMentorRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "claimed",
              mentorName: "You (Verified Mentor)",
            }
          : r
      )
    );
  };

  // Mentor resolve action
  const handleResolveRequest = (id: string) => {
    setMentorRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    );
  };

  // Create new mentor request
  const handleSubmitMentorRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam || !newTopic) return;

    const newReq: MentorRequest = {
      id: `req-${Date.now()}`,
      teamName: newTeam,
      topic: newTopic,
      category: newCategory,
      description: `Team ${newTeam} requested live assistance with ${newCategory} architecture.`,
      urgency: newUrgency,
      voiceRoom: `Buzz Voice #${newTeam.toLowerCase().replace(/\s+/g, "-")}-audio`,
      status: "open",
      createdAt: "Just now",
    };

    setMentorRequests([newReq, ...mentorRequests]);
    setNewTeam("");
    setNewTopic("");
    setIsComposerOpen(false);
  };

  // Add sticky note to whiteboard preview
  const handleAddStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    const colors = [
      "bg-amber-900/60 border-amber-500/40 text-amber-200",
      "bg-pink-900/60 border-pink-500/40 text-pink-200",
      "bg-blue-900/60 border-blue-500/40 text-blue-200",
    ];
    const color = colors[stickyNotes.length % colors.length];
    setStickyNotes([
      ...stickyNotes,
      {
        id: Date.now(),
        text: newNoteInput,
        color,
        x: `${20 + ((stickyNotes.length * 15) % 60)}%`,
        y: `${50 + ((stickyNotes.length * 10) % 30)}%`,
      },
    ]);
    setNewNoteInput("");
  };

  // Sponsorship form submit
  const handleSponsorshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateSponsorshipApplication(sponsorshipForm);
    if (!result.valid) {
      setSponsorshipErrors(result.errors);
      return;
    }
    setSponsorshipErrors({});
    setSponsorshipSubmitted(true);
  };

  // Filtered mentor requests
  const filteredRequests = mentorRequests.filter((r) => {
    if (mentorFilter === "all") return true;
    return r.status === mentorFilter;
  });

  const teamChannels = generateTeamChannels(teamCount);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link
            href="/templates"
            className="hover:text-cyan-400 transition flex items-center gap-1"
          >
            <span>Templates</span>
          </Link>
          <ChevronRight className="size-3.5 text-slate-600" />
          <span className="text-white font-medium">Hackathon-in-a-Box</span>
        </div>

        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0C1322] via-[#0E1A30] to-[#0A1120] border border-cyan-500/20 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
              <Rocket className="size-3.5" />
              <span>Turnkey Event Workspace Template</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Hackathon-in-a-Box{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                Workspace Engine
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Launch your 48-hour student hackathon, university build weekend,
              or coding competition in under 5 seconds. Everything pre-wired:
              automated skill-based team matchmaking, native{" "}
              <code className="text-cyan-300 bg-slate-900/80 px-1.5 py-0.5 rounded">
                /call-mentor
              </code>{" "}
              dispatch into Buzz voice rooms, and team-isolated collaborative
              whiteboards.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-200">
                <Clock className="size-3.5 text-cyan-400" /> &lt; 5s Setup
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-200">
                <Users className="size-3.5 text-teal-400" /> Auto Matchmaking
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-200">
                <LifeBuoy className="size-3.5 text-amber-400" /> /call-mentor
                Dispatch
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-200">
                <PenTool className="size-3.5 text-indigo-400" /> Team
                Whiteboards
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-200">
                <DollarSign className="size-3.5 text-emerald-400" /> $500–$1,000
                Sponsorships
              </span>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab("provisioner")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Deploy Workspace Template</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => setActiveTab("sponsorship")}
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-sm transition border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <DollarSign className="size-4 text-emerald-400" />
                <span>Apply for Micro-Sponsorship</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Feature Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("provisioner")}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "provisioner"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Layers className="size-4" />
            <span>1-Click Provisioner</span>
          </button>
          <button
            onClick={() => setActiveTab("mentor-queue")}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "mentor-queue"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <LifeBuoy className="size-4" />
            <span>/call-mentor Helpdesk</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
              {mentorRequests.filter((r) => r.status === "open").length} Live
            </span>
          </button>
          <button
            onClick={() => setActiveTab("whiteboard")}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "whiteboard"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <PenTool className="size-4" />
            <span>Team-Isolated Whiteboard</span>
          </button>
          <button
            onClick={() => setActiveTab("sponsorship")}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "sponsorship"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <DollarSign className="size-4 text-emerald-400" />
            <span>Micro-Sponsorships ($1,000)</span>
          </button>
        </div>

        {/* TAB 1: 1-Click Provisioner */}
        {activeTab === "provisioner" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls & Customizer */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 space-y-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Rocket className="size-5 text-cyan-400" />
                  <span>Configure Hackathon Setup</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Customize your event parameters. 1-click provisioning will
                  generate role permissions, voice channels, and team workspaces
                  in under 5 seconds.
                </p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Event / Hackathon Name
                    </label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g. TreeHacks 2026, PennApps AI"
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Team Capacity ({teamCount} Dedicated Workspaces)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 15, 20].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setTeamCount(num)}
                          className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            teamCount === num
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                              : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          {num} Teams
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Auto-Configured Features:
                    </span>
                    <ul className="text-xs text-slate-400 space-y-1.5">
                      <li className="flex items-center gap-2 text-slate-300">
                        <Check className="size-3.5 text-cyan-400 shrink-0" />
                        <span>Skill-matched matchmaking channels</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-300">
                        <Check className="size-3.5 text-cyan-400 shrink-0" />
                        <span>Interactive /call-mentor dispatch queue</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-300">
                        <Check className="size-3.5 text-cyan-400 shrink-0" />
                        <span>
                          Isolated team whiteboards &amp; Buzz voice rooms
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-300">
                        <Check className="size-3.5 text-cyan-400 shrink-0" />
                        <span>Student attendee join link generator</span>
                      </li>
                    </ul>
                  </div>

                  {/* Deploy Action */}
                  <div className="pt-2">
                    {!deployedSlug ? (
                      <button
                        onClick={handleDeployWorkspace}
                        disabled={isDeploying}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isDeploying ? (
                          <>
                            <div className="size-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Provisioning Workspace...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="size-4" />
                            <span>Deploy Workspace in 5s</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                          <CheckCircle className="size-4" />
                          <span>Workspace Provisioned!</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Your hackathon workspace is live with {teamCount} team
                          rooms and mentor queue.
                        </p>
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                          <span className="text-xs text-slate-400 truncate flex-1 font-mono">
                            /join/{deployedSlug}
                          </span>
                          <button
                            onClick={handleCopyLink}
                            className="p-1 rounded text-cyan-400 hover:text-white transition cursor-pointer"
                            title="Copy link"
                          >
                            {copiedLink ? (
                              <Check className="size-4 text-emerald-400" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </button>
                        </div>
                        <Link
                          href={`/join/${deployedSlug}`}
                          className="block text-center w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                        >
                          Enter Hackathon Workspace
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Channel Hierarchy Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="size-4 text-cyan-400" />
                      <span>Workspace Architecture Preview</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Standard channel and category structure created for{" "}
                      {eventName}.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700 text-cyan-300">
                    {DEFAULT_HACKATHON_CATEGORIES.reduce(
                      (acc, c) => acc + c.channels.length,
                      0
                    ) + teamChannels.length}{" "}
                    Channels
                  </span>
                </div>

                {/* Provisioning stepper progress overlay when active */}
                {isDeploying && (
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
                      <span>Live Provisioning Stepper</span>
                      <span>{deployStep} / 4 Completed</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-700"
                        style={{ width: `${(deployStep / 4) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 animate-pulse">
                      {deployStep === 1 &&
                        "1/4 Configuring Organizer, Mentor & Hacker role matrices..."}
                      {deployStep === 2 &&
                        "2/4 Creating broadcast, rules, and skill-based matchmaking channels..."}
                      {deployStep === 3 &&
                        "3/4 Wiring /call-mentor queue into Buzz voice rooms and whiteboards..."}
                      {deployStep === 4 &&
                        "4/4 Generating attendee join links and welcome announcements..."}
                    </p>
                  </div>
                )}

                {/* Categories & Channels Accordion */}
                <div className="space-y-4">
                  {DEFAULT_HACKATHON_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 tracking-wide">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {cat.channels.length} channels
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.channels.map((ch) => (
                          <div
                            key={ch.name}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Hash className="size-3.5 text-cyan-400 shrink-0" />
                              <span className="text-slate-200 font-medium truncate">
                                {ch.name}
                              </span>
                            </div>
                            {ch.badge && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                                {ch.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Dedicated Team Workspaces Category */}
                  <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 tracking-wide">
                        💻 Dedicated Team Workspaces (Private)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {teamChannels.length} team rooms
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {teamChannels.slice(0, 6).map((ch) => (
                        <div
                          key={ch.name}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Lock className="size-3.5 text-amber-400 shrink-0" />
                            <span className="text-slate-300 font-mono truncate">
                              #{ch.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Voice + Board
                          </span>
                        </div>
                      ))}
                    </div>
                    {teamChannels.length > 6 && (
                      <p className="text-[11px] text-slate-500 text-center pt-1">
                        + {teamChannels.length - 6} additional private team
                        rooms provisioned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: /call-mentor Helpdesk */}
        {activeTab === "mentor-queue" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="size-5 text-amber-400" />
                    <h2 className="text-lg font-bold text-white">
                      Interactive /call-mentor Dispatcher
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    Eliminate chaotic mentor DMs. Teams submit help tickets from
                    chat, verified mentors claim requests, and jump into Buzz
                    voice rooms with 1 click.
                  </p>
                </div>
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Test /call-mentor Trigger</span>
                </button>
              </div>

              {/* Status Filter Bar */}
              <div className="flex items-center gap-2">
                {(["all", "open", "claimed", "resolved"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setMentorFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                        mentorFilter === status
                          ? "bg-slate-800 text-cyan-300 border border-cyan-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {status} (
                      {status === "all"
                        ? mentorRequests.length
                        : mentorRequests.filter((r) => r.status === status)
                            .length}
                      )
                    </button>
                  )
                )}
              </div>

              {/* Active Voice Room Alert Banner */}
              {activeVoiceRoom && (
                <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center size-8 rounded-full bg-indigo-900 text-indigo-300">
                      <Volume2 className="size-4 animate-pulse" />
                      <span className="absolute -top-1 -right-1 size-2.5 bg-emerald-400 rounded-full animate-ping" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Connected to {activeVoiceRoom}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Live audio stream active with mentor Alex Chen and team
                        members.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveVoiceRoom(null)}
                    className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-700/60 text-red-300 text-xs font-semibold transition cursor-pointer"
                  >
                    Leave Room
                  </button>
                </div>
              )}

              {/* Requests List */}
              <div className="space-y-3">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-bold text-white">
                          {req.teamName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                          {req.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            req.status === "open"
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : req.status === "claimed"
                                ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                                : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          }`}
                        >
                          {req.status}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {req.createdAt}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200">
                        {req.topic}
                      </p>
                      <p className="text-xs text-slate-400">
                        {req.description}
                      </p>
                      {req.mentorName && (
                        <p className="text-xs text-cyan-300 font-medium flex items-center gap-1.5 pt-0.5">
                          <ShieldCheck className="size-3.5 text-cyan-400" />
                          <span>Mentor: {req.mentorName}</span>
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "open" && (
                        <button
                          onClick={() => handleClaimRequest(req.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                        >
                          Claim Ticket
                        </button>
                      )}
                      {req.status === "claimed" && (
                        <>
                          <button
                            onClick={() => setActiveVoiceRoom(req.voiceRoom)}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Volume2 className="size-3.5" />
                            <span>Join Buzz Room</span>
                          </button>
                          <button
                            onClick={() => handleResolveRequest(req.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        </>
                      )}
                      {req.status === "resolved" && (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle className="size-3.5" /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Composer Modal */}
            {isComposerOpen && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="rounded-2xl bg-[#0C1322] border border-cyan-500/40 p-6 max-w-md w-full space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <LifeBuoy className="size-4 text-cyan-400" />
                      <span>Trigger /call-mentor Help Request</span>
                    </h3>
                    <button
                      onClick={() => setIsComposerOpen(false)}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <form
                    onSubmit={handleSubmitMentorRequest}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Your Team Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newTeam}
                        onChange={(e) => setNewTeam(e.target.value)}
                        placeholder="e.g. Team Quantum"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Domain / Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) =>
                          setNewCategory(
                            e.target.value as MentorRequest["category"]
                          )
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="AI/ML">AI / ML / LLM</option>
                        <option value="Frontend">Frontend / UI</option>
                        <option value="Backend">Backend / API</option>
                        <option value="Design">UI/UX Design</option>
                        <option value="DevOps">DevOps / Deployment</option>
                        <option value="Pitch/Product">Pitch &amp; Demo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Problem Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Describe the blocker, error trace, or question..."
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsComposerOpen(false)}
                        className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                      >
                        Dispatch Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Team-Isolated Collaborative Whiteboard */}
        {activeTab === "whiteboard" && (
          <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <PenTool className="size-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">
                    Team-Isolated Collaborative Whiteboard
                  </h2>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Every team workspace automatically includes a private,
                  zero-setup collaborative whiteboard. No external Miro or Figma
                  signups needed.
                </p>
              </div>

              {/* Privacy Setting Toggle */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                <button
                  onClick={() => setBoardPrivacy("private")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    boardPrivacy === "private"
                      ? "bg-slate-800 text-amber-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Lock className="size-3" />
                  <span>Private to Team</span>
                </button>
                <button
                  onClick={() => setBoardPrivacy("public")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    boardPrivacy === "public"
                      ? "bg-slate-800 text-cyan-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye className="size-3" />
                  <span>Public Demo</span>
                </button>
              </div>
            </div>

            {/* Whiteboard Canvas Mockup */}
            <div className="relative w-full h-96 rounded-2xl bg-[#070B14] border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-4">
              {/* Whiteboard Toolbar */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/80">
                  <span className="text-[11px] font-mono font-bold text-slate-400 px-1">
                    Whiteboard: Team 01 (Nexus)
                  </span>
                  <span className="h-3 w-px bg-slate-700 mx-1" />
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-medium">
                    3 Online
                  </span>
                </div>

                <form
                  onSubmit={handleAddStickyNote}
                  className="flex items-center gap-2 bg-slate-900/90 backdrop-blur p-1 rounded-lg border border-slate-700/80"
                >
                  <input
                    type="text"
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    placeholder="Add architecture note..."
                    className="px-2.5 py-1 text-xs bg-slate-950 text-white rounded border border-slate-700 focus:outline-none focus:border-cyan-400 w-48"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition cursor-pointer"
                  >
                    Post Note
                  </button>
                </form>
              </div>

              {/* Canvas Area with Sticky Notes */}
              <div className="relative w-full h-full my-2">
                {stickyNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`absolute p-3 rounded-xl border shadow-lg max-w-xs text-xs font-medium backdrop-blur-sm cursor-move select-none transition-all ${note.color}`}
                    style={{ left: note.x, top: note.y }}
                  >
                    <div className="flex items-center justify-between pb-1 text-[10px] opacity-75">
                      <span>Architecture Note</span>
                      <Lock className="size-2.5" />
                    </div>
                    <p>{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Canvas Footer Status */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900 z-10">
                <span>
                  Permissions:{" "}
                  {boardPrivacy === "private"
                    ? "Team 01 Members + Assigned Mentors only"
                    : "Public Demo Mode (Read-only for judges)"}
                </span>
                <span>Realtime WebRTC Sync Active</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Micro-Sponsorships Intake */}
        {activeTab === "sponsorship" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Track Highlights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">
                    Zedu Student Hackathon Sponsorships
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We actively sponsor university hackathons, high school coding
                  challenges, and student build weekends with{" "}
                  <strong className="text-emerald-400">
                    $500 to $1,000 cash prize grants
                  </strong>{" "}
                  and free platform workspaces for all participants.
                </p>

                <div className="space-y-3 pt-2">
                  {SPONSORSHIP_TRACKS.map((track) => (
                    <div
                      key={track.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {track.title}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {track.amount}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {track.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Application Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 sm:p-8 space-y-6">
                {!sponsorshipSubmitted ? (
                  <>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Organizer Sponsorship Application
                      </h3>
                      <p className="text-xs text-slate-400 pt-0.5">
                        Submit your event details. Our DevRel partnership team
                        reviews applications within 24 hours.
                      </p>
                    </div>

                    <form
                      onSubmit={handleSponsorshipSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Event / Hackathon Name *
                          </label>
                          <input
                            type="text"
                            value={sponsorshipForm.eventName || ""}
                            onChange={(e) =>
                              setSponsorshipForm({
                                ...sponsorshipForm,
                                eventName: e.target.value,
                              })
                            }
                            placeholder="e.g. TreeHacks 2026"
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                          />
                          {sponsorshipErrors.eventName && (
                            <p className="text-[11px] text-red-400 mt-1">
                              {sponsorshipErrors.eventName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            University / Organizing Club *
                          </label>
                          <input
                            type="text"
                            value={sponsorshipForm.organization || ""}
                            onChange={(e) =>
                              setSponsorshipForm({
                                ...sponsorshipForm,
                                organization: e.target.value,
                              })
                            }
                            placeholder="e.g. Stanford ACM, Penn Spark"
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                          />
                          {sponsorshipErrors.organization && (
                            <p className="text-[11px] text-red-400 mt-1">
                              {sponsorshipErrors.organization}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Expected Attendees *
                          </label>
                          <input
                            type="number"
                            min="20"
                            max="10000"
                            value={sponsorshipForm.attendees || ""}
                            onChange={(e) =>
                              setSponsorshipForm({
                                ...sponsorshipForm,
                                attendees: parseInt(e.target.value, 10),
                              })
                            }
                            placeholder="e.g. 250"
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                          />
                          {sponsorshipErrors.attendees && (
                            <p className="text-[11px] text-red-400 mt-1">
                              {sponsorshipErrors.attendees}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Event Date *
                          </label>
                          <input
                            type="date"
                            value={sponsorshipForm.eventDate || ""}
                            onChange={(e) =>
                              setSponsorshipForm({
                                ...sponsorshipForm,
                                eventDate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Lead Organizer Name *
                          </label>
                          <input
                            type="text"
                            value={sponsorshipForm.organizerName || ""}
                            onChange={(e) =>
                              setSponsorshipForm({
                                ...sponsorshipForm,
                                organizerName: e.target.value,
                              })
                            }
                            placeholder="Full name"
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                          />
                          {sponsorshipErrors.organizerName && (
                            <p className="text-[11px] text-red-400 mt-1">
                              {sponsorshipErrors.organizerName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Organizer Email *
                          </label>
                          <input
                            type="email"
                            value={sponsorshipForm.organizerEmail || ""}
                            onChange={(e) =>
                              setSponsorshipForm({
                                ...sponsorshipForm,
                                organizerEmail: e.target.value,
                              })
                            }
                            placeholder="organizer@university.edu"
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                          />
                          {sponsorshipErrors.organizerEmail && (
                            <p className="text-[11px] text-red-400 mt-1">
                              {sponsorshipErrors.organizerEmail}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Preferred Sponsorship Track
                        </label>
                        <select
                          value={sponsorshipForm.track || "ai-track"}
                          onChange={(e) =>
                            setSponsorshipForm({
                              ...sponsorshipForm,
                              track: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="ai-track">
                            Best AI Application on Zedu ($1,000)
                          </option>
                          <option value="collab-track">
                            Best Realtime Collaboration Experience ($500)
                          </option>
                          <option value="social-good">
                            Social Impact &amp; Education Track ($500)
                          </option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        Submit Sponsorship Application
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="size-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                      <CheckCircle className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">
                        Application Submitted!
                      </h4>
                      <p className="text-xs text-slate-300 max-w-sm mx-auto">
                        Thank you for applying. Our DevRel partnership team has
                        logged your request for {sponsorshipForm.eventName} and
                        will reach out to{" "}
                        <span className="text-cyan-400">
                          {sponsorshipForm.organizerEmail}
                        </span>{" "}
                        within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => setSponsorshipSubmitted(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                    >
                      Submit Another Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Organizer FAQ Section */}
        <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-8 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white">
              Frequently Asked Questions for Organizers
            </h3>
            <p className="text-xs text-slate-400">
              Everything you need to know about running a seamless hackathon on
              Zedu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                How many participants can a single workspace support?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zedu workspaces easily handle up to 5,000 concurrent
                participants with low-latency messaging, role-based channel
                isolation, and unlimited audio rooms.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                Are team collaborative whiteboards private?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes. By default, every team whiteboard is strictly accessible
                only to assigned team members and verified organizers/mentors.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                How do mentors join private team voice rooms?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a team uses{" "}
                <code className="text-cyan-300">/call-mentor</code>, the request
                embeds a 1-click jump button directly into the team&apos;s Buzz
                voice room, bypassing chaotic DM coordination.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-semibold text-white">
                How do we distribute micro-sponsorship prizes?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once approved, Zedu disburses the prize grant directly to your
                hackathon&apos;s financial entity (or Open Collective) prior to
                demo day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
