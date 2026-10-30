"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { shortcutGroups, shortcutKeys } from "./shortcuts";

// The profile menu button, used when the element that opened the window (a menu
// item) is gone from the page once the menu closes.
export const PROFILE_MENU_TRIGGER_ID = "profile-trigger";

type KeyboardShortcutsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const KeyboardShortcutsModal = ({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) => {
  const [isMac, setIsMac] = useState(false);
  // Whatever had focus when the window opened (the menu item, or the page for
  // the keyboard shortcut), so focus can go back there on close.
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open && !openerRef.current) {
      openerRef.current = document.activeElement as HTMLElement | null;
    }
  }, [open]);

  useEffect(() => {
    setIsMac(/mac/i.test(navigator.platform));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto sm:max-w-[520px]"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const opener = openerRef.current;
          const target =
            opener && opener.isConnected
              ? opener
              : document.getElementById(PROFILE_MENU_TRIGGER_ID);
          target?.focus();
          openerRef.current = null;
        }}
      >
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {shortcutGroups.map((group) => (
            <section key={group.title} aria-label={group.title}>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                {group.title}
              </h3>
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {group.shortcuts.map((shortcut) => (
                  <li
                    key={shortcut.description}
                    className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                  >
                    <span className="text-gray-700">
                      {shortcut.description}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {shortcutKeys(shortcut, isMac).map((key) => (
                        <kbd
                          key={key}
                          className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-700"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
