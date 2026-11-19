/// <reference types="cypress" />

describe("Marketing Referral Program & Dashboard", () => {
  // Prevent uncaught analytics script errors from halting test execution
  Cypress.on(
    "uncaught:exception",
    (err) =>
      !err.message.includes("Unexpected token '<'") &&
      !err.message.includes("ResizeObserver")
  );

  beforeEach(() => {
    // Clear storage before each test for predictable test state
    cy.clearLocalStorage();
  });

  it("renders the referral page with header, stats, link generator, milestones, and activity", () => {
    cy.visit("/referrals");

    // Page title and breadcrumbs
    cy.get("h1").should("contain.text", "Refer Friends & Expand Your Cohort");
    cy.get("nav[aria-label='Breadcrumb']").should(
      "contain.text",
      "Referral Program"
    );

    // Stat cards
    cy.get("[data-testid='stat-card-total-invited']").should("be.visible");
    cy.get("[data-testid='stat-card-signups']").should("be.visible");
    cy.get("[data-testid='stat-card-points']").should("be.visible");
    cy.get("[data-testid='stat-card-conversion']").should("be.visible");

    // Link generator
    cy.get("[data-testid='referral-link-generator']").should("be.visible");
    cy.get("[data-testid='referral-url-input']")
      .should("have.value")
      .and("include", "?ref=");
    cy.get("[data-testid='copy-referral-btn']").should("be.visible");

    // Social share buttons
    cy.get("[data-testid='share-x-btn']")
      .should("have.attr", "href")
      .and("include", "twitter.com");
    cy.get("[data-testid='share-linkedin-btn']")
      .should("have.attr", "href")
      .and("include", "linkedin.com");
    cy.get("[data-testid='share-telegram-btn']")
      .should("have.attr", "href")
      .and("include", "t.me");
    cy.get("[data-testid='share-whatsapp-btn']")
      .should("have.attr", "href")
      .and("include", "whatsapp.com");

    // Milestone progression
    cy.get("[data-testid='milestone-progression']").should("be.visible");
    cy.get("[data-testid='milestone-tier-3']").should("be.visible");
    cy.get("[data-testid='milestone-tier-5']").should("be.visible");
    cy.get("[data-testid='milestone-tier-10']").should("be.visible");
    cy.get("[data-testid='milestone-tier-25']").should("be.visible");

    // Activity table
    cy.get("[data-testid='referral-activity-section']").should("be.visible");
    cy.get("[data-testid='referral-table']").should("be.visible");
  });

  it("allows copying the unique referral link with a single click and shows feedback", () => {
    cy.visit("/referrals");

    // Click copy button
    cy.get("[data-testid='copy-referral-btn']").click();

    // Verify visual feedback change on button
    cy.get("[data-testid='copy-referral-btn']").should(
      "contain.text",
      "Copied!"
    );
  });

  it("filters and searches referral activity accurately", () => {
    cy.visit("/referrals");

    // Filter by 'Active' status
    cy.get("[data-testid='filter-active']").click();
    cy.get("[data-testid='status-badge-active']").should("exist");
    cy.get("[data-testid='status-badge-pending']").should("not.exist");

    // Filter by 'Pending' status
    cy.get("[data-testid='filter-pending']").click();
    cy.get("[data-testid='status-badge-pending']").should("exist");
    cy.get("[data-testid='status-badge-active']").should("not.exist");

    // Filter back to 'All'
    cy.get("[data-testid='filter-all']").click();
    cy.get("[data-testid='status-badge-active']").should("exist");
    cy.get("[data-testid='status-badge-pending']").should("exist");
  });

  it("supports toggling between empty and populated states", () => {
    cy.visit("/referrals");

    // Initially populated
    cy.get("[data-testid='referral-table']").should("be.visible");

    // Toggle to simulated empty state
    cy.get("[data-testid='toggle-empty-state-btn']").click();

    // Verify empty state is displayed
    cy.get("[data-testid='referral-empty-state']").should("be.visible");
    cy.get("[data-testid='referral-empty-state']").should(
      "contain.text",
      "No referral activity yet"
    );

    // Verify stats reflect empty state
    cy.get("[data-testid='stat-card-total-invited']").should(
      "contain.text",
      "0"
    );
    cy.get("[data-testid='stat-card-signups']").should("contain.text", "0");

    // Toggle back to populated state
    cy.get("[data-testid='toggle-empty-state-btn']").click();
    cy.get("[data-testid='referral-table']").should("be.visible");
  });

  it("displays the welcoming onboarding banner when arriving via ?ref=alex_mentor", () => {
    // Visit home page with referral query param
    cy.visit("/?ref=alex_mentor");

    // Onboarding banner should be visible
    cy.get("[data-testid='referral-onboarding-banner']").should("be.visible");
    cy.get("[data-testid='referral-onboarding-banner']").should(
      "contain.text",
      "@alex_mentor"
    );

    // Call-to-action should link to signup with referral code
    cy.get("[data-testid='referral-banner-signup-cta']")
      .should("have.attr", "href")
      .and("include", "/auth/sign-up?ref=alex_mentor");

    // Can dismiss the banner
    cy.get("[data-testid='dismiss-referral-banner']").click();
    cy.get("[data-testid='referral-onboarding-banner']").should("not.exist");
  });

  it("shows referral bonus attribution on the sign-up page when ref query is present", () => {
    cy.visit("/auth/sign-up?ref=cohort_lead");

    cy.get("[data-testid='signup-referral-banner']").should("be.visible");
    cy.get("[data-testid='signup-referral-banner']").should(
      "contain.text",
      "@cohort_lead"
    );
  });
});
