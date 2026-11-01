import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const productPages = [
  {
    name: "Buzz product page",
    filePath: path.join(
      root,
      "src",
      "app",
      "(homepage)",
      "products",
      "buzz",
      "page.tsx"
    ),
  },
  {
    name: "Channels product page",
    filePath: path.join(
      root,
      "src",
      "app",
      "(homepage)",
      "products",
      "channels",
      "page.tsx"
    ),
  },
  {
    name: "File Management product page",
    filePath: path.join(
      root,
      "src",
      "app",
      "(homepage)",
      "products",
      "file-management",
      "page.tsx"
    ),
  },
];

for (const { name, filePath } of productPages) {
  test(`${name} contains exactly one primary H1 element`, () => {
    assert.ok(fs.existsSync(filePath), `File exists at ${filePath}`);
    const source = fs.readFileSync(filePath, "utf8");
    const h1Matches = source.match(/<h1[\s>]/g) || [];
    assert.strictEqual(
      h1Matches.length,
      1,
      `${name} must have exactly one <h1> hero element to satisfy WCAG heading hierarchy`
    );
  });
}
