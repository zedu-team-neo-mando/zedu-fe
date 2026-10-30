import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Node 20 cannot import a .ts file directly, so compile the helper first.
const source = readFileSync(
  new URL("./stored-accordions.ts", import.meta.url),
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
const { parseStoredAccordions } = await import(moduleUrl);

const defaults = ["starred", "channels"];

test("returns a saved list of open sections", () => {
  assert.deepEqual(parseStoredAccordions('["people"]', defaults), ["people"]);
});

test("keeps an empty saved list (every section closed)", () => {
  assert.deepEqual(parseStoredAccordions("[]", defaults), []);
});

test("falls back to the defaults when nothing is saved", () => {
  assert.deepEqual(parseStoredAccordions(null, defaults), defaults);
  assert.deepEqual(parseStoredAccordions(undefined, defaults), defaults);
  assert.deepEqual(parseStoredAccordions("", defaults), defaults);
});

test("falls back to the defaults for a value that is not JSON", () => {
  assert.deepEqual(parseStoredAccordions("not-json", defaults), defaults);
  assert.deepEqual(parseStoredAccordions("{broken", defaults), defaults);
});

test("falls back to the defaults when the JSON is not an array", () => {
  assert.deepEqual(parseStoredAccordions('"a string"', defaults), defaults);
  assert.deepEqual(parseStoredAccordions('{"a":1}', defaults), defaults);
  assert.deepEqual(parseStoredAccordions("42", defaults), defaults);
});

test("falls back to the defaults when the array holds non-strings", () => {
  assert.deepEqual(parseStoredAccordions("[1,2]", defaults), defaults);
  assert.deepEqual(parseStoredAccordions('["ok", null]', defaults), defaults);
});
