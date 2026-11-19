describe("Auth entry route", () => {
  it("redirects to sign-up instead of rendering an organisation workspace", () => {
    cy.request({ url: "/auth", followRedirect: false }).then((response) => {
      expect(response.status).to.eq(307);
      const destination = new URL(response.headers.location as string);
      expect(destination.pathname).to.eq("/auth/sign-up");
      expect(destination.host).to.eq(new URL(Cypress.config("baseUrl")!).host);
    });
  });

  it("preserves query parameters without changing the redirect destination", () => {
    const query = new URLSearchParams({
      template: "bootcamp",
      redirect: "/henry/home/people/new-chat?filter=all",
      email: "test+invite@example.com",
    });
    query.append("template", "school");

    cy.request({
      url: `/auth?${query.toString()}`,
      followRedirect: false,
    }).then((response) => {
      expect(response.status).to.eq(307);
      const destination = new URL(response.headers.location as string);
      expect(destination.pathname).to.eq("/auth/sign-up");
      expect([...destination.searchParams.entries()].sort()).to.deep.eq(
        [...query.entries()].sort()
      );
    });
  });

  it("shows the sign-up form in a clean browser session", () => {
    cy.visit("/auth");
    cy.location("pathname").should("eq", "/auth/sign-up");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("Select a channel").should("not.exist");
  });

  it("preserves the existing signed-in onboarding redirect", () => {
    cy.visit("/auth", {
      onBeforeLoad(window) {
        window.localStorage.setItem("token", "auth-entry-test-token");
        window.localStorage.setItem("orgSlug", "auth-entry-test-org");
        window.localStorage.setItem(
          "user",
          JSON.stringify({ is_onboarded: false })
        );
      },
    });

    cy.location("pathname").should("eq", "/auth-entry-test-org/welcome");
  });
});
