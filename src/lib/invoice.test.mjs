import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isValidInvoiceId, selectInvoice } from "./invoice.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const readSource = (...segments) =>
  fs.readFileSync(path.join(here, "..", ...segments), "utf8");

const pageSource = readSource(
  "app",
  "(client)",
  "billing",
  "invoice",
  "[id]",
  "page.tsx"
);
const viewSource = readSource(
  "app",
  "(client)",
  "billing",
  "invoice",
  "[id]",
  "_components",
  "invoice-view.tsx"
);
const notFoundSource = readSource(
  "app",
  "(client)",
  "billing",
  "invoice",
  "[id]",
  "not-found.tsx"
);

const ORG_A = "org-a";
const ORG_B = "org-b";

const transactions = [
  {
    id: "0193f2a1-b7c4-7a10-9f3d-2f5a6b7c8d9e",
    name: "Zedu Pro Plan",
    fee: 15,
    start_date: "2025-06-01",
    end_date: "2025-07-01",
    status: "paid",
    session_id: "cs_test_abcdef123456",
    organisation_id: ORG_A,
  },
  {
    id: "invoice_22222222",
    name: "Zedu Business Plan",
    fee: 42.5,
    start_date: "2025-07-01",
    status: "paid",
    organisation_id: ORG_A,
  },
];

test("a valid invoice id returns the matching invoice data", () => {
  const match = selectInvoice(
    transactions,
    "0193f2a1-b7c4-7a10-9f3d-2f5a6b7c8d9e",
    ORG_A
  );
  assert.ok(match, "expected a match for a known invoice id");
  assert.equal(match.name, "Zedu Pro Plan");
  assert.equal(match.fee, 15);
  assert.equal(match.session_id, "cs_test_abcdef123456");

  const second = selectInvoice(transactions, "invoice_22222222", ORG_A);
  assert.ok(second, "expected a match for the second invoice id");
  assert.notEqual(second.name, match.name);
});

test("an unknown invoice id is not found and never falls back", () => {
  assert.equal(
    selectInvoice(transactions, "unknown-invoice-9999", ORG_A),
    null,
    "unknown ids must resolve to not-found"
  );
  assert.equal(
    selectInvoice([], "0193f2a1-b7c4-7a10-9f3d-2f5a6b7c8d9e", ORG_A),
    null,
    "an empty list must never yield a fallback invoice"
  );
  assert.equal(
    selectInvoice(null, "0193f2a1-b7c4-7a10-9f3d-2f5a6b7c8d9e", ORG_A),
    null
  );
});

test("a malformed invoice id is rejected before any lookup", () => {
  for (const bad of [
    "zzz",
    "ab",
    "",
    "id with spaces",
    "../etc/passwd",
    "id?drop=1",
    "invoice/../other",
    "%2e%2e%2f",
    "x".repeat(200),
    null,
    undefined,
    42,
    {},
  ]) {
    assert.equal(
      isValidInvoiceId(bad),
      false,
      `expected ${String(bad)} to be invalid`
    );
    assert.equal(selectInvoice(transactions, bad, ORG_A), null);
  }

  for (const good of [
    "1091",
    "invoice_22222222",
    "0193f2a1-b7c4-7a10-9f3d-2f5a6b7c8d9e",
    "665f3ab8c9e77a001234abcd",
  ]) {
    assert.equal(isValidInvoiceId(good), true, `expected ${good} to be valid`);
  }
});

test("an invoice belonging to another organization is not rendered", () => {
  const foreign = {
    id: "foreign-invoice-1",
    name: "Other org plan",
    fee: 99,
    organisation_id: ORG_B,
  };

  // A record that declares a different organisation is refused even when it
  // is present in the list.
  assert.equal(
    selectInvoice([...transactions, foreign], foreign.id, ORG_A),
    null
  );
  // A record that is simply absent from the authorized list is not found
  // either — the same safe outcome as a missing invoice.
  assert.equal(selectInvoice(transactions, foreign.id, ORG_A), null);
  // And an empty/absent organization context never authorizes anything.
  assert.equal(selectInvoice(transactions, transactions[0].id, ""), null);
  // The right organisation still resolves its own invoice.
  assert.equal(
    selectInvoice([...transactions, foreign], foreign.id, ORG_B)?.name,
    "Other org plan"
  );
});

test("malformed list entries are ignored and ids normalize to strings", () => {
  const mixed = [null, "junk", { name: "no id" }, { id: 1091, name: "Num" }];
  assert.equal(selectInvoice(mixed, "1091", ORG_A)?.name, "Num");
});

test("the old fixed sample invoice is never used as a fallback", () => {
  const banned = [
    "Emerj",
    "Mark Essien",
    "Musterstraße",
    "Berlin",
    "1091",
    "1 June 2025",
    "4242",
    "Lexi",
    "invoiceData",
    "Mock data",
  ];
  for (const source of [pageSource, viewSource]) {
    for (const needle of banned) {
      assert.ok(
        !source.includes(needle),
        `sample invoice value "${needle}" must not appear in the route`
      );
    }
  }
  // The lookup itself is wired: validation + authorized selection +
  // not-found handling are all present.
  assert.ok(pageSource.includes("isValidInvoiceId"));
  assert.ok(pageSource.includes("notFound()"));
  assert.ok(viewSource.includes("selectInvoice"));
  assert.ok(viewSource.includes("notFound()"));
  assert.ok(viewSource.includes("/subscriptions/list/"));
});

test("the route has its own not-found boundary below the client ErrorBoundary", () => {
  // (client)/layout.tsx wraps children in an ErrorBoundary that swallows
  // throws, so the segment must ship its own not-found boundary or
  // notFound() renders the "unexpected error" state instead of the 404 page.
  assert.ok(
    notFoundSource.includes('from "~/app/not-found"'),
    "the segment not-found page must reuse the app's 404 UI"
  );
  assert.ok(notFoundSource.includes("default"), "must export a default");
});

test("the invoice route exports noindex nofollow metadata", () => {
  assert.ok(pageSource.includes("export const metadata"));
  const robotsMatch = pageSource.match(/robots:\s*\{([^}]*)\}/);
  assert.ok(robotsMatch, "expected a robots metadata block");
  assert.match(robotsMatch[1], /index:\s*false/);
  assert.match(robotsMatch[1], /follow:\s*false/);
  // Metadata can only be exported from a server component, so the page must
  // not carry the "use client" directive.
  assert.ok(!pageSource.includes('"use client"'));
});
