"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CelebrationKey,
  CelebrationTheme,
  getActiveCelebration,
} from "../../_lib/celebrations";

interface CelebrationContextValue {
  celebration: CelebrationTheme | null;
  activeKey: CelebrationKey | "none" | "auto";
  setCelebrationKey: (key: CelebrationKey | "none" | "auto") => void;
  dismissBanner: () => void;
  isDismissed: boolean;
  isLoaded: boolean;
}

const CelebrationContext = createContext<CelebrationContextValue>({
  celebration: null,
  activeKey: "auto",
  setCelebrationKey: () => {},
  dismissBanner: () => {},
  isDismissed: false,
  isLoaded: false,
});

const STORAGE_OVERRIDE_KEY = "zedu_celebration_theme_override";
const STORAGE_DISMISSED_KEY = "zedu_celebration_dismissed_theme";

export const CelebrationThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeKey, setActiveKey] = useState<CelebrationKey | "none" | "auto">(
    "auto"
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Check URL query parameters for QA/marketing preview: ?celebration=christmas
    const params = new URLSearchParams(window.location.search);
    const queryCelebration = params.get("celebration");

    // 2. Check localStorage override
    const storedOverride = localStorage.getItem(STORAGE_OVERRIDE_KEY) as
      | CelebrationKey
      | "none"
      | "auto"
      | null;

    const initialKey: CelebrationKey | "none" | "auto" =
      (queryCelebration as CelebrationKey | "none" | "auto" | null) ||
      storedOverride ||
      "auto";

    setActiveKey(initialKey);

    // 3. Check if user already dismissed this celebration banner in this session
    const resolvedTheme = getActiveCelebration(
      initialKey === "auto" ? null : initialKey
    );
    if (resolvedTheme) {
      const dismissedTheme = localStorage.getItem(STORAGE_DISMISSED_KEY);
      if (dismissedTheme === resolvedTheme.id) {
        setIsDismissed(true);
      }
    }

    setIsLoaded(true);
  }, []);

  const setCelebrationKey = useCallback(
    (key: CelebrationKey | "none" | "auto") => {
      setActiveKey(key);
      setIsDismissed(false);
      try {
        if (key === "auto") {
          localStorage.removeItem(STORAGE_OVERRIDE_KEY);
        } else {
          localStorage.setItem(STORAGE_OVERRIDE_KEY, key);
        }
      } catch {
        // Ignore storage errors in restricted contexts
      }
    },
    []
  );

  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    const resolvedTheme = getActiveCelebration(
      activeKey === "auto" ? null : activeKey
    );
    if (resolvedTheme) {
      try {
        localStorage.setItem(STORAGE_DISMISSED_KEY, resolvedTheme.id);
      } catch {
        // Ignore storage errors in restricted contexts
      }
    }
  }, [activeKey]);

  const celebration = isLoaded
    ? getActiveCelebration(activeKey === "auto" ? null : activeKey)
    : null;

  return (
    <CelebrationContext.Provider
      value={{
        celebration,
        activeKey,
        setCelebrationKey,
        dismissBanner,
        isDismissed,
        isLoaded,
      }}
    >
      {children}
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => useContext(CelebrationContext);
