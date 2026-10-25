"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ThemeToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      offset={{ top: "80px", right: "24px" }}
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
