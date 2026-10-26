/**
 * Safe redirect URL utilities to prevent open redirect vulnerabilities.
 * Ensures all post-authentication redirects only resolve to internal relative application routes.
 */

/**
 * Validates whether a given string is a safe, internal relative path.
 *
 * Rules:
 * - Must be a non-empty string.
 * - Must start with a single '/' (not '//' or '/\').
 * - Must not start with '\' or include backslashes in the path.
 * - Must not include schemes (e.g. 'https:', 'http:', 'javascript:', 'data:').
 * - Must not contain control characters (CR, LF, null bytes).
 * - Must resolve to the local origin when parsed with a base origin.
 */
export function isSafeInternalPath(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  // Reject CR, LF, null byte, or any control characters
  if (/[\r\n\0\t]/.test(trimmed)) {
    return false;
  }

  // Must begin with a single slash, not double slash or backslash
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.startsWith("\\")
  ) {
    return false;
  }

  // Reject any protocol or scheme like javascript:, data:, etc.
  // In a valid relative path, a colon shouldn't appear before '?' or '#'
  const pathBeforeQueryOrHash = trimmed.split(/[?#]/)[0];
  if (
    pathBeforeQueryOrHash.includes(":") ||
    pathBeforeQueryOrHash.includes("\\")
  ) {
    return false;
  }

  // Validate resolution against a dummy origin
  try {
    const dummyOrigin = "http://safe-internal.local";
    const resolved = new URL(trimmed, dummyOrigin);
    if (resolved.origin !== dummyOrigin) {
      return false;
    }

    if (
      !resolved.pathname.startsWith("/") ||
      resolved.pathname.startsWith("//")
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * Sanitizes an untrusted redirect URL.
 * Returns the sanitized internal URL (with optional coworkerId appended)
 * or the provided fallback URL if the candidate redirect is unsafe or empty.
 */
export function getSafeRedirectUrl(
  candidateUrl: string | null | undefined,
  fallback?: string,
  coworkerId?: string | null
): string {
  const defaultFallback = fallback ?? "";

  if (!isSafeInternalPath(candidateUrl)) {
    return defaultFallback;
  }

  let finalUrl = candidateUrl!.trim();

  if (coworkerId && coworkerId.trim()) {
    const separator = finalUrl.includes("?") ? "&" : "?";
    finalUrl = `${finalUrl}${separator}coworkerId=${encodeURIComponent(
      coworkerId.trim()
    )}`;
  }

  return finalUrl;
}
