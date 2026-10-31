// Unsent message box text, kept in localStorage per conversation so it
// survives switching channels and reloading the page.
export const MESSAGE_DRAFTS_KEY = "zedu:message-drafts";

function readMessageDrafts(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(MESSAGE_DRAFTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
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
