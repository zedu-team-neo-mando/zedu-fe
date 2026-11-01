const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const pagePath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "(homepage)",
  "products",
  "file-management",
  "page.tsx"
);
const page = fs.readFileSync(pagePath, "utf8");

assert.match(
  page,
  /alt="Zedu file management interface showing course materials, lecture folders, and shared cohort resources"/,
  "The hero image must accurately describe the File Management interface."
);

const h1Count = (page.match(/<h1\b/g) ?? []).length;
const h2Count = (page.match(/<h2\b/g) ?? []).length;

assert.equal(h1Count, 1, "File Management must have one primary H1.");
assert.ok(
  h2Count >= 3,
  "Secondary File Management sections must use H2 headings."
);

console.log("Issue #1127 File Management SEO checks passed.");
