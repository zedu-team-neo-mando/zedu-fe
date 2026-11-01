import { test } from "node:test";
import assert from "node:assert/strict";
import { HEARD_ABOUT_OPTIONS, heardAboutLine } from "./acquisition-source.ts";

test("every answer is a select option whose label is its value", () => {
  assert.ok(HEARD_ABOUT_OPTIONS.length > 0);
  for (const option of HEARD_ABOUT_OPTIONS) {
    assert.equal(option.label, option.value);
  }
});

test("answers are unique and include a catch-all", () => {
  const values = HEARD_ABOUT_OPTIONS.map((option) => option.value);
  assert.equal(new Set(values).size, values.length);
  assert.ok(values.includes("Something else"));
});

test("the webhook line names the chosen answer", () => {
  assert.equal(heardAboutLine("LinkedIn"), "Heard about Zedu: LinkedIn");
});

test("a skipped answer is recorded as not answered", () => {
  assert.equal(heardAboutLine(undefined), "Heard about Zedu: Not answered");
  assert.equal(heardAboutLine(null), "Heard about Zedu: Not answered");
  assert.equal(heardAboutLine("  "), "Heard about Zedu: Not answered");
});
