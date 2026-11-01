import { NextResponse } from "next/server";
import {
  HIDDEN_PREVIEW_TEXT,
  PREVIEW_CACHE_KEY,
  PREVIEW_CACHE_NAME,
} from "~/lib/notification-preview";

export const dynamic = "force-dynamic";

const firebaseVersion = "12.19.0";

export function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };

  const script = `
importScripts("https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-messaging-compat.js");

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

firebase.initializeApp(${JSON.stringify(config)});

const messaging = firebase.messaging();

const PREVIEW_CACHE_NAME = ${JSON.stringify(PREVIEW_CACHE_NAME)};
const PREVIEW_CACHE_KEY = ${JSON.stringify(PREVIEW_CACHE_KEY)};
const HIDDEN_PREVIEW_TEXT = ${JSON.stringify(HIDDEN_PREVIEW_TEXT)};

// Reads the "Show message previews" setting saved by the page.
// Defaults to showing previews if nothing is saved.
async function showMessagePreviews() {
  try {
    const cache = await caches.open(PREVIEW_CACHE_NAME);
    const response = await cache.match(PREVIEW_CACHE_KEY);
    if (!response) return true;
    const data = await response.json();
    return data.showPreviews !== false;
  } catch (error) {
    return true;
  }
}

messaging.onBackgroundMessage(async (payload) => {
  const title = payload.notification?.title || payload.data?.title || "Zedu";
  const rawBody = payload.notification?.body || payload.data?.body || "";
  const body =
    rawBody && !(await showMessagePreviews()) ? HIDDEN_PREVIEW_TEXT : rawBody;

  return self.registration.showNotification(title, {
    body,
    data: payload.data || {},
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const existing = clientList.find((client) => "focus" in client);
      if (existing) return existing.focus();
      return self.clients.openWindow("/");
    })
  );
});
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  });
}
