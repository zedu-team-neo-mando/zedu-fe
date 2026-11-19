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
  "reply-card",
  "index.tsx"
);

const source = fs.readFileSync(filePath, "utf8");

test("reply count label uses the singular for one reply", () => {
  assert.match(
    source,
    /\{totalReplies\} \{totalReplies === 1 \? "reply" : "replies"\}/
  );
});

test("reply count label is never hardcoded to the plural", () => {
  assert.doesNotMatch(source, /\{totalReplies\} replies/);
});
