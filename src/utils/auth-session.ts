import axios from "axios";

let isHandlingSessionExpiry = false;

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
