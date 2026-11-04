/// <reference types="cypress" />

export {};

/**
 * Status text limit (issue #1052).
 *
 * Runs without a live account: the session, profile and organisation
 * bootstrap calls are stubbed and every status save is intercepted, so the
 * spec exercises the real workspace and dialog without registering users or
 * touching shared staging.
 *
 *   pnpm exec cypress run --spec cypress/e2e/profile/test_e2e_status_character_limit.cy.ts
 */
const ORG_ID = "org-1";
const ORG_SLUG = "mando";
const TOKEN = "stub-token";
const STATUS_MAX_LENGTH = 100;

const STATUS_INPUT = 'input[aria-label="Status text"]';
const STATUS_COUNTER = "#status-character-count";
const STATUS_DIALOG = '[role="dialog"]';

const user = {
  user_id: "user-ada",
  id: "user-ada",
  username: "ada",
  email: "ada@example.com",
  current_org: ORG_ID,
  current_organisation_slug: ORG_SLUG,
  pause_notification: false,
};

Cypress.on("uncaught:exception", (err) => {
  // Missing analytics config loads the page HTML as a script (`?id=undefined`).
  if (err.message.includes("OneSignal")) return false;
  if (err.message.includes("Unexpected token")) return false;
  return true;
});

/**
 * A string is well-formed when every high surrogate is followed by a low
 * surrogate and no low surrogate appears on its own. Same invariant as
 * `String.prototype.isWellFormed()`.
 */
const isWellFormed = (value: string) => {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) return false;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return false;
    }
  }
  return true;
};

/** Sets a value the way the browser does, then fires the React input event. */
const setNativeValue = (
  input: HTMLInputElement,
  value: string,
  inputType = "insertFromPaste",
  isComposing = false
) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )!.set!;
  setter.call(input, value);
  input.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      data: value,
      inputType,
      isComposing,
    })
  );
};

const stubWorkspace = () => {
  cy.intercept({ resourceType: /xhr|fetch/ }, (req) => {
    const url = new URL(req.url);
    const path = url.pathname;

    // Next.js dev RSC payloads are fetch requests too; let them reach the app.
    if (url.searchParams.has("_rsc")) {
      req.continue();
      return;
    }

    if (path.endsWith("/profile/change-status")) {
      req.alias = "saveStatus";
      req.reply({ statusCode: 200, body: { data: {} } });
      return;
    }

    if (path.endsWith("/profile")) {
      req.alias = "profile";
      req.reply({ statusCode: 200, body: { data: user } });
      return;
    }

    if (path.endsWith(`/organisations/${ORG_ID}`)) {
      req.alias = "organisation";
      req.reply({
        statusCode: 200,
        body: {
          data: {
            id: ORG_ID,
            name: "Mando",
            organisation_slug: ORG_SLUG,
            current_organisation_slug: ORG_SLUG,
          },
        },
      });
      return;
    }

    if (path.endsWith(`/organisations/${ORG_ID}/user-channels`)) {
      req.reply({
        statusCode: 200,
        body: {
          data: [
            {
              channels_id: "channel-1",
              name: "general",
              channel_name: "general",
            },
          ],
        },
      });
      return;
    }

    if (
      path.endsWith("/token/connection") ||
      path.endsWith("/token/subscription") ||
      path.endsWith("/firebase/token")
    ) {
      req.reply({ statusCode: 200, body: { data: { token: TOKEN } } });
      return;
    }

    req.reply({ statusCode: 200, body: { data: [] } });
  });
};

const openStatusDialog = () => {
  stubWorkspace();

  cy.visit(`/${ORG_SLUG}/settings/personal/account`, {
    timeout: 180000,
    onBeforeLoad(win) {
      win.localStorage.setItem("token", TOKEN);
      win.localStorage.setItem("orgId", ORG_ID);
      win.localStorage.setItem("orgSlug", ORG_SLUG);
      win.localStorage.setItem("user", JSON.stringify(user));
    },
  });

  // Wait for the stubbed profile so the page is fully hydrated.
  cy.contains(user.email, { timeout: 120000 }).should("be.visible");

  cy.contains("button", "Set a status").click();

  cy.get(STATUS_DIALOG).should("be.visible").and("contain", "Set a status");
  cy.get(STATUS_INPUT).should("be.visible").and("have.value", "");
  cy.get(STATUS_COUNTER).should("have.text", "0/100");
};

