import type { Metadata } from "next";
import React from "react";
import { createPageMetadata } from "~/config/site";

const title = "Sign up for Zedu - Free for Bootcamps, Schools and Cohorts";
const description =
  "Create a free Zedu account and bring your cohort, class or learning community into one organised workspace. No credit card needed.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/auth/sign-up",
});

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
