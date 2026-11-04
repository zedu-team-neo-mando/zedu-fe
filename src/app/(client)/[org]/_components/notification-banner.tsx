"use client";

import { BellOff, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { useNotificationStatus } from "~/hooks/useNotificationStatus";
import { NotificationPermissionGuidance } from "~/app/(client)/[org]/_components/notification-permission-guidance";
import { shouldShowNotificationNotice } from "~/app/(client)/[org]/_components/notification-permission";
import { useNotificationDismissal } from "~/app/(client)/[org]/_components/use-notification-dismissal";

export function NotificationBanner() {
  const { permission } = useNotificationStatus();
  const dismissal = useNotificationDismissal();
  if (!shouldShowNotificationNotice(permission, dismissal)) return null;

  return (
    <Collapsible className="shrink-0 border-b border-[#E6EAEF] bg-slate-50 px-3 py-2 text-slate-700 md:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p role="status" className="flex items-center gap-2 text-sm">
          <BellOff aria-hidden="true" className="size-4 shrink-0" />
          Desktop notifications are blocked.
        </p>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="link" size="sm">
            How to enable
          </Button>
        </CollapsibleTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto size-8 shrink-0"
          aria-label="Dismiss notification notice"
          onClick={(event) => {
            dismissal.dismiss();
            event.currentTarget
              .closest("header")
              ?.querySelector<HTMLElement>("h2")
              ?.focus();
          }}
        >
          <X aria-hidden="true" className="size-4" />
        </Button>
      </div>
      <CollapsibleContent className="max-h-[35dvh] overflow-y-auto py-2">
        <NotificationPermissionGuidance />
      </CollapsibleContent>
    </Collapsible>
  );
}
