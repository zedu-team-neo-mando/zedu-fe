"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PageVisitsWebhook } from "~/utils/webhook-request";
import { ipifyUrl } from "~/lib/env-urls";

const TWO_HOURS = 2 * 60 * 60 * 1000;

export const getStoredUser = (): {
  username?: string;
  email?: string;
} | null => {
  try {
    const userData =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!userData) return null;
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const getVisitorId = (): string => {
  try {
    let id =
      typeof window !== "undefined" ? localStorage.getItem("visitor_id") : null;
    if (!id) {
      id = crypto.randomUUID();
      if (typeof window !== "undefined") {
        localStorage.setItem("visitor_id", id);
      }
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
};

export const getLastVisit = (): number | null => {
  try {
    const value =
      typeof window !== "undefined"
        ? localStorage.getItem("last_visit_time")
        : null;
    return value ? parseInt(value, 10) : null;
  } catch {
    return null;
  }
};

export const setLastVisit = (time: number) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("last_visit_time", time.toString());
    }
  } catch {
    // Ignore storage quota or access errors
  }
};

export const useVisitTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorId = getVisitorId();
        const user = getStoredUser();
        const username = user?.username || user?.email || `guest_${visitorId}`;
        const now = Date.now();
        const lastVisit = getLastVisit();
        const fullVisitAllowed = !lastVisit || now - lastVisit > TWO_HOURS;

        const event_name = fullVisitAllowed ? "visit" : "page_view";
        const status = "success";

        // Collect extended metadata
        const ip = await fetch(ipifyUrl())
          .then((res) => res.json())
          .then((data) => data.ip)
          .catch(() => "unknown");

        const message = `
                    🔹 URL: ${window.location.href}\\n
                    🔹 Path: ${pathname}\\n
                    🔹 Username: ${username}\\n
                    🔹 Browser: ${navigator.userAgent}\\n
                    🔹 Referrer: ${document.referrer || "Direct visit"}\\n
                    🔹 IP: ${ip}\\n
                    🔹 Visitor ID: ${visitorId}\\n
                    `;

        await PageVisitsWebhook(username, event_name, message.trim(), status);

        if (fullVisitAllowed) setLastVisit(now);
      } catch (err) {
        console.error("Visit tracking failed:", err);
      }
    };

    trackVisit();
  }, [pathname]);
};
