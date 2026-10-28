/**
 * Header search: a search with no matches shows "No matches found" and the
 * "View all results" button instead of nothing.
 * Needs only the app running; every API call is stubbed, so no real account
 * is used:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/search/header-search-empty.cy.ts
 */
export {};

const ORG = "11111111-1111-4111-8111-111111111111";
const SLUG = "testorg";
const SEARCH = "Search messages and people...";

// Without NEXT_PUBLIC_GTM_SCRIPT_URL the analytics <Script> loads the page's
// own HTML and throws "Unexpected token '<'"; push (OneSignal) isn't set up
// when testing either. Neither is related to search.
Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("OneSignal")
);

const MESSAGE = {
  user: { user_id: "user-1", user_name: "Ada Lovelace", avatar_url: "" },
  messages: [
    {
      message_id: "message-1",
      message: "<p>Welcome to general</p>",
      timestamp: new Date().toISOString(),
    },
  ],
  channel: { channel_id: "channel-1", channel_name: "general" },
};

const stubSearch = (messages: unknown[], delay = 0) => {
  cy.intercept("GET", `**/search/organisation/${ORG}?*`, {
    delay,
    body: { status: "success", data: messages },
  }).as("searchMessages");
  cy.intercept("GET", `**/organisations/${ORG}/users/search?*`, {
    delay,
    body: { status: "success", data: [] },
  }).as("searchUsers");
};

const searchFor = (query: string) =>
  cy.get(`input[placeholder="${SEARCH}"]`).click().type(query);

describe("header search with no matches", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    // Anything not stubbed below gets an empty success.
    cy.intercept(/\/api\/v1\//, { body: { status: "success", data: [] } });
    cy.intercept("GET", new RegExp(`/organisations/${ORG}$`), {
      body: {
        status: "success",
        data: { id: ORG, name: "Test Org", organisation_slug: SLUG },
      },
    });

    cy.visit(`/${SLUG}/buzzs`, {
      onBeforeLoad: ({ localStorage }) => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("orgId", ORG);
        localStorage.setItem("orgSlug", SLUG);
        localStorage.setItem("buzzs-hero-dismissed", "true");
      },
    });
    cy.get(`input[placeholder="${SEARCH}"]`).should("be.visible");
  });

  it('shows "Searching..." and then "No matches found"', () => {
    stubSearch([], 800);
    searchFor("zzqxjv");
    cy.contains("Searching...").should("be.visible");
    cy.wait(["@searchMessages", "@searchUsers"]);
    cy.contains("Searching...").should("not.exist");
    cy.contains("No matches found").should("be.visible");
    cy.contains("button", 'View all results for "zzqxjv"').should("be.visible");
  });

  it('opens the full results page from "View all results"', () => {
    stubSearch([]);
    searchFor("zzqxjv");
    cy.contains("button", 'View all results for "zzqxjv"').click();
    cy.location("pathname").should("eq", `/${SLUG}/search`);
    cy.location("search").should("eq", "?query=zzqxjv");
  });

  it("still lists results when there are matches", () => {
    stubSearch([MESSAGE]);
    searchFor("general");
    cy.contains("Welcome to general").should("be.visible");
    cy.contains("No matches found").should("not.exist");
    cy.contains("button", 'View all results for "general"').should(
      "be.visible"
    );
  });

  it("closes with Escape and with a click outside", () => {
    stubSearch([]);
    searchFor("zzqxjv");
    cy.contains("No matches found").should("be.visible");
    cy.get("body").type("{esc}");
    cy.contains("No matches found").should("not.exist");

    cy.get(`input[placeholder="${SEARCH}"]`).click();
    cy.contains("No matches found").should("be.visible");
    cy.get("body").click(5, 700);
    cy.contains("No matches found").should("not.exist");
  });
});
