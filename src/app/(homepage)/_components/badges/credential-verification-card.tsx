"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Volume2,
  PenTool,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  Search,
  Lock,
  Download,
  Calendar,
  Layers,
} from "lucide-react";
import {
  type VerifiedCredential,
  buildLinkedInCertificationUrl,
} from "./badge-credential-data";

interface CredentialCardProps {
  credential?: VerifiedCredential;
  attemptedId?: string;
  configuredSiteUrl: string;
}

export default function CredentialVerificationCard({
  credential,
  attemptedId,
  configuredSiteUrl,
}: CredentialCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [lookupId, setLookupId] = useState("");

  const verificationUrl = credential
    ? `${configuredSiteUrl}/badges/verify/${credential.id}`
    : "";

  const handleCopy = () => {
    if (!verificationUrl) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(verificationUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadJson = () => {
    if (!credential) return;
    const blob = new Blob([JSON.stringify(credential, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${credential.id}-zedu-credential.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If no credential found (invalid ID)
  if (!credential) {
    return (
      <div className="min-h-screen bg-[#070B14] text-slate-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="size-16 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Credential Verification Failed
            </h1>
            <p className="text-sm text-slate-400">
              The credential ID{" "}
              <code className="text-red-300 font-mono bg-slate-900 px-2 py-0.5 rounded">
                {attemptedId || "UNKNOWN"}
              </code>{" "}
              could not be verified on the Zedu Trust Registry. This badge may
              be forged, expired, or mistyped.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0C1322] border border-slate-800 space-y-4">
            <label className="block text-xs font-semibold text-slate-300 text-left">
              Verify Another Credential ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="e.g. ZEDU-VERIFY-2026-98412"
                className="flex-1 px-3.5 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <Link
                href={`/badges/verify/${lookupId.trim().toUpperCase()}`}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Search className="size-3.5" />
                <span>Verify</span>
              </Link>
            </div>
            <p className="text-[11px] text-slate-500 text-left">
              Sample valid credential:{" "}
              <Link
                href="/badges/verify/ZEDU-VERIFY-2026-98412"
                className="text-cyan-400 hover:underline font-mono"
              >
                ZEDU-VERIFY-2026-98412
              </Link>
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/badges/verify"
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Back to Badge Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const linkedInUrl = buildLinkedInCertificationUrl({
    name: `${credential.title} - Zedu Chat`,
    organizationName: "Zedu Chat",
    issueYear: credential.issueYear,
    issueMonth: credential.issueMonth,
    certUrl: verificationUrl,
    certId: credential.id,
  });

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verification Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Authentic Credential
                </span>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white">
                Official Zedu Proof-of-Contribution Verification
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Share Verification</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadJson}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
              title="Download JSON Credential"
            >
              <Download className="size-4" />
            </button>
          </div>
        </div>

        {/* Certificate Hero Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0C1322] via-[#0E1A30] to-[#0A1120] border border-cyan-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-6">
            {/* Top Seal & ID */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold">
                  <Award className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-amber-300 tracking-wider uppercase">
                    {credential.organizationName}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Cohort: {credential.cohortName}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 font-mono block">
                  VERIFICATION ID
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  {credential.id}
                </span>
              </div>
            </div>

            {/* Recipient Headline */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                This academic micro-credential is proud to recognize
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                {credential.recipientName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
                <span>@{credential.recipientHandle}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Calendar className="size-3.5" /> Issued {credential.issuedAt}
                </span>
              </div>
            </div>

            {/* Badge Title & Description */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-base sm:text-lg">
                <Sparkles className="size-4 text-amber-400" />
                <span>{credential.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {credential.description}
              </p>
            </div>

            {/* Verified Engagement Breakdown Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 text-center space-y-1">
                <MessageSquare className="size-4 text-cyan-400 mx-auto" />
                <span className="block text-xl font-black text-white font-mono">
                  {credential.metrics.solutionsProvided}
                </span>
                <span className="block text-[11px] text-slate-400">
                  Solutions Solved
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 text-center space-y-1">
                <ThumbsUp className="size-4 text-teal-400 mx-auto" />
                <span className="block text-xl font-black text-white font-mono">
                  {credential.metrics.helpfulUpvotes}
                </span>
                <span className="block text-[11px] text-slate-400">
                  Helpful Upvotes
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 text-center space-y-1">
                <Volume2 className="size-4 text-indigo-400 mx-auto" />
                <span className="block text-xl font-black text-white font-mono">
                  {credential.metrics.buzzStudyHours}h
                </span>
                <span className="block text-[11px] text-slate-400">
                  Buzz Voice Hours
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 text-center space-y-1">
                <PenTool className="size-4 text-amber-400 mx-auto" />
                <span className="block text-xl font-black text-white font-mono">
                  {credential.metrics.whiteboardTutorials}
                </span>
                <span className="block text-[11px] text-slate-400">
                  Whiteboards Shared
                </span>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-400 mb-2">
                Demonstrated Technical Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {credential.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Cryptographic Hash & Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono block">
                  CRYPTOGRAPHIC CHECKSUM
                </span>
                <span className="text-[11px] font-mono text-slate-400 truncate block max-w-xs">
                  {credential.cryptographicHash}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Add to LinkedIn</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Peer Endorsements Panel */}
        {credential.endorsements.length > 0 && (
          <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="size-4 text-cyan-400" />
              <span>
                Verified Peer Endorsements ({credential.endorsements.length})
              </span>
            </h3>
            <div className="space-y-3">
              {credential.endorsements.map((end) => (
                <div
                  key={end.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                >
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    &ldquo;{end.comment}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {end.authorName} •{" "}
                      <span className="font-normal text-slate-500">
                        {end.authorRole}
                      </span>
                    </span>
                    <span>{end.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viral Referral Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-900/80 text-cyan-300 border border-cyan-700">
              <Sparkles className="size-3" />
              <span>Power Your Own Cohort</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Start your own learning community or study circle on Zedu
            </h4>
            <p className="text-xs text-slate-300">
              Set up a free academic workspace in 10 seconds. Award verifiable
              micro-credentials to your top students and mentors automatically.
            </p>
          </div>
          <Link
            href="/auth/sign-up?ref=badge_verification"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <span>Launch Free Cohort</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
