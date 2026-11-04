/**
 * Blocked desktop notifications: a compact notice under the conversation
 * header, with browser help on demand, that stays dismissed for the account
 * for the browser session and never covers the messages or the composer.
 * The permission helpers run in the browser; the page checks need only the app
 * running, with every API call stubbed, so no real account is used:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/notifications/blocked-notice.cy.ts
 */
import {
  type Browser,
  type NotificationState,
  createNotificationDismissal,
  getDismissalState,
  getGuidanceBrowser,
  notificationGuidance,
  shouldShowNotificationNotice,
} from "../../../src/app/(client)/[org]/_components/notification-permission";

const ORG = "11111111-1111-4111-8111-111111111111";
const SLUG = "testorg";
const CHANNEL = "22222222-2222-4222-8222-222222222222";
const NOTICE = "Desktop notifications are blocked.";
const DISMISS = '[aria-label="Dismiss notification notice"]';
const EDITOR = ".ProseMirror";

// Without NEXT_PUBLIC_GTM_SCRIPT_URL the analytics <Script> loads the page's
// own HTML and throws "Unexpected token '<'"; push (OneSignal) isn't set up
// when testing either. Neither is related to the notice.
Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("OneSignal")
);

describe("notification permission helpers", () => {
  const states: NotificationState[] = [
    "default",
    "denied",
    "granted",
    "unsupported",
  ];
  states.forEach((permission) => {
    it(`shows the notice for "${permission}" only when denied, ready and not dismissed`, () => {
      [false, true].forEach((ready) =>
        [false, true].forEach((dismissed) =>
          expect(
            shouldShowNotificationNotice(permission, { ready, dismissed })
          ).to.equal(permission === "denied" && ready && !dismissed)
        )
      );
    });
  });

  const agents: [string, Browser][] = [
    ["Chrome/130 Safari/537", "chrome"],
    ["Chrome/130 Safari/537 Edg/130", "edge"],
    ["Firefox/130", "firefox"],
    ["Version/18 Safari/605", "safari"],
    ["iPhone Version/18 Safari/605", "other"],
    ["Chrome/130 Safari/537 OPR/115", "other"],
    ["Unknown browser", "other"],
  ];
  agents.forEach(([userAgent, browser]) => {
    it(`picks the ${browser} guidance for "${userAgent}"`, () => {
      expect(getGuidanceBrowser(userAgent)).to.equal(browser);
      expect(notificationGuidance[browser]).to.have.length(2);
    });
  });

  it("is not ready until the current account's dismissal has been read", () => {
    const alice = { accountId: "alice", dismissed: true };
    const bob = { accountId: "bob", dismissed: false };
    const cases: [string | null, typeof alice | null, boolean, boolean][] = [
      ["alice", null, false, false],
      ["alice", alice, true, true],
      ["bob", alice, false, false],
      ["bob", bob, true, false],
      ["alice", bob, false, false],
      [null, alice, false, false],
    ];
    cases.forEach(([accountId, snapshot, ready, dismissed]) =>
      expect(getDismissalState(accountId, snapshot)).to.deep.equal({
        ready,
        dismissed,
      })
    );
  });

  it("keeps a dismissal for the session and for its account only", () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
    };
    const store = createNotificationDismissal(() => storage);
    expect(store.read("alice")).to.be.false;
    store.dismiss("alice");
    expect(store.read("alice")).to.be.true;
    expect(store.read("bob")).to.be.false;
    expect(createNotificationDismissal(() => storage).read("alice")).to.be.true;
    expect(createNotificationDismissal(() => undefined).read("alice")).to.be
      .false;
  });

  it("copes with no account and with missing or throwing storage", () => {
    const blocked = () => {
      throw new Error("blocked");
    };
    [
      () => undefined,
      blocked,
      () => ({ getItem: blocked, setItem: blocked }),
    ].forEach((getStorage) => {
      const store = createNotificationDismissal(getStorage);
      store.dismiss(null);
      expect(store.read(null)).to.be.false;
      expect(store.read("alice")).to.be.false;
      store.dismiss("alice");
      expect(store.read("alice")).to.be.true;
      expect(store.read("bob")).to.be.false;
    });
  });
});

// Replaces window.Notification with one whose permission the test controls.
const stubPermission = (win: Window, permission: NotificationState) => {
  const control = { permission };
  if (permission === "unsupported") {
    delete (win as { Notification?: unknown }).Notification;
  } else {
    Object.defineProperty(win, "Notification", {
      configurable: true,
      value: {
        get permission() {
          return control.permission;
        },
        requestPermission: () => Promise.resolve(control.permission),
      },
    });
  }
  (win as unknown as { permissionControl: typeof control }).permissionControl =
    control;
};

