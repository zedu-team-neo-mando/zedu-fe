import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import ts from "typescript";

// Node 20 cannot import a .ts file directly, so compile the helper first.
const source = readFileSync(
  new URL("./message-edit.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const encoded = Buffer.from(outputText).toString("base64");
const moduleUrl = `data:text/javascript;base64,${encoded}`;
const { canEditMessage, hasRepliesFromOthers, REPLY_PREVIEW_LIMIT } =
  await import(moduleUrl);

const reply = (user_id) => ({ user_id });

test("a message nobody replied to can be edited by its author", () => {
  const message = { user_id: "me", message_count: 0, messages: [] };
  assert.equal(hasRepliesFromOthers(message), false);
  assert.equal(canEditMessage("me", message), true);
});

test("the author replying twice does not hide editing", () => {
  // Live updates keep one preview per person, but the count goes up to 2.
  const message = { user_id: "me", message_count: 2, messages: [reply("me")] };
  assert.equal(hasRepliesFromOthers(message), false);
  assert.equal(canEditMessage("me", message), true);
});

test("a reply from someone else hides editing", () => {
  const message = {
    user_id: "me",
    message_count: 1,
    messages: [reply("someone-else")],
  };
  assert.equal(hasRepliesFromOthers(message), true);
  assert.equal(canEditMessage("me", message), false);
});

test("a reply count given as text still works", () => {
  const message = {
    user_id: "me",
    message_count: "2",
    messages: [reply("me")],
  };
  assert.equal(hasRepliesFromOthers(message), false);
});

test("a full preview with more replies than it shows hides editing", () => {
  const previews = Array.from({ length: REPLY_PREVIEW_LIMIT }, () =>
    reply("me")
  );
  const message = {
    user_id: "me",
    message_count: REPLY_PREVIEW_LIMIT + 5,
    messages: previews,
  };
  assert.equal(hasRepliesFromOthers(message), true);
});

test("only the author can edit", () => {
  const message = { user_id: "me", message_count: 0, messages: [] };
  assert.equal(canEditMessage("someone-else", message), false);
  assert.equal(canEditMessage(undefined, message), false);
  assert.equal(canEditMessage("me", null), false);
});
