"use client";

import React, {
  useContext,
  useEffect,
  useState,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { z } from "zod";
import { useDebounce } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  Globe,
  Link2,
  Lock,
  X,
} from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { searchUsers } from "~/lib/search/api";
import type { UserSearchResult } from "~/lib/search/types";
import { PostRequest } from "~/utils/new-request";
import { showError, showSuccess, showWarning } from "~/components/toast/sonner";
import { FileDetails } from "./FileInfo";

interface CreateShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileToShare: FileDetails | null;
}

type AccessType = "Restricted" | "public";
type RestrictionType = "view" | "edit";

type Recipient = {
  key: string;
  label: string;
  userId?: string;
  email?: string;
};

// One entry per recipient in the POST /files/:id/share response.
type ShareRecipientResult = {
  user_id: string;
  username?: string;
  success: boolean;
  error?: string;
};

const emailSchema = z.string().email();
const MAX_SUGGESTIONS = 5;
// The share endpoint rejects longer notes (validate:"max=500").
const MAX_NOTE_LENGTH = 500;
const INVALID_RECIPIENT_MESSAGE =
  "Enter a valid email address or choose a workspace member.";

const toMemberRecipient = (user: UserSearchResult): Recipient => ({
  key: `user:${user.id}`,
  label: user.name || user.username || user.email,
  userId: user.id,
  email: user.email,
});

