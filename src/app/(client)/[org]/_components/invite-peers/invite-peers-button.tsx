"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Copy, Share2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { showError, showSuccess } from "~/components/toast/sonner";
import Loading from "~/components/ui/loading";
import { DataContext } from "~/store/GlobalState";
import { PostRequest } from "~/utils/new-request";
import {
  cohortInviteMessage,
  shareTargets,
  trackCohortInvite,
  withCohortReferral,
} from "~/lib/cohort-invite";

type InvitePeersButtonProps = {
  channelId: string;
  cohortName: string;
};

type Profile = {
  full_name?: string;
  name?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

const shareButtonClass =
  "flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-bold text-neutral-900 transition-colors hover:border-primary-500 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

function inviterName(user: Profile | null | undefined): string {
  const joined = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  return (
    user?.full_name || user?.name || joined || user?.username || "A classmate"
  );
}

export function InvitePeersButton({
  channelId,
  cohortName,
}: InvitePeersButtonProps) {
  const { state } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const cache = useRef<{ key: string; link: string } | null>(null);

  const orgId =
    state.orgId ||
    (typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "");
  const roleId =
    state.orgRoles?.find((item: { name?: string }) => item?.name === "User")
      ?.id || "";
  const inviter = inviterName(state.user as Profile | null);
  const cohort = cohortName || state.orgData?.name || "this cohort";

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  const createLink = async () => {
    if (!orgId || !channelId) {
      showError("Open a cohort channel before inviting peers.");
      return;
    }
    const key = `${orgId}:${roleId}:${channelId}`;
    if (cache.current?.key === key) {
      setLink(cache.current.link);
      return;
    }
    if (!roleId) {
      showError("Could not prepare the invite. Try again in a moment.");
      return;
    }

    setLoading(true);
    const res = await PostRequest("/invite/general", {
      organisation_id: orgId,
      role_id: roleId,
    });
    const invitationLink = res?.data?.data?.invitation_link as
      | string
      | undefined;
    setLoading(false);

    if ((res?.status === 200 || res?.status === 201) && invitationLink) {
      const shared = withCohortReferral(invitationLink, {
        channelId,
        inviter,
        cohort,
      });
      cache.current = { key, link: shared };
      setLink(shared);
      trackCohortInvite("invite_generated", {
        ref: "cohort_share",
        channel_id: channelId,
      });
      return;
    }

    if (!res?.response && res?.status) {
      showError("Failed to generate invite link");
    }
  };

  const openDialog = () => {
    setOpen(true);
    void createLink();
  };

  const message = link ? cohortInviteMessage(link, inviter, cohort) : "";
  const targets = link ? shareTargets(message, link) : null;

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      showSuccess("Invite link copied");
    } catch {
      showError("Could not copy the link. Please copy it manually.");
    }
  };

  const nativeShare = async () => {
    if (!link) return;
    try {
      await navigator.share({ title: `Join ${cohort} on Zedu`, text: message });
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;
      await copyLink();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label="Invite peers"
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E6EAEF] px-2.5 text-sm font-semibold text-[#344054] hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <UserPlus className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Invite Peers</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-w-[520px] flex-col gap-5 rounded-[20px] p-6 sm:p-8">
          <DialogHeader className="gap-1.5 text-left">
            <DialogTitle className="text-2xl font-black text-neutral-900">
              Invite peers
            </DialogTitle>
            <DialogDescription className="text-base text-neutral-600">
              Share {cohort} so classmates can join you on Zedu.
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex justify-center py-6">
              <Loading height="40" width="40" color="#7141F8" />
            </div>
          )}

          {!loading && link && targets && (
            <>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  aria-label="Invite link"
                  value={link}
                  onFocus={(event) => event.currentTarget.select()}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white hover:bg-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <Copy className="size-4" aria-hidden="true" />
                  Copy
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  href={targets.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareButtonClass}
                >
                  WhatsApp
                </a>
                <a
                  href={targets.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareButtonClass}
                >
                  Telegram
                </a>
                <a
                  href={targets.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareButtonClass}
                >
                  X
                </a>
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={nativeShare}
                    className={shareButtonClass}
                  >
                    <Share2 className="size-4" aria-hidden="true" />
                    Share
                  </button>
                )}
              </div>
              <p className="break-words rounded-xl bg-primary-50 p-4 text-sm leading-relaxed text-neutral-900">
                {message}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
