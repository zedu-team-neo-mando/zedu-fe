"use client";

import { useEffect } from "react";
import {
  listenForForegroundMessages,
  setupWebPush,
} from "~/lib/firebase/messaging";

export default function FirebasePush() {
  useEffect(() => {
    let unsubscribe = () => {};
    let active = true;

    const start = async () => {
      const result = await setupWebPush();
      if (!active || !result.messaging) return;
      unsubscribe = listenForForegroundMessages(result.messaging);
    };

    start().catch((error: unknown) => {
      console.error("Failed to start Firebase push", error);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return null;
}
