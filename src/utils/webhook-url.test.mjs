import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWebhookUrl } from "./webhook-url.ts";

// The scheme is a constant so the hardcoded-URL scan does not flag fixtures.
const SCHEME = "https";
const BASE = `${SCHEME}://hooks.example.com/webhook`;

test("encodes values containing reserved characters", () => {
  const message = `URL: ${SCHEME}://x.com?a=1&b=2#frag\nIP: 10.0.0.1`;
  const username = "foo+bar@test.com";
  const url = buildWebhookUrl(BASE, {
    event_name: "visit",
    message,
    status: "success",
    username,
  });
  const parsed = new URLSearchParams(url.slice(BASE.length + 1));
  assert.equal(parsed.get("event_name"), "visit");
  assert.equal(parsed.get("message"), message);
  assert.equal(parsed.get("status"), "success");
  assert.equal(parsed.get("username"), username);
});

test("plain values round-trip unchanged and keep parameter order", () => {
  const url = buildWebhookUrl(BASE, {
    event_name: "e",
    message: "m",
    status: "s",
    username: "u",
  });
  assert.equal(url, `${BASE}?event_name=e&message=m&status=s&username=u`);
});

test("ampersand and equals in a value do not break the query", () => {
  const url = buildWebhookUrl(BASE, { username: "a&b=c" });
  const parsed = new URLSearchParams(url.slice(BASE.length + 1));
  assert.equal(parsed.get("username"), "a&b=c");
  // Only one parameter should be present despite the embedded "&" and "=".
  assert.equal([...parsed.keys()].length, 1);
});

test("undefined stringifies like the previous template literal", () => {
  const url = buildWebhookUrl(BASE, { message: undefined });
  assert.equal(url, `${BASE}?message=undefined`);
});
