const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const filePath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "(client)",
  "[org]",
  "_components",
  "meeting",
  "buzz-chat.tsx"
);

const source = fs.readFileSync(filePath, "utf8");

test("the message input is only cleared after a successful send", () => {
  assert.match(
    source,
    /if \(res\?\.status === 200 \|\| res\?\.status === 201\) \{\s*setInputValue\(""\);\s*\}/
  );
  assert.equal(source.match(/setInputValue\(""\)/g)?.length, 1);
});

test("a message cannot be sent again while one is sending", () => {
  assert.match(source, /if \(!inputValue\.trim\(\) \|\| isSending\) return;/);
  assert.match(source, /disabled=\{!inputValue\.trim\(\) \|\| isSending\}/);
});

test("the sending state is reset even when the request fails", () => {
  assert.match(source, /finally \{\s*setIsSending\(false\);\s*\}/);
});
