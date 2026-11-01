"use client";

import { useCallback, useContext, useEffect } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import {
  DeleteSavedMessage,
  GetRequest,
  SaveMessage,
} from "~/utils/new-request";
import { showError } from "~/components/toast/sonner";

/**
 * One saved-for-later item. `id` is the saved item's own id, which the
 * DELETE /organisations/:org_id/saved/message/:smId route expects.
 * A saved thread message carries `thread_id`; a saved reply carries
 * `message_id` (its thread_id is the parent's, so it is left out to keep the
 * parent message from looking saved).
 */
export type Bookmark = {
  id: string;
  thread_id?: string;
  message_id?: string;
};

type SavedMessage = {
  id?: string;
  type?: string;
  thread_id?: string;
  message_id?: string | null;
};

const isOk = (res: any) => res?.status === 200 || res?.status === 201;

const toBookmarks = (items: unknown): Bookmark[] =>
  Array.isArray(items)
    ? (items as SavedMessage[])
        .filter((item) => item?.id)
        .map((item) =>
          item.type === "thread"
            ? { id: item.id as string, thread_id: item.thread_id }
            : {
                id: item.id as string,
                message_id: item.message_id ?? undefined,
              }
        )
    : [];

const getOrgId = (stateOrgId?: string) =>
  stateOrgId ||
  (typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "");

const SAVE_ERROR = "Could not save this message. Please try again.";
const REMOVE_ERROR =
  "Could not remove this message from Saved for Later. Please try again.";

/** Loads the user's saved-for-later items into `state.bookmarks`. */
export const useLoadSavedMessages = (
  orgId: string,
  { enabled = true }: { enabled?: boolean } = {}
) => {
  const { dispatch } = useContext(DataContext);

  useEffect(() => {
    if (!enabled || !orgId) return;
    let active = true;

    GetRequest(`/organisations/${orgId}/saved/message`).then((res: any) => {
      if (active && isOk(res)) {
        dispatch({
          type: ACTIONS.BOOKMARKS,
          payload: toBookmarks(res?.data?.data),
        });
      }
    });

    return () => {
      active = false;
    };
  }, [orgId, enabled, dispatch]);
};

/** Save / remove actions for a channel message or a reply. */
export const useSavedMessageActions = () => {
  const { state, dispatch } = useContext(DataContext);
  const bookmarks: Bookmark[] = state?.bookmarks || [];
  const orgId = getOrgId(state?.orgId);

  const setBookmarks = useCallback(
    (next: Bookmark[]) => dispatch({ type: ACTIONS.BOOKMARKS, payload: next }),
    [dispatch]
  );

  // The save route is a toggle, so when the server reply doesn't match what
  // we expected, re-read the saved list instead of guessing.
  const reload = useCallback(async () => {
    const res = await GetRequest(`/organisations/${orgId}/saved/message`);
    if (isOk(res)) setBookmarks(toBookmarks(res?.data?.data));
  }, [orgId, setBookmarks]);

  const isThreadSaved = (threadId?: string) =>
    !!threadId && bookmarks.some((b) => b.thread_id === threadId);

  const isReplySaved = (messageId?: string) =>
    !!messageId && bookmarks.some((b) => b.message_id === messageId);

  const save = async (
    url: string,
    payload: Record<string, unknown>,
    match: (b: Bookmark) => boolean,
    pending: Bookmark
  ) => {
    const previous = bookmarks;
    setBookmarks([...previous.filter((b) => !match(b)), pending]);

    const res = await SaveMessage(`/organisations/${orgId}/${url}`, payload);
    const savedId = res?.data?.data?.id;

    if (isOk(res) && savedId) {
      setBookmarks([
        ...previous.filter((b) => !match(b)),
        { ...pending, id: savedId },
      ]);
    } else if (isOk(res)) {
      await reload();
    } else {
      setBookmarks(previous);
      showError(SAVE_ERROR);
    }
  };

  const remove = async (match: (b: Bookmark) => boolean) => {
    const previous = bookmarks;
    const bookmark = previous.find(match);
    setBookmarks(previous.filter((b) => !match(b)));

    if (!bookmark?.id) {
      await reload();
      return;
    }

    const res = await DeleteSavedMessage(
      `/organisations/${orgId}/saved/message/${bookmark.id}`
    );

    if (!isOk(res)) {
      setBookmarks(previous);
      showError(REMOVE_ERROR);
    }
  };

  const saveThread = (item: { thread_id: string; channels_id?: string }) =>
    save(
      "thread/save",
      {
        channels_id: item.channels_id,
        thread_id: item.thread_id,
        type: "message",
      },
      (b) => b.thread_id === item.thread_id,
      { id: "", thread_id: item.thread_id }
    );

  const removeThread = (threadId: string) =>
    remove((b) => b.thread_id === threadId);

  const saveReply = (item: {
    id: string;
    thread_id: string;
    channels_id: string;
  }) =>
    save(
      "message/save",
      {
        channels_id: item.channels_id,
        message_id: item.id,
        thread_id: item.thread_id,
      },
      (b) => b.message_id === item.id,
      { id: "", message_id: item.id }
    );

  const removeReply = (messageId: string) =>
    remove((b) => b.message_id === messageId);

  return {
    isThreadSaved,
    isReplySaved,
    saveThread,
    removeThread,
    saveReply,
    removeReply,
  };
};
