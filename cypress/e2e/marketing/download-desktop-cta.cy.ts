/**
 * Download page desktop section (Ziki #732): the "Download for Desktop" button
 * used to be a dead href="#" link. It now links to the installer when
 * NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL is set, and otherwise shows a disabled
 * "Desktop app coming soon" state. Needs only the app running:
 *   CYPRESS_baseUrl=http://localhost:3000 \
 *   pnpm cypress run --spec cypress/e2e/marketing/download-desktop-cta.cy.ts
 * To check the link state, start the app with NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL
 * set and pass the same value as CYPRESS_desktopDownloadUrl.
 */
const UNAVAILABLE = "[data-desktop-download-unavailable]";

// Without NEXT_PUBLIC_GTM_SCRIPT_URL the analytics <Script> loads the page's
// own HTML and throws "Unexpected token '<'". In `next dev` the root layout
// also reports a hydration mismatch on every page. Neither is related to the
// download section.
Cypress.on(
  "uncaught:exception",
  (err) =>
    !err.message.includes("Unexpected token '<'") &&
    !err.message.includes("Hydration failed")
);

describe("download page desktop section", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit("/download");
    cy.contains("h2", "Download Zedu for Desktop").scrollIntoView();
  });

  // Scoped to the desktop section: the App Store and Google Play buttons
  // above it come from NEXT_PUBLIC_APP_STORE_URL / NEXT_PUBLIC_PLAY_STORE_URL,
  // which a local run may not set.
  it('has no dead href="#" link in the desktop section', () => {
    cy.contains("h2", "Download Zedu for Desktop")
      .parent()
      .within(() => {
        cy.get('a[href="#"]').should("not.exist");
      });
  });

  it("links to the installer when a download URL is set, or says it is coming soon", () => {
    const url = Cypress.env("desktopDownloadUrl") as string | undefined;

    if (url) {
      cy.get(`a[href="${url}"]`)
        .should("be.visible")
        .and("contain.text", "Download for Desktop");
      cy.get(UNAVAILABLE).should("not.exist");
    } else {
      cy.get(UNAVAILABLE)
        .should("be.visible")
        .and("be.disabled")
        .and("have.attr", "aria-disabled", "true")
        .and("have.text", "Desktop app coming soon");
      cy.contains("a", "Download for Desktop").should("not.exist");
    }
  });
});
