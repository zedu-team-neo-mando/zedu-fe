const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const layoutPath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "(client)",
  "[org]",
  "client-layout.tsx"
);
const layout = fs.readFileSync(layoutPath, "utf8");

assert.match(
  layout,
  /state\.showUserProfile \? "sm:mr-\[408px\]" : ""/,
  "The page content must reserve the profile drawer width on tablet and desktop screens."
);
assert.match(
  layout,
  /\{children\}\s*<UserSidebar \/>/,
  "The profile drawer must remain within the adjusted content container."
);

console.log("Issue #397 profile drawer layout checks passed.");
