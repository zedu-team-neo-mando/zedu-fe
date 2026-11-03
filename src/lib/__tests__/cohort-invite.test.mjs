import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  COHORT_REF,
  cohortBanner,
  cohortInviteMessage,
  preserveReferralParams,
  shareTargets,
  withCohortReferral,
} from "../cohort-invite.ts";

function site(path) {
  return "https:" + "//zedu.chat" + path;
}

describe("cohort invite links", () => {
  it("keeps the invitation token and adds referral parameters", () => {
    const link = withCohortReferral(
      site("/accept_general_invitation?org_id=org-1&invitation_token=abc"),
      {
        channelId: "channel-9",
        inviter: "Ada Okonkwo",
        cohort: "Frontend Cohort",
      }
    );
    const url = new URL(link);
    assert.equal(url.searchParams.get("org_id"), "org-1");
    assert.equal(url.searchParams.get("invitation_token"), "abc");
    assert.equal(url.searchParams.get("ref"), COHORT_REF);
    assert.equal(url.searchParams.get("channel_id"), "channel-9");
    assert.equal(url.searchParams.get("utm_source"), COHORT_REF);
    assert.equal(url.searchParams.get("utm_medium"), "peer");
    assert.equal(url.searchParams.get("utm_campaign"), "cohort_invite");
    assert.equal(url.searchParams.get("inviter"), "Ada Okonkwo");
    assert.equal(url.searchParams.get("cohort"), "Frontend Cohort");
  });

  it("preserves referral parameters when the guest is sent to sign up", () => {
    const current = new URLSearchParams(
      "org_id=org-1&invitation_token=abc&ref=cohort_share&channel_id=channel-9&utm_campaign=cohort_invite&inviter=Ada&cohort=Frontend"
    );
    const next = preserveReferralParams(
      current,
      new URLSearchParams("org_id=org-1&invitation_token=abc")
    );
    assert.equal(next.get("invitation_token"), "abc");
    assert.equal(next.get("ref"), "cohort_share");
    assert.equal(next.get("channel_id"), "channel-9");
    assert.equal(next.get("inviter"), "Ada");
    assert.equal(next.get("cohort"), "Frontend");
    assert.equal(next.get("utm_campaign"), "cohort_invite");
  });

  it("writes the guest banner and share links from the same names", () => {
    const banner = cohortBanner({
      ref: "cohort_share",
      inviter: "Ada",
      cohort: "Frontend Cohort",
      organisation: "HNG",
    });
    assert.equal(
      banner,
      "You've been invited by Ada to join Frontend Cohort on Zedu"
    );
    assert.equal(
      cohortBanner({
        ref: null,
        inviter: null,
        cohort: null,
        organisation: "HNG",
      }),
      null
    );

    const joinLink = site("/join");
    const message = cohortInviteMessage(joinLink, "Ada", "Frontend Cohort");
    const targets = shareTargets(message, joinLink);
    assert.match(targets.whatsapp, /^https:\/\/wa\.me\/\?text=/);
    assert.match(targets.telegram, /^https:\/\/t\.me\/share\/url\?/);
    assert.match(targets.x, /^https:\/\/twitter\.com\/intent\/tweet\?text=/);
    assert.match(decodeURIComponent(targets.x), /Frontend Cohort/);
  });
});
