"use client";

import {
  Maximize2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Smile,
  Minus,
  PhoneOff,
  Hand,
  Users,
} from "lucide-react";
import { useState, useContext } from "react";
import { RaiseHandAnimation } from "~/components/raise-hand/raise-hand-animation";
import HuddleEmojiReactions from "~/app/(client)/[org]/_components/buzz-management/HuddleEmojiReactions";
import { BuzzMiniParticipant } from "./buzz-miniparticipant";
import { ScreenSharePlayer } from "./screen-share-player";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { useChannelBuzzContext } from "~/hooks/buzz/ChannelBuzzContext";

const MiniWidget = () => {
  const { state, dispatch } = useContext(DataContext);
  const { buzzParticipants, buzzView, buzzData, user } = state;
  const {
    toggleAudio,
    isAudioPublishing,
    toggleVideo,
    toggleHandRaise,
    isVideoPublishing,
    handleEndBuzz,
    screenVideoTrack,
    handleLeave,
  } = useChannelBuzzContext();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const toggleEmojiPicker = () => setIsEmojiPickerOpen(!isEmojiPickerOpen);
  const localParticipant = buzzParticipants?.find(
    (p: any) =>
      String(p?.id) === String(user?.user_id) ||
      String(p?.id) === String(user?.id)
  );
  const isHandRaised = localParticipant?.handsRaised ?? false;

  const handleEndCall = async () => {
    handleEndBuzz();
    dispatch({ type: ACTIONS.BUZZ_VIEW, payload: "side" });
    dispatch({ type: ACTIONS.BUZZ_SIDEBAR, payload: false });
  };

  const handleLeaveCall = async () => {
    handleLeave();
    dispatch({ type: ACTIONS.BUZZ_VIEW, payload: "side" });
    dispatch({ type: ACTIONS.BUZZ_SIDEBAR, payload: false });
  };

  const firstTwoParticipants =
    buzzParticipants?.length > 2
      ? buzzParticipants?.slice(0, 2)
      : buzzParticipants;
  const participantsLeft =
    (buzzParticipants?.length || 0) - (firstTwoParticipants?.length || 0);

  const handleMaximize = () => {
    dispatch({ type: ACTIONS.BUZZ_VIEW, payload: "side" });
    dispatch({ type: ACTIONS.BUZZ_SIDEBAR, payload: true });
  };

  const handleMinimize = () => {
    dispatch({ type: ACTIONS.BUZZ_VIEW, payload: "pill" });
    dispatch({ type: ACTIONS.BUZZ_SIDEBAR, payload: false });
  };

  if (buzzView !== "mini") return null;

  return (
    <div
      className="fixed top-3 right-10 w-[285px] h-[295px] rounded-xl bg-white z-50 flex flex-col"
      style={{ boxShadow: "0px 4px 20px -12px #1A1A1A1F" }}
    >
      <div className="flex items-center border-b-gray-200 justify-between px-4 pt-3 pb-2 text-white border-b">
        <div className="flex flex-col gap-1">
          <p className="text-[#344054] font-medium">
            {buzzData?.channel_name || "Buzz Call"}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
              <Users size={12} strokeWidth={2} />
              {buzzParticipants?.length || 0}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-8 h-8 border border-[#E4E7EC] rounded-lg flex items-center justify-center text-[#344054] hover:bg-[#4a4e6b25] transition-colors"
            onClick={handleMaximize}
            aria-label="Maximize buzz call"
            title="Maximize"
          >
            <Maximize2 size={15} />
          </button>
          <button
            type="button"
            className="w-8 h-8 border border-[#E4E7EC] rounded-lg flex items-center justify-center text-[#344054] hover:bg-[#4a4e6b25] transition-colors"
            onClick={handleMinimize}
            aria-label="Minimize buzz call"
            title="Minimize"
          >
            <Minus size={17} />
          </button>
        </div>
      </div>
      {screenVideoTrack ? (
        <div className="w-full flex-1 relative flex justify-center items-center rounded-xl overflow-hidden px-3 py-1">
          <ScreenSharePlayer videoTrack={screenVideoTrack} />
        </div>
      ) : firstTwoParticipants?.length > 0 ? (
        <div className="flex flex-1 items-center justify-evenly gap-4 px-3">
          {firstTwoParticipants.map((participant: any, index: number) => (
            <BuzzMiniParticipant
              key={participant?.id || index}
              uid={participant?.id}
              audioTrack={participant?.audioTrack}
              videoTrack={participant?.videoTrack}
              name={participant?.username}
              handsRaised={participant?.handsRaised}
              isPinned={participant?.isPinned}
              avatarUrl={participant?.avatarUrl}
              color={participant?.color}
              user_id={participant?.user_id ?? participant?.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No participants
        </div>
      )}

      {participantsLeft > 0 && (
        <p className="w-full flex items-center justify-end text-sm">
          + {participantsLeft} others
        </p>
      )}
      <div className="flex items-center justify-evenly gap-2 py-4 px-3 border-t border-t-gray-200">
        <button
          type="button"
          title={`${isAudioPublishing ? "Mute" : "Unmute"} mic`}
          aria-label={`${isAudioPublishing ? "Mute" : "Unmute"} mic`}
          className={`size-full rounded-lg flex items-center justify-center transition-colors ${
            !isAudioPublishing
              ? "bg-red-500 text-white"
              : "border border-[#E4E7EC] text-[#344054] hover:bg-[#00000012]"
          }`}
          onClick={toggleAudio}
        >
          {!isAudioPublishing ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button
          type="button"
          title={`${isVideoPublishing ? "Turn off" : "Turn on"} video`}
          aria-label={`${isVideoPublishing ? "Turn off" : "Turn on"} video`}
          className={`size-full rounded-lg flex items-center justify-center transition-colors ${
            !isVideoPublishing
              ? "bg-red-500 text-white"
              : "border border-[#E4E7EC] text-[#344054] hover:bg-[#00000012]"
          }`}
          onClick={toggleVideo}
        >
          {!isVideoPublishing ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
        <button
          type="button"
          title={`${isEmojiPickerOpen ? "Hide" : "Add"} reactions`}
          aria-label={`${isEmojiPickerOpen ? "Hide" : "Add"} reactions`}
          aria-expanded={isEmojiPickerOpen}
          className={`size-full border border-[#E4E7EC] rounded-lg flex items-center justify-center text-[#344054] hover:bg-[#00000012] transition-colors ${
            isEmojiPickerOpen ? "bg-blue-100 border-blue-400" : ""
          }`}
          onClick={toggleEmojiPicker}
        >
          <Smile size={20} />
        </button>
        <div className="relative size-full">
          <button
            type="button"
            title={`${isHandRaised ? "Lower" : "Raise"} hand`}
            aria-label={`${isHandRaised ? "Lower" : "Raise"} hand`}
            aria-pressed={isHandRaised}
            onClick={toggleHandRaise}
            className={`size-full border border-[#E4E7EC] rounded-lg flex items-center justify-center transition-colors ${
              isHandRaised
                ? "bg-blue-100 border-blue-400"
                : "text-[#344054] hover:bg-[#00000012]"
            }`}
          >
            <Hand
              size={20}
              className={isHandRaised ? "text-white" : "text-gray-700"}
            />
          </button>

          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
            <RaiseHandAnimation
              trigger={isHandRaised}
              position="bottom-right"
              useRelativePosition={true}
            />
          </div>
        </div>
        <button
          type="button"
          className="bg-red-500 text-white rounded-lg p-2.5 hover:bg-red-600 transition-colors size-full font-medium flex items-center justify-center"
          onClick={
            buzzParticipants?.length === 1 ? handleEndCall : handleLeaveCall
          }
          aria-label={
            buzzParticipants?.length === 1 ? "End call" : "Leave call"
          }
          title={buzzParticipants?.length === 1 ? "End call" : "Leave call"}
        >
          <PhoneOff size={20} />
        </button>
        {isEmojiPickerOpen && (
          <HuddleEmojiReactions
            name={localParticipant?.name}
            showQuickEmojis={isEmojiPickerOpen}
          />
        )}
      </div>
    </div>
  );
};

export default MiniWidget;
