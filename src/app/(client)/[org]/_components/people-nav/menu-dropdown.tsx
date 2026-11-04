"use client";

import { EllipsisVertical } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { showError, showSuccess } from "~/components/toast/sonner";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { DeleteRequest } from "~/utils/new-request";

const DmMenuDropdown = () => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);
  const { state, dispatch } = useContext(DataContext);
  const latestState = useRef(state);
  latestState.current = state;
  const params = useParams();
  const router = useRouter();
  const channelId = params.id as string;

  const handleViewProfile = () => {
    dispatch({ type: ACTIONS.SHOW_PROFILE, payload: true });
  };

  // Placeholders until conversation preferences and a DM files view exist.
  const handleMuteNotifications = () => {
    console.log("Mute notifications clicked", channelId);
  };

  const handlePinConversation = () => {
    console.log("Pin conversation clicked", channelId);
  };

  const handleSearchConversation = () => {
    dispatch({ type: ACTIONS.CONVERSATION_SEARCH_OPEN, payload: true });
  };

  const handleViewFiles = () => {
    console.log("View files clicked", channelId);
  };

  const handleClearHistory = () => {
    dispatch({ type: ACTIONS.CLEAR_CHATS });
    dispatch({ type: ACTIONS.REPLY, payload: false });
    showSuccess("Conversation history cleared locally");
  };

  const handleDeleteConversation = async () => {
    if (deletingRef.current) return;

    const orgId = state.orgId || localStorage.getItem("orgId");
    if (!orgId || !channelId) {
      showError("Unable to identify this conversation. Please try again.");
      return;
    }

    deletingRef.current = true;
    setDeleting(true);

    try {
      const response = await DeleteRequest(
        `/organisations/${orgId}/dms/${channelId}`
      );

      if (response?.status !== 200 && response?.status !== 204) {
        showError("Could not delete the conversation. Please try again.");
        return;
      }

      // Read the latest list so messages arriving during the request are kept.
      dispatch({
        type: ACTIONS.DMS,
        payload: (latestState.current.dms || []).filter(
          (dm: { channel_id?: string; channels_id?: string }) =>
            String(dm.channel_id || dm.channels_id) !== String(channelId)
        ),
      });
      // Only clear/navigate if this is still the active DM after the request.
      const activePath = window.location.pathname.split("/");
      if (activePath[2] === "dm" && activePath[3] === channelId) {
        dispatch({ type: ACTIONS.CLEAR_CHATS });
        dispatch({ type: ACTIONS.REPLY, payload: false });
        dispatch({ type: ACTIONS.SHOW_PROFILE, payload: false });
        router.push(`/${params.org}/dm`);
      }
      showSuccess("Conversation deleted");
      setOpen(false);
    } catch {
      showError("Could not delete the conversation. Please try again.");
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  };

  const menuItemClass =
    "px-4 py-2 text-[15px] text-[#101828] cursor-pointer focus:bg-[#F1F1FE] focus:text-[#101828]";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label="More options"
          className={`p-2 border-[#E6EAEF] h-9 ${open ? "bg-[#F6F7F9]" : ""}`}
        >
          <EllipsisVertical className="w-5 h-5" color="#344054" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="w-[220px] p-0 bg-white rounded-[7px] shadow-lg border-[#E6EAEF]"
      >
        <DropdownMenuItem
          className={menuItemClass}
          onSelect={handleViewProfile}
        >
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className={menuItemClass}
          onSelect={handleMuteNotifications}
        >
          Mute notifications
        </DropdownMenuItem>
        <DropdownMenuItem
          className={menuItemClass}
          onSelect={handlePinConversation}
        >
          Pin conversation
        </DropdownMenuItem>
        <DropdownMenuItem
          className={menuItemClass}
          onSelect={handleSearchConversation}
        >
          Search in conversation
        </DropdownMenuItem>
        <DropdownMenuItem className={menuItemClass} onSelect={handleViewFiles}>
          View files
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-0 bg-[#E6EAEF]" />
        <DropdownMenuItem
          className={menuItemClass}
          onSelect={handleClearHistory}
        >
          Clear history
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${menuItemClass} text-[#D93025] focus:text-[#D93025]`}
          disabled={deleting}
          onSelect={(event) => {
            event.preventDefault();
            void handleDeleteConversation();
          }}
        >
          {deleting ? "Deleting conversation…" : "Delete conversation"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DmMenuDropdown;
