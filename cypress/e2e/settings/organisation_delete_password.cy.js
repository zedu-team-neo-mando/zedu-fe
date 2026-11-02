const apiResponse = (data) => ({
  statusCode: 200,
  body: { status: "success", status_code: 200, data },
});

describe("organisation deletion confirmation", () => {
  const orgId = "test-organisation-id";
  const route = "/test-org/settings/organisation/general";
  const orgResponse = {
    id: orgId,
    name: "Test Organisation",
    role: "owner",
    organisation_slug: "test-org",
  };

  beforeEach(() => {
    cy.intercept("GET", "https://cdn.onesignal.com/**", {
      statusCode: 200,
      headers: { "content-type": "application/javascript" },
      body: `
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignal = {
          init: () => Promise.resolve(),
          Notifications: {
            requestPermission: () => Promise.resolve(),
            addEventListener: () => {},
            removeEventListener: () => {},
          },
        };
        window.OneSignalDeferred.forEach((callback) => callback(window.OneSignal));
      `,
    });
    cy.intercept("GET", "**/mock-gtm.js*", {
      statusCode: 200,
      headers: { "content-type": "application/javascript" },
      body: "",
    });
    cy.intercept("GET", "**/api/v1/**", apiResponse([]));
    cy.intercept("GET", "**/profile", apiResponse({ id: "test-user-id" }));
    cy.intercept("GET", `**/organisations/${orgId}`, apiResponse(orgResponse));
    cy.intercept("GET", "**/users/organisations", apiResponse([]));

    cy.visit(route, {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "cypress-test-token");
        win.localStorage.setItem("orgId", orgId);
        win.localStorage.setItem("orgSlug", "test-org");
        win.localStorage.setItem("zedu:campaign-consent:v1", "denied");
      },
    });
    cy.contains("button", "Delete this organisation", {
      timeout: 30000,
    }).should("be.visible");
  });

  const openConfirmation = () => {
    cy.contains("button", "Delete this organisation").click();
    cy.contains("button", "Continue").click();
  };

  const fillConfirmation = (password = "current-password") => {
    cy.get("#password").type(password);
    cy.get("#consent").check();
  };

  it("requires a password and the deletion-mail profile consent", () => {
    let requestCount = 0;
    cy.intercept("DELETE", `**/organisations/${orgId}`, (request) => {
      requestCount += 1;
      request.reply({ statusCode: 204, body: "" });
    }).as("deleteOrganisation");

    openConfirmation();
    cy.get("#password").should("have.value", "");
    cy.contains("button", "Delete Account").should("be.disabled");

    cy.get("#password").type("current-password");
    cy.contains("button", "Delete Account").should("be.disabled");
    cy.get("#consent").check();
    cy.get("#consent").uncheck();
    cy.contains("button", "Delete Account").should("be.disabled");
    cy.wrap(null).should(() => expect(requestCount).to.equal(0));
  });

  it("sends password and consent, and retains the organisation on rejection", () => {
    cy.intercept("DELETE", `**/organisations/${orgId}`, (request) => {
      expect(request.body).to.deep.equal({
        password: "incorrect-password",
        include_profile_in_deletion_mail: true,
      });
      request.reply({
        statusCode: 400,
        body: { message: "password verification failed" },
      });
    }).as("deleteOrganisation");

    openConfirmation();
    fillConfirmation("incorrect-password");
    cy.contains("button", "Delete Account").click();

    cy.wait("@deleteOrganisation");
    cy.get('[role="dialog"] [role="alert"]')
      .should("be.visible")
      .and("contain", "password verification failed");
    cy.get("#password").should("be.visible");
    cy.contains("p", "Test Organisation").should("be.visible");
    cy.url().should("include", route);
    cy.contains("Organisation deleted successfully").should("not.exist");
  });

  it("completes deletion after the server verifies the authorised user", () => {
    cy.intercept("DELETE", `**/organisations/${orgId}`, (request) => {
      expect(request.body).to.deep.equal({
        password: "current-password",
        include_profile_in_deletion_mail: true,
      });
      request.reply({ statusCode: 204, body: "" });
    }).as("deleteOrganisation");
    cy.intercept(
      "GET",
      "**/users/organisations",
      apiResponse([{ id: "next-org" }])
    );
    cy.intercept("PUT", "**/users/switch-org", (request) => {
      expect(request.body).to.deep.equal({ current_org: "next-org" });
      request.reply(
        apiResponse({
          access_token: "next-token",
          organisation: { id: "next-org" },
          current_organisation_slug: "next-org",
        })
      );
    }).as("switchOrganisation");

    openConfirmation();
    fillConfirmation();
    cy.contains("button", "Delete Account").click();

    cy.wait("@deleteOrganisation");
    cy.wait("@switchOrganisation");
    cy.location("pathname").should("equal", "/next-org");
  });

  it("submits only once when Delete is clicked repeatedly", () => {
    let requestCount = 0;
    cy.intercept("DELETE", `**/organisations/${orgId}`, (request) => {
      requestCount += 1;
      request.reply({
        delay: 300,
        statusCode: 400,
        body: { message: "password verification failed" },
      });
    }).as("deleteOrganisation");

    openConfirmation();
    fillConfirmation();
    cy.contains("button", "Delete Account").then(($button) => {
      const button = $button[0];
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    cy.wait("@deleteOrganisation");
    cy.wait(400);
    cy.wrap(null).should(() => expect(requestCount).to.equal(1));
  });

  it("clears password and consent when the dialog closes and reopens", () => {
    openConfirmation();
    fillConfirmation();
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");

    openConfirmation();
    cy.get("#password").should("have.value", "");
    cy.get("#consent").should("not.be.checked");
    cy.contains("button", "Delete Account").should("be.disabled");
  });
});
