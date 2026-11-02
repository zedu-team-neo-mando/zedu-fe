"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Share2,
  QrCode,
  Sparkles,
  ExternalLink,
  Edit2,
  RefreshCw,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { showSuccess, showError } from "~/components/toast/sonner";
import {
  buildReferralUrl,
  buildSocialShareLinks,
  sanitizeReferralCode,
  STORAGE_KEYS,
} from "~/lib/referrals";
import { QRCodeDisplay } from "~/app/(homepage)/_components/QRCodeDisplay";

interface ReferralLinkCardProps {
  referralCode: string;
  onCodeChange: (newCode: string) => void;
}

export const ReferralLinkCard: React.FC<ReferralLinkCardProps> = ({
  referralCode,
  onCodeChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customHandle, setCustomHandle] = useState(referralCode);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCustomHandle(referralCode);
  }, [referralCode]);

  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      setCanNativeShare(true);
    }
  }, []);

  const currentOrigin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_CLIENT_URL || "";
  const referralUrl = buildReferralUrl(referralCode, currentOrigin);
  const shareLinks = buildSocialShareLinks(referralUrl);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(referralUrl);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = referralUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      showSuccess(
        "Referral link copied!",
        "Share it with your teammates and community to earn milestone rewards."
      );

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      showError(
        "Could not copy link to clipboard",
        "Please try copying manually."
      );
    }
  };

  const handleSaveCustomCode = () => {
    const cleaned = sanitizeReferralCode(customHandle);
    if (!cleaned) {
      showError("Invalid handle", "Please provide alphanumeric characters.");
      return;
    }
    onCodeChange(cleaned);
    setIsEditing(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER_CODE, cleaned);
    }
    showSuccess(
      "Referral handle updated!",
      `Your referral code is now "${cleaned}".`
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Zedu",
          text: "I'm using Zedu to organize cohort learning and real-time collaboration. Join with my invite link:",
          url: referralUrl,
        });
        showSuccess("Shared successfully!");
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          console.error(err);
        }
      }
    }
  };

  return (
    <div
      data-testid="referral-link-generator"
      className="rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white via-primary-50/20 to-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Info & Code Editor */}
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100/60 px-3 py-1 text-xs font-semibold text-primary-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Your Personal Viral Invite Link</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Invite friends & earn together
          </h2>
          <p className="text-sm text-neutral-600 max-w-xl">
            Every learner or educator who signs up with your link earns{" "}
            <strong className="text-neutral-900">100 reward points</strong> for
            both of you, unlocks exclusive workspace badges, and counts towards
            your milestone perks.
          </p>

          {/* Referral Code badge / edit toggle */}
          <div className="pt-1 flex items-center gap-2 text-xs text-neutral-600">
            <span>Referral Handle:</span>
            {!isEditing ? (
              <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200/60">
                {referralCode}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit your referral handle"
                  className="text-neutral-400 hover:text-primary-600 transition ml-1"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  value={customHandle}
                  onChange={(e) => setCustomHandle(e.target.value)}
                  placeholder="custom-handle"
                  className="h-8 w-40 text-xs font-mono"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveCustomCode();
                    if (e.key === "Escape") {
                      setCustomHandle(referralCode);
                      setIsEditing(false);
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleSaveCustomCode}
                  className="h-8 bg-primary-500 hover:bg-primary-600 text-xs px-2.5"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCustomHandle(referralCode);
                    setIsEditing(false);
                  }}
                  className="h-8 text-xs px-2"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowQR((prev) => !prev)}
            className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            aria-expanded={showQR}
            aria-label="Toggle QR code display"
          >
            <QrCode className="mr-1.5 h-4 w-4" />
            <span>{showQR ? "Hide QR" : "Show QR"}</span>
          </Button>

          {canNativeShare && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNativeShare}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              aria-label="Open native sharing menu"
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              <span>Share</span>
            </Button>
          )}
        </div>
      </div>

      {/* Copyable Link Input Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Input
            readOnly
            value={referralUrl}
            data-testid="referral-url-input"
            aria-label="Your unique referral link"
            className="h-12 w-full rounded-xl border border-neutral-300/80 bg-neutral-50/80 px-4 font-mono text-sm text-neutral-800 shadow-inner focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>
        <Button
          type="button"
          data-testid="copy-referral-btn"
          onClick={handleCopy}
          aria-label={
            copied ? "Referral link copied" : "Copy unique referral link"
          }
          className={`h-12 px-6 rounded-xl font-semibold transition-all shadow-sm ${
            copied
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/25"
          }`}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </Button>
      </div>

      {/* QR Code expansion */}
      {showQR && (
        <div
          data-testid="referral-qr-container"
          className="mt-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-primary-100 bg-white p-5 shadow-inner"
        >
          <div className="shrink-0 p-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <QRCodeDisplay url={referralUrl} size={130} />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-neutral-900">
              Scan with mobile camera
            </h3>
            <p className="text-xs text-neutral-600 max-w-sm">
              Point your smartphone camera at this code to open your invite link
              directly on any mobile device. Great for live presentations or
              cohort meetups!
            </p>
          </div>
        </div>
      )}

      {/* Quick Social Share Buttons */}
      <div className="mt-6 pt-6 border-t border-neutral-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Quick Social Share:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {/* X / Twitter */}
            <a
              href={shareLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share referral link on X (Twitter)"
              data-testid="share-x-btn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>

            {/* LinkedIn */}
            <a
              href={shareLinks.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share referral link on LinkedIn"
              data-testid="share-linkedin-btn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.54a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* Telegram */}
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share referral link on Telegram"
              data-testid="share-telegram-btn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:border-[#229ED9] hover:bg-[#229ED9] hover:text-white"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.38-.49 1.04-.75 4.09-1.78 6.82-2.96 8.2-3.53 3.91-1.63 4.72-1.91 5.25-1.92.12 0 .37.03.54.17.14.12.18.28.2.4.02.16.03.45.02.66z" />
              </svg>
              <span>Telegram</span>
            </a>

            {/* WhatsApp */}
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share referral link on WhatsApp"
              data-testid="share-whatsapp-btn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.23-.17-.48-.29z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href={shareLinks.email}
              aria-label="Share referral link via Email"
              data-testid="share-email-btn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:border-neutral-400 hover:bg-neutral-100"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
