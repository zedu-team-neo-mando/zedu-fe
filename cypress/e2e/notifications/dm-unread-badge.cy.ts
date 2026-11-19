/**
 * Unread badge on the DMs icon in the left sidebar (Ziki #152): the total of
 * the per-conversation unread counts, each conversation counted once, capped
 * at "99+" and hidden when nothing is unread. The helper checks run in the
 * browser; the page checks need only the app running, with every API call
 * stubbed, so no real account is used:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/notifications/dm-unread-badge.cy.ts
 */
import {
  formatUnreadBadge,
  getDmUnreadTotal,
} from "../../../src/components/layout/sidebar/dm-unread";

const ORG = "11111111-1111-4111-8111-111111111111";
const SLUG = "testorg";
const CHANNEL = "22222222-2222-4222-8222-222222222222";
const DMS_LINK = `a[href="/${SLUG}/dm"]`;
const BADGE = "[data-dm-unread-badge]";

// Without NEXT_PUBLIC_GTM_SCRIPT_URL the analytics <Script> loads the page's
// own HTML and throws "Unexpected token '<'"; push (OneSignal) isn't set up
// when testing either. In `next dev` the root layout also reports a hydration
// mismatch (it happens on every page, with or without this change). None of
// these are related to the badge.
Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("OneSignal") &&
    !err.message.includes("Hydration failed")
);

describe("DM unread total", () => {
  it("adds up the unread counts of every conversation", () => {
    expect(
      getDmUnreadTotal([
        { channel_id: "a", thread_count: 4 },
        { channel_id: "b", thread_count: 2 },
        { channel_id: "c", thread_count: 0 },
      ])
    ).to.equal(6);
  });

  it("counts a conversation listed in both DM lists once", () => {
    expect(
      getDmUnreadTotal(
        [
          { channel_id: "a", thread_count: 4 },
          { channel_id: "b", thread_count: 1 },
        ],
        [
          { channel_id: "a", thread_count: 4 },
          { channel_id: "c", thread_count: 3 },
        ]
      )
    ).to.equal(8);
  });

  it("ignores missing lists, missing ids and invalid counts", () => {
    expect(getDmUnreadTotal(null, undefined)).to.equal(0);
    expect(
      getDmUnreadTotal([
        { thread_count: 5 },
        { channel_id: "a", thread_count: null },
        { channel_id: "b", thread_count: -3 },
        { channel_id: "c", thread_count: "2" },
        { channel_id: "d", thread_count: "abc" },
      ])
    ).to.equal(2);
  });

  it('caps the badge text at "99+"', () => {
    expect(formatUnreadBadge(1)).to.equal("1");
    expect(formatUnreadBadge(99)).to.equal("99");
    expect(formatUnreadBadge(100)).to.equal("99+");
  });
});

const stubApi = (
  dms: { channel_id: string; thread_count: number }[],
  visibleDms: { channel_id: string; thread_count: number }[]
) => {
  // Anything not stubbed below gets an empty success.
  cy.intercept(/\/api\/v1\//, { body: { status: "success", data: [] } });
  cy.intercept("GET", /\/api\/v1\/profile$/, {
    body: {
      status: "success",
      data: { id: "user-1", user_id: "user-1", username: "user-1" },
    },
  });
  cy.intercept("GET", new RegExp(`/organisations/${ORG}$`), {
    body: {
      status: "success",
      data: { id: ORG, name: "Test Org", organisation_slug: SLUG },
    },
  });
  cy.intercept("GET", new RegExp(`/api/v1/channels/${CHANNEL}$`), {
    body: {
      status: "success",
      data: { channels_id: CHANNEL, name: "general", access: true, users: [] },
    },
  });
  cy.intercept("GET", new RegExp(`/organisations/${ORG}/dms\\?`), {
    body: { status: "success", data: dms },
  });
  cy.intercept("GET", new RegExp(`/organisations/${ORG}/dms/visible\\?`), {
    body: { status: "success", data: visibleDms },
  });
};

const visit = () =>
  cy.visit(`/${SLUG}/home/channels/${CHANNEL}`, {
    onBeforeLoad: (win) => {
      win.localStorage.setItem("token", "test-token");
      win.localStorage.setItem("orgId", ORG);
      win.localStorage.setItem("orgSlug", SLUG);
    },
  });

describe("DMs icon unread badge", () => {
  // The sidebar rail is only on screen from the lg breakpoint up.
  beforeEach(() => cy.viewport(1280, 800));

  it("shows the total unread count, counting each conversation once", () => {
    stubApi(
      [
        { channel_id: "dm-a", thread_count: 3 },
        { channel_id: "dm-b", thread_count: 2 },
      ],
      [
        { channel_id: "dm-a", thread_count: 3 },
        { channel_id: "dm-c", thread_count: 1 },
      ]
    );
    visit();

    cy.get(DMS_LINK).find(BADGE).should("have.text", "6");
    cy.get(DMS_LINK).should("have.attr", "aria-label", "DMs, 6 unread");
  });

  it("hides the badge when nothing is unread", () => {
    stubApi(
      [{ channel_id: "dm-a", thread_count: 0 }],
      [{ channel_id: "dm-a", thread_count: 0 }]
    );
    visit();

    cy.get(DMS_LINK).should("be.visible");
    cy.get(DMS_LINK).find(BADGE).should("not.exist");
    cy.get(DMS_LINK).should("not.have.attr", "aria-label");
  });

  it('shows "99+" for more than 99 unread messages', () => {
    stubApi(
      [
        { channel_id: "dm-a", thread_count: 80 },
        { channel_id: "dm-b", thread_count: 45 },
      ],
      []
    );
    visit();

    cy.get(DMS_LINK).find(BADGE).should("have.text", "99+");
    cy.get(DMS_LINK).should("have.attr", "aria-label", "DMs, 125 unread");
  });
});
