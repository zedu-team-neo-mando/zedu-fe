const answers = [
  ["when-to-use-buzz", "When should I use Buzz?"],
  ["what-can-i-do-in-a-buzz-session", "What can I do in a Buzz session?"],
  ["how-to-start-a-buzz", "How do I start a Buzz?"],
  [
    "are-buzz-sessions-summarized-automatically",
    "Are Buzz sessions summarized automatically?",
  ],
];

for (const [width, height] of [
  [1280, 800],
  [390, 844],
]) {
  describe(`Buzz FAQ answer links at ${width}px`, () => {
    beforeEach(() => cy.viewport(width, height));

    for (const [fragment, question] of answers) {
      it(`opens and copies ${fragment}, including after reload`, () => {
        const copy = cy.stub().resolves();
        cy.visit(`/products/buzz?source=faq#${fragment}`, {
          onBeforeLoad(win) {
            Object.defineProperty(win.navigator, "clipboard", {
              configurable: true,
              value: { writeText: copy },
            });
          },
        });
        cy.get(`#${fragment} > h3 > button`)
          .should("have.attr", "aria-expanded", "true")
          .and("contain", question);
        cy.get(`#${fragment}`).should(($answer) => {
          const top = $answer[0].getBoundingClientRect().top;
          expect(top).to.be.at.least(0);
          expect(top).to.be.lessThan(height);
        });
        cy.get(`#${fragment} button[aria-label^="Copy link to answer:"]`)
          .should("be.visible")
          .click();
        cy.location("origin").then((origin) => {
          cy.wrap(copy).should(
            "have.been.calledOnceWithExactly",
            `${origin}/products/buzz?source=faq#${fragment}`
          );
        });
        cy.get(`#${fragment} [role="status"]`).should(
          "have.text",
          "Answer link copied to clipboard."
        );
        cy.get(`#${fragment} > h3 > button`).should(
          "have.attr",
          "aria-expanded",
          "true"
        );
        cy.reload();
        cy.get(`#${fragment} > h3 > button`).should(
          "have.attr",
          "aria-expanded",
          "true"
        );
      });
    }

    it("responds to hash changes, remains collapsible, and ignores malformed links", () => {
      cy.visit("/products/buzz#how-to-start-a-buzz");
      cy.get("#how-to-start-a-buzz > h3 > button").should(
        "have.attr",
        "aria-expanded",
        "true"
      );
      cy.window().then((win) => {
        win.location.hash = "when-to-use-buzz";
      });
      cy.get("#when-to-use-buzz > h3 > button").should(
        "have.attr",
        "aria-expanded",
        "true"
      );
      cy.get("#how-to-start-a-buzz > h3 > button").should(
        "have.attr",
        "aria-expanded",
        "false"
      );
      cy.get("#when-to-use-buzz > h3 > button")
        .click()
        .should("have.attr", "aria-expanded", "false");
      cy.window().then((win) => {
        win.location.hash = "%E0%A4%A";
      });
      cy.get("#when-to-use-buzz > h3 > button")
        .focus()
        .type("{enter}")
        .should("have.attr", "aria-expanded", "true");
    });

    it("reports a clipboard rejection without closing the answer", () => {
      cy.visit("/products/buzz#when-to-use-buzz", {
        onBeforeLoad(win) {
          Object.defineProperty(win.navigator, "clipboard", {
            configurable: true,
            value: {
              writeText: () => Promise.reject(new Error("Permission denied")),
            },
          });
        },
      });
      cy.get(
        '#when-to-use-buzz button[aria-label^="Copy link to answer:"]'
      ).click();
      cy.get('#when-to-use-buzz [role="status"]').should(
        "have.text",
        "Could not copy the answer link. Please try again."
      );
      cy.get("#when-to-use-buzz > h3 > button").should(
        "have.attr",
        "aria-expanded",
        "true"
      );
    });
  });
}

it("does not add Buzz sharing controls to the homepage FAQs", () => {
  cy.visit("/#when-to-use-buzz");
  cy.contains("button", "What is Zedu").click();
  cy.get('button[aria-label^="Copy link to answer:"]').should("not.exist");
});
