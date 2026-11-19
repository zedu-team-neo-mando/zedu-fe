"use client";

import { useState, type ReactNode } from "react";

import { cn } from "~/lib/utils";
import { InviteCohortDialog } from "./invite-cohort-dialog";

type InviteCohortTriggerProps = {
  /** The user's invite code. The link becomes <site>/invite/<code>. */
  inviteCode: string;
  /** Button content. Defaults to "Invite". */
  children?: ReactNode;
  /** Style the button to fit wherever it is placed. */
  className?: string;
};

const SITE_URL = (
  process.env.NEXT_PUBLIC_CLIENT_URL ?? "https://zedu.chat"
).replace(/\/$/, "");

/**
 * Drop-in "Invite" button that opens the invite panel.
 * Usage: <InviteCohortTrigger inviteCode={code} className="..." />
 * Place it in the sidebar, profile menu or settings, wherever the team decides.
 */
export function InviteCohortTrigger({
  inviteCode,
  children = "Invite",
  className,
}: InviteCohortTriggerProps) {
  const [open, setOpen] = useState(false);

  const inviteUrl = `${SITE_URL}/invite/${encodeURIComponent(
    inviteCode
  )}?utm_source=invite`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          className
        )}
      >
        {children}
      </button>
      <InviteCohortDialog
        open={open}
        onOpenChange={setOpen}
        inviteUrl={inviteUrl}
      />
    </>
  );
}
