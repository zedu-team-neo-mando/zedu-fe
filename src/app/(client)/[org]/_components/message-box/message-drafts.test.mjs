import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Node 20 cannot import a .ts file directly, so compile the helper first.
const source = readFileSync(
  new URL("./message-drafts.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const {
  MESSAGE_DRAFTS_KEY,
  saveMessageDraft,
  loadMessageDraft,
  clearMessageDraft,
  finishMessageDraftSend,
  messageDraftKey,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

// A minimal in-memory localStorage, since node has no window.
const store = new Map();
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};

beforeEach(() => store.clear());

test("keeps unsent text for a conversation", () => {
  saveMessageDraft("conversation:a", "<p>hello</p>", false);
  assert.equal(loadMessageDraft("conversation:a"), "<p>hello</p>");
});

test("a sent message does not come back after a reload", () => {
  // Typing saves the draft on every editor update.
  saveMessageDraft("conversation:a", "<p>hello</p>", false);
  // Sending clears the editor without an update event, so the message box
  // clears the saved draft itself.
  clearMessageDraft("conversation:a");
  // A reload reads the draft from storage again.
  assert.equal(loadMessageDraft("conversation:a"), "");
  assert.deepEqual(JSON.parse(store.get(MESSAGE_DRAFTS_KEY)), {});
});

test("sending in one conversation keeps another conversation's draft", () => {
  saveMessageDraft("conversation:a", "<p>sent</p>", false);
  saveMessageDraft("conversation:b", "<p>unsent</p>", false);
  clearMessageDraft("conversation:a");
  assert.equal(loadMessageDraft("conversation:a"), "");
  assert.equal(loadMessageDraft("conversation:b"), "<p>unsent</p>");
});

test("clearing a conversation with no draft changes nothing", () => {
  clearMessageDraft("conversation:a");
  assert.equal(store.has(MESSAGE_DRAFTS_KEY), false);
});

test("ignores a corrupt saved value", () => {
  store.set(MESSAGE_DRAFTS_KEY, "{not json");
  assert.equal(loadMessageDraft("conversation:a"), "");
});

test("a failed send after navigation preserves the unsent message", () => {
  finishMessageDraftSend("conversation:a", "<p>retry me</p>", false);
  assert.equal(loadMessageDraft("conversation:a"), "<p>retry me</p>");
  saveMessageDraft("conversation:a", "<p>newer text</p>", false);
  finishMessageDraftSend("conversation:a", "<p>retry me</p>", false);
  finishMessageDraftSend("conversation:a", "<p>retry me</p>", true);
  assert.equal(loadMessageDraft("conversation:a"), "<p>newer text</p>");
});

test("isolates drafts by account, organisation and conversation", () => {
  const key = messageDraftKey("alice", "school", "conversation:a");
  saveMessageDraft(key, "<p>private draft</p>", false);
  assert.equal(
    loadMessageDraft(messageDraftKey("bob", "school", "conversation:a")),
    ""
  );
  assert.equal(
    loadMessageDraft(messageDraftKey("alice", "other", "conversation:a")),
    ""
  );
  assert.equal(loadMessageDraft(key), "<p>private draft</p>");
  assert.equal(messageDraftKey("", "school", "conversation:a"), "");
});

test("ignores non-text draft values and array-shaped storage", () => {
  store.set(
    MESSAGE_DRAFTS_KEY,
    JSON.stringify({ bad: { text: "oops" }, good: "<p>ok</p>" })
  );
  assert.equal(loadMessageDraft("bad"), "");
  assert.equal(loadMessageDraft("good"), "<p>ok</p>");
  store.set(MESSAGE_DRAFTS_KEY, JSON.stringify(["not a draft map"]));
  assert.equal(loadMessageDraft("0"), "");
});
