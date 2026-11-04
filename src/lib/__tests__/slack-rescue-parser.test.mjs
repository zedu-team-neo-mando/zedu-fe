import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseRawSlackFiles,
  formatSlackText,
  formatSlackTimestamp,
  searchArchive,
} from "../../app/(homepage)/_components/rescue/slack-parser.ts";

describe("SlackRescue Parser & Search", () => {
  it("formats user mentions and links in Slack messages", () => {
    const users = {
      U123: {
        id: "U123",
        name: "alex",
        realName: "Alex Mercer",
        displayName: "Alex (TA)",
      },
    };

    const testUrl = ["https:", "", "zedu.chat"].join("/");
    const raw = `Hello <@U123> check <${testUrl}|Zedu Chat>`;
    const formatted = formatSlackText(raw, users);
    assert.equal(formatted, `Hello @Alex (TA) check [Zedu Chat](${testUrl})`);
  });

  it("handles missing user mentions gracefully", () => {
    const raw = "Welcome <@UUNKNOWN>";
    const formatted = formatSlackText(raw, {});
    assert.equal(formatted, "Welcome @someone");
  });

  it("formats Slack timestamps into human-readable strings", () => {
    const ts = "1730000000.000100";
    const formatted = formatSlackTimestamp(ts);
    assert.ok(formatted.includes("2024"));
  });

  it("parses raw Slack export data structures into a validated archive", () => {
    const channels = [
      {
        id: "C01",
        name: "general",
        topic: { value: "Cohort discussions" },
        purpose: { value: "General questions" },
      },
    ];

    const users = [
      {
        id: "U01",
        name: "sarah",
        profile: {
          display_name: "Sarah Chen",
          image_72: "/avatars/avatar.png",
        },
      },
    ];

    const messages = {
      general: [
        {
          type: "message",
          user: "U01",
          text: "Week 1 whiteboard is live!",
          ts: "1730000100.000100",
          reactions: [{ name: "fire", count: 5 }],
        },
      ],
    };

    const archive = parseRawSlackFiles(
      channels,
      users,
      messages,
      "React Bootcamp"
    );

    assert.equal(archive.communityName, "React Bootcamp");
    assert.equal(archive.channels.length, 1);
    assert.equal(archive.channels[0].name, "general");
    assert.equal(archive.totalMessages, 1);

    const msg = archive.messagesByChannel.general[0];
    assert.equal(msg.userName, "Sarah Chen");
    assert.equal(msg.text, "Week 1 whiteboard is live!");
    assert.equal(msg.reactions.length, 1);
    assert.equal(msg.reactions[0].name, "fire");
    assert.equal(msg.reactions[0].count, 5);
  });

  it("handles corrupted or empty entries without crashing", () => {
    const archive = parseRawSlackFiles(
      [null, { name: "test" }],
      [null, { id: "U02" }],
      { test: [null, { type: "other" }, { type: "message", text: "valid" }] }
    );

    assert.equal(archive.channels.length, 1);
    assert.equal(archive.channels[0].messageCount, 1);
  });

  it("searches across channel messages and user names", () => {
    const channels = [{ id: "C01", name: "general" }];
    const users = [
      { id: "U01", name: "marcus", profile: { display_name: "Marcus TA" } },
    ];
    const messages = {
      general: [
        {
          type: "message",
          user: "U01",
          text: "Look at the React hook dependencies",
          ts: "1730000100",
        },
        {
          type: "message",
          user: "U02",
          username: "Student",
          text: "What is Next.js ISR?",
          ts: "1730000200",
        },
      ],
    };

    const archive = parseRawSlackFiles(channels, users, messages);

    const resultsByText = searchArchive(archive, "React hook");
    assert.equal(resultsByText.length, 1);
    assert.equal(resultsByText[0].text, "Look at the React hook dependencies");

    const resultsByUser = searchArchive(archive, "Marcus");
    assert.equal(resultsByUser.length, 1);

    const emptyResults = searchArchive(archive, "nonexistent");
    assert.equal(emptyResults.length, 0);
  });
});
