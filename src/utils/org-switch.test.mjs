import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const compile = (source) =>
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
const { resolveChannelIdForOrgSwitch } = await import(
  `data:text/javascript;base64,${Buffer.from(compile(readFileSync(new URL("./org-switch.ts", import.meta.url), "utf8"))).toString("base64")}`
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("picks the first channel when the lookup is fast", async () => {
  const channelId = await resolveChannelIdForOrgSwitch(
    () => Promise.resolve("channel-1"),
    "org-1",
    50
  );

  assert.equal(channelId, "channel-1");
});

test("looks the channel up for the organisation being switched to", async () => {
  let askedFor;
  await resolveChannelIdForOrgSwitch(
    (orgId) => {
      askedFor = orgId;
      return Promise.resolve("channel-1");
    },
    "org-42",
    50
  );

  assert.equal(askedFor, "org-42");
});

test("a lookup slower than the timeout falls back to the workspace root", async () => {
  const channelId = await resolveChannelIdForOrgSwitch(
    () => sleep(80).then(() => "channel-late"),
    "org-1",
    10
  );

  assert.equal(channelId, null);
});

test("an empty workspace falls back to the workspace root", async () => {
  const channelId = await resolveChannelIdForOrgSwitch(
    () => Promise.resolve(undefined),
    "org-empty",
    50
  );

  assert.equal(channelId, null);
});

test("a failed lookup falls back to the workspace root", async () => {
  const channelId = await resolveChannelIdForOrgSwitch(
    () => Promise.reject(new Error("network down")),
    "org-1",
    50
  );

  assert.equal(channelId, null);
});

test("a lookup that wins the race is not reported as abandoned", async () => {
  let abandonedAtCall;
  const channelId = await resolveChannelIdForOrgSwitch(
    (orgId, options) => {
      abandonedAtCall = options?.isAbandoned?.() ?? true;
      return Promise.resolve("channel-1");
    },
    "org-1",
    50
  );

  assert.equal(channelId, "channel-1");
  assert.equal(abandonedAtCall, false);
});

test("a lookup abandoned by the timeout is told so before it writes", async () => {
  // Regression: the caller used to stop waiting and the lookup carried on,
  // writing its channel into local storage after the user had already been
  // routed into a different workspace.
  let abandonedAtResolve;
  const channelId = await resolveChannelIdForOrgSwitch(
    (orgId, options) =>
      sleep(60).then(() => {
        abandonedAtResolve = options?.isAbandoned?.() ?? false;
        return "channel-late";
      }),
    "org-1",
    10
  );

  assert.equal(channelId, null);

  await sleep(120);
  assert.equal(abandonedAtResolve, true);
});

test("the timeout is cleared when the lookup wins", async () => {
  const realClearTimeout = globalThis.clearTimeout;
  let cleared = 0;
  globalThis.clearTimeout = (handle) => {
    cleared++;
    return realClearTimeout(handle);
  };

  try {
    await resolveChannelIdForOrgSwitch(
      () => Promise.resolve("channel-1"),
      "org-1",
      1000
    );
  } finally {
    globalThis.clearTimeout = realClearTimeout;
  }

  assert.ok(cleared >= 1, "expected the losing timeout to be cleared");
});
