import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Node 20 cannot import a .ts file directly, so compile the helper first.
const source = readFileSync(
  new URL("./attribution.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const encoded = Buffer.from(outputText).toString("base64");
const moduleUrl = `data:text/javascript;base64,${encoded}`;
const {
  readAttributionParams,
  parseStoredAttribution,
  formatAttributionMessage,
} = await import(moduleUrl);

test("reads every campaign parameter from the query string", () => {
  assert.deepEqual(
    readAttributionParams(
      "?utm_source=twitter&utm_medium=social&utm_campaign=october_cohort&utm_content=hero&utm_term=bootcamp&ref=ada"
    ),
    {
      utm_source: "twitter",
      utm_medium: "social",
      utm_campaign: "october_cohort",
      utm_content: "hero",
      utm_term: "bootcamp",
      ref: "ada",
    }
  );
});

test("ignores unrelated and empty parameters", () => {
  assert.deepEqual(
    readAttributionParams("?template=school&utm_source=%20&utm_campaign=test"),
    { utm_campaign: "test" }
  );
});

test("returns null when there is no campaign parameter", () => {
  assert.equal(readAttributionParams(""), null);
  assert.equal(readAttributionParams("?email=a@b.com&redirect=/x"), null);
});

test("caps very long values", () => {
  const long = "a".repeat(500);
  assert.equal(
    readAttributionParams(`?utm_source=${long}`).utm_source.length,
    200
  );
});

test("parses a saved attribution value", () => {
  assert.deepEqual(
    parseStoredAttribution('{"utm_source":"twitter","ref":"ada"}'),
    { utm_source: "twitter", ref: "ada" }
  );
});

test("drops unknown keys and non-string values from a saved value", () => {
  assert.deepEqual(
    parseStoredAttribution('{"utm_source":"twitter","utm_medium":5,"x":"y"}'),
    { utm_source: "twitter" }
  );
});

test("falls back to null for a missing or corrupt saved value", () => {
  assert.equal(parseStoredAttribution(null), null);
  assert.equal(parseStoredAttribution(""), null);
  assert.equal(parseStoredAttribution("not-json"), null);
  assert.equal(parseStoredAttribution("[]"), null);
  assert.equal(parseStoredAttribution('"twitter"'), null);
  assert.equal(parseStoredAttribution("{}"), null);
});

test("formats attribution as extra webhook message lines", () => {
  assert.equal(
    formatAttributionMessage({ utm_campaign: "test", utm_source: "twitter" }),
    "\\nUTM Source: twitter\\nUTM Campaign: test"
  );
});

test("adds nothing to the message without attribution", () => {
  assert.equal(formatAttributionMessage(null), "");
});
