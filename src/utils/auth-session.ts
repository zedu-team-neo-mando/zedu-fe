import axios from "axios";

let isHandlingSessionExpiry = false;

const REMEMBER_ME_KEY = "rememberMe";
// A cookie without an expiry date is deleted by the browser when it closes,
// and unlike sessionStorage it is shared by every tab.
const BROWSER_SESSION_COOKIE = "zedu_browser_session";

// Saves the "Remember me" / "Stay Signed In" choice made at login or sign-up.
export const saveRememberMe = (remember: boolean) => {
  if (remember) {
    localStorage.removeItem(REMEMBER_ME_KEY);
  } else {
    localStorage.setItem(REMEMBER_ME_KEY, "false");
  }
  document.cookie = `${BROWSER_SESSION_COOKIE}=1; path=/; SameSite=Lax`;
};

// Signs the user out if they chose not to be remembered and the browser has
// been closed since. Returns true when the saved session was cleared.
export const endSessionIfNotRemembered = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  if (localStorage.getItem(REMEMBER_ME_KEY) !== "false") {
    return false;
  }

  const hasBrowserSession = document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === `${BROWSER_SESSION_COOKIE}=1`);
  if (hasBrowserSession) {
    return false;
  }

  localStorage.clear();
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
