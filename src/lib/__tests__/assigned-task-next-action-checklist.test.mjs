import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ROLE_CONFIG, getRoleChecklist } from "../task-checklist.ts";

describe("Assigned Task Next-Action Checklist - Unit Tests", () => {
  describe("Role Configuration", () => {
    it("defines configuration for all 4 standard agent roles", () => {
      const roles = ["contributor", "reviewer", "triager", "observer"];
      for (const role of roles) {
        assert.ok(ROLE_CONFIG[role], `Missing role config for ${role}`);
        assert.ok(ROLE_CONFIG[role].title, `Missing title for ${role}`);
        assert.ok(
          ROLE_CONFIG[role].badgeColor,
          `Missing badgeColor for ${role}`
        );
        assert.ok(
          ROLE_CONFIG[role].description,
          `Missing description for ${role}`
        );
      }
    });
  });

  describe("Contributor Role Checklist", () => {
    it("marks offer acknowledged and flags active heartbeat/delivery in 'in_progress' state", () => {
      const items = getRoleChecklist("contributor", "in_progress", false);
      assert.equal(items.length, 3);

      const offerItem = items.find((i) => i.id === "contrib-offer");
      assert.ok(offerItem);
      assert.equal(offerItem.completed, true);

      const heartbeatItem = items.find((i) => i.id === "contrib-heartbeat");
      assert.ok(heartbeatItem);
      assert.equal(heartbeatItem.completed, false);
      assert.equal(heartbeatItem.actionRequired, true);

      const deliveryItem = items.find((i) => i.id === "contrib-delivery");
      assert.ok(deliveryItem);
      assert.equal(deliveryItem.completed, false);
      assert.equal(deliveryItem.actionRequired, true);
    });

    it("marks all contributor items completed once work is delivered", () => {
      const items = getRoleChecklist("contributor", "delivered", false);
      assert.ok(items.every((i) => i.completed === true));
    });
  });

  describe("Reviewer Role & Owner Independence", () => {
    it("disables reviewer actions and notes owner independence when isOwnerTask is true", () => {
      const items = getRoleChecklist("reviewer", "delivered", true);
      assert.equal(items.length, 3);

      const inspectItem = items.find((i) => i.id === "review-inspect");
      assert.ok(inspectItem);
      assert.ok(
        inspectItem.disabledReason?.includes("Self-review exclusion"),
        "Should explain owner independence restriction"
      );

      const verdictItem = items.find((i) => i.id === "review-verdict");
      assert.ok(verdictItem);
      assert.ok(
        verdictItem.disabledReason?.includes("owner-independence rule"),
        "Should disable verdict submission for owner tasks"
      );
    });

    it("enables reviewer actions when isOwnerTask is false and work is delivered", () => {
      const items = getRoleChecklist("reviewer", "delivered", false);
      const inspectItem = items.find((i) => i.id === "review-inspect");
      assert.ok(inspectItem);
      assert.equal(inspectItem.actionRequired, true);
      assert.equal(inspectItem.disabledReason, undefined);
    });
  });

  describe("Triager Role Checklist", () => {
    it("shows triage items completed when issue is beyond 'requires_confirmation'", () => {
      const items = getRoleChecklist("triager", "in_progress", false);
      assert.equal(items.length, 3);
      assert.ok(items.every((i) => i.completed === true));
    });

    it("shows triage items uncompleted when issue is at 'requires_confirmation'", () => {
      const items = getRoleChecklist("triager", "requires_confirmation", false);
      assert.equal(items.length, 3);
      assert.ok(items.every((i) => i.completed === false));
    });
  });

  describe("Observer Role Checklist", () => {
    it("renders read-only items and explicitly notes write controls are disabled", () => {
      const items = getRoleChecklist("observer", "in_progress", false);
      assert.equal(items.length, 2);

      const readonlyItem = items.find((i) => i.id === "observer-readonly");
      assert.ok(readonlyItem);
      assert.ok(
        readonlyItem.disabledReason?.includes("Write controls are disabled"),
        "Observer should note write action restriction"
      );
    });
  });
});
