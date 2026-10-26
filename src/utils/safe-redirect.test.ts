import { describe, it } from "node:test";
import assert from "node:assert/strict";
// @ts-ignore
import { isSafeInternalPath, getSafeRedirectUrl } from "./safe-redirect.ts";

describe("isSafeInternalPath", () => {
  it("accepts valid relative internal paths", () => {
    assert.equal(isSafeInternalPath("/"), true);
    assert.equal(isSafeInternalPath("/org/channels"), true);
    assert.equal(isSafeInternalPath("/workspace?tab=settings"), true);
    assert.equal(isSafeInternalPath("/path/to/page#section"), true);
    assert.equal(
      isSafeInternalPath("/invite?redirect=https://other.com"),
      true
    );
  });

  it("rejects absolute URLs with protocols", () => {
    assert.equal(isSafeInternalPath("https://example.org"), false);
    assert.equal(isSafeInternalPath("http://evil.com"), false);
    assert.equal(isSafeInternalPath("ftp://files.com"), false);
    assert.equal(isSafeInternalPath("javascript:alert(1)"), false);
    assert.equal(isSafeInternalPath("data:text/html,test"), false);
    assert.equal(isSafeInternalPath("vbscript:test"), false);
  });

  it("rejects protocol-relative and backslash URLs", () => {
    assert.equal(isSafeInternalPath("//evil.example"), false);
    assert.equal(isSafeInternalPath("//attacker.org/test"), false);
    assert.equal(isSafeInternalPath("/\\evil.example"), false);
    assert.equal(isSafeInternalPath("\\\\evil.example"), false);
    assert.equal(isSafeInternalPath("/test\\evil"), false);
  });

  it("rejects strings containing control characters", () => {
    assert.equal(isSafeInternalPath("/path\r\nevil"), false);
    assert.equal(isSafeInternalPath("/path\0evil"), false);
    assert.equal(isSafeInternalPath("/path\tevil"), false);
  });

  it("rejects null, undefined, and empty/whitespace strings", () => {
    assert.equal(isSafeInternalPath(null), false);
    assert.equal(isSafeInternalPath(undefined), false);
    assert.equal(isSafeInternalPath(""), false);
    assert.equal(isSafeInternalPath("   "), false);
  });
});

describe("getSafeRedirectUrl", () => {
  it("returns sanitized URL when valid", () => {
    assert.equal(getSafeRedirectUrl("/my-org"), "/my-org");
    assert.equal(getSafeRedirectUrl("/my-org/welcome"), "/my-org/welcome");
  });

  it("falls back to default destination on unsafe or empty inputs", () => {
    const fallback = "/default-org";
    assert.equal(
      getSafeRedirectUrl("https://phishing.site", fallback),
      fallback
    );
    assert.equal(getSafeRedirectUrl("//evil.com", fallback), fallback);
    assert.equal(getSafeRedirectUrl("javascript:evil()", fallback), fallback);
    assert.equal(getSafeRedirectUrl(null, fallback), fallback);
    assert.equal(getSafeRedirectUrl("", fallback), fallback);
  });

  it("preserves query parameters and properly appends coworkerId", () => {
    assert.equal(
      getSafeRedirectUrl("/my-org", "/fallback", "agent-123"),
      "/my-org?coworkerId=agent-123"
    );
    assert.equal(
      getSafeRedirectUrl("/my-org?view=messages", "/fallback", "agent-123"),
      "/my-org?view=messages&coworkerId=agent-123"
    );
  });
});
