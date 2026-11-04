export type Shortcut = {
  /** Keys without the modifier, for example ["K"]. */
  keys: string[];
  /** Shown with Cmd on a Mac and Ctrl everywhere else. */
  mod?: boolean;
  shift?: boolean;
  description: string;
};

export type ShortcutGroup = {
  title: string;
  shortcuts: Shortcut[];
};

/** Only shortcuts that work in the app today. */
export const shortcutGroups: ShortcutGroup[] = [
  {
    title: "General",
    shortcuts: [
      { keys: ["K"], mod: true, description: "Search" },
      { keys: ["/"], mod: true, description: "Show keyboard shortcuts" },
      { keys: ["Esc"], description: "Close a window" },
    ],
  },
  {
    title: "Message box",
    shortcuts: [
      { keys: ["Enter"], description: "Send the message" },
      { keys: ["Shift", "Enter"], description: "New line" },
      { keys: ["B"], mod: true, description: "Bold" },
      { keys: ["I"], mod: true, description: "Italic" },
      { keys: ["S"], mod: true, shift: true, description: "Strikethrough" },
      { keys: ["Z"], mod: true, description: "Undo" },
    ],
  },
  {
    title: "Files",
    shortcuts: [
      {
        keys: ["A"],
        mod: true,
        description: "Select all files (when selecting several)",
      },
    ],
  },
];

/** The keys to show for a shortcut, with the right modifier for this computer. */
export function shortcutKeys(shortcut: Shortcut, isMac: boolean): string[] {
  const keys = [...shortcut.keys];
  if (shortcut.shift && !keys.includes("Shift")) keys.unshift("Shift");
  if (shortcut.mod) keys.unshift(isMac ? "Cmd" : "Ctrl");
  return keys;
}
