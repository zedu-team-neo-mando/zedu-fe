describe("Contact Sales phone validation", () => {
  it("rejects alphabetic phone input and accepts a valid formatted phone number", () => {
    let requestCount = 0;

    cy.intercept("POST", "**/contact", (request) => {
      requestCount += 1;

      request.reply({
        statusCode: 200,
        body: { message: "Message sent" },
      });
    }).as("contactSales");

    cy.visit("/contact-sales");

    cy.get("#name").type("Test User");
    cy.get("#email").type("test@example.com");
    cy.get("#message").type("Interested in Zedu");

    cy.get("#phone").type("test08012345678hello");
    cy.contains("button", "Send").click();

    cy.contains(
      "Phone number can only contain digits and standard phone formatting"
    ).should("be.visible");

    cy.then(() => {
      expect(requestCount).to.equal(0);
    });

    cy.get("#phone").clear().type("+234 801 234 5678");
    cy.get("#organization_type").click();
    cy.contains("[role=option]", "Bootcamp").click();
    cy.contains("button", "Send").click();

    cy.wait("@contactSales").then(({ request }) => {
      expect(request.body.phone_number).to.equal("2348012345678");
      expect(request.body.organization_type).to.equal("Bootcamp");
      expect(request.body.message).to.match(/^Organization type: Bootcamp/);
    });
  });
});
