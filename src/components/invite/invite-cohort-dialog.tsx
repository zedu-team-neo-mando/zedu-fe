"use client";

import { useMemo } from "react";
import { Copy, Mail } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { showError, showSuccess } from "~/components/toast/sonner";

type InviteCohortDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Full invite link, e.g. https://zedu.chat/invite/<code>?utm_source=invite */
  inviteUrl: string;
};

const shareButtonClass =
  "flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-sm font-bold text-neutral-900 transition-colors hover:border-primary-500 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

export function InviteCohortDialog({
  open,
  onOpenChange,
  inviteUrl,
}: InviteCohortDialogProps) {
  const message = useMemo(
    () =>
      `Join me on Zedu, where our class learns and chats in one place: ${inviteUrl}`,
    [inviteUrl]
  );

  const shareLinks = useMemo(
    () => ({
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        inviteUrl
      )}&text=${encodeURIComponent(
        "Join me on Zedu, where our class learns and chats in one place."
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        inviteUrl
      )}`,
      email: `mailto:?subject=${encodeURIComponent(
        "Join me on Zedu"
      )}&body=${encodeURIComponent(message)}`,
    }),
    [inviteUrl, message]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      showSuccess("Link copied");
    } catch {
      showError("Could not copy the link. Please copy it manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-[520px] flex-col gap-6 rounded-[20px] p-6 sm:p-8">
        <DialogHeader className="gap-1.5 text-left">
          <DialogTitle className="text-2xl font-black text-neutral-900 sm:text-[28px]">
            Invite your cohort
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600">
            Share your link so classmates and colleagues can join you on Zedu.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="invite-link"
            className="text-sm font-bold text-neutral-900"
          >
            Your invite link
          </label>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              id="invite-link"
              readOnly
              value={inviteUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="h-12 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-base text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition-colors hover:bg-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Copy className="size-[18px]" aria-hidden="true" />
              Copy link
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-neutral-900">
            Or share directly
          </span>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={shareButtonClass}
            >
              WhatsApp
            </a>
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={shareButtonClass}
            >
              Telegram
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={shareButtonClass}
            >
              LinkedIn
            </a>
            <a href={shareLinks.email} className={shareButtonClass}>
              <Mail className="size-[18px]" aria-hidden="true" />
              Email
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-neutral-900">
            Message preview
          </span>
          <p className="break-words rounded-xl bg-primary-50 p-4 text-[15px] leading-relaxed text-neutral-900">
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
