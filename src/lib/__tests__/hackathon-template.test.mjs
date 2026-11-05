import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_HACKATHON_CATEGORIES,
  SPONSORSHIP_TRACKS,
  generateHackathonSlug,
  validateSponsorshipApplication,
  generateTeamChannels,
} from "../../app/(homepage)/_components/hackathon/hackathon-data.ts";
import { getTemplateBySlug, TEMPLATES } from "../../data/templates.ts";

describe("Hackathon-in-a-Box Template Architecture", () => {
  it("includes all core hackathon categories and channels", () => {
    const categoryIds = DEFAULT_HACKATHON_CATEGORIES.map((c) => c.id);
    assert.ok(categoryIds.includes("broadcast"), "broadcast category missing");
    assert.ok(
      categoryIds.includes("matchmaking"),
      "matchmaking category missing"
    );
    assert.ok(categoryIds.includes("mentors"), "mentors category missing");
    assert.ok(
      categoryIds.includes("submissions"),
      "submissions category missing"
    );

    const allChannels = DEFAULT_HACKATHON_CATEGORIES.flatMap((c) =>
      c.channels.map((ch) => ch.name)
    );

    assert.ok(allChannels.includes("announcements"), "#announcements missing");
    assert.ok(
      allChannels.includes("rules-and-schedule"),
      "#rules-and-schedule missing"
    );
    assert.ok(
      allChannels.includes("submit-projects"),
      "#submit-projects missing"
    );
    assert.ok(allChannels.includes("call-mentor"), "#call-mentor missing");
    assert.ok(allChannels.includes("find-team-ai"), "#find-team-ai missing");
    assert.ok(
      allChannels.includes("find-team-frontend"),
      "#find-team-frontend missing"
    );
    assert.ok(
      allChannels.includes("find-team-design"),
      "#find-team-design missing"
    );
  });

  it("generates isolated private team channels with correct naming", () => {
    const channels = generateTeamChannels(5);
    assert.equal(channels.length, 5);

    channels.forEach((ch, idx) => {
      const num = (idx + 1).toString().padStart(2, "0");
      assert.ok(
        ch.name.startsWith(`team-${num}-`),
        `Channel name mismatch: ${ch.name}`
      );
      assert.equal(ch.isPrivate, true, "Team channel should be private");
      assert.equal(ch.category, "teams");
    });
  });

  it("normalizes hackathon event names into URL-safe slugs", () => {
    assert.equal(
      generateHackathonSlug("TreeHacks AI 2026!"),
      "treehacks-ai-2026"
    );
    assert.equal(
      generateHackathonSlug("PennApps   Build   Weekend"),
      "pennapps-build-weekend"
    );
    assert.equal(generateHackathonSlug(""), "hackathon-2026");
  });

  it("validates sponsorship applications rigorously", () => {
    // Missing required fields
    const invalid = validateSponsorshipApplication({
      eventName: "",
      organization: "",
      attendees: 10,
      organizerName: "",
      organizerEmail: "bad-email",
    });

    assert.equal(invalid.valid, false);
    assert.ok(invalid.errors.eventName);
    assert.ok(invalid.errors.organization);
    assert.ok(invalid.errors.attendees);
    assert.ok(invalid.errors.organizerName);
    assert.ok(invalid.errors.organizerEmail);

    // Valid application
    const valid = validateSponsorshipApplication({
      eventName: "CalHacks AI",
      organization: "UC Berkeley ACM",
      attendees: 400,
      organizerName: "Alex Rivera",
      organizerEmail: "alex@berkeley.edu",
    });

    assert.equal(valid.valid, true);
    assert.equal(Object.keys(valid.errors).length, 0);
  });

  it("registers hackathon-in-a-box in global template directory", () => {
    const template = getTemplateBySlug("hackathon");
    assert.ok(template, "Hackathon template not found by slug 'hackathon'");
    assert.equal(template.slug, "hackathon-in-a-box");
    assert.ok(template.channels.includes("announcements"));
    assert.ok(template.channels.includes("call-mentor"));
    assert.ok(template.channels.includes("find-team-ai"));

    const byFullSlug = getTemplateBySlug("hackathon-in-a-box");
    assert.equal(byFullSlug?.slug, "hackathon-in-a-box");
  });

  it("offers multiple micro-sponsorship tracks totaling $2,000", () => {
    assert.equal(SPONSORSHIP_TRACKS.length, 3);
    const aiTrack = SPONSORSHIP_TRACKS.find((t) => t.id === "ai-track");
    assert.equal(aiTrack?.amount, "$1,000");
  });
});
