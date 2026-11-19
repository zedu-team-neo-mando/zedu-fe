import { useEffect, useState, useRef } from "react";
import type {
  ILocalAudioTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";

interface UseAudioVisualizerProps {
  audioTrack:
    | IMicrophoneAudioTrack
    | IRemoteAudioTrack
    | ILocalAudioTrack
    | null;
  threshold?: number;
  maxConsecutiveErrors?: number;
}

const DEFAULT_MAX_CONSECUTIVE_ERRORS = 3;

export function useAudioVisualizer({
  audioTrack,
  threshold = 0.1,
  maxConsecutiveErrors = DEFAULT_MAX_CONSECUTIVE_ERRORS,
}: UseAudioVisualizerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!audioTrack) {
      setIsSpeaking(false);
      setVolume(0);
      return;
    }

    let consecutiveErrors = 0;

    const handleTrackEnded = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSpeaking(false);
      setVolume(0);
    };

    const trackWithEvents = audioTrack as unknown as {
      on?: (event: string, handler: () => void) => void;
      off?: (event: string, handler: () => void) => void;
      getMediaStreamTrack?: () => { readyState?: string } | undefined;
    };

    trackWithEvents.on?.("track-ended", handleTrackEnded);

    intervalRef.current = setInterval(() => {
      try {
        const mediaStreamTrack = trackWithEvents.getMediaStreamTrack?.();
        if (mediaStreamTrack?.readyState === "ended") {
          handleTrackEnded();
          return;
        }

        const level = audioTrack.getVolumeLevel?.() || 0;
        consecutiveErrors = 0;
        setVolume(level);
        setIsSpeaking(level > threshold);
      } catch (error) {
        consecutiveErrors += 1;
        setVolume(0);
        setIsSpeaking(false);

        if (consecutiveErrors >= maxConsecutiveErrors) {
          console.warn(
            `[useAudioVisualizer] Audio track volume polling stopped after ${consecutiveErrors} consecutive errors:`,
            error
          );
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    }, 100);

    return () => {
      trackWithEvents.off?.("track-ended", handleTrackEnded);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSpeaking(false);
      setVolume(0);
    };
  }, [audioTrack, threshold, maxConsecutiveErrors]);

  return { isSpeaking, volume };
}
