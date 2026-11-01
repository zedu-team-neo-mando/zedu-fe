import type { SignatureValues } from "./signature-form";

export interface BuiltSignature {
  /** Table-based HTML with inline styles, the format email clients accept. */
  html: string;
  /** Plain-text fallback for clients that paste text only. */
  text: string;
}

const FONT = "Arial, Helvetica, sans-serif";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Adds https:// when it is missing; anything that is not http(s) is dropped. */
export const normaliseUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
};

/** The URL as people read it: no scheme, no trailing slash. */
const displayUrl = (url: string): string =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const link = (href: string, label: string, color: string): string =>
  `<a href="${escapeHtml(href)}" style="color:${color};text-decoration:none;">${escapeHtml(label)}</a>`;

/**
 * Builds the signature from the form values. Every value is escaped and only
 * http(s), mailto and tel links are written, so the output is safe to preview.
 */
export const buildSignature = (
  values: SignatureValues,
  creditUrl: string
): BuiltSignature => {
  const accent = values.accent;
  const name = values.fullName.trim();
  const role = values.role.trim();
  const organisation = values.organisation.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const website = normaliseUrl(values.website);
  const community = normaliseUrl(values.communityUrl);

  const roleLine = [role, organisation].filter(Boolean).join(" · ");
  const contacts = [
    email && link(`mailto:${email}`, email, "#404040"),
    phone && link(`tel:${phone.replace(/[^\d+]/g, "")}`, phone, "#404040"),
    website && link(website, displayUrl(website), "#404040"),
  ].filter(Boolean);

  const rows = [
    `<tr><td style="font-family:${FONT};font-size:16px;font-weight:bold;color:${accent};padding:0 0 2px;">${escapeHtml(name || "Your name")}</td></tr>`,
    roleLine &&
      `<tr><td style="font-family:${FONT};font-size:13px;color:#525252;padding:0 0 8px;">${escapeHtml(roleLine)}</td></tr>`,
    contacts.length > 0 &&
      `<tr><td style="font-family:${FONT};font-size:13px;color:#404040;padding:0 0 8px;">${contacts.join(' <span style="color:#a3a3a3;">|</span> ')}</td></tr>`,
    community &&
      `<tr><td style="font-family:${FONT};font-size:13px;padding:0 0 8px;"><a href="${escapeHtml(community)}" style="color:${accent};font-weight:bold;text-decoration:none;">Join our community on Zedu &rarr;</a></td></tr>`,
    values.showCredit &&
      creditUrl &&
      `<tr><td style="font-family:${FONT};font-size:11px;color:#737373;padding:4px 0 0;">Signature made with ${link(creditUrl, "Zedu", "#737373")}</td></tr>`,
  ].filter(Boolean);

  const html = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows.join("")}</table>`;

  const text = [
    name || "Your name",
    roleLine,
    [email, phone, website && displayUrl(website)].filter(Boolean).join(" | "),
    community && `Join our community on Zedu: ${community}`,
    values.showCredit && creditUrl && `Signature made with Zedu: ${creditUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
};
