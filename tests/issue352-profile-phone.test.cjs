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
  "edit-profile-modal",
  "index.tsx"
);

const source = fs.readFileSync(filePath, "utf8");

const start = source.indexOf("const phonePattern =");
const end = source.indexOf("const EditProfileDialog", start);

assert.ok(start >= 0 && end > start, "Phone validator not found");

const code = source.slice(start, end).replace("(value: string)", "(value)");

const isValidPhone = new Function(code + "\nreturn isValidPhone;")();

test("phone validation accepts valid and rejects invalid values", () => {
  const cases = [
    ["", true],
    ["  ", true],
    ["08012345678", true],
    ["+234 801 234 5678", true],
    ["+44 20 7946 0958", true],
    ["080.1234.5678", true],
    ["(080) 1234-5678", true],
    ["Paul.. Hello", false],
    ["test08012345678hello", false],
    ["123", false],
    ["123456789", false],
    ["1234567890123456", false],
    ["++2348012345678", false],
    ["080#12345678", false],
    ["+()--", false],
  ];

  for (const [value, expected] of cases) {
    assert.equal(
      isValidPhone(value),
      expected,
      `Failed for ${JSON.stringify(value)}`
    );
  }
});

test("legacy phone safeguard is present", () => {
  assert.match(source, /const originalPhoneRef = useRef\(""\)/);
  assert.match(source, /originalPhoneRef\.current = savedPhone/);
  assert.match(
    source,
    /const phoneChanged = phone !== originalPhoneRef\.current/
  );
  assert.match(source, /if \(phoneChanged && !isValidPhone\(phone\)\)/);
  assert.match(
    source,
    /phoneChanged\s*\?\s*phone\.trim\(\)\s*:\s*originalPhoneRef\.current/
  );
});
