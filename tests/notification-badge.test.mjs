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
import {
  isNotificationRead,
  isNotificationUnread,
  markNotificationAsRead,
  getReadNotificationIds,
  saveReadNotificationIds,
  getStorageKey,
  getSeenAt,
  markNotificationsSeen,
  fetchAndSyncUnreadBadge,
} from "../src/lib/notifications/notification-store.ts";

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

test("shouldIncrementNotificationBadge accepts only valid notification types", () => {
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
  assert.equal(
    shouldIncrementNotificationBadge({ notification_type: "announcement" }),
    true
  );
  assert.equal(
    shouldIncrementNotificationBadge({
      notification_type: "direct_call_initiated",
    }),
    true
  );

  // Thread section
  assert.equal(
    shouldIncrementNotificationBadge({
      section: "thread_message",
      notification_type: "new_message",
    }),
    true
  );

  // Arbitrary payloads without valid notification_type must not increment
  assert.equal(
    shouldIncrementNotificationBadge({
      title: "Random Title",
      message: "Random text",
    }),
    false
  );
  assert.equal(
    shouldIncrementNotificationBadge({
      notification_type: "random_custom_event",
    }),
    false
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

test("unread tracking store correctly identifies and marks read notifications", () => {
  // Mock localStorage in global scope for testing
  const mockStorage = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) || null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
      removeItem: (key) => mockStorage.delete(key),
      clear: () => mockStorage.clear(),
    },
  };

  const userId = "test-user-1";
  const orgId = "test-org-1";

  const notif1 = { id: "notif-101", is_read: false };
  const notif2 = { id: "notif-102", is_read: false };

  // Initially both are unread
  assert.equal(isNotificationRead(notif1, userId, orgId), false);
  assert.equal(isNotificationRead(notif2, userId, orgId), false);

  // Mock dispatch
  const dispatched = [];
  const mockDispatch = (action) => dispatched.push(action);

  // Clicking an unread notification marks it as read and decrements
  const result1 = markNotificationAsRead(
    notif1.id,
    userId,
    orgId,
    mockDispatch
  );
  assert.equal(result1, true);
  assert.equal(dispatched.length, 1);
  assert.equal(dispatched[0].type, "DECREMENT_NOTIFICATION_BADGE");
  assert.equal(dispatched[0].payload, 1);
  assert.equal(isNotificationRead(notif1, userId, orgId), true);

  // Clicking the same notification again does NOT decrement badge
  const result2 = markNotificationAsRead(
    notif1.id,
    userId,
    orgId,
    mockDispatch
  );
  assert.equal(result2, false);
  assert.equal(dispatched.length, 1); // no new action dispatched!

  // notif2 is still unread
  assert.equal(isNotificationRead(notif2, userId, orgId), false);

  delete globalThis.window;
});

