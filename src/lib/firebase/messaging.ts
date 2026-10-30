"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
} from "firebase/messaging";
import {
  firebaseVapidKey,
  firebaseWebConfig,
  missingFirebaseWebEnv,
} from "~/lib/firebase/config";
import { PostRequest } from "~/utils/new-request";

const SERVICE_WORKER_URL = "/firebase-messaging-sw.js";

export type WebPushSetup = {
  token: string | null;
  messaging: Messaging | null;
  error: string | null;
};

const unregisterOneSignalWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(
    registrations.map((registration) => {
      const scriptUrl =
        registration.active?.scriptURL ||
        registration.installing?.scriptURL ||
        "";
      if (!scriptUrl.includes("OneSignal")) return Promise.resolve(false);
      return registration.unregister();
    })
  );
};

export const setupWebPush = async (): Promise<WebPushSetup> => {
  const missing = missingFirebaseWebEnv();
  if (missing.length > 0) {
    return {
      token: null,
      messaging: null,
      error: `Missing ${missing.join(", ")}`,
    };
  }

  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator)
  ) {
    return {
      token: null,
      messaging: null,
      error: "This browser cannot receive web push",
    };
  }

  const supported = await isSupported();
  if (!supported) {
    return {
      token: null,
      messaging: null,
      error: "Firebase messaging is not supported in this browser",
    };
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();

  if (permission !== "granted") {
    return {
      token: null,
      messaging: null,
      error: "Notification permission was not granted",
    };
  }

  await unregisterOneSignalWorkers();

  const registration = await navigator.serviceWorker.register(
    SERVICE_WORKER_URL,
    {
      scope: "/",
    }
  );
  await navigator.serviceWorker.ready;

  const app: FirebaseApp = getApps()[0] ?? initializeApp(firebaseWebConfig);
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: firebaseVapidKey,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    return { token: null, messaging, error: "Firebase did not return a token" };
  }

  sessionStorage.setItem("fcm_token", token);
  const saved = await PostRequest("/fcmtoken", {
    fcm_token: token,
    platform: "web",
  });
  if (saved?.data?.data?.provider !== "firebase") {
    return {
      token,
      messaging,
      error:
        "Token is ready, but the server did not save it. Restart the API and reload.",
    };
  }

  return { token, messaging, error: null };
};

const showPushNotification = (
  title: string,
  body: string,
  data?: { [key: string]: string }
) => {
  const options = { body, data: data ?? {} };

  if (!("serviceWorker" in navigator)) {
    new Notification(title, { body });
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => registration.showNotification(title, options))
    .catch(() => {
      new Notification(title, { body });
    });
};

export const listenForForegroundMessages = (messaging: Messaging) =>
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || payload.data?.title || "Zedu";
    const body = payload.notification?.body || payload.data?.body || "";

    if (Notification.permission !== "granted") return;

    showPushNotification(title, body, payload.data);
  });