const CreateShareModal: React.FC<CreateShareModalProps> = ({
  isOpen,
  onClose,
  fileToShare,
}) => {
  const { state } = useContext(DataContext);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedInput] = useDebounce(emailInput.trim(), 300);
  const [restrict, setRestrict] = useState<RestrictionType>("view");
  const [toggleRestrict, setToggleRestrict] = useState(false);
  const [message, setMessage] = useState("");
  const [accessType, setAccessType] = useState<AccessType>("Restricted");
  const [isCopied, setIsCopied] = useState(false);
  const [showSelectCanView, setShowSelectCanView] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const availableSuggestions = suggestions
    .filter((user) => !recipients.some((r) => r.key === `user:${user.id}`))
    .slice(0, MAX_SUGGESTIONS);

  useEffect(() => {
    const orgId = state?.orgId;
    if (!orgId || debouncedInput.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    searchUsers(orgId, debouncedInput)
      .then((results) => {
        if (!cancelled) setSuggestions(results);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedInput, state?.orgId]);

  const addRecipient = (recipient: Recipient) => {
    const email = recipient.email?.toLowerCase();
    const existing = recipients.findIndex(
      (r) =>
        r.key === recipient.key || (!!email && r.email?.toLowerCase() === email)
    );
    if (existing === -1) {
      setRecipients([...recipients, recipient]);
    } else if (recipient.userId && !recipients[existing].userId) {
      // The same address as a member replaces the email-only recipient.
      setRecipients(recipients.map((r, i) => (i === existing ? recipient : r)));
    }
    setEmailInput("");
    setSuggestions([]);
    setActiveIndex(-1);
    setRecipientError("");
  };

  const addTypedEmail = (): boolean => {
    const typed = emailInput.trim();
    if (!typed) return true;

    if (!emailSchema.safeParse(typed).success) {
      setRecipientError(INVALID_RECIPIENT_MESSAGE);
      return false;
    }

    const email = typed.toLowerCase();
    const member = suggestions.find((u) => u.email?.toLowerCase() === email);
    addRecipient(
      member
        ? toMemberRecipient(member)
        : { key: `email:${email}`, label: email, email }
    );
    return true;
  };

  const handleEmailKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    // Enter can confirm an IME candidate; it must not add a recipient then.
    if (e.nativeEvent.isComposing) return;

    if (e.key === "ArrowDown" && availableSuggestions.length > 0) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % availableSuggestions.length);
    } else if (e.key === "ArrowUp" && availableSuggestions.length > 0) {
      e.preventDefault();
      setActiveIndex(
        (i) =>
          (i - 1 + availableSuggestions.length) % availableSuggestions.length
      );
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const active = availableSuggestions[activeIndex];
      if (active) {
        addRecipient(toMemberRecipient(active));
      } else {
        addTypedEmail();
      }
    } else if (
      e.key === "Backspace" &&
      emailInput === "" &&
      recipients.length > 0
    ) {
      removeRecipient(recipients.length - 1);
    }
  };

  const removeRecipient = (indexToRemove: number) => {
    setRecipients(recipients.filter((_, index) => index !== indexToRemove));
  };

  const handleViewSelect = () => {
    setShowSelectCanView((state) => !state);
  };

  const handleRestrictionChange = (type: RestrictionType) => {
    setRestrict(type);
    setShowSelectCanView(false);
    setToggleRestrict(false);
  };

  const handleToggleRestrict = () => {
    setToggleRestrict((state) => !state);
  };

  const handleAccessChange = (type: AccessType) => {
    setAccessType(type);
    setShowSelectCanView(false);
  };

  const handleCopyLink = async () => {
    try {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setRecipients([]);
      setEmailInput("");
      setRecipientError("");
      setSuggestions([]);
      setMessage("");
      setAccessType("Restricted");
      setShowSelectCanView(false);
      onClose();
    }
  };

  // The API shares only with workspace members, by user id. Members picked
  // from the suggestions carry one; a typed address is matched to a member
  // by exact email.
  const resolveRecipients = async () => {
    const ids = new Map<string, string>();
    const outsiders: string[] = [];

    for (const recipient of recipients) {
      let userId = recipient.userId;
      const email = recipient.email?.toLowerCase();
      if (!userId && email && state?.orgId) {
        const matches = await searchUsers(state.orgId, email).catch(
          () => [] as UserSearchResult[]
        );
        userId = matches.find((u) => u.email?.toLowerCase() === email)?.id;
      }
      if (userId) {
        ids.set(userId, recipient.label);
      } else {
        outsiders.push(recipient.label);
      }
    }

    return { ids, outsiders };
  };

  const handleSend = async () => {
    // An address still in the input becomes a recipient first, or shows why
    // it can't.
    if (emailInput.trim()) {
      addTypedEmail();
      return;
    }
    if (!fileToShare || recipients.length === 0 || isSending) return;

    setIsSending(true);
    try {
      const { ids, outsiders } = await resolveRecipients();
      if (outsiders.length > 0) {
        setRecipientError(
          `${outsiders.join(", ")} ${
            outsiders.length === 1 ? "isn't" : "aren't"
          } in this workspace. Only workspace members can receive shared files.`
        );
        return;
      }

      const res = await PostRequest(`/files/${fileToShare.id}/share`, {
        file_id: fileToShare.id,
        access_type: accessType === "public" ? "public" : "private",
        permission_type: restrict,
        note: message.trim(),
        share_via_dm: true,
        recipient_ids: Array.from(ids.keys()),
      });
      // On failure PostRequest has already shown the API's error message.
      if (res?.status !== 200 && res?.status !== 201) return;

      const data = res.data?.data;
      const sent: number = data?.dms_sent?.length ?? 0;
      const failed = ((data?.recipients_info ?? []) as ShareRecipientResult[])
        .filter((result) => !result.success)
        .map(
          (result) =>
            `${ids.get(result.user_id) || result.username || "A recipient"}: ${
              result.error || "not sent"
            }`
        );

      if (sent === 0) {
        showError(`${fileToShare.file_name} wasn't sent`, failed.join("; "));
        return;
      }
      if (failed.length > 0) {
        showWarning(
          `Shared with ${sent} of ${sent + failed.length} people`,
          failed.join("; ")
        );
      } else {
        showSuccess(
          `Shared ${fileToShare.file_name}`,
          `Sent to ${sent} ${sent === 1 ? "person" : "people"} by direct message.`
        );
      }
      handleOpenChange(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="">
        <DialogHeader className="flex flex-row items-center -mx-6 px-6 justify-between border-b border-[#7141f8]">
          <DialogTitle className="font-semibold mb-6">
            Share {fileToShare ? fileToShare.file_name : "this file"}{" "}
          </DialogTitle>
        </DialogHeader>

        <div className="">
          {/* Add people with tags */}
          <div>
            <label
              htmlFor="share-emails"
              className="block text-sm font-medium mb-2"
            >
              Add people
            </label>
            <div className="flex flex-wrap relative justify-between items-start gap-2 p-2 border rounded-md focus-within:border-[#7141f8] focus-within:ring-2 focus-within:ring-[#7141f8]/20 transition-all">
              <div className="w-3/5 relative">
                {recipients.map((recipient, index) => (
                  <span
                    key={recipient.key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 mx-2 my-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                  >
                    {recipient.label}
                    <button
                      type="button"
                      onClick={() => removeRecipient(index)}
                      className="hover:text-gray-900 focus:outline-none"
                      aria-label={`Remove ${recipient.label}`}
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </span>
                ))}
                <input
                  id="share-emails"
                  type="text"
                  role="combobox"
                  aria-expanded={availableSuggestions.length > 0}
                  aria-controls="share-suggestions"
                  aria-invalid={!!recipientError}
                  aria-describedby={
                    recipientError ? "share-emails-error" : undefined
                  }
                  autoComplete="off"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setRecipientError("");
                    setActiveIndex(-1);
                    // Old results belong to the previous query.
                    setSuggestions([]);
                  }}
                  onKeyDown={handleEmailKeyDown}
                  onBlur={() => {
                    if (emailInput.trim()) addTypedEmail();
                  }}
                  placeholder={
                    recipients.length === 0 ? "Add people to send link to" : ""
                  }
                  className="flex-1 w-full outline-none bg-transparent text-[#344054] placeholder:text-[#344054] px-2 py-1"
                />
                {(availableSuggestions.length > 0 || isSearching) && (
                  <ul
                    id="share-suggestions"
                    role="listbox"
                    className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md border bg-white text-sm shadow-lg"
                  >
                    {isSearching && availableSuggestions.length === 0 && (
                      <li className="px-3 py-2 text-[#667085]">Searching...</li>
                    )}
                    {availableSuggestions.map((user, index) => (
                      <li
                        key={user.id}
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addRecipient(toMemberRecipient(user));
                        }}
                        className={`cursor-pointer px-3 py-2 ${
                          index === activeIndex ? "bg-[#F1F1FE]" : ""
                        } hover:bg-[#F1F1FE]`}
                      >
                        <p className="text-[#1D2939]">
                          {user.name || user.username}
                        </p>
                        <p className="text-xs text-[#667085]">{user.email}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="">
                <Button
                  onClick={handleToggleRestrict}
                  variant="outline"
                  className="flex items-center"
                >
                  <span className="text-[#344054]">
                    {restrict === "view" ? "Can view" : "Can Edit"}
                  </span>

                  {toggleRestrict ? (
                    <ChevronUp
                      className="text-[#667085]"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <ChevronDown
                      className="text-[#667085]"
                      width={16}
                      height={16}
                    />
                  )}
                </Button>
              </div>

              {toggleRestrict && (
                <ul className="text-[15px] shadow-lg font-normal right-2 top-16 w-[127px] overflow-hidden cursor-pointer absolute text-[#1D2939] bg-white rounded-[7px]">
                  <li
                    onClick={() => handleRestrictionChange("view")}
                    className={`${restrict === "view" && "bg-[#F1F1FE] text-[#5F5FE1]"} flex px-4 py-[10px] gap-2 items-center`}
                  >
                    {restrict === "view" ? (
                      <Check width={13} height={13} className="" />
                    ) : (
                      <Eye width={13} height={13} className="" />
                    )}
                    <p>Can View</p>
                  </li>
                  <li
                    onClick={() => handleRestrictionChange("edit")}
                    className={`${restrict === "edit" && "bg-[#F1F1FE] text-[#5F5FE1]"} flex px-4 py-[10px] gap-2 items-center`}
                  >
                    {restrict === "edit" ? (
                      <Check width={13} height={13} className="" />
                    ) : (
                      <Edit width={13} height={13} className="" />
                    )}
                    <p>Can Edit</p>
                  </li>
                </ul>
              )}
            </div>
            {recipientError && (
              <p
                id="share-emails-error"
                role="alert"
                className="mt-1 text-xs text-red-600"
              >
                {recipientError}
              </p>
            )}
          </div>
        </div>

        <div className="text-[#344054] text-[12px] ">
          <label htmlFor="share-note" className="block text-sm  mb-2">
            Message
          </label>
          <textarea
            name=""
            // className="w-full text-[#344054] placeholder:text-[#344054] min-h-[82px] rounded-[6px] px-4 py-2 focus:border-[#7141f8] border"
            className="w-full text-[#344054] placeholder:text-gray-400 min-h-[82px] rounded-[6px] px-4 py-2 border focus:border-[#7141f8] focus:ring-2 focus:ring-[#7141f8]/20 outline-none transition-all"
            id="share-note"
            maxLength={MAX_NOTE_LENGTH}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add additional notes"
          ></textarea>
        </div>

        <div className="text-[#667085] relative text-[12px] leading-[18px]">
          <h2>Access</h2>

          <div className="flex text-[15px] items-center gap-1">
            {accessType === "Restricted" ? (
              <Lock width={13} height={13} />
            ) : (
              <Globe width={13} height={13} className="" />
            )}
            <button
              onClick={handleViewSelect}
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="text-[#1D2939]">
                {accessType === "Restricted"
                  ? "Only those invited"
                  : "Anyone with link"}
              </span>
              <div className="">
                {showSelectCanView ? (
                  <ChevronUp className="text-center" width={16} height={16} />
                ) : (
                  <ChevronDown className="text-center" width={16} height={16} />
                )}
              </div>
            </button>
          </div>
          {showSelectCanView && (
            <ul className="text-[15px] shadow-lg overflow-hidden cursor-pointer absolute left-8 text-[#1D2939] bg-white rounded-[7px] w-fit">
              <li
                onClick={() => handleAccessChange("public")}
                className={`${accessType === "public" && "bg-[#F1F1FE] text-[#5F5FE1]"} flex px-4 py-[8px] gap-2 items-center`}
              >
                {accessType === "public" ? (
                  <Check width={13} height={13} className="" />
                ) : (
                  <Globe width={13} height={13} className="" />
                )}

                <p>Anyone with Link</p>
              </li>
              <li
                onClick={() => handleAccessChange("Restricted")}
                className={`${accessType === "Restricted" && "bg-[#F1F1FE] text-[#5F5FE1]"} flex px-4 py-[8px] gap-2 items-center`}
              >
                {accessType === "Restricted" ? (
                  <Check width={13} height={13} className="" />
                ) : (
                  <Lock width={13} height={13} className="" />
                )}
                <p>Only those invited</p>
              </li>
            </ul>
          )}
        </div>

        <DialogFooter className="pt-">
          <Button
            onClick={handleCopyLink}
            className="text-[#5F5FE1] flex gap-1 border mr-auto"
          >
            <Link2 strokeWidth={1.5} height={25} className="font-light" />
            <span className="p-0 text-[13px]">Copy link</span>
          </Button>
          <DialogClose asChild>
            <Button className="border px-4 py-[7px] text-[#344054] border-[neutral-300]">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSend}
            disabled={
              isSending || (recipients.length === 0 && !emailInput.trim())
            }
            className="bg-[#7141f8] text-white px-6 py-3 hover:bg-[#7141f8]/90"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>

        {isCopied && (
          <div className="absolute text-[16px] left-1/2 right-1/2 transform -translate-x-1/2 flex w-1/2 rounded-lg items-center px-4 py-2 justify-between text-white bottom-0 bg-[#1C1C1C]">
            <span className="">Link copied</span>
            <Check />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateShareModal;
