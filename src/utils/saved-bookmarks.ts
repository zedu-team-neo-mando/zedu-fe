export type Bookmark = {
  id: string;
  thread_id?: string;
  message_id?: string;
};

export const bookmarkKey = (item: Bookmark) =>
  item.message_id ? `reply:${item.message_id}` : `thread:${item.thread_id}`;

let revision = 0;
export const bookmarkRevision = () => revision;
export const nextBookmarkRevision = () => ++revision;

type BookmarkState = {
  orgId?: string | null;
  bookmarks?: Bookmark[];
  bookmarkPending?: Record<string, boolean>;
  bookmarkVersions?: Record<string, number>;
  bookmarkOrgVersion?: number;
};

type Mutation = {
  orgId: string;
  orgVersion: number;
  phase: "load" | "begin" | "finish";
  key?: string;
  value?: Bookmark;
  items?: Bookmark[];
  revision: number;
};

/** Apply one operation to current state, never to a render-time list snapshot. */
export const updateSavedBookmarks = <T extends BookmarkState>(
  state: T,
  mutation: Mutation
): T => {
  if (String(state.orgId || "") !== mutation.orgId) return state;
  if ((state.bookmarkOrgVersion || 0) !== mutation.orgVersion) return state;
  const current = state.bookmarks || [];
  const pending = { ...state.bookmarkPending };
  const versions = { ...state.bookmarkVersions };
  if (mutation.phase === "load") {
    const preserve = (key: string) =>
      pending[key] || (versions[key] || 0) > mutation.revision;
    return {
      ...state,
      bookmarks: [
        ...(mutation.items || []).filter((b) => !preserve(bookmarkKey(b))),
        ...current.filter((b) => preserve(bookmarkKey(b))),
      ],
    };
  }
  if (!mutation.key) return state;
  versions[mutation.key] = mutation.revision;
  if (mutation.phase === "begin") pending[mutation.key] = true;
  else delete pending[mutation.key];
  return {
    ...state,
    bookmarkPending: pending,
    bookmarkVersions: versions,
    bookmarks: [
      ...current.filter((b) => bookmarkKey(b) !== mutation.key),
      ...(mutation.value ? [mutation.value] : []),
    ],
  };
};
