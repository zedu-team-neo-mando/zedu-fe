import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

const srcBase = new URL("../", import.meta.url).href;
const loaderCode = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/navigation') {
    return {
      shortCircuit: true,
      url: 'data:text/javascript,' + encodeURIComponent('export const usePathname = () => "/";')
    };
  }
  if (specifier === '~/utils/webhook-request') {
    return {
      shortCircuit: true,
      url: 'data:text/javascript,' + encodeURIComponent('export const PageVisitsWebhook = async () => {};')
    };
  }
  if (specifier === '~/lib/env-urls') {
    return {
      shortCircuit: true,
      url: 'data:text/javascript,' + encodeURIComponent('export const ipifyUrl = () => "https://api.ipify.org?format=json";')
    };
  }
  if (specifier.startsWith('~/')) {
    const rel = specifier.slice(2);
    const target = '${srcBase}' + rel + (rel.endsWith('.ts') ? '' : '.ts');
    return { shortCircuit: true, url: target };
  }
  return nextResolve(specifier, context);
}
`;
register(
  "data:text/javascript," + encodeURIComponent(loaderCode),
  import.meta.url
);

// Mock browser globals for testing storage helpers
const storage = new Map();
globalThis.window = { location: { href: "https://zedu.chat/" } };
globalThis.document = { referrer: "" };
globalThis.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => {
    storage.set(key, String(value));
  },
  removeItem: (key) => {
    storage.delete(key);
  },
  clear: () => {
    storage.clear();
  },
};

const { getStoredUser, getVisitorId, getLastVisit, setLastVisit } =
  await import("./useVisitTracker.ts");

test("getStoredUser handles malformed non-JSON data without throwing SyntaxError", () => {
  localStorage.setItem("user", "corrupted_json_data");
  const user = getStoredUser();
  assert.equal(
    user,
    null,
    "malformed JSON should return null fallback instead of throwing"
  );
});

test("getStoredUser handles null or empty storage values", () => {
  localStorage.removeItem("user");
  assert.equal(getStoredUser(), null);

  localStorage.setItem("user", "");
  assert.equal(getStoredUser(), null);
});

test("getStoredUser returns parsed user object when valid JSON is present", () => {
  localStorage.setItem(
    "user",
    JSON.stringify({ username: "sophia", email: "sophia@example.com" })
  );
  const user = getStoredUser();
  assert.deepEqual(user, { username: "sophia", email: "sophia@example.com" });
});

test("getVisitorId generates and caches UUID, and handles existing ID", () => {
  localStorage.removeItem("visitor_id");
  const id1 = getVisitorId();
  assert.ok(
    typeof id1 === "string" && id1.length > 0,
    "visitor ID should be a non-empty string"
  );

  const id2 = getVisitorId();
  assert.equal(id1, id2, "visitor ID should be preserved across invocations");
});

test("visit time helpers correctly store and retrieve timestamps", () => {
  localStorage.removeItem("last_visit_time");
  assert.equal(getLastVisit(), null);

  const timestamp = 1730491200000;
  setLastVisit(timestamp);
  assert.equal(getLastVisit(), timestamp);
});

test("defensive handlers survive storage throwing exceptions", () => {
  const originalGetItem = localStorage.getItem;
  localStorage.getItem = () => {
    throw new Error("Access denied");
  };

  assert.equal(
    getStoredUser(),
    null,
    "getStoredUser should catch storage errors"
  );
  assert.equal(
    getLastVisit(),
    null,
    "getLastVisit should catch storage errors"
  );
  assert.ok(
    typeof getVisitorId() === "string",
    "getVisitorId should fallback to random UUID"
  );

  localStorage.getItem = originalGetItem;
});
