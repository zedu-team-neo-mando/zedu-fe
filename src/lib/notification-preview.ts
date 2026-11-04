// Lets users hide message text in push notifications.
// The page reads the choice from localStorage. The service worker cannot read
// localStorage, so the same value is mirrored into the Cache API.

export const PREVIEW_STORAGE_KEY = "zedu_show_message_previews";
export const PREVIEW_CACHE_NAME = "zedu-notification-prefs";
export const PREVIEW_CACHE_KEY =
  "/__zedu/notification-prefs/show-message-previews";
export const HIDDEN_PREVIEW_TEXT = "New message. Open Zedu to read it.";

/** Previews are on by default so existing behaviour does not change. */
export const getShowMessagePreviews = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(PREVIEW_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
};

export const setShowMessagePreviews = async (value: boolean) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREVIEW_STORAGE_KEY, String(value));
  } catch {
    // Storage can be blocked; fall back to the default.
  }
  if (!("caches" in window)) return;
  try {
    const cache = await caches.open(PREVIEW_CACHE_NAME);
    await cache.put(
      PREVIEW_CACHE_KEY,
      new Response(JSON.stringify({ showPreviews: value }), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    // The service worker falls back to showing previews.
  }
};

/** Returns the text to show in a notification body. */
export const applyPreviewPreference = (body: string, showPreviews: boolean) =>
  showPreviews || !body ? body : HIDDEN_PREVIEW_TEXT;
