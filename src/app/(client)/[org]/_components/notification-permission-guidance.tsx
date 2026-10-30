"use client";

import {
  type Browser,
  getGuidanceBrowser,
  notificationGuidance,
} from "~/app/(client)/[org]/_components/notification-permission";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { useEffect, useState } from "react";

export function NotificationPermissionGuidance() {
  const [browser, setBrowser] = useState<Browser>("other");
  useEffect(() => {
    setBrowser(getGuidanceBrowser(navigator.userAgent));
  }, []);
  return (
    <div className="space-y-2 text-sm">
      <p>
        Your browser controls notification permission. Zedu cannot change a
        blocked permission for you.
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        {notificationGuidance[browser].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p>Return to Zedu after changing the permission to check its status.</p>
    </div>
  );
}

export function NotificationPermissionHelp() {
  return (
    <section aria-label="Browser notification permissions" className="mb-4">
      <h2 className="text-sm font-semibold">Browser notifications</h2>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="link" className="px-0">
            How to enable
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <NotificationPermissionGuidance />
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
