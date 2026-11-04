import test from "node:test";
import assert from "node:assert/strict";
import {
  formatOrgName,
  invitePreviewCopy,
  isOrgId,
  memberCountFromOrgInfo,
  truncateName,
} from "./invite-preview.ts";

test("reads the count from each sentence the backend builds", () => {
  assert.equal(
    memberCountFromOrgInfo(
      "Ada, Tunde and 212 others are in this organisation"
    ),
    214
  );
  assert.equal(
    memberCountFromOrgInfo("Ada, Tunde and 1 other is in this organisation"),
    3
  );
  assert.equal(
    memberCountFromOrgInfo("Ada and Tunde are in this organisation"),
    2
  );
  assert.equal(memberCountFromOrgInfo("Ada is in this organisation"), 1);
});

test("returns null when there is no count to trust", () => {
  assert.equal(memberCountFromOrgInfo("No members yet"), null);
  assert.equal(memberCountFromOrgInfo("No named members yet"), null);
  assert.equal(memberCountFromOrgInfo(""), null);
  assert.equal(memberCountFromOrgInfo(undefined), null);
  assert.equal(memberCountFromOrgInfo(42), null);
});

test("shows the count only from five members up", () => {
  assert.equal(
    invitePreviewCopy("CSC 301", 214).countLine,
    "214 people are already in"
  );
  assert.equal(
    invitePreviewCopy("CSC 301", 5).countLine,
    "5 people are already in"
  );
  assert.equal(
    invitePreviewCopy("CSC 301", 4).countLine,
    "Be one of the first to join CSC 301"
  );
  assert.equal(
    invitePreviewCopy("CSC 301", null).countLine,
    "Be one of the first to join CSC 301"
  );
});

test("formats large counts with separators", () => {
  assert.equal(
    invitePreviewCopy("HNG", 12500).countLine,
    "12,500 people are already in"
  );
});

test("builds the title and description around the workspace name", () => {
  const copy = invitePreviewCopy("CSC 301", 214);
  assert.equal(copy.title, "Join CSC 301 on Zedu");
  assert.equal(
    copy.description,
    "214 people are already in. Accept your invite to chat, share files and learn together."
  );
});

test("never puts member names in the preview copy", () => {
  const info = "Ada, Tunde and 212 others are in this organisation";
  const copy = invitePreviewCopy("CSC 301", memberCountFromOrgInfo(info));
  for (const text of Object.values(copy)) {
    assert.equal(text.includes("Ada"), false);
    assert.equal(text.includes("Tunde"), false);
  }
});

test("accepts only uuid organisation ids", () => {
  assert.equal(isOrgId("0190a1b2-c3d4-7e5f-8a9b-0c1d2e3f4a5b"), true);
  assert.equal(isOrgId("not-an-id"), false);
  assert.equal(isOrgId("../../users"), false);
  assert.equal(isOrgId(null), false);
  assert.equal(isOrgId(["0190a1b2-c3d4-7e5f-8a9b-0c1d2e3f4a5b"]), false);
});

test("capitalises and tidies the workspace name", () => {
  assert.equal(formatOrgName("  csc   301 "), "Csc 301");
  assert.equal(formatOrgName(undefined), "");
});

test("cuts long names for the image", () => {
  assert.equal(truncateName("short"), "short");
  const long = "A".repeat(60);
  const cut = truncateName(long);
  assert.equal(cut.length, 48);
  assert.equal(cut.endsWith("…"), true);
});
