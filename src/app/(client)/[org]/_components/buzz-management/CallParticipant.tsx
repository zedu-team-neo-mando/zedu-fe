"use client";

import { MicOff, Pin, PinOff } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AudioWaveBars, AudioWaveBorder } from "./audio-wave-border";

import { Button } from "~/components/ui/button";
import { useAudioVisualizer } from "~/hooks/useAudioVisualizer";
import { BuzzRaiseHandIcon } from "~/svgs";
import { Participant } from "~/hooks/buzz";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import {
  getParticipantVideoScale,
  observeParticipantVideoStyles,
} from "~/lib/buzz/participant-video-styles";

const DEFAULT_PARTICIPANT_COLOR = "#4848AD";
const PARTICIPANT_VIDEO_CONTAINER_CLASS =
  "w-full h-full overflow-hidden bg-[#202124] flex items-center justify-center";

const size = 60;

export const BuzzParticipant = ({
  audioTrack,
  videoTrack,
  name,
  handsRaised,
  uid,
  isPinned = false,
  avatarUrl,
  join_status,
  color,
  user_id,
  isFullHeight = false,
}: Participant & { isFullHeight?: boolean }) => {
  const { state, dispatch } = useContext(DataContext);
  const isLocalVideo =
    String(user_id) === String(state.user?.user_id) ||
    String(uid) === String(state.user?.user_id);

  const { isSpeaking, volume } = useAudioVisualizer({
    audioTrack: audioTrack || null,
    threshold: 0.1,
  });

  // Blinking effect for 'pending' status
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    if (join_status === "pending") {
      setIsBlinking(true);
    } else {
      setIsBlinking(false);
    }
  }, [join_status]);

  const videoRef = useRef<HTMLDivElement | null>(null);
  const bgColor = color || DEFAULT_PARTICIPANT_COLOR;
  const lighter = `color-mix(in srgb, ${bgColor} 80%, white)`;
  const darker = `color-mix(in srgb, ${bgColor} 80%, black)`;

  const handlePin = () => {
    const targetId = String(user_id || uid);

    dispatch({
      type: ACTIONS.BUZZ_PARTICIPANTS,
      payload: ((state.buzzParticipants as Participant[]) ?? []).map(
        (participant) => {
          const participantId = String(participant.user_id || participant.uid);
          const isTarget = participantId === targetId;

          return {
            ...participant,
            isPinned: isTarget ? !participant.isPinned : false,
          };
        }
      ),
    });
  };

  useEffect(() => {
    if (!videoTrack || !videoRef.current) return;

    const container = videoRef.current;
    let disposed = false;
    let stopObserving = () => {};

    const playVideo = async () => {
      await videoTrack.play(container, { fit: "cover" });
      if (disposed) return;
      stopObserving = observeParticipantVideoStyles(container, {
        mirror: isLocalVideo,
        scale: getParticipantVideoScale(isLocalVideo),
      });
    };

    void playVideo();

    return () => {
      disposed = true;
      stopObserving();
      videoTrack.stop();
    };
  }, [videoTrack, isLocalVideo]);

  // Determine status display
  let statusContent: React.ReactNode = null;
  let cardClass = `min-w-[150px] w-full flex justify-center items-center rounded-lg overflow-hidden relative ${isFullHeight ? "h-full min-h-0" : "h-[180px]"} ${audioTrack ? "ring-4" : "ring-0"}`;
  if (isBlinking) {
    cardClass += " animate-blinkOpacity";
  }

  if (join_status === "pending") {
    statusContent = (
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 w-full px-2 h-8 z-10">
        <span
          className="font-semibold rounded px-3 py-1 text-sm shadow animate-pulse"
          style={{ backgroundColor: bgColor, color: "#000" }}
        >
          Ringing
        </span>
      </div>
    );
  } else if (join_status === "declined") {
    statusContent = (
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 w-full px-2 h-8 z-10">
        <span className="bg-red-500 text-white font-semibold rounded px-3 py-1 text-sm shadow">
          Declined
        </span>
      </div>
    );
  } else if (join_status === "timeout") {
    statusContent = (
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 w-full px-2 h-8 z-10">
        <span className="bg-gray-400 text-white font-semibold rounded px-3 py-1 text-sm shadow">
          Timeout
        </span>
      </div>
    );
  }

  return (
    <div
      className={cardClass}
      style={
        audioTrack
          ? ({ "--tw-ring-color": lighter } as React.CSSProperties)
          : undefined
      }
    >
      {name && (
        <div className="absolute top-2 left-2 z-10 bg-black/60 rounded-md px-2 py-1 max-w-[calc(100%-16px)]">
          <p className="text-white text-xs font-semibold truncate">{name}</p>
        </div>
      )}
      {handsRaised && (
        <div className="absolute top-2 right-2 z-10 p-1">
          <BuzzRaiseHandIcon />
        </div>
      )}
      {videoTrack ? (
        <div ref={videoRef} className={PARTICIPANT_VIDEO_CONTAINER_CLASS} />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-white font-semibold text-2xl"
          style={{ backgroundColor: bgColor }}
        >
          <AudioWaveBorder
            isSpeaking={isSpeaking}
            color={bgColor}
            size={size}
            volume={volume}
          >
            <div
              className="size-8 p-8 rounded-full flex justify-center items-center relative overflow-hidden"
              style={{ backgroundColor: darker }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name || "Participant"}
                  fill
                  className="object-cover"
                />
              ) : (
                <p>{name ? name.charAt(0).toUpperCase() : ""}</p>
              )}
            </div>
          </AudioWaveBorder>
        </div>
      )}

      {/* Status or controls section */}
      {statusContent || (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 w-full px-2 h-8 z-10 text-white">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePin();
            }}
            type="button"
            style={{ pointerEvents: "auto" }}
            className={`flex-1 items-center justify-center size-full rounded-[5px] max-w-[38px] px-2.5 border-0 transition-colors cursor-pointer ${
              isPinned
                ? "bg-black/50 hover:bg-black/60"
                : "bg-black/40 hover:bg-black/50"
            }`}
            title={isPinned ? "Unpin participant" : "Pin participant"}
          >
            {isPinned ? (
              <PinOff className="size-4" fontWeight={2} />
            ) : (
              <Pin className="size-4" fontWeight={1} />
            )}
          </button>
          <Button className="flex-1 items-center justify-center size-full bg-black/40 hover:bg-black/60 rounded-[5px] max-w-[38px] p-1 border-0">
            {audioTrack ? (
              <AudioWaveBars isSpeaking={isSpeaking} volume={volume} />
            ) : (
              <MicOff className="size-4" fontWeight={1} />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