const stubApi = (userId = "user-1") => {
  // Anything not stubbed below gets an empty success.
  cy.intercept(/\/api\/v1\//, { body: { status: "success", data: [] } });
  cy.intercept("GET", /\/api\/v1\/profile$/, {
    body: {
      status: "success",
      data: { id: userId, user_id: userId, username: userId },
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
  cy.intercept("GET", new RegExp(`/threads/channels/${CHANNEL}\\?`), {
    body: {
      status: "success",
      data: Array.from({ length: 40 }, (_, i) => ({
        thread_id: `thread-${i}`,
        channels_id: CHANNEL,
        user_id: "member-1",
        username: "Ada Lovelace",
        avatar_url: "",
        message: `Message ${i}`,
        type: "message",
        media: [],
        reactions: [],
        created_at: new Date(Date.now() - i * 60e3).toISOString(),
      })),
    },
  });
};

const visit = (
  path: string,
  permission: NotificationState,
  session: Record<string, string> = {}
) =>
  cy.visit(path, {
    onBeforeLoad: (win) => {
      win.localStorage.setItem("token", "test-token");
      win.localStorage.setItem("orgId", ORG);
      win.localStorage.setItem("orgSlug", SLUG);
      Object.entries(session).forEach(([key, value]) =>
        win.sessionStorage.setItem(key, value)
      );
      stubPermission(win, permission);
    },
  });

const openChannel = (
  permission: NotificationState,
  session?: Record<string, string>
) => {
  visit(`/${SLUG}/home/channels/${CHANNEL}`, permission, session);
  cy.contains("Message 0").should("exist");
};

const howToEnable = () => cy.get("header").contains("button", "How to enable");

const bottomOf = ($el: JQuery<HTMLElement>) =>
  $el[0].getBoundingClientRect().bottom;
const topOf = ($el: JQuery<HTMLElement>) => $el[0].getBoundingClientRect().top;

[1280, 375].forEach((width) => {
  describe(`blocked notification notice at ${width}px`, () => {
    beforeEach(() => {
      cy.viewport(width, 800);
      stubApi();
    });

    it("shows under the channel header without covering messages or the composer", () => {
      openChannel("denied");
      cy.get("header").contains(NOTICE).should("be.visible");
      howToEnable().click();
      cy.get("header").then(($header) => {
        cy.get("#scrollableDivs").should(($messages) =>
          expect(topOf($messages)).to.be.at.least(bottomOf($header) - 1)
        );
        cy.get(EDITOR).should(($editor) =>
          expect(topOf($editor)).to.be.at.least(bottomOf($header))
        );
      });
      cy.document().should((doc) =>
        expect(doc.documentElement.scrollWidth).to.be.at.most(width)
      );
    });

    it("opens browser-specific help on demand", () => {
      openChannel("denied");
      cy.get("header ol").should("not.exist");
      howToEnable()
        .should("have.attr", "aria-expanded", "false")
        .focus()
        .should("have.focus")
        .click()
        .should("have.attr", "aria-expanded", "true")
        .invoke("attr", "aria-controls")
        .then((id) => cy.get(`#${id}`).should("be.visible"));
      cy.window().then((win) => {
        const steps =
          notificationGuidance[getGuidanceBrowser(win.navigator.userAgent)];
        cy.get("header ol li").should(($items) =>
          expect(
            $items.toArray().map((item) => item.textContent)
          ).to.deep.equal(steps)
        );
      });
      howToEnable().click().should("have.attr", "aria-expanded", "false");
      cy.get("header ol").should("not.exist");
    });

    it("keeps an unsent draft while the notice opens and is dismissed", () => {
      openChannel("denied");
      cy.get(EDITOR).click().type("Unsent draft");
      howToEnable().click();
      howToEnable().click();
      cy.get(DISMISS).click();
      cy.get(EDITOR).should("have.text", "Unsent draft");
    });

    it("stays dismissed for the account after a reload", () => {
      openChannel("denied");
      cy.get(DISMISS).click();
      cy.contains(NOTICE).should("not.exist");
      cy.get("header h2").should("have.focus");
      cy.window()
        .its("sessionStorage")
        .invoke("getItem", "zedu:notification-notice-dismissed:user-1")
        .should("equal", "1");
      cy.reload();
      cy.contains("Message 0").should("exist");
      cy.contains(NOTICE).should("not.exist");
    });
  });
});

describe("blocked notification notice and other states", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("still shows for another account after one account dismissed it", () => {
    stubApi("user-2");
    openChannel("denied", {
      "zedu:notification-notice-dismissed:user-1": "1",
    });
    cy.contains(NOTICE).should("be.visible");
  });

  (["default", "granted", "unsupported"] as const).forEach((permission) => {
    it(`does not show when permission is "${permission}"`, () => {
      stubApi();
      openChannel(permission);
      cy.get("header h2").should("exist");
      cy.contains(NOTICE).should("not.exist");
    });
  });

  it("hides once notifications are allowed", () => {
    stubApi();
    openChannel("denied");
    cy.contains(NOTICE).should("be.visible");
    cy.window().then((win) => {
      (
        win as unknown as { permissionControl: { permission: string } }
      ).permissionControl.permission = "granted";
    });
    // The permission is polled every 2 seconds.
    cy.contains(NOTICE, { timeout: 5000 }).should("not.exist");
  });

  it("keeps the help in Settings → Notifications after a dismissal", () => {
    stubApi();
    cy.intercept("GET", /\/notification-preference\?/, {
      body: {
        status: "success",
        data: {
          notify_about: "mentions",
          time_range: "09:00 AM - 05:00 PM",
          send_mail: false,
        },
      },
    }).as("preferences");
    visit(`/${SLUG}/settings/personal/notifications`, "denied", {
      "zedu:notification-notice-dismissed:user-1": "1",
    });
    cy.wait("@preferences");
    cy.get('section[aria-label="Browser notification permissions"]').within(
      () => {
        cy.contains("button", "How to enable").click();
        cy.contains("button", "How to enable").should(
          "have.attr",
          "aria-expanded",
          "true"
        );
        cy.get("ol li").should("have.length", 2);
      }
    );
  });
});
