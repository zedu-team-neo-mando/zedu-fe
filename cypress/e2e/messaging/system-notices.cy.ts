export {};

/**
 * System notices stay visually distinct from user messages.
 * Login, the channel list, and thread responses are stubbed, so this runs
 * without a live account:
 *   pnpm exec cypress run --spec cypress/e2e/messaging/system-notices.cy.ts
 */
const ORG_ID = "org-1";
const NOTICE_SLUG = "mando";
const CHANNEL_ID = "channel-1";
const TOKEN = "stub-token";

const NOTICE =
  "@mimi joined this channel. @abduljaleel_abdulsamad and 5 others also joined.";

const user = {
  user_id: "user-ada",
  id: "user-ada",
  username: "ada",
  email: "ada@example.com",
  current_org: ORG_ID,
  current_organisation_slug: NOTICE_SLUG,
};

const threads = [
  {
    thread_id: "normal-message",
    channels_id: CHANNEL_ID,
    org_id: ORG_ID,
    username: "ada",
    user_id: "user-ada",
    created_at: "2026-10-17T10:31:00.000Z",
    updated_at: "2026-10-17T10:31:00.000Z",
    message: "The cohort call starts at 4.",
    channel_name: "general",
    channel_type: "channel",
    message_count: 0,
    type: "message",
    media: [],
  },
  {
    thread_id: "system-notice",
    channels_id: CHANNEL_ID,
    org_id: ORG_ID,
    username: "system",
    user_id: "system",
    created_at: "2026-10-17T10:30:00.000Z",
    updated_at: "2026-10-17T10:30:00.000Z",
    message: NOTICE,
    channel_name: "general",
    channel_type: "channel",
    message_count: 0,
    type: "system",
    media: [],
  },
];

Cypress.on("uncaught:exception", (err) => {
  // Missing analytics config loads the page HTML as a script (`?id=undefined`).
  if (err.message.includes("OneSignal")) return false;
  if (err.message.includes("Unexpected token")) return false;
  return true;
});

const mentionRequests: string[] = [];

const orgUsers = [
  {
    id: "user-mimi",
    user_id: "user-mimi",
    username: "mimi",
    name: "Mimi",
  },
  {
    id: "user-abdul",
    user_id: "user-abdul",
    username: "abduljaleel_abdulsamad",
    name: "Abdul",
  },
];

const stubWorkspace = () => {
  mentionRequests.length = 0;

  cy.intercept("**/api/v1/**", (req) => {
    const path = new URL(req.url).pathname;

    if (path.endsWith("/auth/login")) {
      req.alias = "login";
      req.reply({
        statusCode: 200,
        body: { data: { access_token: TOKEN, user } },
      });
      return;
    }

    if (path.endsWith("/profile")) {
      req.alias = "profile";
      req.reply({ statusCode: 200, body: { data: user } });
      return;
    }

    if (path.endsWith(`/organisations/${ORG_ID}/user-channels`)) {
      req.alias = "channels";
      req.reply({
        statusCode: 200,
        body: { data: [{ channels_id: CHANNEL_ID, name: "general" }] },
      });
      return;
    }

    if (path.endsWith(`/organisations/${ORG_ID}`)) {
      req.alias = "organisation";
      req.reply({
        statusCode: 200,
        body: { data: { organisation_slug: NOTICE_SLUG, name: "Mando" } },
      });
      return;
    }

    if (path.includes(`/threads/channels/${CHANNEL_ID}`)) {
      req.alias = "threads";
      req.reply({ statusCode: 200, body: { data: threads } });
      return;
    }

    if (path.endsWith(`/channels/${CHANNEL_ID}`)) {
      req.alias = "channel";
      req.reply({
        statusCode: 200,
        body: {
          data: {
            channels_id: CHANNEL_ID,
            name: "general",
            access: true,
            archived: false,
            is_restricted: false,
          },
        },
      });
      return;
    }

    if (path.includes(`/organisations/${ORG_ID}/users`)) {
      req.reply({
        statusCode: 200,
        body: {
          data: orgUsers,
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_items: orgUsers.length,
            page_size: 50,
          },
        },
      });
      return;
    }

    if (path.endsWith("/users/mentions/user-mimi")) {
      mentionRequests.push(path);
      req.reply({
        statusCode: 200,
        body: {
          data: {
            id: "user-mimi",
            userid: "user-mimi",
            username: "mimi",
            status_text: "Available",
          },
        },
      });
      return;
    }

    if (path.includes("/users/mentions/")) {
      mentionRequests.push(path);
      req.reply({ statusCode: 404, body: { message: "user id required" } });
      return;
    }

    if (
      path.endsWith("/token/connection") ||
      path.endsWith("/token/subscription")
    ) {
      req.reply({ statusCode: 200, body: { data: { token: TOKEN } } });
      return;
    }

    req.reply({ statusCode: 200, body: { data: [] } });
  });
};

const openChannel = () => {
  stubWorkspace();
  cy.visit(`/${NOTICE_SLUG}/home/channels/${CHANNEL_ID}`, {
    onBeforeLoad(win) {
      win.localStorage.setItem("token", TOKEN);
      win.localStorage.setItem("orgId", ORG_ID);
      win.localStorage.setItem("orgSlug", NOTICE_SLUG);
      win.localStorage.setItem("user", JSON.stringify(user));
    },
  });
  cy.contains(".message-row", "mimi joined this channel.", {
    timeout: 60000,
  }).should("be.visible");
};

const expectSlimNotice = () => {
  cy.contains(".message-row", "mimi joined this channel.").within(() => {
    cy.get("svg").should("exist");
    cy.contains("span.cursor-pointer", "mimi").should("be.visible");
    cy.contains("span.cursor-pointer", "abduljaleel_abdulsamad").should(
      "be.visible"
    );
    cy.root().should("not.contain", "@");
    cy.get("time").should("have.class", "ml-auto");
  });

  cy.contains(".message-row", "The cohort call starts at 4.").within(() => {
    cy.contains("ada").should("be.visible");
    cy.get("time").should("not.exist");
  });
};

describe("channel system notices", () => {
  it("renders a slim notice beside a normal message, with a clickable name", () => {
    cy.viewport(1280, 800);
    openChannel();
    expectSlimNotice();

    cy.contains(".message-row", "mimi joined this channel.").scrollIntoView();
    cy.screenshot("system-notice-desktop");

    cy.contains(".message-row", "mimi joined this channel.")
      .contains("span.cursor-pointer", "mimi")
      .click();
    cy.contains("h3", "mimi")
      .should("be.visible")
      .parents(".bg-white")
      .first()
      .within(() => {
        cy.contains("Message").should("be.visible");
      })
      .screenshot("system-notice-name");
    cy.wrap(null).should(() => {
      expect(mentionRequests).to.deep.equal([
        "/api/v1/users/mentions/user-mimi",
      ]);
    });

    cy.viewport(390, 844);
    cy.contains(".message-row", "mimi joined this channel.").scrollIntoView();
    cy.screenshot("system-notice-narrow");
    expectSlimNotice();
  });
});
