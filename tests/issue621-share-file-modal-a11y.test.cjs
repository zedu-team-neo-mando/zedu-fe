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
  "ChannelMessage",
  "share-file-modal.tsx"
);

const source = fs.readFileSync(filePath, "utf8");

test("recipient search input has an accessible name", () => {
  assert.match(
    source,
    /placeholder="Search for channel or person"\s+aria-label="Search for channel or person"/
  );
});

test("recipient buttons expose their selected state", () => {
  assert.match(
    source,
    /type="button"\s+aria-pressed=\{selected\?\.key === recipient\.key\}/
  );
});
