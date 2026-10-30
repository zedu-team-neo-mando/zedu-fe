import React, { useContext, useRef, useEffect } from "react";
import Image from "next/image";
import { EllipsisVertical, Mic, MicOff, Pin, PinOff } from "lucide-react";
import { BuzzRaiseHandIcon } from "~/svgs";
import { AudioWaveBorder } from "./audio-wave-border";
import { useAudioVisualizer } from "~/hooks/useAudioVisualizer";
import { Participant } from "~/hooks/buzz";
import { DataContext } from "~/store/GlobalState";
import {
  getParticipantVideoScale,
  observeParticipantVideoStyles,
} from "~/lib/buzz/participant-video-styles";

const DEFAULT_PARTICIPANT_COLOR = "#4848AD";
const PARTICIPANT_VIDEO_CONTAINER_CLASS =
  "w-full h-full overflow-hidden bg-[#202124] flex items-center justify-center";

export const BuzzMiniParticipant = ({
  audioTrack,
  videoTrack,
  name,
  handsRaised,
  uid,
  isPinned = false,
  avatarUrl,
  color,
  user_id,
}: Participant) => {
  const { state } = useContext(DataContext);
  const isLocalVideo =
    String(user_id) === String(state.user?.user_id) ||
    String(uid) === String(state.user?.user_id);
  const { isSpeaking, volume } = useAudioVisualizer({
    audioTrack: audioTrack || null,
    threshold: 0.1,
  });
  const videoRef = useRef<HTMLDivElement | null>(null);
  const bgColor = color || DEFAULT_PARTICIPANT_COLOR;
  const lighter = `color-mix(in srgb, ${bgColor} 80%, white)`;
  const darker = `color-mix(in srgb, ${bgColor} 80%, black)`;

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

  return (
    <div
      className={`min-w-[100px] h-[100px] w-full flex justify-center items-center rounded-lg overflow-hidden relative ${
        isSpeaking ? "ring-2" : "ring-0"
      }`}
      style={
        isSpeaking
          ? ({ "--tw-ring-color": lighter } as React.CSSProperties)
          : undefined
      }
    >
      {name && (
        <div className="absolute top-1.5 left-1.5 z-10 bg-black/60 rounded px-1.5 py-0.5 max-w-[calc(100%-12px)]">
          <p className="text-white text-[10px] font-semibold truncate">
            {name}
          </p>
        </div>
      )}
      {handsRaised && (
        <div className="absolute top-1.5 right-1.5 z-10">
          <BuzzRaiseHandIcon />
        </div>
      )}
      {videoTrack ? (
        <div ref={videoRef} className={PARTICIPANT_VIDEO_CONTAINER_CLASS} />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-white font-semibold text-xl"
          style={{ backgroundColor: bgColor }}
        >
          <AudioWaveBorder
            isSpeaking={isSpeaking}
            color={bgColor}
            size={40}
            volume={volume}
          >
            <div
              className="w-10 h-10 rounded-full text-white flex justify-center items-center text-base relative overflow-hidden"
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

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1 w-full px-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          type="button"
          className={`flex items-center justify-center w-6 h-6 rounded border-0 transition-colors cursor-pointer ${
            isPinned
              ? "bg-black/60 hover:bg-black/70"
              : "bg-black/50 hover:bg-black/60"
          }`}
          title={isPinned ? "Unpin participant" : "Pin participant"}
          aria-label={isPinned ? "Unpin participant" : "Pin participant"}
          aria-pressed={isPinned}
        >
          {isPinned ? (
            <PinOff className="size-3.5 text-white" strokeWidth={2} />
          ) : (
            <Pin className="size-3.5 text-white" strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-6 h-6 bg-black/50 hover:bg-black/60 rounded transition-colors border-0"
          aria-label={audioTrack ? "Microphone active" : "Microphone muted"}
          title={audioTrack ? "Microphone active" : "Microphone muted"}
        >
          {audioTrack ? (
            <Mic className="size-3.5 text-white" strokeWidth={2} />
          ) : (
            <MicOff className="size-3.5 text-white" strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-6 h-6 bg-black/50 hover:bg-black/60 rounded transition-colors border-0"
          aria-label="More participant options"
          title="More participant options"
        >
          <EllipsisVertical className="size-3.5 text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
