import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const compile = (source) =>
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
const { MessageDelivery } = await import(
  `data:text/javascript;base64,${Buffer.from(compile(readFileSync(new URL("./message-delivery.ts", import.meta.url), "utf8"))).toString("base64")}`
);
const attempt = (send, scope = "channel:a") => ({
  scope,
  id: "attempt-a",
  html: "<p>Keep this</p>",
  attachmentIds: ["file-a"],
  send,
  status: "sending",
});

test("locks synchronously against repeated sends and retry clicks", async () => {
  const delivery = new MessageDelivery();
  let resolve;
  let requests = 0;
  const message = attempt(() => {
    requests++;
    return new Promise((done) => {
      resolve = done;
    });
  });
  const first = delivery.deliver(message);
  assert.equal(await delivery.deliver(message), false);
  assert.equal(requests, 1);
  resolve(false);
  await first;
  assert.equal(message.status, "failed");
  const retry = delivery.deliver(message, true);
  assert.equal(await delivery.deliver(message, true), false);
  assert.equal(requests, 2);
  resolve(true);
  assert.equal(await retry, true);
  assert.equal(message.status, "sent");
  assert.equal(delivery.get(message.scope), undefined);
  assert.equal(await delivery.deliver(message, true), false);
  assert.equal(requests, 2);
});

test("thrown and undefined outcomes retain the original attempt for retry", async () => {
  for (const outcome of [undefined, false, new Error("offline")]) {
    const delivery = new MessageDelivery();
    const calls = [];
    const message = attempt(async (retry) => {
      calls.push(retry);
      if (outcome instanceof Error) throw outcome;
      return outcome;
    });
    assert.equal(await delivery.deliver(message), false);
    assert.equal(delivery.get(message.scope), message);
    assert.equal(message.html, "<p>Keep this</p>");
    assert.deepEqual(message.attachmentIds, ["file-a"]);
    await delivery.deliver(message, true);
    assert.deepEqual(calls, [false, true]);
    assert.equal(delivery.busy, false);
  }
});

test("navigation never retargets a failed attempt to another conversation", async () => {
  const delivery = new MessageDelivery();
  const message = attempt(async () => false);
  await delivery.deliver(message);
  assert.equal(delivery.get("thread:b"), undefined);
  await delivery.deliver(attempt(async () => true, "thread:b"));
  assert.equal(delivery.get("channel:a"), message);
});

test("a superseded failed attempt cannot be replayed", async () => {
  const delivery = new MessageDelivery();
  const old = attempt(async () => false);
  await delivery.deliver(old);
  await delivery.deliver(attempt(async () => false));
  assert.equal(await delivery.deliver(old, true), false);
});

// Exercise the merged composer's actual completion handler so staging's draft
// reconciliation cannot be lost while retaining the retry implementation.
const composerSource = readFileSync(
  new URL("./index.tsx", import.meta.url),
  "utf8"
);
const composerAst = ts.createSourceFile(
  "index.tsx",
  composerSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);
let completionHandler;
function findCompletion(node) {
  if (
    ts.isVariableDeclaration(node) &&
    node.name.getText(composerAst) === "runDelivery"
  )
    completionHandler = node.initializer.getText(composerAst);
  ts.forEachChild(node, findCompletion);
}
findCompletion(composerAst);
for (const [destination, sent] of [
  ["same", true],
  ["same", false],
  ["navigated", true],
  ["navigated", false],
  ["unmounted", true],
  ["unmounted", false],
]) {
  test(`composer completion after ${destination}, success=${sent}, preserves draft ownership`, async () => {
    let settle;
    const message = attempt(
      () =>
        new Promise((resolve) => {
          settle = resolve;
        })
    );
    const reconciled = [],
      cleared = [],
      removed = [];
    const mounted = { current: true },
      scope = { current: message.scope };
    let editorClears = 0;
    const editor = {
      isDestroyed: false,
      getHTML: () => message.html,
      commands: {
        clearContent: () => {
          editorClears++;
        },
      },
    };
    const run = new Function(
      "delivery",
      "channelLoading",
      "subscription",
      "dispatch",
      "ACTIONS",
      "refreshDelivery",
      "mounted",
      "activeScope",
      "editor",
      "finishMessageDraftSend",
      "clearMessageDraft",
      "remove",
      `${compile(`const run = ${completionHandler};`)};return run;`
    )(
      { current: new MessageDelivery() },
      false,
      {},
      () => {},
      {},
      () => {},
      mounted,
      scope,
      editor,
      (...args) => reconciled.push(args),
      (key) => cleared.push(key),
      (id) => removed.push(id)
    );
    const pending = run(message);
    if (destination === "navigated") scope.current = "channel:b";
    if (destination === "unmounted") mounted.current = false;
    settle(sent);
    await pending;
    if (destination === "same") {
      assert.deepEqual(reconciled, []);
      assert.equal(editorClears, sent ? 1 : 0);
      assert.deepEqual(cleared, sent ? [message.scope] : []);
      assert.deepEqual(removed, sent ? message.attachmentIds : []);
    } else {
      assert.deepEqual(reconciled, [[message.scope, message.html, sent]]);
      assert.equal(editorClears, 0);
      assert.deepEqual(cleared, []);
      assert.deepEqual(removed, []);
    }
  });
}

