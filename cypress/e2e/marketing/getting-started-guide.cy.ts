/**
 * Getting Started tutorial (Ziki #2257): the guide renders with its own title,
 * description and four illustrated steps, and is reachable from the resources
 * hub, the bootcamps solution page and the sitemap. Needs only the app running:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/marketing/getting-started-guide.cy.ts
 */
const GUIDE = "/resources?guide=getting-started-with-zedu";

const STEPS = [
  "Step 1: Create your organisation",
  "Step 2: Organise your programme into channels",
  "Step 3: Invite your learners",
  "Step 4: Run the cohort day to day",
];

// Without NEXT_PUBLIC_GTM_SCRIPT_URL the analytics <Script> loads the page's
// own HTML and throws "Unexpected token '<'". In `next dev` the root layout
// also reports a hydration mismatch on every page. Neither is related to the
// guide.
Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("Hydration failed")
);

describe("Getting Started guide", () => {
  beforeEach(() => cy.viewport(1280, 900));

  it("renders the tutorial with its own title, description and steps", () => {
    cy.visit(GUIDE);
    cy.get("h1")
      .should("have.length", 1)
      .and("contain.text", "Getting Started with Zedu");
    cy.title().should("contain", "Getting Started with Zedu");
    cy.get('meta[name="description"]')
      .should("have.attr", "content")
      .and("contain", "step-by-step tutorial for educators");
    STEPS.forEach((step) => cy.contains("h2", step).should("exist"));
    cy.get('a[href="/auth/sign-up"]').should("exist");
  });

  it("shows every step screenshot", () => {
    cy.visit(GUIDE);
    cy.get('img[src*="/images/homepage/resources/getting-started/"]')
      .should("have.length.at.least", 4)
      .each(($img) => {
        cy.wrap($img)
          .scrollIntoView()
          .should(($el) => {
            const img = $el[0] as HTMLImageElement;
            expect(img.complete, "loaded").to.equal(true);
            expect(img.naturalWidth, "has pixels").to.be.greaterThan(0);
            expect(img.alt, "alt text").to.not.equal("");
          });
      });
  });

  it("is linked from the resources hub", () => {
    cy.visit("/resources");
    cy.get(`a[href="${GUIDE}"]`).should("exist");
  });

  it("is linked from the bootcamps solution page", () => {
    cy.visit("/solutions/bootcamps");
    cy.get(`a[href="${GUIDE}"]`)
      .should("exist")
      .and("contain.text", "Set up your first cohort");
  });

  it("is listed in the sitemap", () => {
    cy.request("/sitemap.xml")
      .its("body")
      .should("contain", "/resources?guide=getting-started-with-zedu");
  });
});
