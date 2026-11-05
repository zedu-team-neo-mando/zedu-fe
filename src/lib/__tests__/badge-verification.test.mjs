import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getCredentialById,
  getAllCredentials,
  buildLinkedInCertificationUrl,
  calculateEngagementTier,
  generateVerificationHash,
  SEED_CREDENTIALS,
} from "../../app/(homepage)/_components/badges/badge-credential-data.ts";

describe("Proof-of-Contribution Verifiable Badges", () => {
  it("retrieves valid credentials by ID case-insensitively", () => {
    const cred = getCredentialById("ZEDU-VERIFY-2026-98412");
    assert.ok(cred, "Credential ZEDU-VERIFY-2026-98412 should exist");
    assert.equal(cred.recipientName, "Majiroghene Emmanuel Enaye");
    assert.equal(cred.recipientHandle, "Only1mjay");
    assert.equal(cred.tier, "top-peer-mentor");

    // Case-insensitivity check
    const lowercase = getCredentialById("zedu-verify-2026-98412");
    assert.ok(lowercase);
    assert.equal(lowercase.id, "ZEDU-VERIFY-2026-98412");
  });

  it("returns undefined for forged or unknown badge IDs", () => {
    assert.equal(getCredentialById("ZEDU-FORGED-99999"), undefined);
    assert.equal(getCredentialById(""), undefined);
    assert.equal(getCredentialById(null), undefined);
  });

  it("contains complete and cryptographically hashed seed credentials", () => {
    const all = getAllCredentials();
    assert.ok(all.length >= 3, "Expected at least 3 seed credentials");

    all.forEach((c) => {
      assert.ok(c.id.startsWith("ZEDU-VERIFY-"));
      assert.ok(c.recipientName.length > 0);
      assert.ok(c.cryptographicHash.startsWith("0x"));
      assert.ok(c.metrics.solutionsProvided > 0);
      assert.ok(c.metrics.buzzStudyHours > 0);
      assert.ok(c.skills.length > 0);
      assert.ok(c.endorsements.length > 0);
    });
  });

  it("constructs compliant LinkedIn 1-click certification URLs", () => {
    const PROTO = "https";
    const testCertUrl = `${PROTO}://zedu.chat/badges/verify/ZEDU-VERIFY-2026-98412`;
    const urlString = buildLinkedInCertificationUrl({
      name: "Verified Top Peer Mentor - Zedu Chat",
      organizationName: "Zedu Chat",
      issueYear: 2026,
      issueMonth: 11,
      certUrl: testCertUrl,
      certId: "ZEDU-VERIFY-2026-98412",
    });

    const url = new URL(urlString);
    assert.equal(url.hostname, "www.linkedin.com");
    assert.equal(url.pathname, "/profile/add");
    assert.equal(url.searchParams.get("startTask"), "CERTIFICATION_NAME");
    assert.equal(
      url.searchParams.get("name"),
      "Verified Top Peer Mentor - Zedu Chat"
    );
    assert.equal(url.searchParams.get("organizationName"), "Zedu Chat");
    assert.equal(url.searchParams.get("issueYear"), "2026");
    assert.equal(url.searchParams.get("issueMonth"), "11");
    assert.equal(url.searchParams.get("certUrl"), testCertUrl);
    assert.equal(url.searchParams.get("certId"), "ZEDU-VERIFY-2026-98412");
  });

  it("accurately scores and categorizes engagement tiers", () => {
    // Top Peer Mentor
    assert.equal(
      calculateEngagementTier({
        solutionsProvided: 55,
        buzzStudyHours: 25,
        whiteboardTutorials: 12,
      }),
      "top-peer-mentor"
    );

    // Active Collaborator
    assert.equal(
      calculateEngagementTier({
        solutionsProvided: 30,
        buzzStudyHours: 12,
        whiteboardTutorials: 6,
      }),
      "active-collaborator"
    );

    // Study Circle Lead
    assert.equal(
      calculateEngagementTier({
        solutionsProvided: 10,
        buzzStudyHours: 16,
        whiteboardTutorials: 2,
      }),
      "study-circle-lead"
    );

    // Whiteboard Architect
    assert.equal(
      calculateEngagementTier({
        solutionsProvided: 8,
        buzzStudyHours: 5,
        whiteboardTutorials: 15,
      }),
      "whiteboard-architect"
    );
  });

  it("generates deterministic verification checksums", () => {
    const hash1 = generateVerificationHash(
      "ZEDU-VERIFY-2026-98412",
      "Majiroghene Emmanuel Enaye",
      "November 4, 2026"
    );
    const hash2 = generateVerificationHash(
      "ZEDU-VERIFY-2026-98412",
      "Majiroghene Emmanuel Enaye",
      "November 4, 2026"
    );
    assert.equal(hash1, hash2);
    assert.ok(hash1.startsWith("0x"));

    const different = generateVerificationHash(
      "ZEDU-VERIFY-2026-98412",
      "Other Person",
      "November 4, 2026"
    );
    assert.notEqual(hash1, different);
  });
});
