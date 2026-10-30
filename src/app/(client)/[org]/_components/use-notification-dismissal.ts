"use client";

import { useContext, useEffect, useReducer } from "react";
import { DataContext } from "~/store/GlobalState";
import {
  createNotificationDismissal,
  type DismissalSnapshot,
  getDismissalState,
} from "~/app/(client)/[org]/_components/notification-permission";

const dismissal = createNotificationDismissal(() =>
  typeof window === "undefined" ? undefined : window.sessionStorage
);

export function useNotificationDismissal() {
  const { state } = useContext(DataContext);
  const userId = state?.user?.user_id ?? state?.user?.id;
  const accountId = userId ? String(userId) : null;
  const [snapshot, update] = useReducer(
    (_: DismissalSnapshot | null, next: DismissalSnapshot) => next,
    null
  );
  useEffect(() => {
    update({ accountId, dismissed: dismissal.read(accountId) });
  }, [accountId]);
  return {
    ...getDismissalState(accountId, snapshot),
    dismiss: () => {
      dismissal.dismiss(accountId);
      update({ accountId, dismissed: dismissal.read(accountId) });
    },
  };
}
