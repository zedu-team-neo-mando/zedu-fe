describe("mobile navigation trigger", () => {
  it("keeps a stable tap target and spacing at narrow widths", () => {
    cy.viewport(320, 800);
    cy.visit("/contact-sales");

    cy.get('a[href="/"] img[alt="Zedu"]').then(($logo) => {
      const logo = $logo[0].getBoundingClientRect();

      cy.get('button[aria-label="Open navigation menu"]').then(($button) => {
        const button = $button[0].getBoundingClientRect();
        expect(button.width).to.eq(40);
        expect(button.height).to.eq(40);
        expect(button.left).to.be.at.least(logo.right);
      });
    });

    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.get('nav[aria-label="Mobile navigation"]').should("be.visible");
  });
});
