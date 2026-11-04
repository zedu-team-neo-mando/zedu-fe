"use client";
import { NotificationBanner } from "~/app/(client)/[org]/_components/notification-banner";

import { HeadphonesIcon, Search } from "lucide-react";
import { useContext, useRef, useState } from "react";

import { ACTIONS } from "~/store/Actions";
import { Button } from "~/components/ui/button";
import { DataContext } from "~/store/GlobalState";
import UserAvatar from "~/components/layout/user-avatar";
import { isUserDeactivated } from "~/utils/user-deactivation";
import MenuDropdown from "../channel-nav/menu-dropdown";
import Tooltips from "../tooltip";
import { cn } from "~/lib/utils";
import Loading from "~/components/ui/loading";
import { PostRequest } from "~/utils/new-request";
import { showError } from "~/components/toast/sonner";
import { useParams } from "next/navigation";
import StartBuzzConfirmModal from "../buzz-management/start-buzz-confirm-modal";

const PeopleHeader = ({ user }: { user: any }) => {
  const { state, dispatch } = useContext(DataContext);
  const [startLoading, setStartLoading] = useState(false);
  const [startBuzzConfirmOpen, setStartBuzzConfirmOpen] = useState(false);

  const params = useParams();
  const id = params.id as string;

  const handleOpen = () => {
    setTimeout(() => {
      dispatch({ type: ACTIONS.SHOW_PROFILE, payload: true });
    }, 500);
  };

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

  if (!user) return null;

  const navigation = (
    <nav className="flex items-center justify-between p-5 border-b border-[#E6EAEF]">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={handleOpen}
      >
        <div className="relative size-9">
          <UserAvatar
            item={user}
            size="sm"
            alt="dm"
            imageClassName="rounded-[6px]"
            className="rounded-[6px]"
          />
          {!isUserDeactivated(user) && (
            <div
              className={`absolute -bottom-0.5 -right-1 w-2 h-2 rounded-full border border-white ${
                user?.online ? "bg-[#00AD51]" : "bg-[#F97316]"
              }`}
            />
          )}
        </div>

        <h2
          tabIndex={-1}
          className="text-[#1D2939] text-base lg:text-lg font-bold"
        >
          {user?.username}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            dispatch({ type: ACTIONS.CONVERSATION_SEARCH_OPEN, payload: true })
          }
          className={cn(
            "inline-flex items-center justify-center gap-2 px-3 h-9 rounded-md font-medium relative border"
          )}
          aria-label="Search messages"
        >
          <Search size={16} />
        </button>

        {!isUserDeactivated(user) && (
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
        )}
      </div>

      <StartBuzzConfirmModal
        open={startBuzzConfirmOpen}
        onOpenChange={setStartBuzzConfirmOpen}
        onConfirm={handleCall}
        loading={startLoading}
        variant="direct_chat"
        displayName={user?.username || "this chat"}
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

export default PeopleHeader;
