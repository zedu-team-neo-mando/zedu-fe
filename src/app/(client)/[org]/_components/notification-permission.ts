export type NotificationState = NotificationPermission | "unsupported";
export type Browser = "chrome" | "edge" | "firefox" | "safari" | "other";

export function shouldShowNotificationNotice(
  permission: NotificationState,
  dismissal: { ready: boolean; dismissed: boolean }
) {
  return permission === "denied" && dismissal.ready && !dismissal.dismissed;
}

export function getGuidanceBrowser(userAgent: string): Browser {
  if (
    /android|ip(hone|ad|od)|opr\/|opera|samsungbrowser|vivaldi/i.test(userAgent)
  ) {
    return "other";
  }
  if (/edg\//i.test(userAgent)) return "edge";
  if (/firefox\//i.test(userAgent)) return "firefox";
  if (/chrome\//i.test(userAgent)) return "chrome";
  if (/safari\//i.test(userAgent)) return "safari";
  return "other";
}

export const notificationGuidance: Record<Browser, string[]> = {
  chrome: [
    "Open the site controls icon to the left of the address bar, then Site settings.",
    "Find Notifications and choose Allow for this site.",
  ],
  edge: [
    "Open the site information icon to the left of the address bar, then Permissions for this site.",
    "Find Notifications and choose Allow for this site.",
  ],
  firefox: [
    "Open Firefox Settings, then Privacy & Security.",
    "Under Permissions, open Settings next to Notifications and allow this site.",
  ],
  safari: [
    "Open Safari Settings, then Websites and Notifications.",
    "Find this site and choose Allow.",
  ],
  other: [
    "Open your browser's site permissions or notification settings.",
    "Find this site and allow notifications if your browser supports them.",
  ],
};

export type DismissalSnapshot = {
  accountId: string | null;
  dismissed: boolean;
};

export function getDismissalState(
  accountId: string | null,
  snapshot: DismissalSnapshot | null
) {
  if (!accountId || snapshot?.accountId !== accountId) {
    return { ready: false, dismissed: false };
  }
  return { ready: true, dismissed: snapshot.dismissed };
}

export function createNotificationDismissal(
  getStorage: () => Pick<Storage, "getItem" | "setItem"> | undefined
) {
  const memory = new Set<string>();
  const keyFor = (accountId: string) =>
    `zedu:notification-notice-dismissed:${encodeURIComponent(accountId)}`;
  return {
    read(accountId: string | null) {
      if (!accountId) return false;
      const key = keyFor(accountId);
      if (memory.has(key)) return true;
      try {
        return getStorage()?.getItem(key) === "1";
      } catch {
        return false;
      }
    },
    dismiss(accountId: string | null) {
      if (!accountId) return;
      const key = keyFor(accountId);
      memory.add(key);
      try {
        getStorage()?.setItem(key, "1");
      } catch {
        // Preserve dismissal in this document when session storage is blocked.
      }
    },
  };
}
