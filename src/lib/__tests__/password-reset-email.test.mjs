import test from "node:test";
import assert from "node:assert/strict";

function resolveAuthEmailEndpoint(type) {
  const isVerification = type === "verification" || type === "verify";
  return isVerification ? "/auth/email-request" : "/auth/password-reset";
}

function normalizeAuthEmail(email) {
  return email ? email.trim().toLowerCase() : "";
}

function maskEmailAddress(email) {
  if (!email || !email.includes("@")) return email || "";
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.slice(0, 2)}***@${domain}`;
}

test("resolveAuthEmailEndpoint routes to /auth/password-reset by default", () => {
  assert.equal(resolveAuthEmailEndpoint(null), "/auth/password-reset");
  assert.equal(resolveAuthEmailEndpoint(""), "/auth/password-reset");
  assert.equal(resolveAuthEmailEndpoint("reset"), "/auth/password-reset");
});

test("resolveAuthEmailEndpoint routes to /auth/email-request only for verification", () => {
  assert.equal(resolveAuthEmailEndpoint("verification"), "/auth/email-request");
  assert.equal(resolveAuthEmailEndpoint("verify"), "/auth/email-request");
});

test("normalizeAuthEmail trims whitespace and lowercases email", () => {
  assert.equal(
    normalizeAuthEmail("  User.Test@Example.COM  "),
    "user.test@example.com"
  );
  assert.equal(normalizeAuthEmail(""), "");
});

test("maskEmailAddress masks email safely for password reset display", () => {
  assert.equal(maskEmailAddress("user.test@example.com"), "us***@example.com");
  assert.equal(maskEmailAddress("ab@example.com"), "a***@example.com");
  assert.equal(maskEmailAddress(""), "");
});
