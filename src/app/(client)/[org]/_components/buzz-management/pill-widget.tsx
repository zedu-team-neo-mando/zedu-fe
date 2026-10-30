"use client";

import { Maximize2, Mic, MicOff, PhoneOff } from "lucide-react";

import { useContext } from "react";
import Image from "next/image";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { useChannelBuzzContext } from "~/hooks/buzz/ChannelBuzzContext";

const PillWidget = () => {
  const { state, dispatch } = useContext(DataContext);
  const { buzzParticipants, buzzData } = state;
  const { handleLeave, toggleAudio, handleEndBuzz, isAudioPublishing } =
    useChannelBuzzContext();

  const displayedCaller =
    buzzParticipants?.length > 1
      ? buzzParticipants?.slice(0, 1)
      : buzzParticipants;
  const extraCount =
    (buzzParticipants?.length || 0) - (displayedCaller?.length || 0);

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

  const handleMaximize = () => {
    dispatch({ type: ACTIONS.BUZZ_VIEW, payload: "mini" });
    dispatch({ type: ACTIONS.BUZZ_SIDEBAR, payload: false });
  };

  if (state?.buzzView !== "pill") return null;

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-[#4848AD] px-1.5 sm:px-2 md:px-3 py-1 sm:py-2 rounded-md sm:rounded-lg">
      {/* Avatar Stack */}
      <div className="flex items-center -space-x-1.5 sm:-space-x-2">
        {displayedCaller?.map((participant: any, index: number) => (
          <div
            key={participant?.uid || index}
            className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-sm sm:rounded-md overflow-hidden flex-shrink-0 ring-1 ring-[#4848AD]"
            style={{ backgroundColor: participant.color || "#4848AD" }}
          >
            {Boolean(
              participant?.avatar_url || participant?.default_avatar_url
            ) ? (
              <Image
                src={participant.avatar_url || participant.default_avatar_url}
                alt={participant.username}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xs">
                {participant.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        ))}
        {extraCount > 0 && (
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-sm sm:rounded-md overflow-hidden bg-black/50 flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs ring-1 ring-[#4848AD]">
            +{extraCount}
          </div>
        )}
      </div>

      {/* Info Section - Hide on very small screens */}
      <div className="hidden sm:flex flex-col items-start mx-1 md:mx-1.5 min-w-0">
        <p className="hidden md:inline text-white text-xs truncate max-w-28">
          {buzzData?.channel_name || "Buzz Call"}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-0.5 sm:gap-1 ml-auto sm:ml-1">
        <button
          type="button"
          onClick={handleMaximize}
          className="p-1 sm:p-1.5 hover:bg-[#2a2b67] bg-[#0000001A] rounded transition-colors flex-shrink-0"
          aria-label="Maximize"
          title="Maximize"
        >
          <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
        </button>
        <button
          type="button"
          className={`p-1 sm:p-1.5 rounded transition-colors flex-shrink-0 ${
            !isAudioPublishing
              ? "bg-red-500 text-white"
              : "bg-[#0000001A] text-white hover:bg-[#2a2b67]"
          }`}
          onClick={toggleAudio}
          aria-label={`${isAudioPublishing ? "Mute" : "Unmute"} mic`}
          title={`${isAudioPublishing ? "Mute" : "Unmute"} mic`}
        >
          {!isAudioPublishing ? (
            <MicOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
          ) : (
            <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
          )}
        </button>
        <button
          type="button"
          className="bg-red-500 text-white rounded p-1 sm:p-1.5 hover:bg-red-600 transition-colors flex-shrink-0"
          onClick={
            buzzParticipants?.length === 1 ? handleEndCall : handleLeaveCall
          }
          aria-label="End call"
          title="End call"
        >
          <PhoneOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default PillWidget;
