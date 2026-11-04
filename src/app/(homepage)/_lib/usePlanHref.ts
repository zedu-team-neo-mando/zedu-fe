"use client";

import { useEffect, useState } from "react";

/**
 * The billing page lives under the viewer's org, so the Pro plan target can
 * only be resolved after mount. Falls back to sign-up for signed-out visitors.
 */
export function usePlanHref() {
  const [planHref, setPlanHref] = useState("/auth/sign-up");

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const orgSlug = window.localStorage.getItem("orgSlug");
    setPlanHref(
      token && orgSlug
        ? `/${orgSlug}/settings/organisation/billing/all-plans`
        : "/auth/sign-up"
    );
  }, []);

  return planHref;
}
