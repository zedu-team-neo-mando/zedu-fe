/**
 * Domain logic for the billing invoice route (`/billing/invoice/[id]`).
 *
 * The backend exposes billing records only through the organisation-scoped
 * payment-history list (`GET /subscriptions/list/{orgId}`) — there is no
 * single-invoice endpoint in the approved API contract. An invoice is
 * therefore resolved by matching the requested route id against the records
 * the authenticated user is already allowed to see for the active
 * organisation. Anything that does not match — unknown id, a record from
 * another organisation, a malformed id — resolves to "not found" so no
 * billing data can be disclosed or guessed, and there is never a fallback
 * to sample data.
 */

/** A billing record as returned by the payment-history list, normalized. */
export type InvoiceRecord = {
  id: string;
  name?: string;
  fee?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  session_id?: string;
  organisation_id?: string;
  invoice_number?: string;
};

/**
 * Backend ids are opaque URL-safe tokens (uuids, object ids, stripe-style
 * session ids). Short or exotic ids such as `zzz` are malformed and never
 * reach the data layer.
 */
const MIN_INVOICE_ID_LENGTH = 4;
const MAX_INVOICE_ID_LENGTH = 128;
const INVOICE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

/** True when `id` is a plausibly well-formed invoice identifier. */
export const isValidInvoiceId = (id: unknown): id is string =>
  typeof id === "string" &&
  id.length >= MIN_INVOICE_ID_LENGTH &&
  id.length <= MAX_INVOICE_ID_LENGTH &&
  INVOICE_ID_PATTERN.test(id);

const asText = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
};

const asFee = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

/** Projects an untrusted list entry onto a typed, display-safe record. */
const normalize = (candidate: unknown): InvoiceRecord | null => {
  if (!candidate || typeof candidate !== "object") return null;
  const record = candidate as Record<string, unknown>;
  const id = asText(record.id);
  if (!id) return null;
  return {
    id,
    name: asText(record.name),
    fee: asFee(record.fee),
    start_date: asText(record.start_date),
    end_date: asText(record.end_date),
    status: asText(record.status),
    session_id: asText(record.session_id),
    organisation_id: asText(record.organisation_id),
    invoice_number: asText(record.invoice_number),
  };
};

/**
 * Resolves `invoiceId` inside the already-authorized, organisation-scoped
 * list of billing records.
 *
 * Returns `null` when the invoice does not exist for this organisation —
 * unknown id, another organisation's id, or a malformed record. Callers
 * must treat `null` as not-found and never as a reason to fall back to
 * sample data.
 */
export const selectInvoice = (
  transactions: unknown,
  invoiceId: string,
  organisationId: string
): InvoiceRecord | null => {
  if (!isValidInvoiceId(invoiceId)) return null;
  if (!organisationId) return null;
  if (!Array.isArray(transactions)) return null;

  for (const candidate of transactions) {
    const record = normalize(candidate);
    if (!record || record.id !== invoiceId) continue;
    // Defence in depth: never return a record that declares another org.
    if (record.organisation_id && record.organisation_id !== organisationId) {
      continue;
    }
    return record;
  }
  return null;
};
