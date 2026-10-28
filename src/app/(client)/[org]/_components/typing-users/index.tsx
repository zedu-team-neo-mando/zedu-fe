"use client";
import React, { useContext, useEffect } from "react";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";

const TYPING_EXPIRE_MS = 4000;

type TypingUsersProps = {
  /** "channel" reads the channel/DM list, "thread" reads the open thread's list. */
  scope?: "channel" | "thread";
};

const TypingUsers = ({ scope = "channel" }: TypingUsersProps) => {
  const { state, dispatch } = useContext(DataContext);
  const isThread = scope === "thread";
  const userTyping = isThread ? state.threadTyping : state.userTyping;
  const typingAction = isThread ? ACTIONS.THREAD_TYPING : ACTIONS.USER_TYPING;

  useEffect(() => {
    if (!userTyping?.length) return;

    const interval = setInterval(() => {
      const now = Date.now();
      userTyping.forEach((typer: any) => {
        if (now - (typer?.at || 0) > TYPING_EXPIRE_MS) {
          dispatch({
            type: typingAction,
            payload: { userId: typer.id, typing: false },
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userTyping, dispatch, typingAction]);

  if (!userTyping?.length) return null;

  const names = userTyping
    .map((typer: any) => (typeof typer === "string" ? typer : typer?.username))
    .filter(Boolean);

  if (!names.length) return null;

  let label = "";
  if (names.length === 1) {
    label = `${names[0]} is typing…`;
  } else if (names.length === 2) {
    label = `${names[0]} and ${names[1]} are typing…`;
  } else {
    label = "Several people are typing…";
  }

  return (
    <p className="absolute -bottom-2 left-0 pointer-events-none mt-1.5 truncate px-1 text-xs leading-4 text-[#667085] dark:text-zinc-400">
      {label}
    </p>
  );
};

export default TypingUsers;
