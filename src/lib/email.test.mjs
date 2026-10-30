import test from "node:test";
import assert from "node:assert/strict";
import { isValidEmail } from "./email.ts";

test("accepts ordinary addresses", () => {
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("first.last+tag@mail.example.co.uk"), true);
  assert.equal(isValidEmail("a@b-c.io"), true);
});

test("rejects empty or dash-edged domain labels", () => {
  assert.equal(isValidEmail("x@y..z"), false);
  assert.equal(isValidEmail("a@..b"), false);
  assert.equal(isValidEmail("a@.b.c"), false);
  assert.equal(isValidEmail("a@-.-"), false);
  assert.equal(isValidEmail("a@-b.com"), false);
  assert.equal(isValidEmail("a@b-.com"), false);
});

test("rejects characters that cannot be in a domain label", () => {
  assert.equal(isValidEmail("a@exa!mple.com"), false);
  assert.equal(isValidEmail("a@exa_mple.com"), false);
  assert.equal(isValidEmail("a@exa,mple.com"), false);
  assert.equal(isValidEmail("a@exam ple.com"), false);
});

test("rejects a missing name, domain or dot", () => {
  assert.equal(isValidEmail("@example.com"), false);
  assert.equal(isValidEmail("user@"), false);
  assert.equal(isValidEmail("user@localhost"), false);
  assert.equal(isValidEmail("no-at-sign.com"), false);
  assert.equal(isValidEmail("a@b@c.com"), false);
});
