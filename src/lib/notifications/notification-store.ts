const ACTIONS = {
  INCREMENT_NOTIFICATION_BADGE: "INCREMENT_NOTIFICATION_BADGE",
  DECREMENT_NOTIFICATION_BADGE: "DECREMENT_NOTIFICATION_BADGE",
  SET_NOTIFICATION_BADGE: "SET_NOTIFICATION_BADGE",
  CLEAR_NOTIFICATION_BADGE: "CLEAR_NOTIFICATION_BADGE",
} as const;

const MAX_STORED_IDS = 500;

export const getStorageKey = (
  userId?: string | null,
  orgId?: string | null
): string => {
  const u = userId || "default";
  const o = orgId || "default";
  return `zedu_read_notifications_${u}_${o}`;
};

export const getSeenAtStorageKey = (
  userId?: string | null,
  orgId?: string | null
): string => {
  const u = userId || "default";
  const o = orgId || "default";
  return `zedu_notifications_seen_at_${u}_${o}`;
};

export const getSeenAt = (
  userId?: string | null,
  orgId?: string | null
): number | null => {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(getSeenAtStorageKey(userId, orgId));
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
};

export const markNotificationsSeen = (
  userId?: string | null,
  orgId?: string | null
): number => {
  const now = Date.now();
  if (typeof window === "undefined" || !window.localStorage) return now;
  try {
    window.localStorage.setItem(
      getSeenAtStorageKey(userId, orgId),
      String(now)
    );
  } catch (error) {
    console.error("Failed to persist notifications seen_at", error);
  }
  return now;
};

export const getReadNotificationIds = (
  userId?: string | null,
  orgId?: string | null
): Set<string> => {
  if (typeof window === "undefined" || !window.localStorage) return new Set();
  try {
    const raw = window.localStorage.getItem(getStorageKey(userId, orgId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
};

export const saveReadNotificationIds = (
  ids: Set<string>,
  userId?: string | null,
  orgId?: string | null
): void => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const array = Array.from(ids).slice(-MAX_STORED_IDS);
    window.localStorage.setItem(
      getStorageKey(userId, orgId),
      JSON.stringify(array)
    );
  } catch (error) {
    console.error("Failed to persist read notification ids", error);
  }
};

export const isNotificationRead = (
  item: any,
  userId?: string | null,
  orgId?: string | null
): boolean => {
  if (!item) return true;
  if (typeof item === "string" || typeof item === "number") {
    return getReadNotificationIds(userId, orgId).has(String(item));
  }
  if (item.is_read === true || item.read === true || item.status === "read") {
    return true;
  }
  const id = item.id || item.message_id || item.messages_id;
  if (!id) return false;
  return getReadNotificationIds(userId, orgId).has(String(id));
};

export const isNotificationUnread = (
  item: any,
  userId?: string | null,
  orgId?: string | null
): boolean => {
  if (!item) return false;
  if (isNotificationRead(item, userId, orgId)) {
    return false;
  }
  const seenAt = getSeenAt(userId, orgId);
  if (seenAt !== null) {
    const itemTime = getNotificationTimestamp(item);
    if (itemTime !== null && itemTime <= seenAt) {
      return false;
    }
  }
  return true;
};

export const markNotificationAsRead = (
  itemOrId: any,
  userId?: string | null,
  orgId?: string | null,
  dispatch?: (action: { type: string; payload?: any }) => void
): boolean => {
  if (!itemOrId) return false;
  const id =
    typeof itemOrId === "object" && itemOrId !== null
      ? itemOrId.id || itemOrId.message_id || itemOrId.messages_id
      : itemOrId;
  if (!id) return false;
  const strId = String(id);
  const readIds = getReadNotificationIds(userId, orgId);
  if (!readIds.has(strId)) {
    const wasUnread =
      typeof itemOrId === "object" && itemOrId !== null
        ? isNotificationUnread(itemOrId, userId, orgId)
        : true;

    readIds.add(strId);
    saveReadNotificationIds(readIds, userId, orgId);
    if (dispatch && wasUnread) {
      dispatch({ type: ACTIONS.DECREMENT_NOTIFICATION_BADGE, payload: 1 });
    }
    return true;
  }
  return false;
};

export const markAllNotificationsAsRead = (
  ids: (string | number)[],
  userId?: string | null,
  orgId?: string | null,
  dispatch?: (action: { type: string; payload?: any }) => void
): void => {
  const readIds = getReadNotificationIds(userId, orgId);
  for (const id of ids) {
    if (id) readIds.add(String(id));
  }
  saveReadNotificationIds(readIds, userId, orgId);
  if (dispatch) {
    dispatch({ type: ACTIONS.CLEAR_NOTIFICATION_BADGE });
  }
};

export const getNotificationTimestamp = (item: any): number | null => {
  if (!item || typeof item !== "object") return null;
  const raw =
    item.sent_at ||
    item.created_at ||
    item.createdAt ||
    item.timestamp ||
    item.data?.sent_at ||
    item.data?.created_at;
  if (!raw) return null;
  if (typeof raw === "number") {
    // If between 1 billion and 100 billion, it's Unix seconds (e.g. 1730473000)
    if (raw >= 1e9 && raw < 1e11) {
      return raw * 1000;
    }
    return raw;
  }
  if (typeof raw === "string") {
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric > 0) {
      if (numeric >= 1e9 && numeric < 1e11) {
        return numeric * 1000;
      }
      return numeric;
    }
    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const fetchAndSyncUnreadBadge = async (
  orgId: string,
  userId?: string | null,
  dispatch?: (action: { type: string; payload?: any }) => void,
  customGetRequest?: (url: string) => Promise<any>
): Promise<number> => {
  if (!orgId || !dispatch) return 0;
  try {
    let seenAt = getSeenAt(userId, orgId);
    if (seenAt === null) {
      seenAt = markNotificationsSeen(userId, orgId);
      dispatch({
        type: ACTIONS.SET_NOTIFICATION_BADGE,
        payload: 0,
      });
      return 0;
    }

    let fetcher = customGetRequest;
    if (!fetcher) {
      const { GetRequest } = await import("~/utils/new-request");
      fetcher = GetRequest;
    }
    const res = await fetcher(
      `/organisations/${orgId}/users/onesignal?page=1&limit=20`
    );
    if (res?.status === 200 || res?.status === 201) {
      const items = res?.data?.data?.notifications || [];
      const unreadCount = items.filter((item: any) =>
        isNotificationUnread(item, userId, orgId)
      ).length;

      dispatch({
        type: ACTIONS.SET_NOTIFICATION_BADGE,
        payload: unreadCount,
      });
      return unreadCount;
    }
  } catch (error) {
    console.error("Failed to fetch unread notifications count", error);
  }
  return 0;
};
