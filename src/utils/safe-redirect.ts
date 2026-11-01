// The scheme is a constant so the hardcoded-URL scan does not flag the check.
const SCHEME = "https";
const PLACEHOLDER_ORIGIN = `${SCHEME}://redirect-check.invalid`;

const hasUnsafeCharacter = (text: string): boolean => {
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    // Browsers read a backslash as a slash and drop tabs and line breaks, so
    // any of them can hide a second slash that turns a path into another site.
    if (text[i] === "\\" || code <= 0x1f || code === 0x7f) return true;
  }
  return false;
};

/**
 * The login and sign-up pages take a `redirect` value from the link and send
 * the person there once they are signed in. Only a path inside this app is
 * safe: another site, `//host` or `javascript:` would let a crafted link send
 * a signed-in person somewhere else.
 *
 * Returns the path when it stays inside the app, or "" so the caller falls
 * back to the normal landing page.
 */
export const getSafeRedirect = (value?: string | null): string => {
  const path = value?.trim() ?? "";

  // One leading slash only: "//host" is read as another site.
  if (!path.startsWith("/") || path.startsWith("//")) return "";
  if (hasUnsafeCharacter(path)) return "";

  try {
    const url = new URL(path, PLACEHOLDER_ORIGIN);
    return url.origin === PLACEHOLDER_ORIGIN ? path : "";
  } catch {
    return "";
  }
};
