type NotificationLike = Record<string, unknown> | null | undefined;

const seenNotificationKeys = new Set<string>();

export const isHomeRoute = (pathname: string | null | undefined): boolean => {
  if (!pathname) return false;
  return /\/home(\/|$)/.test(pathname);
};

export const isNotificationsRoute = (
  pathname: string | null | undefined
): boolean => {
  if (!pathname) return false;
  return /\/notifications(\/|$)/.test(pathname);
};

const getString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

export const getNotificationBadgeKey = (payload: NotificationLike): string => {
  if (!payload) return "";

  const nested =
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : {};

  const notificationType =
    getString(payload.notification_type) || getString(payload.event);
  const channelId =
    getString(payload.channel_id) ||
    getString(payload.channels_id) ||
    getString(nested.channel_id) ||
    getString(nested.channels_id);
  const messageId =
    getString(payload.message_id) ||
    getString(payload.messages_id) ||
    getString(payload.thread_id) ||
    getString(nested.message_id) ||
    getString(nested.messages_id) ||
    getString(nested.thread_id);
  const senderId =
    getString(payload.sender_id) ||
    getString(payload.participant_id) ||
    getString(nested.sender_id) ||
    getString(nested.participant_id);

  return [notificationType, channelId, messageId, senderId]
    .filter(Boolean)
    .join(":");
};

export const shouldIncrementNotificationBadge = (
  payload: NotificationLike
): boolean => {
  if (!payload) return false;

  const nested =
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : {};

  const notificationType =
    getString(payload.notification_type) ||
    getString(payload.event) ||
    getString(nested.notification_type) ||
    getString(nested.event);
  const section = getString(payload.section) || getString(nested.section);

  if (Boolean(payload.isTest || payload.test || nested.isTest)) return true;

  if (
    notificationType === "new_message" ||
    notificationType === "dm" ||
    notificationType === "mention" ||
    notificationType === "direct_call_initiated" ||
    notificationType === "direct_call_initialized" ||
    notificationType === "notification" ||
    notificationType === "announcement"
  ) {
    return true;
  }

  if (
    section === "thread_message" &&
    (notificationType === "new_message" || notificationType === "mention")
  ) {
    return true;
  }

  // Any payload carrying a title or message is a user-facing notification
  if (
    getString(payload.title) ||
    getString(payload.message) ||
    getString(nested.title) ||
    getString(nested.message)
  ) {
    return true;
  }

  return false;
};

export const TRIGGER_NOTIFICATION_EVENT = "zedu:trigger-notification";

export const triggerLocalTestNotification = (
  payload?: NotificationLike
): void => {
  if (typeof window === "undefined") return;
  const data = {
    id: `test-${Date.now()}`,
    title: "New Notification",
    message: "You have an unread notification",
    notification_type: "new_message",
    isTest: true,
    created_at: new Date().toISOString(),
    ...(payload || {}),
  };
  window.dispatchEvent(
    new CustomEvent(TRIGGER_NOTIFICATION_EVENT, { detail: data })
  );
};

declare global {
  interface Window {
    triggerTestNotification?: (payload?: NotificationLike) => void;
  }
}

if (typeof window !== "undefined") {
  window.triggerTestNotification = triggerLocalTestNotification;
}

export const registerNotificationBadge = (
  payload: NotificationLike
): boolean => {
  if (!shouldIncrementNotificationBadge(payload)) return false;

  const key =
    getNotificationBadgeKey(payload) ||
    `notification:${Date.now()}:${Math.random().toString(36).slice(2)}`;

  if (seenNotificationKeys.has(key)) return false;

  seenNotificationKeys.add(key);
  return true;
};

export const clearNotificationBadgeRegistry = () => {
  seenNotificationKeys.clear();
};
