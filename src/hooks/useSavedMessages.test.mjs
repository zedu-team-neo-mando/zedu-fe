import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const ts = createRequire(import.meta.url)("typescript");
const compile = (url, mocks = {}) => {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(readFileSync(url, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    { exports, require: (name) => mocks[name], WeakMap, Set }
  );
  return exports;
};

const setup = (initial = []) => {
  const helpers = compile(
    new URL("../utils/saved-bookmarks.ts", import.meta.url)
  );
  let state = { orgId: "org-a", bookmarks: initial };
  const requests = [];
  const effects = [];
  const errors = [];
  const request = (url) =>
    new Promise((resolve, reject) => requests.push({ url, resolve, reject }));
  const dispatch = ({ payload }) => {
    state = helpers.updateSavedBookmarks(state, payload);
  };
  const hook = compile(new URL("./useSavedMessages.ts", import.meta.url), {
    react: {
      useCallback: (fn) => fn,
      useContext: () => ({ state, dispatch }),
      useEffect: (fn) => effects.push(fn),
    },
    "~/store/GlobalState": { DataContext: {} },
    "~/store/Actions": { ACTIONS: { UPDATE_SAVED_BOOKMARK: "update" } },
    "~/utils/saved-bookmarks": helpers,
    "~/utils/new-request": {
      SaveMessage: request,
      DeleteSavedMessage: request,
      GetRequest: request,
    },
    "~/components/toast/sonner": {
      showError: (message) => errors.push(message),
    },
  });
  return {
    render: () => hook.useSavedMessageActions(),
    requests,
    errors,
    get state() {
      return state;
    },
    switchOrg: (orgId = "org-b") => {
      state = {
        orgId,
        bookmarks: [],
        bookmarkOrgVersion: (state.bookmarkOrgVersion || 0) + 1,
      };
    },
    load: () => {
      hook.useLoadSavedMessages("org-a");
      effects.pop()();
    },
  };
};
const ok = (id) => ({ status: 200, data: { data: { id } } });
const thread = (id) => ({ thread_id: id, channels_id: "channel" });

test("reversed successful saves preserve both messages and their server ids", async () => {
  const s = setup();
  const a = s.render().saveThread(thread("a"));
  const b = s.render().saveThread(thread("b"));
  s.requests[1].resolve(ok("saved-b"));
  await b;
  s.requests[0].resolve(ok("saved-a"));
  await a;
  assert.deepEqual(Array.from(s.state.bookmarks, (b) => b.id).sort(), [
    "saved-a",
    "saved-b",
  ]);
});

test("a failed save rolls back only itself, including thrown errors", async () => {
  for (const thrown of [false, true]) {
    const s = setup();
    const a = s.render().saveThread(thread("a"));
    const b = s.render().saveThread(thread("b"));
    s.requests[1].resolve(ok("saved-b"));
    await b;
    if (thrown) s.requests[0].reject(new Error("network"));
    else s.requests[0].resolve({ status: 500 });
    await a;
    assert.equal(s.state.bookmarks.length, 1);
    assert.equal(s.state.bookmarks[0].id, "saved-b");
    assert.equal(s.errors.length, 1);
  }
});

test("concurrent save and failed removal preserve the unrelated save", async () => {
  const s = setup([{ id: "saved-a", thread_id: "a" }]);
  const remove = s.render().removeThread("a");
  const save = s
    .render()
    .saveReply({ id: "reply-b", thread_id: "a", channels_id: "channel" });
  assert.match(s.requests[0].url, /saved\/message\/saved-a$/);
  s.requests[1].resolve(ok("saved-b"));
  await save;
  s.requests[0].resolve({ status: 500 });
  await remove;
  assert.equal(s.state.bookmarks.length, 2);
  assert.equal(s.render().isThreadSaved("a"), true);
  assert.equal(s.render().isReplySaved("reply-b"), true);
});

test("duplicate clicks across hook instances send one toggle request", async () => {
  const s = setup();
  const a = s.render().saveThread(thread("a"));
  await s.render().removeThread("a");
  await s.render().saveThread(thread("a"));
  assert.equal(s.requests.length, 1);
  s.requests[0].resolve(ok("saved-a"));
  await a;
});

test("old organisation completions cannot overwrite the new organisation", async () => {
  const s = setup();
  const a = s.render().saveThread(thread("a"));
  s.switchOrg();
  s.switchOrg("org-a");
  s.requests[0].resolve(ok("saved-a"));
  await a;
  assert.equal(s.state.bookmarks.length, 0);
});

test("a stale initial load cannot erase a save completed after it started", async () => {
  const s = setup();
  s.load();
  const a = s.render().saveThread(thread("a"));
  s.requests[1].resolve(ok("saved-a"));
  await a;
  s.requests[0].resolve({ status: 200, data: { data: [] } });
  await new Promise(setImmediate);
  assert.equal(s.state.bookmarks[0].id, "saved-a");
});
