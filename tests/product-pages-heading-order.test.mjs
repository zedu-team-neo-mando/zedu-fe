import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/**
 * Target marketing routes to validate:
 * - 4 product pages (/products/buzz, /products/channels, /products/file-management, /products/ai)
 * - 1 core marketing page (/pricing)
 */
const targetPages = [
  {
    name: "Buzz product page",
    route: "/products/buzz",
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
    route: "/products/channels",
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
    route: "/products/file-management",
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
  {
    name: "AI product page",
    route: "/products/ai",
    filePath: path.join(
      root,
      "src",
      "app",
      "(homepage)",
      "products",
      "ai",
      "page.tsx"
    ),
  },
  {
    name: "Pricing marketing page",
    route: "/pricing",
    filePath: path.join(
      root,
      "src",
      "app",
      "(homepage)",
      "pricing",
      "page.tsx"
    ),
  },
];

/**
 * Scope & Capabilities of Static Heading Hierarchy Analysis:
 *
 * 1. What it sees:
 *    - Inline semantic heading elements (<h1..h6>) in the page JSX.
 *    - Standard shared section components that render top-level section headings:
 *      * <PricingSection headingLevel="...">: resolves prop ("h1" | "h2", default "h2").
 *      * <FAQSection headingLevel="...">: resolves prop ("h1" | "h2", default "h2").
 *      * <DynamicFooter ...>: renders <h2> section title.
 *      * <PricingComparisonTable ...>: renders <h2> comparison section titles.
 *
 * 2. What it cannot see statically:
 *    - Runtime-rendered conditional children or dynamically fetched CMS content.
 *    - Accordion item contents inside sub-components before user expansion.
 */
function extractHeadingsInDocumentOrder(source) {
  const tagRegex =
    /<(h[1-6]|PricingSection|PricingComparisonTable|FAQSection|DynamicFooter)([\s\S]*?)(\/?>)/g;
  const headings = [];
  let match;

  while ((match = tagRegex.exec(source)) !== null) {
    const tagName = match[1];
    const props = match[2] || "";

    if (tagName.startsWith("h")) {
      const level = parseInt(tagName.slice(1), 10);
      headings.push({
        tag: tagName,
        level,
        source: `<${tagName}>`,
      });
    } else if (tagName === "PricingSection") {
      const isH1 = /headingLevel\s*=\s*["'`]h1["'`]/.test(props);
      const level = isH1 ? 1 : 2;
      headings.push({
        tag: `h${level}`,
        level,
        source: `<PricingSection headingLevel="${isH1 ? "h1" : "h2"}">`,
      });
    } else if (tagName === "PricingComparisonTable") {
      headings.push({
        tag: "h2",
        level: 2,
        source: "<PricingComparisonTable>",
      });
    } else if (tagName === "FAQSection") {
      const isH1 = /headingLevel\s*=\s*["'`]h1["'`]/.test(props);
      const level = isH1 ? 1 : 2;
      headings.push({
        tag: `h${level}`,
        level,
        source: `<FAQSection headingLevel="${isH1 ? "h1" : "h2"}">`,
      });
    } else if (tagName === "DynamicFooter") {
      headings.push({
        tag: "h2",
        level: 2,
        source: "<DynamicFooter>",
      });
    }
  }

  return headings;
}

for (const { name, route, filePath } of targetPages) {
  test(`${name} (${route}) contains exactly one primary H1 element`, () => {
    assert.ok(fs.existsSync(filePath), `File exists at ${filePath}`);
    const source = fs.readFileSync(filePath, "utf8");
    const headings = extractHeadingsInDocumentOrder(source);
    const h1Elements = headings.filter((h) => h.level === 1);

    assert.strictEqual(
      h1Elements.length,
      1,
      `${name} (${route}) must have exactly one <h1> hero element to satisfy WCAG heading hierarchy. Found: ${h1Elements.length} (${h1Elements.map((h) => h.source).join(", ")})`
    );
  });

  test(`${name} (${route}) adheres to strictly descending heading order without skipping levels`, () => {
    assert.ok(fs.existsSync(filePath), `File exists at ${filePath}`);
    const source = fs.readFileSync(filePath, "utf8");
    const headings = extractHeadingsInDocumentOrder(source);

    assert.ok(
      headings.length > 0,
      `${name} (${route}) must contain at least one heading element`
    );

    // Initial heading on any page must be the primary H1
    assert.strictEqual(
      headings[0].level,
      1,
      `${name} (${route}) first heading must be <h1> hero title, but found ${headings[0].tag}`
    );

    // Verify sequential descending hierarchy (WCAG SC 1.3.1 & 2.4.6)
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1].level;
      const curr = headings[i].level;

      if (curr > prev) {
        assert.ok(
          curr <= prev + 1,
          `${name} (${route}) heading level skipped from h${prev} directly to h${curr} at ${headings[i].source}. Headings must step down sequentially without skipping levels.`
        );
      }
    }
  });
}
