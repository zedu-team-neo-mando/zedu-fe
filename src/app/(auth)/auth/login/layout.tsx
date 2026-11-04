import { Metadata } from "next";
import { ReactNode } from "react";
import { createPageMetadata } from "~/config/site";

const description =
  "Log in to Zedu to pick up your classes, channels and cohort conversations where you left off, all in one learning workspace.";

export const metadata: Metadata = createPageMetadata({
  title: "Log in to Zedu",
  description,
  path: "/auth/login",
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
