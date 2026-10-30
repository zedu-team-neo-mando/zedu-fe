"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { DataContext, DataProvider } from "~/store/GlobalState";

import { getLoggedInRedirectPath } from "~/utils/auth-redirect";
import { endSessionIfNotRemembered } from "~/utils/auth-session";

/**
 * Root authentication layout providing OAuth context and onboarding redirects.
 * @param props Layout component properties containing child elements.
 * @returns Rendered authentication layout tree.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { state } = useContext(DataContext);
  const { orgSlug } = state;

  useEffect(() => {
    (async () => {
      const urlTemplate = new URLSearchParams(window.location.search).get(
        "template"
      );
      endSessionIfNotRemembered();
      if (urlTemplate) {
        localStorage.setItem("selected_template", urlTemplate);
      }
      const t = urlTemplate;
      const token = localStorage.getItem("token");
      if (token) {
        const r = getLoggedInRedirectPath(orgSlug, t);
        if (r) return router.replace(r);
      }
      setLoading(false);
    })();
  }, [orgSlug, router]);

  if (loading) return;

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <DataProvider>{children}</DataProvider>
    </GoogleOAuthProvider>
  );
}