const typeStatus = (value: string) => {
  cy.get(STATUS_INPUT).clear().type(value);
};

describe("status character limit", () => {
  it("enforces the limit on typed, pasted and replaced text", () => {
    openStatusDialog();

    // Valid text updates the counter.
    typeStatus("Working remotely");
    cy.get(STATUS_INPUT).should("have.value", "Working remotely");
    cy.get(STATUS_COUNTER).should("have.text", "16/100");
    cy.screenshot("status-dialog-desktop");

    // Exactly 100 ASCII characters fit.
    typeStatus("a".repeat(STATUS_MAX_LENGTH));
    cy.get(STATUS_INPUT).should("have.value", "a".repeat(STATUS_MAX_LENGTH));
    cy.get(STATUS_COUNTER).should("have.text", "100/100");
    cy.screenshot("status-max-length");

    // Typing past the limit changes nothing.
    cy.get(STATUS_INPUT).type("b");
    cy.get(STATUS_INPUT).should("have.value", "a".repeat(STATUS_MAX_LENGTH));

    // More than 100 characters.
    typeStatus("x".repeat(140));
    cy.get(STATUS_INPUT).invoke("val").should("have.length", 100);
    cy.get(STATUS_COUNTER).should("have.text", "100/100");

    // Pasting an oversized value keeps the first 100 characters.
    cy.get(STATUS_INPUT).then(($input) =>
      setNativeValue($input[0] as HTMLInputElement, "p".repeat(150))
    );
    cy.get(STATUS_INPUT).should("have.value", "p".repeat(100));
    cy.get(STATUS_COUNTER).should("have.text", "100/100");

    // Selection replacement: replacing the last 5 of 100 characters with 20
    // characters yields a 115-unit value, trimmed back to the limit.
    cy.get(STATUS_INPUT).then(($input) =>
      setNativeValue(
        $input[0] as HTMLInputElement,
        "p".repeat(95) + "q".repeat(20)
      )
    );
    cy.get(STATUS_INPUT).should("have.value", "p".repeat(95) + "q".repeat(5));
    cy.get(STATUS_COUNTER).should("have.text", "100/100");

    // Existing validation and presets are unchanged.
    cy.get(STATUS_INPUT).clear();
    cy.contains("button", "Save").should("be.disabled");
    cy.get(STATUS_INPUT).type("   ");
    cy.contains("button", "Save").should("not.be.disabled");
    cy.get(STATUS_INPUT).clear();
    cy.contains("Commuting").click();
    cy.get(STATUS_INPUT).should("have.value", "Commuting");
    cy.get(STATUS_COUNTER).should("have.text", "9/100");
    cy.get("select").should("have.value", "30 minutes");

    // 390px layout keeps the counter visible next to the input.
    cy.viewport(390, 844);
    cy.get(STATUS_COUNTER).should("be.visible");
    cy.get(STATUS_DIALOG).should(($dialog) => {
      const dialog = $dialog[0].getBoundingClientRect();
      expect(dialog.left).to.be.at.least(0);
      expect(dialog.right).to.be.at.most(390);
    });
    cy.get(STATUS_COUNTER).should(($counter) => {
      const counter = $counter[0].getBoundingClientRect();
      expect(counter.width, "counter width").to.be.greaterThan(0);
      expect(counter.right).to.be.at.most(390);
    });
    cy.screenshot("status-dialog-mobile-390");
  });

  it("never splits a surrogate pair at the boundary", () => {
    openStatusDialog();

    // 99 ASCII + emoji is 101 code units: keep 99 ASCII, drop the whole emoji.
    cy.get(STATUS_INPUT).then(($input) =>
      setNativeValue($input[0] as HTMLInputElement, "a".repeat(99) + "😀")
    );
    cy.get(STATUS_INPUT).should("have.value", "a".repeat(99));
    cy.get(STATUS_INPUT)
      .invoke("val")
      .should((value) =>
        expect(isWellFormed(value as string), "well-formed value").to.eq(true)
      );
    cy.get(STATUS_COUNTER).should("have.text", "99/100");
    cy.screenshot("status-unicode-boundary");

    // Unicode paste: 60 emoji are 120 code units, so exactly 50 survive.
    cy.get(STATUS_INPUT).then(($input) =>
      setNativeValue($input[0] as HTMLInputElement, "😀".repeat(60))
    );
    cy.get(STATUS_INPUT).should("have.value", "😀".repeat(50));
    cy.get(STATUS_COUNTER).should("have.text", "100/100");

    // Mixed Unicode paste stays inside the limit and well-formed.
    cy.get(STATUS_INPUT).then(($input) =>
      setNativeValue(
        $input[0] as HTMLInputElement,
        "Café ☕️ 🚀 naïve — ".repeat(10)
      )
    );
    cy.get(STATUS_INPUT)
      .invoke("val")
      .should((value) => {
        const text = value as string;
        expect(text.length).to.be.at.most(STATUS_MAX_LENGTH);
        expect(isWellFormed(text), "well-formed value").to.eq(true);
      });
    cy.get(STATUS_COUNTER).should("have.text", "100/100");

    // A malformed programmatic value cannot reach the input either.
    cy.get(STATUS_INPUT).then(($input) =>
      setNativeValue($input[0] as HTMLInputElement, "a".repeat(99) + "\uD83D")
    );
    cy.get(STATUS_INPUT)
      .invoke("val")
      .should((value) => {
        expect(isWellFormed(value as string), "well-formed value").to.eq(true);
      });
  });

  it("does not rewrite an active IME composition", () => {
    openStatusDialog();

    cy.get(STATUS_INPUT).type("a".repeat(99));

    // Chrome exposes the composing text in the input value before commit.
    cy.get(STATUS_INPUT).then(($input) => {
      const input = $input[0] as HTMLInputElement;
      input.dispatchEvent(
        new CompositionEvent("compositionstart", { bubbles: true, data: "" })
      );
      setNativeValue(
        input,
        "a".repeat(99) + "😀",
        "insertCompositionText",
        true
      );

      expect(isWellFormed(input.value), "composition buffer").to.eq(true);
      expect(input.value, "composition buffer is untouched").to.eq(
        "a".repeat(99) + "😀"
      );
    });

    cy.get(STATUS_INPUT)
      .invoke("val")
      .should("eq", "a".repeat(99) + "😀");
    cy.screenshot("status-ime-composition");

    cy.get(STATUS_INPUT).then(($input) => {
      $input[0].dispatchEvent(
        new CompositionEvent("compositionend", { bubbles: true, data: "😀" })
      );
    });

    cy.get(STATUS_INPUT).should("have.value", "a".repeat(99));
    cy.get(STATUS_INPUT)
      .invoke("val")
      .should((value) =>
        expect(isWellFormed(value as string), "well-formed value").to.eq(true)
      );
    cy.get(STATUS_COUNTER).should("have.text", "99/100");
  });

  it("saves a bounded, well-formed status and closes the dialog", () => {
    openStatusDialog();

    cy.get(STATUS_INPUT).then(($input) =>
      setNativeValue($input[0] as HTMLInputElement, "😀".repeat(60))
    );
    cy.get(STATUS_INPUT).should("have.value", "😀".repeat(50));
    cy.get(STATUS_COUNTER).should("have.text", "100/100");

    cy.contains("button", "Save").click();
    cy.wait("@saveStatus").then(({ request }) => {
      expect(request.body.text).to.eq("😀".repeat(50));
      expect(request.body.text).to.have.length(100);
      expect(isWellFormed(request.body.text), "saved payload").to.eq(true);
      expect(request.body).to.include({
        icon: "",
        status_timeout: "Today",
        clear_status: false,
      });
    });

    cy.get(STATUS_DIALOG).should("not.exist");
  });
});