// Exercise the actual route callbacks, including legacy routes and all three
// thread endpoint types. The request helper returns errors rather than throwing.
const base = new URL("../../", import.meta.url);
function* files(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = new URL(
      `${entry.name}${entry.isDirectory() ? "/" : ""}`,
      directory
    );
    if (entry.isDirectory()) yield* files(path);
    else if (entry.name.endsWith(".tsx")) yield path;
  }
}
for (const path of files(base)) {
  const source = readFileSync(path, "utf8");
  if (source.includes("FirstMessageBox sendMessage=")) continue;
  if (
    !source.includes("sendMessage={handleSendMessage}") &&
    !source.includes("handleSendMessage={handleReplyMessage}")
  )
    continue;
  const ast = ts.createSourceFile(
    fileURLToPath(path),
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const callbacks = [];
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      /^(handleSendMessage|handleReplyMessage)$/.test(node.name.getText(ast)) &&
      node.initializer?.getText(ast).includes("PostRequest(")
    )
      callbacks.push(node);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const node of callbacks) {
    test(`${fileURLToPath(path).split("[org]")[1]} ${node.name.getText(ast)} reports HTTP failure and preserves retry payload`, async () => {
      for (const channel_type of ["Channel", "DM", "GroupDm"]) {
        for (const status of [200, 201, 500, undefined]) {
          const requests = [],
            actions = [];
          const state = {
            mentions: ["new-mention"],
            thread: {
              thread_id: "parent-a",
              channels_id: "channel-a",
              channel_type,
            },
            user: { id: "user-a" },
          };
          const callback = new Function(
            "PostRequest",
            "state",
            "user",
            "dispatch",
            "ACTIONS",
            "thread",
            "loadThread",
            "window",
            `${compile(`const callback = ${node.initializer.getText(ast)};`)};return callback;`
          )(
            async (url, payload) => {
              requests.push({ url, payload });
              return { status };
            },
            state,
            { user_id: "user-a" },
            (action) => actions.push(action),
            { MESSAGES: "MESSAGES", CHATS: "CHATS", REPLIES: "REPLIES" },
            state.thread,
            false,
            { dispatchEvent() {} }
          );
          const media = [{ id: "file-a" }],
            mentions = ["original-mention"];
          const first = await callback(
            "channel-a",
            "attempt-a",
            "<p>message</p>",
            media,
            mentions,
            false
          );
          assert.equal(first, status === 200 || status === 201);
          const optimisticCount = actions.filter(
            (action) => action.payload?.newMessage
          ).length;
          const retry = await callback(
            "channel-a",
            "attempt-a",
            "<p>message</p>",
            media,
            mentions,
            true
          );
          assert.equal(retry, first);
          assert.deepEqual(requests[1], requests[0]);
          assert.equal(
            actions.filter((action) => action.payload?.newMessage).length,
            optimisticCount
          );
          if ("mentions" in requests[0].payload)
            assert.deepEqual(requests[0].payload.mentions, mentions);
          assert.deepEqual(requests[0].payload.media, media);
        }
      }
    });
  }
}

test("delivery status updates only the matching optimistic message", async () => {
  const actionsCode = compile(
    readFileSync(
      new URL("../../../../../store/Actions.ts", import.meta.url),
      "utf8"
    )
  );
  const actionsUrl = `data:text/javascript;base64,${Buffer.from(actionsCode).toString("base64")}`;
  const reducerCode = compile(
    readFileSync(
      new URL("../../../../../store/Reducers.ts", import.meta.url),
      "utf8"
    )
  ).replace('"./Actions"', JSON.stringify(actionsUrl));
  const { default: reducer } = await import(
    `data:text/javascript;base64,${Buffer.from(reducerCode).toString("base64")}`
  );
  const optimistic = {
    thread_id: "attempt-a",
    isOptimistic: true,
    status: "pending",
  };
  const real = { thread_id: "attempt-b", status: "sent" };
  let state = {
    messages: [optimistic, real],
    replies: [{ id: "attempt-a", isOptimistic: true }],
    chats: [],
  };
  for (const status of ["failed", "pending", "sent"]) {
    state = reducer(state, {
      type: "MESSAGE_DELIVERY",
      payload: { id: "attempt-a", status },
    });
    assert.equal(state.messages[0].status, status);
    assert.equal(state.replies[0].status, status);
    assert.equal(state.messages[1], real);
    assert.equal(state.messages.length, 2);
  }
});
