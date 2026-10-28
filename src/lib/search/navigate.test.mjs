import assert from "node:assert/strict";
import test from "node:test";

const {
  hasMoreReplyPages,
  isIndividualDmType: isDm,
  openSearchMessageResult,
  resolveSearchDeepLink,
  shouldFetchSearchReply,
} = await import("./navigate.ts");

globalThis.localStorage = { setItem: () => {} };

const makeResult = (channelType = "channel", messageId = "reply-9") => ({
  messages: [{ message_id: messageId }],
  thread: { id: "parent-1" },
  channel: {
    channel_id: "channel-1",
    ...(channelType ? { channel_type: channelType } : {}),
  },
});

async function navigate(channelType, messageId, options = {}) {
  const pushes = [];
  await openSearchMessageResult({
    result: makeResult(channelType, messageId),
    orgSlug: "acme",
    router: { push: (href) => pushes.push(href) },
    dispatch: () => {},
    ...options,
  });
  return pushes[0];
}

test("routes channel, individual-DM, and group-DM roots and replies", async () => {
  for (const channelType of ["channel", "dm", "groupdm"])
    for (const messageId of ["parent-1", "reply-9"]) {
      const path = channelType === "channel" ? "home/channels" : "dms";
      const query =
        messageId === "parent-1"
          ? "?thread_id=parent-1"
          : "?thread_id=parent-1&message_id=reply-9";
      assert.equal(
        await navigate(channelType, messageId),
        `/acme/${path}/channel-1${query}`
      );
    }
});
test("uses loaded state when search results omit channel_type", async () => {
  assert.match(
    await navigate("", "reply-9", {
      dms: [{ channel_id: "channel-1" }],
      channels: [],
    }),
    /^\/acme\/dms\/channel-1\?/
  );
});
test("uses the participants endpoint for an unloaded DM", async () => {
  const requests = [];
  const href = await navigate("", "reply-9", {
    orgId: "org-7",
    dms: [],
    channels: [],
    getDmParticipants: async (url) => (requests.push(url), { status: 200 }),
  });
  assert.deepEqual(requests, [
    "/organisations/org-7/dms/participants/channel-1",
  ]);
  assert.match(href, /^\/acme\/dms\/channel-1\?/);
});
test("classifies backend DM types", () => {
  assert.deepEqual(["dm", "bot", "groupdm"].map(isDm), [true, true, false]);
});
test("loads reply pages only while a search target is missing", () => {
  assert.deepEqual(
    [
      shouldFetchSearchReply("reply-9", [{ id: "reply-1" }], true),
      shouldFetchSearchReply("reply-9", [{ id: "reply-9" }], true),
      shouldFetchSearchReply("reply-9", [{ id: "reply-1" }], false),
      hasMoreReplyPages(30),
      hasMoreReplyPages(29),
    ],
    [true, false, false, true, false]
  );
});
test("keeps a reply link pending until its parent finishes loading", () => {
  const parent = { thread_id: "parent-1" };
  const resolve = (messages, loading) =>
    resolveSearchDeepLink("parent-1", "reply-9", messages, loading);
  assert.equal(resolve([parent], true).status, "pending");
  assert.equal(resolve([], false).status, "pending");
  assert.deepEqual(resolve([parent], false), { status: "reply", parent });
});
