"use client";
import { NotificationBanner } from "~/app/(client)/[org]/_components/notification-banner";
import { EllipsisVertical, HeadphonesIcon } from "lucide-react";
import React, { useState, useRef, useContext } from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import MenuDropdown from "./menu-dropdown";
import { ViewMembersModal } from "./view-members-modal";
import Loading from "~/components/ui/loading";
import { useParams } from "next/navigation";
import { PostRequest } from "~/utils/new-request";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { showError } from "~/components/toast/sonner";
import { cn } from "~/lib/utils";
import {
  DEACTIVATED_AVATAR_SRC,
  isUserDeactivated,
} from "~/utils/user-deactivation";
import StartBuzzConfirmModal from "../buzz-management/start-buzz-confirm-modal";

const ChatHeader = ({ participants }: any) => {
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [viewMembersOpen, setViewMembersOpen] = useState(false);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const [startLoading, setStartLoading] = useState(false);
  const [startBuzzConfirmOpen, setStartBuzzConfirmOpen] = useState(false);

  const params = useParams();
  const id = params.id as string;

  const participantLabel = (() => {
    if (!participants?.length) return "";
    const maxVisible = 4;
    if (participants.length <= maxVisible) {
      return participants.map((user: any) => user.username).join(", ");
    }
    const visibleNames = participants
      .slice(0, maxVisible)
      .map((user: any) => user.username)
      .join(", ");
    return `${visibleNames} +${participants.length - maxVisible} more`;
  })();

  const handleCall = async () => {
    setStartLoading(true);
    try {
      const createRes = await PostRequest("/buzz/direct-call", {
        channel_id: id,
      });
      const buzzId = createRes.data.data.buzz_code;

      const joinRes = await PostRequest(`/buzz/${buzzId}/join`);
      if (joinRes.status === 200 || joinRes.status === 201) {
        const localUserAsParticipant = {
          user_id: user?.user_id,
          username: user?.username || "You",
          avatar_url: user?.avatar_url,
          audioTrack: null,
          videoTrack: null,
          handsRaised: false,
          isPinned: false,
        };

        const result = joinRes.data.data.participants?.map(
          (participant: any) => {
            if (participant?.user_id === user?.user_id) {
              return {
                ...participant,
                localUserAsParticipant,
              };
            }

            return participant;
          }
        );
        dispatch({
          type: ACTIONS.BUZZ_PARTICIPANTS,
          payload: result,
        });

        dispatch({ type: ACTIONS.BUZZ_DATA, payload: joinRes.data.data });
        dispatch({ type: ACTIONS.HAS_JOINED, payload: true });
        dispatch({ type: ACTIONS.BUZZ_SIDEBAR, payload: true });

        setStartBuzzConfirmOpen(false);
        setStartLoading(false);
      }
    } catch (error) {
      showError("Failed to create meeting. Please try again.");
      setStartLoading(false);
    }
  };

  const buzzVariant =
    (participants?.length ?? 0) > 2 ? "group_chat" : "direct_chat";
  const buzzDisplayName =
    buzzVariant === "group_chat"
      ? participantLabel || "Group chat"
      : participants?.[0]?.username || participantLabel || "this chat";

  //

  const navigation = (
    <nav className="flex items-center justify-between flex-wrap gap-3 p-5 border-b border-[#E6EAEF]">
      <h2
        tabIndex={-1}
        className="text-[#1D2939] text-base lg:text-lg font-bold"
      >
        {participantLabel}
      </h2>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStartBuzzConfirmOpen(true)}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-4 h-9 rounded-md font-medium relative border"
          )}
        >
          {startLoading ? (
            <Loading color="black" />
          ) : (
            <HeadphonesIcon size={16} />
          )}
        </button>

        {/* avatar badge group */}
        <button
          type="button"
          onClick={() => setViewMembersOpen(true)}
          className="flex rounded-[5px] border border-[#E6EAEF] p-2 h-9 cursor-pointer hover:bg-[#F6F7F9]"
          aria-label="View members"
        >
          <div className="flex items-center gap-1.5">
            {participants?.map((member: any) => (
              <Avatar
                key={member.user_id}
                className="rounded-[5px] w-5 h-5 -ml-2.5 first:ml-0 border border-[#E6EAEF]"
              >
                <AvatarImage
                  src={
                    isUserDeactivated(member)
                      ? DEACTIVATED_AVATAR_SRC
                      : member.avatar_url ||
                        member.default_avatar_url ||
                        DEACTIVATED_AVATAR_SRC
                  }
                  alt="avatar"
                />
              </Avatar>
            ))}

            {participants?.length > 3 && (
              <span className="text-[13px] font-semibold text-[#344054]">
                +{participants?.length - 3}
              </span>
            )}
          </div>
        </button>

        <div className="relative" ref={menuDropdownRef}>
          <Button
            variant="outline"
            className={`p-2 border-[#E6EAEF] h-9 ${
              isMenuDropdownOpen ? "bg-[#F6F7F9]" : ""
            }`}
            onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
          >
            <EllipsisVertical className="w-5 h-5" color="#344054" />
          </Button>
          <MenuDropdown
            isOpen={isMenuDropdownOpen}
            onClose={() => setIsMenuDropdownOpen(false)}
            participants={participants}
          />
        </div>
      </div>

      <ViewMembersModal
        isOpen={viewMembersOpen}
        onClose={() => setViewMembersOpen(false)}
        channelId={id}
        participants={participants}
      />

      <StartBuzzConfirmModal
        open={startBuzzConfirmOpen}
        onOpenChange={setStartBuzzConfirmOpen}
        onConfirm={handleCall}
        loading={startLoading}
        variant={buzzVariant}
        displayName={buzzDisplayName}
        memberCount={participants?.length}
      />
    </nav>
  );

  return (
    <header className="shrink-0">
      {navigation}
      <NotificationBanner />
    </header>
  );
};

export default ChatHeader;
