export const SUPPORT_EMAIL = "contact@zedu.chat";

/**
 * A ready-to-send support email with the page, browser and screen size filled
 * in. Opening it sends nothing until the person presses send.
 */
export function buildReportProblemHref(): string {
  const subject = "Zedu web: report a problem";
  const body = [
    "What went wrong?",
    "",
    "",
    "---",
    // No query string or fragment: invitation and magic-link tokens live there.
    `Page: ${window.location.origin}${window.location.pathname}`,
    `Browser: ${navigator.userAgent}`,
    `Screen: ${window.screen.width}x${window.screen.height}`,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
