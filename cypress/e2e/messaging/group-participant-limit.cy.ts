/**
 * Run with NEXT_PUBLIC_BASE_URL pointed at a local API URL and
 * CYPRESS_baseUrl pointed at the local app. Every API request is stubbed.
 */
export {};

const ORG = "11111111-1111-4111-8111-111111111111";
const SLUG = "testorg";
const CHANNEL = "22222222-2222-4222-8222-222222222222";
const members = Array.from({ length: 13 }, (_, index) => ({
  id: `person-${index + 1}`,
  user_id: `person-${index + 1}`,
  name: `Person ${index + 1}`,
  username: `person${index + 1}`,
  avatar_url: "/zedu-icon.png",
  default_avatar_url: "/zedu-icon.png",
}));

Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("OneSignal")
);

const selectInNewChat = (method: "mouse" | "keyboard") => {
  cy.contains("span", "With:").parent().find("input").click();
  if (method === "mouse") {
    cy.get('[data-row-index="0"]').click();
  } else {
    cy.contains("span", "With:").parent().find("input").type("{enter}");
  }
};

describe("group participant limits and first message", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.intercept("**/api/v1/**", {
      body: { status: "success", data: [] },
    });
    cy.intercept("GET", "**/api/v1/profile", {
      body: {
        data: { id: "self", user_id: "self", username: "Tester" },
      },
    });
    cy.intercept("GET", `**/organisations/${ORG}`, {
      body: {
        data: {
          id: ORG,
          name: "Test Org",
          organisation_slug: SLUG,
          role: "owner",
        },
      },
    });
    cy.intercept("GET", `**/organisations/${ORG}/users?*`, {
      body: { data: members, pagination: { total_pages: 1 } },
    });
    cy.intercept("GET", `**/organisations/${ORG}/dms/participants/${CHANNEL}`, {
      body: {
        data: {
          participants: members.slice(0, 3).map((member) => ({
            user_id: member.id,
            username: member.username,
          })),
        },
      },
    });
    cy.visit(`/${SLUG}/home/people/new-chat`, {
      onBeforeLoad: ({ localStorage }) => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("orgId", ORG);
        localStorage.setItem("orgSlug", SLUG);
      },
    });
    cy.get(".ProseMirror").should("be.visible");
  });

  for (const method of ["mouse", "keyboard"] as const) {
    it(`stops at 9 people using ${method} and permits removal`, () => {
      for (let index = 0; index < 9; index++) selectInNewChat(method);
      cy.contains("You can select up to 9 people.").should("be.visible");
      selectInNewChat(method);
      cy.contains("span", "With:")
        .parent()
        .find("button")
        .should("have.length", 9)
        .first()
        .click();
      cy.contains("span", "With:")
        .parent()
        .find("button")
        .should("have.length", 8);
      selectInNewChat(method);
      cy.contains("span", "With:")
        .parent()
        .find("button")
        .should("have.length", 9);

      cy.intercept("POST", `**/organisations/${ORG}/group-dms`, {
        statusCode: 201,
        body: { data: { channel_id: CHANNEL } },
      }).as("createGroup");
      cy.intercept("POST", `**/group-dms/channels/${CHANNEL}/threads`, {
        statusCode: 201,
        body: { data: {} },
      });
      cy.get(".ProseMirror").type("Hello group");
      cy.get('button[type="submit"]').last().click();
      cy.wait("@createGroup")
        .its("request.body.participants")
        .should("have.length", 9);
      cy.location("pathname").should(
        "eq",
        `/${SLUG}/home/people/${CHANNEL}/dms`
      );
    });
  }

  it("still creates a direct message with one selected person", () => {
    selectInNewChat("mouse");
    cy.intercept("POST", `**/organisations/${ORG}/dms`, {
      statusCode: 201,
      body: { data: { channel_id: CHANNEL, participant_id: "person-1" } },
    }).as("createDm");
    cy.intercept("POST", `**/dms/channels/${CHANNEL}/threads`, {
      statusCode: 201,
      body: { data: {} },
    }).as("sendDm");
    cy.get(".ProseMirror").type("Hello person");
    cy.get('button[type="submit"]').last().click();
    cy.wait("@createDm")
      .its("request.body.participant_id")
      .should("eq", "person-1");
    cy.wait("@sendDm");
    cy.location("pathname").should(
      "eq",
      `/${SLUG}/home/people/${CHANNEL}/person-1/dm`
    );
  });

  it("keeps text and attachments after failures, then sends once", () => {
    selectInNewChat("mouse");
    selectInNewChat("mouse");
    cy.intercept("POST", `**/organisations/${ORG}/group-dms`, {
      statusCode: 500,
      body: { message: "Validation failed" },
    }).as("createFailed");
    cy.intercept("POST", "**/files/upload-files", {
      body: { data: [{ id: "file-1", file_name: "draft.txt" }] },
    }).as("upload");
    cy.get('input[type="file"]')
      .first()
      .selectFile(
        {
          contents: Cypress.Buffer.from("draft"),
          fileName: "draft.txt",
          mimeType: "text/plain",
        },
        { force: true }
      );
    cy.wait("@upload");
    cy.get(".ProseMirror").type("Keep this draft");
    cy.get('button[type="submit"]').last().click();
    cy.wait("@createFailed");
    cy.get(".ProseMirror").should("contain.text", "Keep this draft");
    cy.contains("draft.txt").should("be.visible");

    cy.intercept("POST", `**/organisations/${ORG}/group-dms`, {
      statusCode: 201,
      body: { data: { channel_id: CHANNEL } },
    }).as("createSuccess");
    cy.intercept("POST", `**/group-dms/channels/${CHANNEL}/threads`, {
      statusCode: 500,
      body: { message: "Send failed" },
    }).as("sendFailed");
    cy.get('button[type="submit"]').last().click();
    cy.wait(["@createSuccess", "@sendFailed"]);
    cy.get(".ProseMirror").should("contain.text", "Keep this draft");
    cy.contains("draft.txt").should("be.visible");

    const cleared = { count: 0 };
    cy.get(".ProseMirror").then(($editor) => {
      const element = $editor[0];
      let wasEmpty = !element.textContent?.trim();
      new MutationObserver(() => {
        const isEmpty = !element.textContent?.trim();
        if (isEmpty && !wasEmpty) cleared.count++;
        wasEmpty = isEmpty;
      }).observe(element, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });

    cy.intercept("POST", `**/group-dms/channels/${CHANNEL}/threads`, {
      statusCode: 201,
      delay: 400,
      body: { data: {} },
    }).as("sendSuccess");
    cy.get('button[type="submit"]').last().dblclick({ force: true });
    cy.wait("@sendSuccess");
    cy.get("@createSuccess.all").should("have.length", 1);
    cy.get("@sendSuccess.all").should("have.length", 1);
    cy.wrap(cleared).its("count").should("eq", 1);
    cy.location("pathname").should("eq", `/${SLUG}/home/people/${CHANNEL}/dms`);
  });

  it("limits additions per request, even when the group already has members", () => {
    cy.visit(`/${SLUG}/home/people/${CHANNEL}/dms`);
    cy.get("nav button").last().click();
    cy.contains("div", "Add members").click();
    cy.contains("h2", "Add members").parents(".rounded-xl").first().as("modal");

    for (let index = 0; index < 9; index++) {
      cy.get("@modal").find("div.cursor-pointer.rounded-lg").first().click();
    }
    cy.get("@modal")
      .contains("You can add up to 9 people at a time.")
      .should("be.visible");
    cy.get("@modal").find("div.cursor-pointer.rounded-lg").first().click();
    cy.get("@modal")
      .find("span")
      .filter((_, element) => /^Person \d+$/.test(element.textContent ?? ""))
      .should("have.length", 9);

    cy.get("@modal")
      .find("button")
      .filter((_, element) => Boolean(element.querySelector("svg.lucide-x")))
      .first()
      .click();
    cy.get("@modal")
      .find("span")
      .filter((_, element) => /^Person \d+$/.test(element.textContent ?? ""))
      .should("have.length", 8);
    cy.get("@modal").find("div.cursor-pointer.rounded-lg").first().click();

    cy.intercept("POST", `**/organisations/group-dms/${CHANNEL}/participants`, {
      statusCode: 201,
      body: { message: "Members added" },
    }).as("addMembers");
    cy.get("@modal").contains("button", "Add members").click();
    cy.wait("@addMembers")
      .its("request.body.user_ids")
      .should("have.length", 9);
    cy.contains("h2", "Add members").should("not.exist");
  });
});
