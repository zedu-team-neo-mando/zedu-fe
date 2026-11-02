const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const pricingSectionPath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "(homepage)",
  "_components",
  "home",
  "PricingSection.tsx"
);
const pricingSection = fs.readFileSync(pricingSectionPath, "utf8");

// Ensure the CTA link does not use the broken unslashed relative path
assert.equal(
  pricingSection.includes(
    'href={"client/settings/organisation/billing/all-plans"}'
  ),
  false,
  "Homepage Pricing CTA must not link to relative unslashed path"
);

// Ensure the CTA link routes to /pricing#compare-plans
assert.match(
  pricingSection,
  /href="\/pricing#compare-plans"/,
  "Homepage Pricing CTA must route to /pricing#compare-plans"
);

console.log("Issue #2193 pricing CTA link checks passed.");
