"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import GeneralNotificationConnection from "~/components/layout/centrifugo/general-notification-connection";
import ChannelNav from "~/components/layout/sidebar/Nav";
import { DataContext } from "~/store/GlobalState";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { state } = useContext(DataContext);
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
      document.body.style.userSelect = "auto"; // Re-enable text selection
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
      document.body.style.userSelect = "none"; // Prevent text selection
      document.body.style.cursor = "ew-resize"; // Change cursor globally
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

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLargeScreen = windowWidth >= 1024;

  if (state?.channelLoading) return null;

  //

  return (
    <div className="w-full flex relative overflow-auto">
      {/* <GeneralNotificationConnection /> */}
      <ChannelNav
        resizerRef={resizerRef}
        sidebarWidth={sidebarWidth}
        sidebarRef={sidebarRef}
      />

      <div
        className={`w-full mt-[60px] relative`}
        style={{ marginLeft: isLargeScreen ? `${sidebarWidth + 85}px` : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
