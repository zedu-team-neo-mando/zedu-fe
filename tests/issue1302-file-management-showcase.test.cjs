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

// 1. Verify Channels card icon is messaging-system.png
assert.match(
  page,
  /title:\s*"Channels"[\s\S]*?icon:\s*"\/images\/homepage\/icons\/messaging-system\.png"/,
  "The Channels feature card must use '/images/homepage/icons/messaging-system.png'."
);

assert.doesNotMatch(
  page,
  /title:\s*"Channels"[\s\S]*?icon:\s*"\/images\/homepage\/icons\/file-management\.png"/,
  "The Channels feature card must not reuse the file-management icon."
);

// 2. Verify preload attribute is not passed to Image in otherFeatures
assert.doesNotMatch(
  page,
  /<Image[\s\S]*?alt=\{`\$\{feature\.title\} icon`\}[\s\S]*?\bpreload\b/,
  "The otherFeatures Image element must not pass an invalid preload attribute."
);

// 3. Verify all feature icons exist in public directory
const publicDir = path.join(__dirname, "..", "public");
const iconMatches = [
  ...page.matchAll(/icon:\s*"(\/images\/homepage\/icons\/[^"]+)"/g),
];
assert.ok(
  iconMatches.length >= 4,
  "Should find at least 4 feature card icons."
);

for (const match of iconMatches) {
  const iconRelPath = match[1];
  const iconDiskPath = path.join(publicDir, iconRelPath);
  assert.ok(
    fs.existsSync(iconDiskPath),
    `Feature icon must exist on disk: ${iconDiskPath}`
  );
}

// 4. Ensure hero alt text and heading structure are preserved
assert.match(
  page,
  /alt="Zedu file management interface showing course materials, lecture folders, and shared cohort resources"/,
  "Hero image alt text must remain intact."
);

const h1Count = (page.match(/<h1\b/g) ?? []).length;
assert.equal(h1Count, 1, "Must maintain exactly one primary H1.");

console.log("Issue #1302 File Management showcase checks passed successfully.");
