/**
 * Message text: an email address is plain text (or a mailto link), never a
 * mention, and real @ and # mentions next to it still render as mentions.
 * The tokenizer cases run in the browser; the channel checks need only the app
 * running, with every API call stubbed, so no real account is used:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/messaging/email-mentions.cy.ts
 */
import { tokenizeMessageText } from "../../../src/app/(client)/[org]/_components/ChannelMessage/tokenize-message-text";

const ORG = "11111111-1111-4111-8111-111111111111";
const SLUG = "testorg";
const CHANNEL = "22222222-2222-4222-8222-222222222222";
const USER = { id: "user-1", user_id: "user-1", username: "tester" };

// Without NEXT_PUBLIC_GTM_SCRIPT_URL the analytics <Script> loads the page's
// own HTML and throws "Unexpected token '<'"; push (OneSignal) isn't set up
// when testing either. Neither is related to message text.
Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("OneSignal")
);

// [input, emails, mentions]. Plain strings, without mailto links or mention
// markup, so only the tokenizer decides.
const CASES: [string, string[], string[]][] = [
  ["person@gmail.com", ["person@gmail.com"], []],
  ["first.last+tag@example.co.uk", ["first.last+tag@example.co.uk"], []],
  ["Contact person@team.example.org.", ["person@team.example.org"], []],
  ["@username and person@gmail.com", ["person@gmail.com"], ["@username"]],
  ["person@gmail.com and @username", ["person@gmail.com"], ["@username"]],
  ["(@username)", [], ["@username"]],
  [".@username", [], ["@username"]],
  ["Hello @username", [], ["@username"]],
  ["@first and @second", [], ["@first", "@second"]],
  ["@username and the team", [], ["@username"]],
  ["@username, please review.", [], ["@username"]],
  ["(@username); #general!", [], ["@username", "#general"]],
  ["@first.last and @second-user", [], ["@first.last", "@second-user"]],
  ["@first. and #general-", [], ["@first", "#general"]],
  ["@Jane Doe", [], ["@Jane"]],
  ["@channel", [], ["@channel"]],
  ["#channel", [], ["#channel"]],
  ["@channel and #channel", [], ["@channel", "#channel"]],
  [
    "@first person@gmail.com @second first.last+tag@example.co.uk",
    ["person@gmail.com", "first.last+tag@example.co.uk"],
    ["@first", "@second"],
  ],
  ["www.person@example.com", ["www.person@example.com"], []],
  // Internationalised addresses
  ["josé@example.com", ["josé@example.com"], []],
  ["**josé@example.com**", ["josé@example.com"], []],
  ["Contact josé@example.com.", ["josé@example.com"], []],
  ["用户@example.com", ["用户@example.com"], []],
  ["person@exämple.com", ["person@exämple.com"], []],
  ["@username and josé@example.com", ["josé@example.com"], ["@username"]],
];

describe("tokenizeMessageText", () => {
  CASES.forEach(([input, emails, mentions]) => {
    it(`splits "${input}"`, () => {
      const tokens = tokenizeMessageText(input);
      expect(tokens.map((token) => token.text).join("")).to.equal(input);
      expect(
        tokens.filter((token) => token.isEmail).map((token) => token.text)
      ).to.deep.equal(emails);
      expect(
        tokens.filter((token) => token.isMention).map((token) => token.text)
      ).to.deep.equal(mentions);
      expect(tokens.every((token) => !(token.isEmail && token.isMention))).to.be
        .true;
    });
  });
});

const message = (id: string, text: string) => ({
  thread_id: `thread-${id}`,
  channels_id: CHANNEL,
  user_id: "member-1",
  username: "Ada Lovelace",
  avatar_url: "",
  message: text,
  type: "message",
  media: [],
  reactions: [],
  created_at: new Date().toISOString(),
});

const MESSAGES = [
  message(
    "markup",
    'support@example.com, **@username and team**; <span data-id="member-1" data-label="Jane Doe">@Jane Doe</span> and <span data-id="channel-1" data-label="Team Updates">#Team Updates</span>.'
  ),
  message("paragraph", "<p>@reviewer and ops@gmail.com</p>"),
  message("bare", "@username and person@gmail.com"),
  message("url", "<p>Visit www.fixture.test/@username and @second</p>"),
];

// The text of every mention chip in the message that contains `text`.
const mentionsIn = (text: string) =>
  cy.contains(".custom-message", text).then(($message) =>
    $message
      .find("span.cursor-pointer")
      .toArray()
      .map((element) => element.textContent)
  );

describe("email addresses in channel messages", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    // Anything not stubbed below gets an empty success.
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
    cy.intercept("GET", new RegExp(`/api/v1/channels/${CHANNEL}$`), {
      body: {
        status: "success",
        data: {
          channels_id: CHANNEL,
          name: "general",
          access: true,
          users: [],
        },
      },
    });
    cy.intercept("GET", new RegExp(`/threads/channels/${CHANNEL}\\?`), {
      body: { status: "success", data: MESSAGES },
    });
    cy.intercept("GET", /\/users\/mentions\//).as("mentionCard");

    cy.visit(`/${SLUG}/home/channels/${CHANNEL}`, {
      onBeforeLoad: ({ localStorage }) => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem("orgId", ORG);
        localStorage.setItem("orgSlug", SLUG);
      },
    });
    cy.contains(".custom-message", "support@example.com").should("be.visible");
  });

  it("renders an email address as a mailto link, not a mention", () => {
    cy.contains(".custom-message", "support@example.com")
      .find('a[href="mailto:support@example.com"]')
      .should("exist");
    cy.contains(".custom-message", "person@gmail.com")
      .find('a[href="mailto:person@gmail.com"]')
      .should("exist");
  });

  it("keeps the mentions next to an email address", () => {
    mentionsIn("support@example.com").should("deep.equal", [
      "@username",
      "@Jane Doe",
      "#Team Updates",
    ]);
    cy.contains(".custom-message", "support@example.com").should(
      "contain.text",
      "@username and team"
    );
    mentionsIn("ops@gmail.com").should("deep.equal", ["@reviewer"]);
    mentionsIn("person@gmail.com").should("deep.equal", ["@username"]);
  });

  it("does not read an @ inside a link as a mention", () => {
    cy.contains(".custom-message", "www.fixture.test")
      .find('a[href="https://www.fixture.test/@username"]')
      .should("exist");
    mentionsIn("www.fixture.test").should("deep.equal", ["@second"]);
  });

  it("does not load a mention card for an email address", () => {
    cy.contains(".custom-message", "ops@gmail.com")
      .contains("ops@gmail.com")
      .trigger("mouseover");
    cy.wait(500);
    cy.get("@mentionCard.all").should("have.length", 0);
  });
});
