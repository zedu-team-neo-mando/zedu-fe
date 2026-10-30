import { isValidEmail } from "~/lib/utils";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { X, AlertCircle, LinkIcon, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { uiAvatarUrl } from "~/lib/env-urls";

interface Invitee {
  id: string;
  email: string;
}

const mockUsers = [
  {
    id: "1",
    name: "Jennifer Garner",
    email: "jennifer@example.com",
    avatar: uiAvatarUrl("Jennifer Garner"),
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@example.com",
    avatar: uiAvatarUrl("John Smith"),
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: uiAvatarUrl("Sarah Johnson"),
  },
];

const InviteModal = () => {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<typeof mockUsers>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useContext(DataContext);
  const { inviteModal } = state;

  const onClose = () => {
    dispatch({ type: ACTIONS.INVITE_MODAL, payload: false });
  };

  useEffect(() => {
    if (inviteModal && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inviteModal]);

  //

  useEffect(() => {
    // Filter users based on input value
    if (inputValue.trim()) {
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.email.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowPopover(true);
    } else {
      setShowPopover(false);
    }
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !containerRef.current?.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (error) setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      // If there's a selected user in the popover, add them
      if (filteredUsers.length > 0) {
        addInvitee(filteredUsers[0].email);
        setShowPopover(false);
        return;
      }

      // Basic email validation
      if (isValidEmail(inputValue.trim())) {
        addInvitee(inputValue.trim());
        setError(null);
        setShowPopover(false);
      } else {
        setError("Please enter a valid email address");
      }
    } else if (e.key === "Escape") {
      setShowPopover(false);
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
            className={`flex flex-wrap gap-2 items-center min-h-[40px] border rounded-xl px-3 py-2 cursor-text focus-within:ring-4 focus-within:ring-[#8686F9]/30 ${
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
              rows={3}
              className="flex-1 outline-none text-[15px] min-w-[200px] resize-none placeholder:text-[#98A2B3] self-center py-1"
              style={{ overflow: "hidden", lineHeight: "normal" }}
            />
          </div>
          {error && (
            <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}

          {/* Popover - search results */}
          {showPopover && !error && (
            <div
              ref={popoverRef}
              className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-[#E6EAEF] max-h-[200px] overflow-y-auto"
            >
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 hover:bg-[#F1F1FE] cursor-pointer"
                    onClick={() => {
                      addInvitee(user.email);
                      setShowPopover(false);
                    }}
                  >
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-[#667085]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : isValidEmail(inputValue) ? (
                <div
                  className="flex items-center gap-2 p-2 hover:bg-[#F1F1FE] cursor-pointer"
                  onClick={() => {
                    addInvitee(inputValue);
                    setShowPopover(false);
                  }}
                >
                  <UserPlus size={18} className="text-[#7141F8]" />
                  <span className="text-sm">
                    Invite <strong>{inputValue}</strong>
                  </span>
                </div>
              ) : (
                <div className="p-2 text-sm text-[#667085]">
                  No matches found - try using their email address instead
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-6 justify-between items-center">
          <div className="w-full h-[0.5px] bg-[#D6DAE0]" />
          {/* <span className="text-[#344054] font-semibold">OR</span> */}
          <div className="w-full h-[0.5px] bg-[#D6DAE0]" />
        </div>

        <div className="flex justify-between gap-3 mt-6">
          <Button
            variant="outline"
            className="h-9 border border-[#101828]/40"
            onClick={onClose}
          >
            <LinkIcon size={16} />
            <span className="ml-2">Copy invite link</span>
          </Button>

          <Button
            className="bg-[#7141F8] h-9 text-white px-7"
            disabled={invitees.length === 0}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
