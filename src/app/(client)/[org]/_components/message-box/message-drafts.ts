// Unsent message box text, kept in localStorage per conversation so it
// survives switching channels and reloading the page.
export const MESSAGE_DRAFTS_KEY = "zedu:message-drafts";

function readMessageDrafts(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(MESSAGE_DRAFTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string"
      )
    );
  } catch {
    return {};
  }
}

export function saveMessageDraft(key: string, html: string, empty: boolean) {
  if (!key || typeof window === "undefined") return;
  const drafts = readMessageDrafts();
  if (empty) {
    if (!(key in drafts)) return;
    delete drafts[key];
  } else {
    drafts[key] = html;
  }
  try {
    localStorage.setItem(MESSAGE_DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // Storage is full or blocked; the draft just isn't kept.
  }
}

export function loadMessageDraft(key: string) {
  return readMessageDrafts()[key] || "";
}

export function clearMessageDraft(key: string) {
  saveMessageDraft(key, "", true);
}

// Reconcile a send that finished after its conversation was closed. A newer
// draft always wins, whether the old send succeeded or failed.
export function finishMessageDraftSend(
  key: string,
  html: string,
  sent: boolean
) {
  const current = loadMessageDraft(key);
  if (sent && current === html) clearMessageDraft(key);
  if (!sent && !current) saveMessageDraft(key, html, false);
}

// Never restore another account's drafts on a shared browser. Legacy unscoped
// drafts cannot be safely assigned to a user and are intentionally not imported.
export function messageDraftKey(
  userId: string,
  org: string,
  conversation: string
) {
  return userId && org && conversation
    ? JSON.stringify([userId, org, conversation])
    : "";
}
