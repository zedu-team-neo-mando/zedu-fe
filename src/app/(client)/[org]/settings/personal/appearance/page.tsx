"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import SettingsLabel from "../../components/settings-label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import {
  COLOR_MODE_TO_THEME,
  type ColorMode,
  themeToColorMode,
} from "~/lib/theme";

const COLOR_MODE_OPTIONS: {
  id: ColorMode;
  label: string;
  description: string;
}[] = [
  {
    id: "light",
    label: "Light",
    description: "A bright look for daytime use.",
  },
  {
    id: "dark",
    label: "Dark",
    description: "A darker look that's easier on the eyes.",
  },
  {
    id: "auto",
    label: "Auto",
    description: "Match your computer's appearance.",
  },
];

function WorkspacePreview({ mode }: { mode: "light" | "dark" }) {
  const isDark = mode === "dark";

  return (
    <div
      className="h-[132px] w-full overflow-hidden rounded-lg border"
      style={{
        backgroundColor: isDark ? "#1A1D21" : "#ffffff",
        borderColor: isDark ? "#3F3F42" : "#E6EAEF",
      }}
    >
      <div className="flex h-full">
        <div
          className="flex w-[30%] flex-col gap-1.5 p-2"
          style={{ backgroundColor: "#303073" }}
        >
          <div
            className="h-1.5 w-full rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
          />
          <div
            className="h-1.5 w-3/4 rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
          />
          <div
            className="mt-1 h-1.5 w-5/6 rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="h-1.5 w-2/3 rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-3">
          {[0, 1].map((row) => (
            <div key={row} className="flex items-start gap-2">
              <div
                className="h-5 w-5 shrink-0 rounded"
                style={{ backgroundColor: "#6868F7" }}
              />
              <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
                <div
                  className="h-1.5 w-1/2 rounded-sm"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.28)"
                      : "#D0D5DD",
                  }}
                />
                <div
                  className="h-1.5 w-full rounded-sm"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.12)"
                      : "#EAECF0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const AppearancePage = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorMode = mounted ? themeToColorMode(theme) : "light";

  const handleColorModeChange = (value: ColorMode) => {
    setTheme(COLOR_MODE_TO_THEME[value]);
  };

  return (
    <div className="min-h-screen">
      <SettingsLabel />
      <div className="p-4 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-base font-semibold">Appearance</h1>
          <p className="text-sm text-[#344054]">
            Choose how Zedu looks to you. Select a single color mode, or sync
            with your computer&apos;s appearance.
          </p>
        </div>

        <section className="max-w-2xl">
          <h2 className="mb-1 text-sm font-semibold">Color mode</h2>
          <p className="mb-4 text-sm text-[#667085]">
            Changing this only affects this device.
          </p>

          <RadioGroup
            value={colorMode}
            onValueChange={(value) => handleColorModeChange(value as ColorMode)}
            className="grid gap-3 sm:grid-cols-3"
            aria-label="Color mode"
          >
            {COLOR_MODE_OPTIONS.map((option) => (
              <Label
                key={option.id}
                className={cn(
                  "flex cursor-pointer flex-col gap-2 rounded-xl border p-3 font-normal transition-colors",
                  colorMode === option.id
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    id={`color-mode-${option.id}`}
                    value={option.id}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <p className="text-xs leading-4 text-[#667085]">
                  {option.description}
                </p>
              </Label>
            ))}
          </RadioGroup>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleColorModeChange("light")}
              className={cn(
                "rounded-xl border p-2 text-left transition-colors",
                colorMode === "light"
                  ? "border-primary-500 ring-1 ring-primary-500"
                  : "hover:border-gray-300"
              )}
              aria-label="Use light color mode"
            >
              <WorkspacePreview mode="light" />
              <p className="mt-2 px-1 text-sm font-medium">Light</p>
            </button>
            <button
              type="button"
              onClick={() => handleColorModeChange("dark")}
              className={cn(
                "rounded-xl border p-2 text-left transition-colors",
                colorMode === "dark"
                  ? "border-primary-500 ring-1 ring-primary-500"
                  : "hover:border-gray-300"
              )}
              aria-label="Use dark color mode"
            >
              <WorkspacePreview mode="dark" />
              <p className="mt-2 px-1 text-sm font-medium">Dark</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppearancePage;
