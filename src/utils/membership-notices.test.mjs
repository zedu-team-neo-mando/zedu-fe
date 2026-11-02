import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("./membership-notices.ts", import.meta.url),
  "utf8"
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const { parseMembershipNotice, groupMembershipNotices, membershipNames } =
  await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );

let nextId = 0;
const system = (message) => ({
  thread_id: `t${++nextId}`,
  type: "system",
  message,
});
const chat = (message) => ({
  thread_id: `t${++nextId}`,
  type: "message",
  message,
});

test("reads the notices the server writes", () => {
  assert.deepEqual(
    parseMembershipNotice(system("@chinonso okolie joined this channel")),
    {
      kind: "joined",
      names: ["chinonso okolie"],
    }
  );
  assert.deepEqual(
    parseMembershipNotice(
      system(
        "<p>@Megafox joined this channel. @abubakar sadiq muhammad also joined.</p>"
      )
    ),
    { kind: "joined", names: ["Megafox", "abubakar sadiq muhammad"] }
  );
  assert.deepEqual(parseMembershipNotice(system("@pam left this channel")), {
    kind: "left",
    names: ["pam"],
  });
});

test("leaves every other message alone", () => {
  assert.equal(parseMembershipNotice(chat("@pam joined this channel")), null);
  assert.equal(
    parseMembershipNotice(system("Channel renamed to #general")),
    null
  );
  assert.equal(
    parseMembershipNotice(system("@pam joined this channel. Welcome!")),
    null
  );
  assert.equal(parseMembershipNotice(undefined), null);
});

test("folds consecutive joins into one line, oldest name first", () => {
  // Newest first, as the channel list holds them.
  const threads = [
    system("@dayve007 joined this channel"),
    system("@peratenoch joined this channel"),
    system("@konvoslee joined this channel. @oladimejibilkis also joined."),
    system("@chinonso okolie joined this channel"),
  ];
  const rows = groupMembershipNotices(threads);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].thread_id, threads[0].thread_id);
  assert.deepEqual(rows[0].membership.names, [
    "chinonso okolie",
    "konvoslee",
    "oladimejibilkis",
    "peratenoch",
    "dayve007",
  ]);
  assert.deepEqual(
    rows[0].membership.threadIds,
    threads.map((t) => t.thread_id)
  );
});

test("never hides a real message between notices", () => {
  const rows = groupMembershipNotices([
    system("@a joined this channel"),
    chat("hello"),
    system("@b joined this channel"),
    system("@c joined this channel"),
  ]);
  assert.equal(rows.length, 3);
  assert.deepEqual(rows[0].membership.names, ["a"]);
  assert.equal(rows[1].type, "message");
  assert.deepEqual(rows[2].membership.names, ["c", "b"]);
});

test("keeps joins and leaves apart and lists someone once", () => {
  const rows = groupMembershipNotices([
    system("@pam left this channel"),
    system("@ada joined this channel"),
    system("@ada joined this channel"),
  ]);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0].membership, {
    kind: "left",
    names: ["pam"],
    threadIds: [rows[0].thread_id],
  });
  assert.deepEqual(rows[1].membership.names, ["ada"]);
});

test("names read the way Slack writes them", () => {
  assert.deepEqual(membershipNames(["a"]), { shown: ["a"], others: 0 });
  assert.deepEqual(membershipNames(["a", "b", "c"]), {
    shown: ["a", "b", "c"],
    others: 0,
  });
  assert.deepEqual(membershipNames(["a", "b", "c", "d", "e"]), {
    shown: ["a", "b"],
    others: 3,
  });
});
