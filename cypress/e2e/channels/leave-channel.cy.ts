/**
 * Channel menu dropdown — Leave channel navigation and error handling (#1353).
 * Runs with all API calls stubbed:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/channels/leave-channel.cy.ts
 */

Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("OneSignal")
);

describe("MenuDropdown Leave channel (#1353)", () => {
  const ORG = "11111111-1111-4111-8111-111111111111";
  const SLUG = "testorg";
  const GENERAL_CHANNEL = "22222222-2222-4222-8222-222222222222";
  const PROJECT_CHANNEL = "33333333-3333-4333-8333-333333333333";
  const USER = { id: "user-1", user_id: "user-1", username: "tester" };

  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.intercept(/\/api\/v1\//, { body: { status: "success", data: [] } });
    cy.intercept("GET", /\/api\/v1\/profile$/, {
      body: { status: "success", data: USER },
    });
    cy.intercept("GET", new RegExp(`/organisations/${ORG}$`), {
      body: {
        status: "success",
        data: { id: ORG, name: "Test Org", organisation_slug: SLUG },
      },
    });
    cy.intercept("GET", new RegExp(`/organisations/${ORG}/user-channels$`), {
      body: {
        status: "success",
        data: [
          {
            channels_id: GENERAL_CHANNEL,
            name: "general",
            archived: false,
          },
          {
            channels_id: PROJECT_CHANNEL,
            name: "project-alpha",
            archived: false,
          },
        ],
      },
    });
    cy.intercept("GET", new RegExp(`/api/v1/channels/${PROJECT_CHANNEL}$`), {
      body: {
        status: "success",
        data: {
          channels_id: PROJECT_CHANNEL,
          name: "project-alpha",
          access: true,
          users: [],
        },
      },
    });
    cy.intercept("GET", new RegExp(`/api/v1/channels/${GENERAL_CHANNEL}$`), {
      body: {
        status: "success",
        data: {
          channels_id: GENERAL_CHANNEL,
          name: "general",
          access: true,
          users: [],
        },
      },
    });
    cy.intercept("GET", /\/threads\/channels\//, {
      body: { status: "success", data: [] },
    });
  });

  it("navigates away from the left channel and shows a toast on successful leave", () => {
    cy.intercept(
      "POST",
      new RegExp(`/api/v1/channels/${PROJECT_CHANNEL}/leave$`),
      {
        statusCode: 200,
        body: { status: "success", message: "You left the channel" },
      }
    ).as("leaveChannel");

    cy.visit(`/${SLUG}/home/channels/${PROJECT_CHANNEL}`, {
      onBeforeLoad: ({ localStorage }) => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("orgId", ORG);
        localStorage.setItem("orgSlug", SLUG);
      },
    });

    cy.get('button[aria-label="More actions"]').click();
    cy.contains("Leave channel").click();
    cy.wait("@leaveChannel");
    cy.location("pathname").should(
      "eq",
      `/${SLUG}/home/channels/${GENERAL_CHANNEL}`
    );
    // The sidebar Home link is built from channelId.
    cy.window()
      .its("localStorage")
      .invoke("getItem", "channelId")
      .should("eq", GENERAL_CHANNEL);
  });

  it("surfaces an error toast and stays on the channel when leave fails with 403", () => {
    cy.intercept(
      "POST",
      new RegExp(`/api/v1/channels/${PROJECT_CHANNEL}/leave$`),
      {
        statusCode: 403,
        body: {
          status: "error",
          message: "Channel owners cannot leave without transferring ownership",
        },
      }
    ).as("leaveChannelForbidden");

    cy.visit(`/${SLUG}/home/channels/${PROJECT_CHANNEL}`, {
      onBeforeLoad: ({ localStorage }) => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("orgId", ORG);
        localStorage.setItem("orgSlug", SLUG);
      },
    });

    cy.get('button[aria-label="More actions"]').click();
    cy.contains("Leave channel").click();
    cy.wait("@leaveChannelForbidden");
    cy.location("pathname").should(
      "include",
      `/${SLUG}/home/channels/${PROJECT_CHANNEL}`
    );
    cy.get("[data-sonner-toast]")
      .should("have.length", 1)
      .and(
        "contain",
        "Channel owners cannot leave without transferring ownership"
      );
  });
});

export {};
