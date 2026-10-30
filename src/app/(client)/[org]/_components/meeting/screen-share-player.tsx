"use client";

import { useEffect, useRef, useState } from "react";
import type { ILocalVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";

interface ScreenSharePlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | null | undefined;
  uid?: string | number | null;
  isLocal?: boolean;
  className?: string;
}

export function ScreenSharePlayer({
  videoTrack,
  uid,
  isLocal = false,
  className = "",
}: ScreenSharePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // console.log("ScreenSharePlayer useEffect:", {
    //   hasTrack: !!videoTrack,
    //   hasContainer: !!containerRef.current,
    //   uid,
    //   isLocal,
    //   trackId: videoTrack?.getTrackId?.(),
    // });

    if (!videoTrack || !containerRef.current) {
      console.warn("Missing videoTrack or container");
      setIsPlaying(false);
      return;
    }

    let mounted = true;

    const playVideo = async () => {
      try {
        if (!containerRef.current) {
          return;
        }

        await videoTrack.play(containerRef.current, { fit: "contain" });

        if (mounted) {
          setIsPlaying(true);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to play video track", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : String(err));
          setIsPlaying(false);
        }
      }
    };

    playVideo();
    return () => {
      mounted = true;
      try {
        videoTrack.stop();
      } catch (err) {
        console.error("Error stopping video track:", err);
      }
    };
  }, [videoTrack, uid, isLocal]);

  if (!videoTrack) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-900 flex-1 ${className}`}
      >
        <div className="text-center text-white">
          <p className="text-sm">No screen share</p>
          {uid && <p className="text-xs text-gray-400 mt-1">UID: {uid}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-gray-900 flex-1 ${className}`}>
      <div
        ref={containerRef}
        className="absolute inset-0 max-w-full max-h-full flex items-center justify-center [&_video]:!object-contain"
        style={{
          backgroundColor: "#000",
          width: "100%",
          height: "100%",
        }}
      />
      {!isPlaying && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading screen share...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 z-10">
          <div className="text-white text-center p-4">
            <p className="text-sm font-bold mb-2">Failed to play video</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {uid && (
        <div className="absolute top-3 left-3 bg-black bg-opacity-70 rounded px-3 py-1 z-20">
          <span className="text-white text-sm font-medium flex items-center gap-2">
            {isLocal ? "You (Screen Share)" : `Remote User`}
            {isPlaying && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