test("fetchAndSyncUnreadBadge respects seenAt and unread status", async () => {
  const mockStorage = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) || null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
      removeItem: (key) => mockStorage.delete(key),
      clear: () => mockStorage.clear(),
    },
  };

  const userId = "test-user-sync";
  const orgId = "test-org-sync";

  const baselineTime = 1000000;
  const mockNotifications = [
    { id: "notif-old", created_at: baselineTime - 10000, is_read: false },
    {
      id: "notif-new-unread",
      created_at: baselineTime + 10000,
      is_read: false,
    },
    { id: "notif-new-read", created_at: baselineTime + 20000, is_read: false },
  ];

  const mockFetcher = async () => ({
    status: 200,
    data: { data: { notifications: mockNotifications } },
  });

  const dispatched = [];
  const mockDispatch = (action) => dispatched.push(action);

  // 1. With no seenAt, the sync stores one and reports 0
  assert.equal(getSeenAt(userId, orgId), null);
  const initialCount = await fetchAndSyncUnreadBadge(
    orgId,
    userId,
    mockDispatch,
    mockFetcher
  );
  assert.equal(initialCount, 0);
  assert.ok(getSeenAt(userId, orgId) !== null);
  assert.equal(
    dispatched[dispatched.length - 1].type,
    "SET_NOTIFICATION_BADGE"
  );
  assert.equal(dispatched[dispatched.length - 1].payload, 0);

  // Set seenAt to baselineTime for explicit testing
  mockStorage.set(
    `zedu_notifications_seen_at_${userId}_${orgId}`,
    String(baselineTime)
  );
  assert.equal(getSeenAt(userId, orgId), baselineTime);

  // 2. Items older than seenAt don't count, even if unread
  // 3. A newer unread item counts, and a newer read item doesn't
  markNotificationAsRead("notif-new-read", userId, orgId);

  dispatched.length = 0;
  const countWithNewer = await fetchAndSyncUnreadBadge(
    orgId,
    userId,
    mockDispatch,
    mockFetcher
  );
  assert.equal(countWithNewer, 1);
  assert.equal(
    dispatched[dispatched.length - 1].type,
    "SET_NOTIFICATION_BADGE"
  );
  assert.equal(dispatched[dispatched.length - 1].payload, 1);

  // 4. After markNotificationsSeen, the count is 0
  markNotificationsSeen(userId, orgId);
  dispatched.length = 0;
  const countAfterSeen = await fetchAndSyncUnreadBadge(
    orgId,
    userId,
    mockDispatch,
    mockFetcher
  );
  assert.equal(countAfterSeen, 0);
  assert.equal(
    dispatched[dispatched.length - 1].type,
    "SET_NOTIFICATION_BADGE"
  );
  assert.equal(dispatched[dispatched.length - 1].payload, 0);

  // 5. Handles ISO strings and sent_at field
  const now = Date.now();
  mockStorage.set(`zedu_notifications_seen_at_${userId}_${orgId}`, String(now));
  const isoFetcher = async () => ({
    status: 200,
    data: {
      data: {
        notifications: [
          {
            id: "notif-iso-old",
            sent_at: new Date(now - 60000).toISOString(),
            is_read: false,
          },
          {
            id: "notif-iso-new",
            sent_at: new Date(now + 60000).toISOString(),
            is_read: false,
          },
        ],
      },
    },
  });

  dispatched.length = 0;
  const countIso = await fetchAndSyncUnreadBadge(
    orgId,
    userId,
    mockDispatch,
    isoFetcher
  );
  assert.equal(countIso, 1);
  assert.equal(dispatched[dispatched.length - 1].payload, 1);

  delete globalThis.window;
});

test("unified unread definition: items older than seenAt do not show unread indicator or decrement badge", () => {
  const mockStorage = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) || null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
      removeItem: (key) => mockStorage.delete(key),
      clear: () => mockStorage.clear(),
    },
  };

  const userId = "test-user-unified";
  const orgId = "test-org-unified";
  const seenTime = 1700000000000;

  // Set seenAt
  mockStorage.set(
    `zedu_notifications_seen_at_${userId}_${orgId}`,
    String(seenTime)
  );

  const oldItem = {
    id: "notif-old-1",
    created_at: new Date(seenTime - 60000).toISOString(),
    is_read: false,
  };
  const newItem = {
    id: "notif-new-1",
    created_at: new Date(seenTime + 60000).toISOString(),
    is_read: false,
  };

  // 1. isNotificationUnread treats old item as NOT unread, and new item as unread
  assert.equal(isNotificationUnread(oldItem, userId, orgId), false);
  assert.equal(isNotificationUnread(newItem, userId, orgId), true);

  const dispatched = [];
  const mockDispatch = (action) => dispatched.push(action);

  // 2. Clicking an older item (already seen) does NOT dispatch DECREMENT_NOTIFICATION_BADGE
  const oldResult = markNotificationAsRead(
    oldItem,
    userId,
    orgId,
    mockDispatch
  );
  assert.equal(oldResult, true); // marks id in read set
  assert.equal(dispatched.length, 0); // did NOT decrement badge!

  // 3. Clicking the newer unread item DOES dispatch DECREMENT_NOTIFICATION_BADGE
  const newResult = markNotificationAsRead(
    newItem,
    userId,
    orgId,
    mockDispatch
  );
  assert.equal(newResult, true);
  assert.equal(dispatched.length, 1);
  assert.equal(dispatched[0].type, "DECREMENT_NOTIFICATION_BADGE");
  assert.equal(dispatched[0].payload, 1);

  // 4. Now both are marked read
  assert.equal(isNotificationUnread(oldItem, userId, orgId), false);
  assert.equal(isNotificationUnread(newItem, userId, orgId), false);

  delete globalThis.window;
});
