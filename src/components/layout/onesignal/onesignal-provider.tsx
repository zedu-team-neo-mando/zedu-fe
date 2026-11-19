"use client";

import { useContext, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import OneSignal from "react-onesignal";
import { initOneSignalSafely } from "~/lib/onesignal/init";
import {
  normalizeNotificationPayload,
  resolveNotificationRoute,
  storeMessageHighlightId,
} from "~/lib/onesignal/notification-route";
import {
  registerNotificationBadge,
  isNotificationsRoute,
} from "~/lib/notifications/notification-badge";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { openBuzzInNewTab } from "~/lib/buzz/open-buzz-tab";
import { ensureCentrifugeConnected } from "~/lib/centrifugo/ensure-connected";

const getString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const isMessageLikeNotification = (data: Record<string, unknown>) => {
  const type = (
    getString(data.notification_type) ||
    getString(data.event) ||
    ""
  ).toLowerCase();

  if (
    type === "new_message" ||
    type === "dm" ||
    type === "mention" ||
    type === "channel" ||
    type.includes("message")
  ) {
    return true;
  }

  return Boolean(
    getString(data.channel_id) ||
    getString(data.channels_id) ||
    getString(data.thread_id) ||
    getString(data.message_id)
  );
};

const applyNotificationNavigationContext = (data: Record<string, unknown>) => {
  if (typeof window === "undefined") return;

  const orgId = getString(data.org_id);
  if (orgId) {
    localStorage.setItem("orgId", orgId);
  }

  const channelId = getString(data.channel_id) || getString(data.channels_id);
  if (channelId) {
    localStorage.setItem("channelId", channelId);
  }

  const channelName =
    getString(data.channel_name) || getString(data.sender_name);
  if (channelName) {
    localStorage.setItem("channelName", channelName);
  }
};

const getNotificationData = (notification: any) => {
  const additionalData = notification?.additionalData || {};
  const data = notification?.data || {};
  const customA = notification?.rawPayload?.custom?.a || {};

  return normalizeNotificationPayload({
    ...customA,
    ...data,
    ...additionalData,
  });
};

const navigateToNotificationTarget = (
  event: any,
  router: ReturnType<typeof useRouter>
) => {
  const notification = event?.notification;
  const data = getNotificationData(notification);
  applyNotificationNavigationContext(data);

  // Prefer payload IDs over OneSignal's generic launchURL (often "/" or "/{org}")
  const nextRoute = resolveNotificationRoute(
    data,
    notification?.launchURL || notification?.launchUrl
  );

  if (!nextRoute) return;

  storeMessageHighlightId(data);

  if (/\/buzz\/[^/]+$/.test(nextRoute)) {
    const [, orgSlug, , buzzId] = nextRoute.split("/");
    if (orgSlug && buzzId) {
      openBuzzInNewTab(orgSlug, buzzId);
      return;
    }
  }

  router.push(nextRoute);
};

export default function OneSignalProvider() {
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const context = useContext(DataContext);
  const dispatch = context?.dispatch;

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const incrementBadgeFromNotification = (notification: any) => {
    if (!dispatch || isNotificationsRoute(pathnameRef.current)) return;

    const payload = getNotificationData(notification);
    if (!registerNotificationBadge(payload)) return;

    dispatch({ type: ACTIONS.INCREMENT_NOTIFICATION_BADGE });
  };

  /** Catch up message lists when push arrives while Centrifugo was asleep. */
  const resyncMessagesFromPush = (data: Record<string, unknown>) => {
    if (!dispatch || !isMessageLikeNotification(data)) return;

    ensureCentrifugeConnected();
    dispatch({ type: ACTIONS.HOME_DMS_CALLBACK });
    dispatch({ type: ACTIONS.TRIGGER_CALLBACK });
  };

  useEffect(() => {
    if (!dispatch) return;

    let isActive = true;

    const handlePermissionChange = (permission: boolean) => {
      console.log("[OneSignal] Permission changed:", permission);
    };

    const handleForeground = (event: any) => {
      incrementBadgeFromNotification(event?.notification);

      const foregroundData = getNotificationData(event?.notification);
      resyncMessagesFromPush(foregroundData);

      if (foregroundData?.notification_type === "direct_call_initialized") {
        if (audioPlayer.current) {
          audioPlayer.current.currentTime = 0;
          audioPlayer.current.play().catch(() => {
            console.log(
              "[OneSignal] Unable to autoplay ringtone without user interaction"
            );
          });
        }
      }

      if (foregroundData?.notification_type === "direct_call_canceled") {
        if (audioPlayer.current) {
          audioPlayer.current.pause();
          audioPlayer.current.currentTime = 0;
        }
      }
    };

    const handleClick = (event: any) => {
      incrementBadgeFromNotification(event?.notification);
      const clickData = getNotificationData(event?.notification);
      resyncMessagesFromPush(clickData);
      // Remount may not run if already on the target conversation — refetch after nav
      window.setTimeout(() => resyncMessagesFromPush(clickData), 500);
      navigateToNotificationTarget(event, router);
    };

    const setup = async () => {
      try {
        await initOneSignalSafely();
        if (!isActive) return;

        if (Notification.permission === "default") {
          await OneSignal.Notifications.requestPermission();
        }

        OneSignal.Notifications.addEventListener(
          "permissionChange",
          handlePermissionChange
        );
        OneSignal.Notifications.addEventListener(
          "foregroundWillDisplay",
          handleForeground
        );
        OneSignal.Notifications.addEventListener("click", handleClick);
      } catch (error) {
        console.error("[OneSignal] Failed to initialize", error);
      }
    };

    setup();

    return () => {
      isActive = false;
      OneSignal.Notifications.removeEventListener(
        "permissionChange",
        handlePermissionChange
      );
      OneSignal.Notifications.removeEventListener(
        "foregroundWillDisplay",
        handleForeground
      );
      OneSignal.Notifications.removeEventListener("click", handleClick);
    };
  }, [dispatch, router]);

  return (
    <audio ref={audioPlayer} style={{ display: "none" }}>
      <source src="/audio/call-ringtone.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
