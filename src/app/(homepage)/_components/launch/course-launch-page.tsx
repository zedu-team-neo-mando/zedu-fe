"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Volume2,
  Copy,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings2,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  CourseModule,
  CourseSyllabusData,
  LaunchStep,
} from "./syllabus-parser";
import { parseRawSyllabusText } from "./syllabus-parser";
import { SAMPLE_COURSES } from "./sample-syllabus-data";

export function CourseLaunchPage() {
  const [step, setStep] = useState<LaunchStep>("upload");
  const [fileName, setFileName] = useState<string>("");
  const [courseData, setCourseData] = useState<CourseSyllabusData>(
    SAMPLE_COURSES.fullstack
  );
  const [expandedModuleId, setExpandedModuleId] = useState<string>("mod_1");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "channels" | "officeHours" | "invite"
  >("channels");
  const [customChannelName, setCustomChannelName] = useState("");

  const fileInputId = useId();

  // Simulated extraction pipeline with progress milestones
  const runExtraction = (text: string, name: string) => {
    setFileName(name);
    setStep("extracting");
    setExtractionProgress(15);

    const timer1 = setTimeout(() => setExtractionProgress(45), 400);
    const timer2 = setTimeout(() => setExtractionProgress(75), 800);
    const timer3 = setTimeout(() => {
      setExtractionProgress(100);
      const parsed = parseRawSyllabusText(text, name);
      setCourseData(parsed);
      setStep("review");
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || "";
      runExtraction(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    runExtraction(
      "CS 106A Full-Stack Curriculum Sample",
      "cs106a_syllabus_2024.pdf"
    );
  };

  const toggleModule = (moduleId: string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, enabled: !m.enabled } : m
      ),
    }));
  };

  const updateChannelSlug = (moduleId: string, newName: string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, channelName: newName } : m
      ),
    }));
  };

  const handleAddCustomChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customChannelName.trim()) return;

    const cleanSlug = customChannelName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const newModule: CourseModule = {
      id: `custom_${Date.now()}`,
      weekNumber: courseData.modules.length + 1,
      title: customChannelName,
      channelName: cleanSlug.startsWith("#") ? cleanSlug.slice(1) : cleanSlug,
      description: `Custom discussion channel for ${customChannelName}`,
      topics: ["General discussions and collaborative work"],
      assignments: [],
      enabled: true,
      announcementPreview: `Welcome to #${cleanSlug}! Use this space for team discussions.`,
    };

    setCourseData((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
    setCustomChannelName("");
  };

  const handleDeleteModule = (moduleId: string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }));
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/join/${courseData.workspaceSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(courseData.welcomeMessage);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const activeChannelCount = courseData.modules.filter((m) => m.enabled).length;
  const activeOfficeHoursCount = courseData.officeHours.filter(
    (o) => o.enabled
  ).length;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Background ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Syllabus-to-Workspace Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
            Transform Your Raw Syllabus into a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400">
              Live Zedu Workspace
            </span>{" "}
            in 10 Seconds
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
            Upload any course syllabus (PDF, DOCX, or text). Our AI extracts
            weekly modules, maps channel hierarchies, pins assignment
            milestones, and schedules Buzz voice office hours automatically.
          </p>
        </div>

        {/* STEP 1: UPLOAD DROPZONE */}
        {step === "upload" && (
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-indigo-500/50 transition-all p-10 text-center group cursor-pointer shadow-xl">
              <input
                id={fileInputId}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                Drop your course syllabus here
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Supports PDF, Word (.docx), Markdown (.md), and plain text
                documents up to 25 MB.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/25">
                <FileText className="w-4 h-4" />
                <span>Select Syllabus File</span>
              </div>
            </div>

            {/* Instant Demo Option */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Don&apos;t have a syllabus file ready?
              </span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Load Sample: CS 106A (10 Weeks)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXTRACTING SPINNER & PROGRESS */}
        {step === "extracting" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Structuring Academic Workspace...
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {extractionProgress < 40
                ? "Reading course milestones and grading policies..."
                : extractionProgress < 80
                  ? "Generating weekly channels and assignment schedules..."
                  : "Configuring Buzz office hours and student permissions..."}
            </p>

            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${extractionProgress}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 font-mono text-right">
              {fileName || "Syllabus"} • {extractionProgress}% complete
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE CONFIRMATION MATRIX */}
        {(step === "review" || step === "ready") && (
          <div className="space-y-8">
            {/* Course Summary Banner */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold">
                      {courseData.code}
                    </span>
                    <span className="text-xs text-slate-400">
                      {courseData.institution} • {courseData.term}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {courseData.courseName}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Instructor:{" "}
                    <span className="text-slate-300 font-medium">
                      {courseData.instructor}
                    </span>{" "}
                    • Duration:{" "}
                    <span className="text-slate-300 font-medium">
                      {courseData.durationWeeks} Weeks
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-mono">
                      {activeChannelCount} Channels
                    </div>
                    <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to Provision</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-6 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("channels")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === "channels"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Weekly Channels ({activeChannelCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("officeHours")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === "officeHours"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Buzz Office Hours ({activeOfficeHoursCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("invite")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === "invite"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Student Invite & Onboarding</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: CHANNELS MATRIX */}
            {activeTab === "channels" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Curriculum Channels Confirmation Grid
                  </h3>
                  <span className="text-xs text-slate-400">
                    Toggle channels on/off or rename slugs before creating
                    workspace
                  </span>
                </div>

                <div className="grid gap-3">
                  {courseData.modules.map((mod) => {
                    const isExpanded = expandedModuleId === mod.id;
                    return (
                      <div
                        key={mod.id}
                        className={`rounded-xl border transition-all ${
                          mod.enabled
                            ? "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                            : "bg-slate-950 border-slate-900 opacity-60"
                        }`}
                      >
                        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={mod.enabled}
                              onChange={() => toggleModule(mod.id)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-indigo-400">
                                  #{mod.channelName}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Week {mod.weekNumber}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-white mt-0.5">
                                {mod.title}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            {mod.assignments.length > 0 && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                                <Calendar className="w-3 h-3" />
                                {mod.assignments.length} Deliverable
                                {mod.assignments.length > 1 ? "s" : ""}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedModuleId(isExpanded ? "" : mod.id)
                              }
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                              title="Toggle details"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteModule(mod.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete channel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-slate-900/30 space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1">
                                Channel Name
                              </label>
                              <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5">
                                <span className="text-slate-500 font-mono text-xs">
                                  #
                                </span>
                                <input
                                  type="text"
                                  value={mod.channelName}
                                  onChange={(e) =>
                                    updateChannelSlug(mod.id, e.target.value)
                                  }
                                  className="w-full bg-transparent text-xs font-mono text-white focus:outline-none ml-1"
                                />
                              </div>
                            </div>

                            <div>
                              <div className="text-xs font-medium text-slate-400 mb-2">
                                Pinned Topics & Lectures
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {mod.topics.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 rounded-md bg-slate-800 text-xs text-slate-300 font-medium"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {mod.assignments.length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-slate-400 mb-2">
                                  Tracked Assignments & Due Dates
                                </div>
                                <div className="grid gap-2">
                                  {mod.assignments.map((a) => (
                                    <div
                                      key={a.id}
                                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                                    >
                                      <span className="font-medium text-slate-200">
                                        {a.title}
                                      </span>
                                      <span className="text-amber-400 font-mono">
                                        {a.dueDate}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="text-xs font-medium text-slate-400 mb-1">
                                Initial Announcement Post Preview
                              </div>
                              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                                {mod.announcementPreview}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Channel Form */}
                <form
                  onSubmit={handleAddCustomChannel}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800"
                >
                  <input
                    type="text"
                    placeholder="Add custom channel (e.g. project-showcase, exam-prep)..."
                    value={customChannelName}
                    onChange={(e) => setCustomChannelName(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Channel</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: OFFICE HOURS */}
            {activeTab === "officeHours" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Recurring Buzz Voice Office Hours
                  </h3>
                  <span className="text-xs text-slate-400">
                    Auto-configured persistent audio spaces for faculty & TA
                    mentoring
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {courseData.officeHours.map((oh) => (
                    <div
                      key={oh.id}
                      className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            #{oh.buzzRoomName}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs">
                          Buzz Audio
                        </span>
                      </div>

                      <div className="text-base font-bold text-white">
                        {oh.dayOfWeek} • {oh.time}
                      </div>

                      <div className="text-xs text-slate-400">
                        Host:{" "}
                        <span className="text-slate-300 font-medium">
                          {oh.host}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: INVITE & ONBOARDING */}
            {activeTab === "invite" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    Shareable Student Join Link
                  </h3>
                  <p className="text-sm text-slate-400">
                    Enrolled students who click this link are immediately
                    onboarded into the workspace with Student permissions.
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`/join/${courseData.workspaceSlug}`}
                      className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 text-sm font-mono text-slate-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-md shadow-indigo-600/25"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Student Welcome Announcement Template
                      </h3>
                      <p className="text-sm text-slate-400">
                        Paste this into your Canvas, Blackboard, or email
                        announcement.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {courseData.welcomeMessage}
                  </pre>
                </div>
              </div>
            )}

            {/* Sticky Launch Action Bar */}
            <div className="sticky bottom-6 z-20 rounded-2xl border border-indigo-500/30 bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-indigo-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Ready to initialize {courseData.courseName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {activeChannelCount} channels • {activeOfficeHoursCount}{" "}
                    Buzz office hours • Unlimited message history
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors text-center"
                >
                  Upload Another Syllabus
                </button>

                <Link
                  href={`/auth/sign-up?source=syllabus-launch&course=${courseData.workspaceSlug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
                >
                  <span>Create Workspace in 1 Click</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* COMPARISON TABLE */}
        <section className="mt-28 border-t border-slate-800/80 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Instructors Choose Zedu Syllabus AI
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Skip hours of tedious manual setup. Keep your entire academic
              cohort engaged and organized.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4 sm:p-5">Capability</th>
                    <th className="p-4 sm:p-5 text-indigo-400">
                      Zedu Chat (Syllabus AI)
                    </th>
                    <th className="p-4 sm:p-5 text-slate-500">
                      Slack (Free Tier)
                    </th>
                    <th className="p-4 sm:p-5 text-slate-500">
                      Traditional LMS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs sm:text-sm">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      Setup Time
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">
                      10 Seconds (Automated)
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      3–5 Hours Manual Setup
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      Weeks of Admin Bureaucracy
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      Message History
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">
                      Unlimited & Permanent
                    </td>
                    <td className="p-4 sm:p-5 text-rose-400">
                      Locked after 90 Days
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      Clunky archival exports
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      Live Voice Office Hours
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">
                      Built-in Buzz Voice Rooms
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      External Zoom links needed
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      No native audio spaces
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      Whiteboards & Code Sharing
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">
                      Native Real-Time Whiteboard
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      Paid add-ons required
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      Static file uploads only
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      Cost for Cohorts
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">
                      Free for Academic Classes
                    </td>
                    <td className="p-4 sm:p-5 text-rose-400">
                      $8.75/student/month
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      Enterprise institutional license
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="mt-24 border-t border-slate-800/80 pt-16 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Everything you need to know about using Syllabus AI for your class
              or bootcamp.
            </p>
          </div>

          <div className="space-y-4">
            <details className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 group cursor-pointer">
              <summary className="font-semibold text-white flex items-center justify-between list-none">
                <span>
                  Can I edit or add more channels after the AI extracts them?
                </span>
                <span className="text-indigo-400 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Yes! The review matrix allows you to toggle channels on/off,
                rename any slug, add custom channels, and reorganize assignment
                schedules before provisioning.
              </p>
            </details>

            <details className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 group cursor-pointer">
              <summary className="font-semibold text-white flex items-center justify-between list-none">
                <span>What file formats does the syllabus parser support?</span>
                <span className="text-indigo-400 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                The launcher accepts PDF documents, Word files (.docx), Markdown
                (.md), and plain text syllabi up to 25 MB in size.
              </p>
            </details>

            <details className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 group cursor-pointer">
              <summary className="font-semibold text-white flex items-center justify-between list-none">
                <span>How do students join once the workspace is created?</span>
                <span className="text-indigo-400 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                You get an instant invite link (e.g. zedu.chat/join/your-course)
                and a pre-formatted welcome email to share via Canvas,
                Blackboard, or email. Students join in 1 click.
              </p>
            </details>

            <details className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 group cursor-pointer">
              <summary className="font-semibold text-white flex items-center justify-between list-none">
                <span>
                  Will student messages or lecture notes ever be deleted?
                </span>
                <span className="text-indigo-400 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Never. Unlike Slack, Zedu Chat provides unlimited, permanent
                message and whiteboard history so previous cohorts can always
                access their learning resources.
              </p>
            </details>
          </div>
        </section>
      </main>
    </div>
  );
}
