import { Metadata } from "next";
import { ReactNode } from "react";

// One-time step in the auth flow: keep it out of search results.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthStepLayout({ children }: { children: ReactNode }) {
  return children;
}
