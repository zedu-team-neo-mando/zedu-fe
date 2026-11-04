import { isValidEmail } from "~/lib/utils";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { X, AlertCircle, LinkIcon, MessageCircle, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { PostRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import { showError, showSuccess } from "~/components/toast/sonner";
import { useRBAC } from "~/hooks/useRBAC";

interface Invitee {
  id: string;
  email: string;
}

const InviteModal = () => {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useContext(DataContext);
  const { inviteModal, orgId } = state;
  const [buttonLoading, setButtonLoading] = useState(false);
  const [roleId, setRoleId] = useState("");
  const { hasPermission, status: rbacStatus } = useRBAC();
  const canInviteMembers = hasPermission("invite:members");

  const onClose = () => {
    dispatch({ type: ACTIONS.INVITE_MODAL, payload: false });
  };

  useEffect(() => {
    if (inviteModal && rbacStatus === "authorized" && !canInviteMembers) {
      showError("You don't have permission to invite members");
      dispatch({ type: ACTIONS.INVITE_MODAL, payload: false });
    }
  }, [inviteModal, rbacStatus, canInviteMembers, dispatch]);

  useEffect(() => {
    if (inviteModal && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inviteModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (error) setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();

      if (isValidEmail(inputValue.trim())) {
        addInvitee(inputValue.trim());
        setError(null);
      } else {
        setError("Please enter a valid email address");
      }
    }
  };

  const addInvitee = (email: string) => {
    const newInvitee: Invitee = {
      id: Date.now().toString(),
      email: email,
    };

    setInvitees([...invitees, newInvitee]);
    setInputValue("");
  };

  const removeInvitee = (id: string) => {
    setInvitees(invitees.filter((invitee) => invitee.id !== id));
    textareaRef.current?.focus();
  };

  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  // Default invite role from organisation roles loaded via `/organisations/{id}/roles`
  useEffect(() => {
    const roleuser = state.orgRoles?.find(
      (item: { name?: string }) => item?.name === "User"
    );
    if (roleuser?.id) {
      setRoleId(roleuser.id);
    }
  }, [state.orgRoles]);

  // submit emails
  const handleSubmit = async () => {
    if (inputValue.trim()) {
      if (isValidEmail(inputValue.trim())) {
        addInvitee(inputValue.trim());
        setError(null);
        setInputValue("");
        return; // Wait for user to click again after saving input
      } else {
        setError("Please enter a valid email address");
        return;
      }
    }

    if (invitees.length === 0) {
      setError("Please enter at least one valid email address");
      return;
    }

    setButtonLoading(true);

    const payload = {
      org_id: orgId,
      emails: invitees.map((item) => item.email),
      role_id: roleId,
    };

    const res = await PostRequest("/invite", payload);
    if (res?.status === 200 || res?.status === 201) {
      showSuccess(res?.data?.message);
      onClose();
    }

    setButtonLoading(false);
  };

  // One invite link per modal session, shared by Copy, WhatsApp and Share, so
  // each click doesn't create another invite. Cleared on close or org change.
  const inviteLinkRef = useRef<{ key: string; link: string } | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!inviteModal) inviteLinkRef.current = null;
  }, [inviteModal, orgId]);

  const getInviteLink = async (): Promise<string | null> => {
    if (!orgId) return null;
    const key = `${orgId}:${roleId}`;
    if (inviteLinkRef.current?.key === key) return inviteLinkRef.current.link;

    try {
      const res = await PostRequest("/invite/general", {
        organisation_id: orgId,
        role_id: roleId,
      });
      const link = res?.data?.data?.invitation_link;
      if ((res?.status === 200 || res?.status === 201) && link) {
        inviteLinkRef.current = { key, link };
        return link;
      }
    } catch (error) {
      console.error(error);
    }
    showError("Failed to generate invite link");
    return null;
  };

  const inviteMessage = (link: string) =>
    `You're invited to join ${state?.orgData?.name || "our workspace"} on Zedu, where we share updates, resources and discussions. Join here: ${link}`;

  const trackShare = (method: "copy" | "whatsapp" | "native") => {
    const { gtag } = window as {
      gtag?: (...args: unknown[]) => void;
    };
    gtag?.("event", "share", { method, content_type: "workspace_invite" });
  };

  const handleCopyInviteLink = async () => {
    const link = await getInviteLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      showSuccess("Invite link copied to clipboard");
      trackShare("copy");
    } catch (error) {
      console.error(error);
      showError("An error occurred while copying the invite link");
    }
  };

  const handleShareWhatsApp = async () => {
    // Open the tab inside the click so popup blockers allow it, then point it
    // at WhatsApp once the link is ready.
    const whatsappTab = window.open("", "_blank");
    if (whatsappTab) whatsappTab.opener = null;

    const link = await getInviteLink();
    if (!link) {
      whatsappTab?.close();
      return;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(inviteMessage(link))}`;
    if (whatsappTab) whatsappTab.location.href = url;
    else window.location.href = url;
    trackShare("whatsapp");
  };

  const handleNativeShare = async () => {
    const link = await getInviteLink();
    if (!link) return;

    try {
      await navigator.share({
        title: `Join ${state?.orgData?.name || "us"} on Zedu`,
        text: inviteMessage(link),
      });
      trackShare("native");
    } catch (error) {
      // Closing the share sheet is not an error
      if ((error as Error)?.name === "AbortError") return;
      await handleCopyInviteLink();
    }
  };

  return (
    <Dialog open={inviteModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Invite people to {state?.orgData?.name}
          </DialogTitle>
          <button onClick={onClose}>
            <X size={20} className="text-[#667085] -mt-1.5" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="mt-2 relative">
          <label
            htmlFor="invite-input"
            className="text-sm font-semibold text-[#344054] mb-1.5 block"
          >
            Send to
          </label>

          <div
            ref={containerRef}
            className={`flex flex-wrap gap-2 items-center min-h-[40px] border rounded-xl px-3 py-5 cursor-text focus-within:ring-4 focus-within:ring-[#8686F9]/30 ${
              error ? "border-red-500" : "border-[#7141F8]"
            }`}
            onClick={handleContainerClick}
          >
            {invitees.map((invitee) => (
              <div
                key={invitee.id}
                className="flex items-center gap-1 bg-[#F1F1FE] rounded-[3px] px-1 py-[2px]"
              >
                <span className="text-xs font-semibold text-[#101828]">
                  {invitee.email}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeInvitee(invitee.id);
                  }}
                  className="hover:bg-gray-200 rounded-full p-1"
                >
                  <X size={14} className="text-[#667085]" />
                </button>
              </div>
            ))}

            <textarea
              id="invite-input"
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                invitees.length === 0 ? "Enter names or email addresses" : ""
              }
              rows={1}
              className="flex-1 outline-none text-[15px] min-w-[200px] resize-none placeholder:text-[#98A2B3] self-center py-1"
              style={{ overflow: "hidden", lineHeight: "normal" }}
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex gap-6 justify-between items-center">
          <div className="w-full h-[0.5px] bg-[#D6DAE0]" />
          <div className="w-full h-[0.5px] bg-[#D6DAE0]" />
        </div>

        <div className="flex flex-wrap justify-between gap-3 mt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-9 border border-[#101828]/40"
              onClick={handleCopyInviteLink}
            >
              <LinkIcon size={16} />
              <span className="ml-2">Copy invite link</span>
            </Button>

            <Button
              variant="outline"
              className="h-9 border border-[#101828]/40"
              onClick={handleShareWhatsApp}
            >
              <MessageCircle size={16} className="text-[#25D366]" />
              <span className="ml-2">Share on WhatsApp</span>
            </Button>

            {canNativeShare && (
              <Button
                variant="outline"
                className="h-9 w-9 p-0 border border-[#101828]/40"
                onClick={handleNativeShare}
                aria-label="Share invite link"
              >
                <Share2 size={16} />
              </Button>
            )}
          </div>

          <Button
            className="bg-[#7141F8] h-9 text-white px-7 w-full sm:w-auto"
            disabled={invitees.length === 0 && inputValue.trim() === ""}
            onClick={handleSubmit}
          >
            Send {buttonLoading && <Loading />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
