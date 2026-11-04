import { isValidEmail } from "~/lib/utils";
import React, { useState, useRef, useEffect, useContext } from "react";
import { X, AlertCircle } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { Label } from "~/components/ui/label";

interface Invitee {
  id: string;
  email: string;
}

const InviteMany = ({
  emails,
  setEmails,
}: {
  emails: string[];

  setEmails: (emails: string[]) => void;
}) => {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { state } = useContext(DataContext);
  const { inviteModal, orgId, orgRoles } = state;

  const [buttonLoading, setButtonLoading] = useState(false);

  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    const initialInvitees = emails.map((email, index) => ({
      id: `initial-${index}`,
      email: email,
    }));
    setInvitees(initialInvitees);
  }, []);

  useEffect(() => {
    const emailList = invitees.map((invitee) => invitee.email);
    if (JSON.stringify(emailList) !== JSON.stringify(emails)) {
      setEmails(emailList);
    }
  }, [invitees]);

  useEffect(() => {
    if (inviteModal && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inviteModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (error) setError(null);
  };

  // Handle pasting multiple emails
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    // Split by comma, semicolon, whitespace, or newline
    const rawEmails = pastedText
      .split(/[\s,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (rawEmails.length > 1) {
      e.preventDefault();
      let added = false;
      let duplicate = false;
      let invalid = false;
      const currentEmails = invitees.map((invitee) => invitee.email);
      rawEmails.forEach((email) => {
        if (!isValidEmail(email)) {
          invalid = true;
          return;
        }
        if (currentEmails.includes(email)) {
          duplicate = true;
          return;
        }
        addInvitee(email);
        added = true;
      });
      if (invalid) {
        setError("One or more emails are invalid");
      } else if (duplicate) {
        setError("Some emails were already added");
      } else {
        setError(null);
      }
      setInputValue("");
    }
    // If only one, let normal input flow handle it
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();

      const email = inputValue.trim();

      if (isValidEmail(email)) {
        // Check for duplicates
        const isDuplicate = invitees.some((invitee) => invitee.email === email);
        if (isDuplicate) {
          setError("Email already added");
        } else {
          addInvitee(email);
          setError(null);
        }
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

    setInvitees((prev) => [...prev, newInvitee]);
    setInputValue("");
  };

  const removeInvitee = (id: string) => {
    setInvitees((prev) => prev.filter((invitee) => invitee.id !== id));
    textareaRef.current?.focus();
  };

  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  useEffect(() => {
    const roleuser = orgRoles?.find(
      (item: { name?: string }) => item?.name === "User"
    );
    if (roleuser?.id) {
      setRoleId(roleuser.id);
    }
  }, [orgRoles]);

  return (
    <div className="bg-white rounded-lg w-full  max-w-full">
      <div className="mt-2 relative px-6">
        <Label
          htmlFor="invite-input"
          className="text-sm font-medium text-gray-700"
        >
          Email Addresses
        </Label>

        <div
          ref={containerRef}
          className={`flex mt-[8px] flex-wrap content-start gap-2 items-start min-h-[25dvh] border rounded-xl px-3 py-2 cursor-text w-full ${
            error ? "border-red-500" : "border-[#E6EAEF]"
          }`}
          onClick={handleContainerClick}
        >
          {invitees.map((invitee, index: number) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-[#F1F1FE] rounded-[3px] px-1 py-[2px]"
            >
              <span className="text-xs font-semibold text-[#101828] break-all">
                {invitee.email}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeInvitee(invitee.id);
                }}
                className="hover:bg-gray-200 rounded-full p-1 flex-shrink-0"
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
            onPaste={handlePaste}
            placeholder={
              invitees.length === 0
                ? "Input the address and press enter to complete"
                : ""
            }
            rows={1}
            className="flex-1 outline-none text-sm min-w-[100px] w-full resize-none placeholder:text-[#98A2B3] pt-1"
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
    </div>
  );
};

export default InviteMany;
