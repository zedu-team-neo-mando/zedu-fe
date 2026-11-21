import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("./jump-to-date.ts", import.meta.url),
  "utf8"
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const {
  nextJumpToDateStep: nextStepWithIds,
  parseDateInput,
  toDateInputValue,
  startOfLocalDay,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

// The step without its fallback list, which one test checks on its own.
const nextJumpToDateStep = (...args) => {
  const { messageIds: _ids, ...step } = nextStepWithIds(...args);
  return step;
};

// Local times, so the tests hold in any time zone.
const at = (y, m, d, h = 12, min = 0) =>
  new Date(y, m - 1, d, h, min).toISOString();
const msg = (id, created_at) => ({ thread_id: id, created_at });

// Newest first, as conversations load them.
const history = [
  msg("n3", at(2026, 11, 20, 18)),
  msg("n2", at(2026, 11, 20, 9)),
  msg("n1", at(2026, 11, 18, 15)),
  msg("o2", at(2026, 11, 15, 10)),
  msg("o1", at(2026, 11, 15, 8, 30)),
];

test("scrolls to the first message of the chosen day", () => {
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 10, 15), false), {
    action: "scroll",
    messageId: "o1",
    exactDay: true,
  });
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 10, 20), false), {
    action: "scroll",
    messageId: "n2",
    exactDay: true,
  });
});

test("lists the day's messages oldest first, for when the first is not on the page", () => {
  // Consecutive join notices render as one line, under one of their ids.
  assert.deepEqual(
    nextStepWithIds(history, new Date(2026, 10, 18), false).messageIds,
    ["n1", "n2", "n3"]
  );
});

test("goes to the next day with messages when the day had none", () => {
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 10, 16), false), {
    action: "scroll",
    messageId: "n1",
    exactDay: false,
  });
});

test("loads older pages until the history reaches before the day", () => {
  // Oldest loaded is 15 Nov; 14 Nov may hold older messages.
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 10, 14), true), {
    action: "load_older",
  });
  // The oldest loaded message is on the day itself: earlier ones may be unloaded.
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 10, 15), true), {
    action: "load_older",
  });
  // History already reaches before the day: no need to load more.
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 10, 18), true), {
    action: "scroll",
    messageId: "n1",
    exactDay: true,
  });
});

test("a day before the whole history goes to the first message ever", () => {
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 0, 1), false), {
    action: "scroll",
    messageId: "o1",
    exactDay: false,
  });
});

test("a day after the last message finds nothing", () => {
  assert.deepEqual(nextJumpToDateStep(history, new Date(2026, 10, 21), false), {
    action: "none",
  });
});

test("an empty conversation loads older pages, then finds nothing", () => {
  assert.deepEqual(nextJumpToDateStep([], new Date(2026, 10, 15), true), {
    action: "load_older",
  });
  assert.deepEqual(nextJumpToDateStep([], new Date(2026, 10, 15), false), {
    action: "none",
  });
});

test("messages without a usable time are skipped", () => {
  const withBroken = [
    msg("bad", "not a date"),
    msg("x", undefined),
    ...history,
  ];
  assert.deepEqual(
    nextJumpToDateStep(withBroken, new Date(2026, 10, 18), false),
    { action: "scroll", messageId: "n1", exactDay: true }
  );
});

test("date input values round-trip as local days", () => {
  const day = parseDateInput("2026-11-05");
  assert.equal(day.getFullYear(), 2026);
  assert.equal(day.getMonth(), 10);
  assert.equal(day.getDate(), 5);
  assert.equal(toDateInputValue(day), "2026-11-05");
  assert.equal(parseDateInput("2026-02-30"), null);
  assert.equal(parseDateInput(""), null);
  assert.equal(
    startOfLocalDay(new Date(2026, 10, 5, 23, 59)).getTime(),
    new Date(2026, 10, 5).getTime()
  );
});
