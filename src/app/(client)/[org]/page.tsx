"use client";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { HashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ChannelNav from "~/components/layout/sidebar/Nav";
import { DataContext } from "~/store/GlobalState";

const People = () => {
  const [sidebarWidth, setSidebarWidth] = useState(270);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const minWidth = 250;
    const maxWidth = 550;
    let startX = 0;
    let startWidth = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = "auto";
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startX = e.clientX;
      if (sidebarRef.current) {
        startWidth = sidebarRef.current.offsetWidth;
      }
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ew-resize";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const resizer = resizerRef.current;
    if (resizer) {
      resizer.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (resizer) {
        resizer.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const router = useRouter();
  const { state } = useContext(DataContext);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLargeScreen = windowWidth !== null && windowWidth >= 1024;
  const channels = Array.isArray(state?.channels) ? state.channels : [];
  const defaultChannel =
    channels.find(
      (channel: any) =>
        (channel?.name || "").trim().toLowerCase() === "general" &&
        !channel?.archived
    ) ??
    channels.find((channel: any) => !channel?.archived) ??
    null;

  useEffect(() => {
    if (windowWidth === null) return;

    if (!isLargeScreen && defaultChannel && state?.orgSlug) {
      const channelId =
        defaultChannel?.channels_id ??
        defaultChannel?.channel_id ??
        defaultChannel?.id;

      if (channelId) {
        router.replace(`/${state.orgSlug}/home/channels/${channelId}`);
      }
    }
  }, [defaultChannel, isLargeScreen, router, state?.orgSlug, windowWidth]);

  const handleSelectChannel = (channelId: string) => {
    if (!channelId) return;
    router.push(`/${state.orgSlug}/home/channels/${channelId}`);
  };

  return (
    <>
      <ChannelNav
        resizerRef={resizerRef}
        sidebarWidth={sidebarWidth}
        sidebarRef={sidebarRef}
      />

      <div
        className={`mt-[60px] relative`}
        style={{ marginLeft: isLargeScreen ? `${sidebarWidth + 85}px` : 0 }}
      >
        {!isLargeScreen && channels.length > 0 && !defaultChannel ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-center text-xl font-semibold text-blue-500">
                Open channels
              </h2>

              <div className="space-y-2">
                {channels.map((channel: any) => {
                  const channelId =
                    channel?.channels_id ?? channel?.channel_id ?? channel?.id;

                  if (!channelId) return null;

                  return (
                    <button
                      key={channelId}
                      type="button"
                      onClick={() => handleSelectChannel(channelId)}
                      className="flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-left transition hover:border-blue-200 hover:bg-blue-100"
                    >
                      <HashIcon className="size-4 text-blue-500" />
                      <span className="truncate text-sm font-medium text-blue-700">
                        {channel?.name || "Untitled channel"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[80vh] flex flex-col items-center justify-center">
            <Image
              src="/image/empty-message.svg"
              width={100}
              height={100}
              className="size-20 lg:size-30"
              alt=""
              unoptimized
            />
            <h2 className="font-bold text-xl text-blue-500">
              Select a channel
            </h2>
          </div>
        )}
      </div>
    </>
  );
};
export default People;
