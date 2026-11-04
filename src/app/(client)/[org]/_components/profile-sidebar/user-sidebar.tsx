import { Phone, Star, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  BellSimpleSlashIcon,
  ClockIcon,
  CopyIcon,
  FilesIcon,
  HideUserIcon,
  MailIcon,
} from "~/svgs";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import EditProfileDialog from "../edit-profile-modal";
import { usePathname } from "next/navigation";
import { CopyToClipboardWithTooltip } from "../copy-to-clipboard";
import ProfileStatus from "./profile-status";
import UserAvatar from "~/components/layout/user-avatar";
import { isUserDeactivated } from "~/utils/user-deactivation";

const UserSidebar = () => {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    dispatch({ type: ACTIONS.SHOW_PROFILE, payload: false });
  }, [pathname]);

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const onClose = () => {
    dispatch({ type: ACTIONS.USER_DATA });
    dispatch({ type: ACTIONS.SHOW_USER_PROFILE, payload: false });
  };

  return (
    <div
      className={`fixed mt-[60px] right-0 top-0 z-20 w-full sm:w-[408px] h-full bg-white border-l border-[#E6EAEF] ${state?.showUserProfile ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex items-center justify-between p-5 py-[23px] border-b border-[#E6EAEF]">
          <h2 className="text-[#1D2939] text-lg font-bold">Profile</h2>

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
        <div className="py-5 flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex flex-col gap-5 px-5">
            <UserAvatar
              item={user}
              size="profile"
              alt={user?.username ?? "avatar"}
              imageClassName="rounded-[9px] object-cover object-top"
              className="rounded-[9px]"
            />

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
                <button
                  className="text-[#6868F7] font-semibold cursor-pointer"
                  onClick={handleEditProfile}
                >
                  Edit
                </button>
              </div>
              {user?.title && (
                <p className="text-[#344054] text-lg">{user.title}</p>
              )}

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

            {/* <div className="flex gap-3 items-center">
              <Button
                variant={"outline"}
                className="h-fit p-[7px] border-[#E6EAEF]"
              >
                <Star size={20} strokeWidth={1.5} color="#667085" />
              </Button>

              <Button
                variant={"outline"}
                className="h-fit py-[7px] px-[10px] border-[#E6EAEF] font-semibold text-[13px] text-[#344054] gap-1"
              >
                <BellSimpleSlashIcon /> Mute
              </Button>

              <Button
                variant={"outline"}
                className="h-fit py-[7px] px-[10px] border-[#E6EAEF] font-semibold text-[13px] text-[#344054] gap-1"
              >
                <HideUserIcon /> Hide
              </Button>

              <Button
                variant={"outline"}
                className="h-fit py-[7px] px-[10px] border-[#E6EAEF] font-semibold text-[13px] text-[#344054] gap-1"
              >
                <FilesIcon /> View Files
              </Button>

              <Button
                variant={"outline"}
                className="h-fit p-[7px] border-[#E6EAEF] font-semibold text-[13px] text-[#344054] gap-1"
              >
                <CopyIcon />
              </Button>
            </div> */}
          </div>

          <div className="border-t border-[#E6EAEF]" />
          <div className="flex flex-col gap-2 mb-20 px-5">
            <h4 className="text-[15px] text-[#101828] font-bold">
              Contact Information
            </h4>
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
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-[10px] items-center">
                <MailIcon />
                <span className="text-sm text-[#6868F7]">{user?.email}</span>
              </div>

              <CopyToClipboardWithTooltip
                textToCopy={user?.email}
                tooltipText="Email copied!"
                label="Copy email"
              >
                <CopyIcon />
              </CopyToClipboardWithTooltip>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      </div>
    </div>
  );
};

export default UserSidebar;
