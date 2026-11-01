import test from "node:test";
import assert from "node:assert/strict";
import {
  shouldIncrementNotificationBadge,
  registerNotificationBadge,
  clearNotificationBadgeRegistry,
  isNotificationsRoute,
  isHomeRoute,
  getNotificationBadgeKey,
} from "../src/lib/notifications/notification-badge.ts";

test("isNotificationsRoute correctly identifies notification paths", () => {
  assert.equal(isNotificationsRoute("/my-org/notifications"), true);
  assert.equal(isNotificationsRoute("/my-org/notifications/"), true);
  assert.equal(isNotificationsRoute("/my-org/notifications/123"), true);
  assert.equal(isNotificationsRoute("/my-org/home"), false);
  assert.equal(isNotificationsRoute("/my-org/home/channels/123"), false);
  assert.equal(isNotificationsRoute(null), false);
  assert.equal(isNotificationsRoute(undefined), false);
});

test("isHomeRoute correctly identifies home paths", () => {
  assert.equal(isHomeRoute("/my-org/home"), true);
  assert.equal(isHomeRoute("/my-org/home/channels/123"), true);
  assert.equal(isHomeRoute("/my-org/notifications"), false);
});

test("shouldIncrementNotificationBadge accepts valid notification payloads", () => {
  assert.equal(
    shouldIncrementNotificationBadge({ notification_type: "new_message" }),
    true
  );
  assert.equal(
    shouldIncrementNotificationBadge({ notification_type: "dm" }),
    true
  );
  assert.equal(
    shouldIncrementNotificationBadge({ notification_type: "mention" }),
    true
  );
  assert.equal(shouldIncrementNotificationBadge({ isTest: true }), true);
  assert.equal(
    shouldIncrementNotificationBadge({
      title: "New Announcement",
      message: "Hello team",
    }),
    true
  );
  assert.equal(
    shouldIncrementNotificationBadge({ data: { title: "Nested Alert" } }),
    true
  );
  assert.equal(shouldIncrementNotificationBadge(null), false);
  assert.equal(shouldIncrementNotificationBadge(undefined), false);
  assert.equal(shouldIncrementNotificationBadge({}), false);
});

test("registerNotificationBadge deduplicates repeated events", () => {
  clearNotificationBadgeRegistry();
  const payload = {
    notification_type: "new_message",
    channel_id: "chan-1",
    message_id: "msg-100",
    sender_id: "user-5",
  };
  assert.equal(registerNotificationBadge(payload), true);
  assert.equal(registerNotificationBadge(payload), false);

  clearNotificationBadgeRegistry();
  assert.equal(registerNotificationBadge(payload), true);
});
