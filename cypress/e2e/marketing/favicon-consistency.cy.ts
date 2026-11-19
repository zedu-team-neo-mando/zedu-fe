/**
 * Favicon consistency (Ziki #1731): marketing pages must not override the
 * site icon with the old Telex logo, so every page shows the same Zedu icon in
 * the browser tab. Needs only the app running:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/marketing/favicon-consistency.cy.ts
 */
const PAGES = [
  "/solutions/tutors",
  "/resources?guide=getting-started-with-zedu",
  "/resources?guide=zedu-vs-whatsapp-telegram-for-bootcamps",
];

// A page that never had an override, used as the reference icon set.
const CONTROL = "/pricing";

// Without NEXT_PUBLIC_GTM_SCRIPT_URL the analytics <Script> loads the page's
// own HTML and throws "Unexpected token '<'". In `next dev` the root layout
// also reports a hydration mismatch on every page. Neither is related to the
// favicon.
Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("Hydration failed")
);

const iconHrefs = () =>
  cy
    .get('head link[rel~="icon"]')
    .then(($links) =>
      [...$links].map((link) => link.getAttribute("href") ?? "").sort()
    );

describe("Favicon on marketing pages", () => {
  let controlIcons: string[] = [];

  before(() => {
    cy.visit(CONTROL);
    iconHrefs().then((hrefs) => {
      controlIcons = hrefs;
    });
  });

  PAGES.forEach((page) => {
    it(`${page} uses the site icon, not the Telex logo`, () => {
      cy.visit(page);
      cy.get('head link[rel~="icon"][href*="TelexIcon"]').should("not.exist");
      iconHrefs().should((hrefs) => {
        expect(hrefs).to.deep.equal(controlIcons);
      });
    });
  });
});
