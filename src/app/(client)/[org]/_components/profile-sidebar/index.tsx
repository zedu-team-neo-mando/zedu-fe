import { Phone, Star, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { BellSimpleSlashIcon, ClockIcon, CopyIcon, MailIcon } from "~/svgs";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { PostRequest } from "~/utils/new-request";
import { showSuccess } from "~/components/toast/sonner";
import { cn } from "~/lib/utils";

import { CopyToClipboardWithTooltip } from "../copy-to-clipboard";
import ProfileStatus from "./profile-status";
import UserAvatar from "~/components/layout/user-avatar";
import { isUserDeactivated } from "~/utils/user-deactivation";

const ProfileSidebar = ({
  user,
  channelId,
  isFavourite: initialIsFavourite,
}: {
  user: any;
  channelId?: string;
  isFavourite?: boolean;
}) => {
  const { state, dispatch } = useContext(DataContext);
  const [localIsFavourite, setLocalIsFavourite] = useState<boolean | null>(
    initialIsFavourite ?? null
  );
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setLocalIsFavourite(initialIsFavourite ?? null);
  }, [initialIsFavourite]);

  const orgId = state?.orgId || "";

  // The Home sidebar lists homeDms, not dms — check both so reopening the
  // panel after a toggle reads the updated shared entry instead of the stale
  // prop captured when the page first mounted.
  const findDmIn = (list: any[]) =>
    (list || []).find(
      (dm: any) =>
        String(dm.channel_id || dm.channels_id) === String(channelId || "")
    );
  const dmInStore = findDmIn(state?.dms) ?? findDmIn(state?.homeDms);
  const isFavouriteKnown = Boolean(dmInStore) || localIsFavourite !== null;
  const isFavourite =
    !isToggling && dmInStore
      ? Boolean(dmInStore.is_favourite)
      : (localIsFavourite ?? false);

  const handleToggleFavourite = async () => {
    if (!channelId || !orgId || isToggling || !isFavouriteKnown) return;

    const next = !isFavourite;
    setIsToggling(true);
    setLocalIsFavourite(next);

    const res = await PostRequest(
      `/organisations/${orgId}/dms/${channelId}/favourite`
    );

    if (res?.status === 200 || res?.status === 201) {
      const serverState = Boolean(res?.data?.data?.is_favourite);
      setLocalIsFavourite(serverState);
      dispatch({
        type: ACTIONS.UPDATE_DM_FAVOURITE,
        payload: { channelId, isFavourite: serverState },
      });
      dispatch({ type: ACTIONS.DM_RENDER_CALLBACK });
      showSuccess(
        serverState ? "Added to favourites" : "Removed from favourites"
      );
    } else {
      setLocalIsFavourite(!next);
    }

    setIsToggling(false);
  };

  const onClose = () => {
    dispatch({ type: ACTIONS.USER_DATA });
    dispatch({ type: ACTIONS.SHOW_PROFILE, payload: false });
    dispatch({ type: ACTIONS.HOVER_PROFILE, payload: false });
  };

  //
  return (
    <div className="flex flex-col h-full">
      <nav className="flex items-center justify-between p-5 py-[23px] border-b border-[#E6EAEF]">
        {/* <h2 className="text-[#1D2939] text-lg font-bold">Profile</h2> */}

        <button
          aria-label="Close profile"
          title="Close profile"
          onClick={onClose}
          className="text-[#344054] p-1 border border-input rounded-[0.3125rem]"
        >
          <X className="size-5 text-[#344054]" />
        </button>
      </nav>

      {/* Profile body */}
      <div className="py-3 flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-5 px-5">
          <div className="">
            <UserAvatar
              item={user}
              size="profile"
              alt={user?.username ?? "avatar"}
              imageClassName="rounded-[9px] object-cover"
              className="rounded-[9px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[#101828] text-[22px] font-black">
                  {user?.username || user?.full_name}
                  {isUserDeactivated(user) && (
                    <span className="ml-1.5 font-normal text-[#ABABAD]">
                      (deactivated)
                    </span>
                  )}
                </h2>
                {user?.online && !isUserDeactivated(user) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    <span className="size-1.5 rounded-full bg-green-600" />
                    Online
                  </span>
                )}
              </div>
            </div>
            <p className="text-[#344054] text-lg">{user?.title}</p>

            <ProfileStatus user={user} />

            <div className="flex gap-[10px] items-center">
              <BellSimpleSlashIcon color="#475467" />
              <p className="text-[15px] text-[#344054]">
                {user?.online ? "Online" : "Away"}, Notifications snoozed
              </p>
            </div>
            {user?.timezone && (
              <div className="flex gap-[10px] items-center">
                <ClockIcon />
                <p className="text-[15px] text-[#344054]">{user?.timezone}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 items-center">
            {channelId && (
              <Button
                variant={"outline"}
                className={cn(
                  "h-fit p-[7px] border-[#E6EAEF]",
                  isFavourite && "border-[#F59E0B] bg-[#FFFBEB]"
                )}
                onClick={handleToggleFavourite}
                disabled={isToggling || !isFavouriteKnown}
                aria-pressed={isFavourite}
                aria-label={
                  isFavourite ? "Remove from favourites" : "Add to favourites"
                }
                title={
                  isFavourite ? "Remove from favourites" : "Add to favourites"
                }
              >
                <Star
                  size={20}
                  strokeWidth={1.5}
                  color={isFavourite ? "#F59E0B" : "#667085"}
                  fill={isFavourite ? "#F59E0B" : "none"}
                />
              </Button>
            )}

            <Button
              variant={"outline"}
              className="h-fit py-[7px] px-[10px] border-[#E6EAEF] font-semibold text-[13px] text-[#344054] gap-1"
            >
              <BellSimpleSlashIcon /> Mute
            </Button>
          </div>
        </div>

        <div className="border-t border-[#E6EAEF]" />
        <div className="flex flex-col gap-2 px-5">
          <h4 className="text-[15px] text-[#101828] font-bold">
            Contact Information
          </h4>

          {user?.phone && (
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-[10px] items-center">
                <Phone size={20} color="#475467" />
                <span className="text-sm text-[#6868F7]">{user?.phone}</span>
                {/* <span className="text-sm text-[#667085]">whatsapp only</span> */}
              </div>
              <CopyToClipboardWithTooltip
                textToCopy={user?.phone}
                label="Copy phone number"
              >
                <CopyIcon />
              </CopyToClipboardWithTooltip>
            </div>
          )}

          {user?.email && (
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-[10px] items-center">
                <MailIcon />
                <span className="text-sm text-[#6868F7]">{user?.email}</span>
              </div>

              <CopyToClipboardWithTooltip
                textToCopy={user?.email}
                tooltipText="Copied!"
                label="Copy email"
              >
                <CopyIcon />
              </CopyToClipboardWithTooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
