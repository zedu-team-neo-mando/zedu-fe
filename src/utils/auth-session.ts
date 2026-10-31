import axios from "axios";

let isHandlingSessionExpiry = false;

const REMEMBER_ME_KEY = "rememberMe";
// The user the "not remembered" choice was made for, read from the token's
// user_id claim. The token itself changes during a session (switching
// workspace, creating an organisation and onboarding all issue a new one), so
// the choice is bound to the user, not to a token. A login as a different user
// (an invitation, a magic link, a buzz recorder link) makes an old flag stale.
const REMEMBER_ME_USER_KEY = "rememberMeUser";
// Earlier builds stored the token here; only read to migrate old flags.
const LEGACY_REMEMBER_ME_TOKEN_KEY = "rememberMeToken";
const LAST_ACTIVE_KEY = "rememberMeLastActive";
// A cookie without an expiry date is deleted by the browser when it closes,
// and unlike sessionStorage it is shared by every tab.
const BROWSER_SESSION_COOKIE = "zedu_browser_session";
// Browsers that restore the previous session also restore session cookies, so
// a session that is not remembered also ends after this much inactivity.
const NOT_REMEMBERED_IDLE_LIMIT_MS = 12 * 60 * 60 * 1000;

// Only the signed-in session is removed; preferences such as the colour mode,
// recent searches and the selected template are kept.
const SESSION_KEYS = [
  "token",
  "user",
  "useremail",
  "orgId",
  "orgSlug",
  "channelId",
  "channelName",
];

const clearRememberMeFlags = () => {
  localStorage.removeItem(REMEMBER_ME_KEY);
  localStorage.removeItem(REMEMBER_ME_USER_KEY);
  localStorage.removeItem(LEGACY_REMEMBER_ME_TOKEN_KEY);
  localStorage.removeItem(LAST_ACTIVE_KEY);
};

// Reads the user_id claim from a JWT without verifying it. It is only used to
// tell whether two tokens belong to the same user; the API still verifies
// every request. Returns null for anything that is not a readable JWT.
const tokenUserId = (token: string | null): string | null => {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const claims = JSON.parse(atob(padded));
    const userId = claims?.user_id;
    return typeof userId === "string" && userId ? userId : null;
  } catch {
    return null;
  }
};

const hasBrowserSessionCookie = () =>
  document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === `${BROWSER_SESSION_COOKIE}=1`);

// Removes the signed-in session from this browser without touching unrelated
// preferences.
export const clearStoredSession = () => {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  clearRememberMeFlags();
  try {
    sessionStorage.removeItem("pending_org");
  } catch {
    // sessionStorage can be unavailable (private mode); nothing to clear.
  }
  document.cookie = `${BROWSER_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};

// Saves the "Remember me" / "Stay Signed In" choice made at login or sign-up.
// Call it after the new token has been stored.
export const saveRememberMe = (remember: boolean) => {
  clearRememberMeFlags();
  if (!remember) {
    localStorage.setItem(REMEMBER_ME_KEY, "false");
    localStorage.setItem(
      REMEMBER_ME_USER_KEY,
      tokenUserId(localStorage.getItem("token")) ?? ""
    );
    localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
  }
  document.cookie = `${BROWSER_SESSION_COOKIE}=1; path=/; SameSite=Lax`;
};

// Signs the user out if they chose not to be remembered and either the
// browser has been closed since or the session has been idle too long.
// Returns true when the saved session was cleared.
export const endSessionIfNotRemembered = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  if (localStorage.getItem(REMEMBER_ME_KEY) !== "false") {
    return false;
  }

  const token = localStorage.getItem("token");
  const userId = tokenUserId(token);

  // Flags saved by an earlier build hold the token instead of the user.
  const legacyToken = localStorage.getItem(LEGACY_REMEMBER_ME_TOKEN_KEY);
  if (legacyToken !== null) {
    localStorage.removeItem(LEGACY_REMEMBER_ME_TOKEN_KEY);
    if (token && token === legacyToken && userId) {
      localStorage.setItem(REMEMBER_ME_USER_KEY, userId);
    }
  }

  if (!userId || userId !== localStorage.getItem(REMEMBER_ME_USER_KEY)) {
    // The choice belongs to another user's session; the current one was
    // created another way and is not ended by it.
    clearRememberMeFlags();
    return false;
  }

  const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY));
  const idleTooLong =
    !Number.isFinite(lastActive) ||
    Date.now() - lastActive > NOT_REMEMBERED_IDLE_LIMIT_MS;

  if (hasBrowserSessionCookie() && !idleTooLong) {
    localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    return false;
  }

  clearStoredSession();
  return true;
};

export const isUnauthorizedResponse = (errorOrResponse: unknown): boolean => {
  if (!errorOrResponse || typeof errorOrResponse !== "object") {
    return false;
  }

  const value = errorOrResponse as {
    status?: number;
    response?: {
      status?: number;
      data?: { status_code?: number };
    };
    data?: { status_code?: number };
  };

  return (
    value.status === 401 ||
    value.response?.status === 401 ||
    value.response?.data?.status_code === 401 ||
    value.data?.status_code === 401
  );
};

export const handleSessionExpired = () => {
  if (typeof window === "undefined" || isHandlingSessionExpiry) {
    return;
  }

  if (window.location.pathname.startsWith("/auth")) {
    return;
  }

  isHandlingSessionExpiry = true;

  const currentFullUrl = `${window.location.pathname}${window.location.search}`;
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentFullUrl)}`;

  try {
    sessionStorage.removeItem("pending_org");
  } catch {
    // ignore
  }
  localStorage.clear();
  window.location.href = loginUrl;
};

export const handleUnauthorizedIfNeeded = (
  errorOrResponse: unknown
): boolean => {
  if (!isUnauthorizedResponse(errorOrResponse)) {
    return false;
  }

  handleSessionExpired();
  return true;
};

export const setupAxiosAuthInterceptor = () => {
  if (typeof window === "undefined") {
    return;
  }

  axios.interceptors.response.use(
    (response) => {
      if (response?.data?.status_code === 401) {
        handleSessionExpired();
      }
      return response;
    },
    (error) => {
      if (isUnauthorizedResponse(error)) {
        handleSessionExpired();
      }
      return Promise.reject(error);
    }
  );
};
