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
  "file-management",
  "delete-file-modal.tsx"
);

const source = fs.readFileSync(filePath, "utf8");

test("removes ungrammatical hardcoded 'of My files' phrasing", () => {
  assert.equal(
    source.includes("of My files"),
    false,
    "The broken phrase 'of My files' should not be present in the modal"
  );
});

test("calculates isPermanent based on Deleted Files viewType", () => {
  assert.match(
    source,
    /const isPermanent = viewType === "Deleted Files";/,
    "isPermanent should be derived from viewType"
  );
});

test("renders dynamic title distinguishing permanent vs soft deletion", () => {
  assert.match(
    source,
    /\{isPermanent \? "Delete file permanently\?" : "Delete file\?"\}/,
    "Dialog title should adapt to permanent vs soft deletion"
  );
});

test("renders permanent deletion warning stating it cannot be undone", () => {
  assert.match(
    source,
    /permanently delete/,
    "Permanent deletion should explicitly say 'permanently delete'"
  );
  assert.match(
    source,
    /This\s+cannot\s+be undone\./,
    "Permanent deletion warning should state 'This cannot be undone.'"
  );
});

test("renders soft deletion restoration guidance", () => {
  assert.match(
    source,
    /restore it from the Deleted Files section\./,
    "Soft deletion should inform user they can restore from Deleted Files"
  );
});

test("renders accurate action button labels for permanent and soft deletion", () => {
  assert.match(
    source,
    /Delete permanently/,
    "Button should support 'Delete permanently'"
  );
  assert.match(
    source,
    /Move to trash/,
    "Button should support 'Move to trash'"
  );
});
