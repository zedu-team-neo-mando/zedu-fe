"use client";

import ChannelDetailsDialog from "../channel-details-dialog";
import ChannelExportModal from "../channel-export/channel-export-modal";
import { useParams, useRouter } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  useContext,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import NotificationSettingsModal from "../notification-modal";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { PostRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import { useRBAC } from "~/hooks/useRBAC";
import { showError, showSuccess } from "~/components/toast/sonner";

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDropdown = ({ isOpen, onClose }: MenuDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useContext(DataContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { hasPermission } = useRBAC();
  const canManageChannels = hasPermission("manage:channels");

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const isInsideDialog = (event.target as Element).closest(
        '[role="dialog"]'
      );
      if (isInsideDialog) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const menuItemClass =
    "px-4 py-[10px] text-[15px] text-[#101828] hover:bg-[#F1F1FE] flex items-center justify-between cursor-pointer";
  const dividerClass = "h-px bg-[#E6EAEF]";

  const detailsMatch =
    String(state?.channelDetails?.channels_id || "") === String(id || "");
  const isStarred = detailsMatch && Boolean(state?.channelDetails?.is_starred);

  const handleToggleStar = async (e: ReactMouseEvent) => {
    e.stopPropagation();
    if (!id || !detailsMatch || buttonLoading) return;
    setButtonLoading(true);

    const nextStarred = !isStarred;
    try {
      const res = await PostRequest(`/channels/${id}/star`);
      if (res?.status === 200 || res?.status === 201) {
        const actualStatus = res.data?.data?.is_starred ?? nextStarred;
        dispatch({
          type: ACTIONS.UPDATE_CHANNEL_STAR,
          payload: { channelId: id, isStarred: actualStatus },
        });
        showSuccess(
          res.data?.message ||
            (actualStatus ? "Channel starred" : "Channel unstarred")
        );
      }
    } finally {
      setButtonLoading(false);
      onClose();
    }
  };

  const handleLeave = async () => {
    if (!id || buttonLoading) return;
    setButtonLoading(true);

    try {
      const res = await PostRequest(`/channels/${id}/leave`, {});
      if (res?.status === 200 || res?.status === 201) {
        dispatch({
          type: ACTIONS.LEAVE_CALLBACK,
          payload: !state?.leaveCallback,
        });
        showSuccess(res?.data?.message || "You left the channel");
        onClose();

        const orgSlug =
          state?.orgSlug || (typeof params?.org === "string" ? params.org : "");
        const channels = Array.isArray(state?.channels) ? state.channels : [];
        const fallbackChannel =
          channels.find((ch: any) => {
            const chId = ch?.channels_id ?? ch?.channel_id ?? ch?.id;
            return (
              chId &&
              String(chId) !== String(id) &&
              !ch?.archived &&
              String(ch?.name || "")
                .trim()
                .toLowerCase() === "general"
            );
          }) ??
          channels.find((ch: any) => {
            const chId = ch?.channels_id ?? ch?.channel_id ?? ch?.id;
            return chId && String(chId) !== String(id) && !ch?.archived;
          });
        const nextChannelId =
          fallbackChannel?.channels_id ??
          fallbackChannel?.channel_id ??
          fallbackChannel?.id;

        // The sidebar Home link reads channelId, so it must not keep pointing
        // at the channel that was just left.
        if (nextChannelId) {
          const nextChannelName = fallbackChannel?.name || "";
          localStorage.setItem("channelId", nextChannelId);
          localStorage.setItem("channelName", nextChannelName);
          dispatch({ type: ACTIONS.CHANNEL_NAME, payload: nextChannelName });
        } else {
          localStorage.removeItem("channelId");
          localStorage.removeItem("channelName");
        }

        if (orgSlug && nextChannelId) {
          router.push(`/${orgSlug}/home/channels/${nextChannelId}`);
        } else if (orgSlug) {
          router.push(`/${orgSlug}`);
        } else {
          router.push("/");
        }
      } else if (!res?.isAxiosError) {
        // PostRequest already shows a toast for request errors it catches.
        const errorMessage =
          res?.response?.data?.message ||
          res?.data?.message ||
          res?.message ||
          "Failed to leave channel";
        showError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to leave channel";
      showError(errorMessage);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleOpenExport = (event: ReactMouseEvent) => {
    event.stopPropagation();
    setExportOpen(true);
    onClose();
  };

  return (
    <>
      {isOpen ? (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 w-[220px] mt-2.5 bg-white rounded-[7px] shadow-lg border border-[#E6EAEF] z-20"
          onClick={() =>
            dispatch({ type: ACTIONS.ACTIVE_TAB, payload: "about" })
          }
        >
          <div>
            <ChannelDetailsDialog className={cn(menuItemClass, "w-full")}>
              Open channel details
            </ChannelDetailsDialog>

            <Button
              type="button"
              variant="ghost"
              disabled={!detailsMatch || buttonLoading}
              className={cn(
                menuItemClass,
                "w-full h-auto rounded-none font-normal"
              )}
              onClick={handleToggleStar}
            >
              {isStarred ? "Unstar channel" : "Star channel"}
            </Button>

            <NotificationSettingsModal />

            <div className={menuItemClass} onClick={handleOpenExport}>
              Export
            </div>

            <div
              className={menuItemClass}
              onClick={() => {
                dispatch({
                  type: ACTIONS.CONVERSATION_SEARCH_OPEN,
                  payload: true,
                });
                onClose();
              }}
            >
              Search
            </div>

            {canManageChannels ? (
              <div
                className={menuItemClass}
                onClick={() => {
                  onClose();
                  router.push(
                    `/${state?.orgSlug}/home/channels/${id}/settings`
                  );
                }}
              >
                Channel settings
              </div>
            ) : null}

            <div className={dividerClass} />

            <div
              className={`${menuItemClass} text-[#B00E03]`}
              onClick={handleLeave}
            >
              Leave channel{" "}
              {buttonLoading && (
                <Loading color="red" height="15px" width="15px" />
              )}
            </div>
          </div>
        </div>
      ) : null}

      <ChannelExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        channelId={id}
      />
    </>
  );
};

export default MenuDropdown;
