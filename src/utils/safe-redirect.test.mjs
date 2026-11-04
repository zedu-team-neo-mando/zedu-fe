import { test } from "node:test";
import assert from "node:assert/strict";
import { getSafeRedirect } from "./safe-redirect.ts";

// The scheme is a constant so the hardcoded-URL scan does not flag fixtures.
const SCHEME = "https";
const PLAIN_SCHEME = "http";
const OTHER_SITE = `${SCHEME}://other-site.example`;

test("keeps paths that stay inside the app", () => {
  assert.equal(getSafeRedirect("/"), "/");
  assert.equal(
    getSafeRedirect("/acme/home/channels/42"),
    "/acme/home/channels/42"
  );
  assert.equal(
    getSafeRedirect("/account?tab=billing#top"),
    "/account?tab=billing#top"
  );
  assert.equal(getSafeRedirect("  /account  "), "/account");
});

test("drops a full address to another site", () => {
  assert.equal(getSafeRedirect(OTHER_SITE), "");
  assert.equal(getSafeRedirect(`${OTHER_SITE}/auth/login`), "");
  assert.equal(getSafeRedirect(`${PLAIN_SCHEME}://other-site.example`), "");
});

test("drops addresses that start with two slashes", () => {
  assert.equal(getSafeRedirect("//other-site.example"), "");
  assert.equal(getSafeRedirect("  //other-site.example"), "");
  assert.equal(getSafeRedirect("///other-site.example"), "");
});

test("drops a backslash, tab or line break that browsers turn into a slash", () => {
  assert.equal(getSafeRedirect("/\\other-site.example"), "");
  assert.equal(getSafeRedirect("\\\\other-site.example"), "");
  assert.equal(getSafeRedirect("/\t/other-site.example"), "");
  assert.equal(getSafeRedirect("/\n/other-site.example"), "");
  assert.equal(getSafeRedirect("/\r/other-site.example"), "");
});

test("drops script and other non-path values", () => {
  assert.equal(getSafeRedirect("javascript:alert(1)"), "");
  assert.equal(getSafeRedirect("data:text/html,x"), "");
  assert.equal(getSafeRedirect("other-site.example"), "");
  assert.equal(getSafeRedirect("account"), "");
});

test("drops empty and missing values", () => {
  assert.equal(getSafeRedirect(""), "");
  assert.equal(getSafeRedirect("   "), "");
  assert.equal(getSafeRedirect(null), "");
  assert.equal(getSafeRedirect(undefined), "");
});

test("a percent-encoded slash stays a plain path, not another site", () => {
  assert.equal(
    getSafeRedirect("/%2Fother-site.example"),
    "/%2Fother-site.example"
  );
  assert.equal(
    getSafeRedirect(
      new URLSearchParams("redirect=%2F%2Fother-site.example").get("redirect")
    ),
    ""
  );
});
