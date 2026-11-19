import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const directory = dirname(fileURLToPath(import.meta.url));
const load = (name) => {
  const exports = {};
  const code = ts.transpileModule(
    readFileSync(resolve(directory, name), "utf8"),
    {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }
  ).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => load(`${name}.ts`),
  });
  return exports;
};
const { parseTopics, generatePlan } = load("generate-plan.ts");
const { EXAMPLE_INPUTS } = load("content.ts");
const { planToMarkdown } = load("plan-to-markdown.ts");

test("reserves explicit weeks before placing plain lines, regardless of order", () => {
  for (const raw of [
    "Introduction\nWeek 1: HTML\nWeek 3: JavaScript",
    "Week 3: JavaScript\nIntroduction\nWeek 1: HTML",
  ]) {
    const result = parseTopics(raw, 4);
    assert.deepEqual(Array.from(result.slots), [
      "HTML",
      "Introduction",
      "JavaScript",
      null,
    ]);
    assert.equal(result.overflow, 0);
    assert.equal(result.placed, 3);
  }
});

test("keeps the first explicit entry and identifies conflicting week numbers", () => {
  const result = parseTopics("Week 1: Introduction\nWeek 1: HTML", 4);
  assert.equal(result.slots[0], "Introduction");
  assert.deepEqual(Array.from(result.conflicts), [1]);
  assert.equal(result.overflow, 0);
  const plan = generatePlan({
    ...EXAMPLE_INPUTS,
    topics: "Week 1: Introduction\nWeek 1: HTML",
  });
  assert.ok(
    plan.overview.notes.some((note) =>
      note.includes("Week 1 was listed more than once")
    )
  );
});

test("keeps overflow, sequential numbering and empty input behavior", () => {
  assert.equal(parseTopics("Week 9: Outside\nA\nB\nC", 2).overflow, 2);
  assert.deepEqual(Array.from(parseTopics("1. First\n2. Second", 2).slots), [
    "First",
    "Second",
  ]);
  assert.equal(parseTopics(" \n", 4).placed, 0);
});

test("copied/downloaded playbook preserves accepted topics and conflict notices", () => {
  const plan = generatePlan({
    ...EXAMPLE_INPUTS,
    topics:
      "Introduction\nWeek 1: HTML\nWeek 3: JavaScript\nWeek 3: Not scheduled\nWeek 3: Also omitted",
  });
  const markdown = planToMarkdown(plan);
  for (const topic of ["Introduction", "HTML", "JavaScript"])
    assert.ok(markdown.includes(topic));
  assert.equal(
    plan.overview.notes.filter((n) =>
      n.includes("Week 3 was listed more than once")
    ).length,
    1
  );
  assert.ok(markdown.includes("Week 3 was listed more than once"));
  assert.equal(markdown.includes("Not scheduled"), false);
});
