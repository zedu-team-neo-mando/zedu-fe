import { Phone, Star, X } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  BellSimpleSlashIcon,
  ClockIcon,
  CopyIcon,
  FilesIcon,
  HideUserIcon,
  MailIcon,
  ChatBubbleIcon,
} from "~/svgs";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { usePathname, useRouter } from "next/navigation";
import { CopyToClipboardWithTooltip } from "../copy-to-clipboard";
import ProfileStatus from "./profile-status";
import { PostRequest } from "~/utils/new-request";
import UserAvatar from "~/components/layout/user-avatar";
import { isUserDeactivated } from "~/utils/user-deactivation";

const HoverSidebar = () => {
  const { state, dispatch } = useContext(DataContext);
  const pathname = usePathname();
  const router = useRouter();
  const user = state?.userData;
  const { user: currentUser, orgSlug, orgMembers } = state;

  const isOnline = orgMembers?.find(
    (member: any) => member.id === user?.user_id
  )?.online;

  useEffect(() => {
    dispatch({ type: ACTIONS.SHOW_PROFILE, payload: false });
  }, [pathname]);

  const onClose = () => {
    dispatch({ type: ACTIONS.USER_DATA });
    dispatch({ type: ACTIONS.SHOW_PROFILE, payload: false });
    dispatch({ type: ACTIONS.HOVER_PROFILE, payload: false });
  };

  const handleMessage = async () => {
    localStorage.setItem("channelName", user?.username);
    const orgId = localStorage.getItem("orgId") || "";

    dispatch({ type: ACTIONS.PARTICIPANT, payload: user });

    const firstPayload = {
      chat_type: "user",
      participant_id: user?.user_id,
    };

    const res = await PostRequest(`/organisations/${orgId}/dms`, firstPayload);

    if (res?.status === 200 || res?.status === 201) {
      router.push(
        `/${orgSlug}/home/people/${res?.data?.data?.channel_id}/${res?.data?.data?.participant_id}/dm`
      );
    }
  };

  if (!user) return null;

  //

  //
  return (
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
            imageClassName="rounded-[9px] object-cover"
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
                {isOnline && !isUserDeactivated(user) && (
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
                {isOnline ? "Online" : "Away"}, Notifications snoozed
              </p>
            </div>
            {user?.timezone && (
              <div className="flex gap-[10px] items-center">
                <ClockIcon />
                <p className="text-[15px] text-[#344054]">{user?.timezone}</p>
              </div>
            )}
          </div>

          {user?.user_id !== currentUser?.user_id &&
            !isUserDeactivated(user) && (
              <button
                onClick={handleMessage}
                className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-500/90 text-white font-semibold text-[13px] rounded-md py-2.5 transition"
              >
                <ChatBubbleIcon />
                Message
              </button>
            )}

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

export default HoverSidebar;
