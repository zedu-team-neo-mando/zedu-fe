// The backend enforces `min=7` on reset and change-password endpoints (`min=7`
// in zedu-be), while sign-up enforces it client-side for consistency. Every form
// that sets a password checks it before sending the request.
export const PASSWORD_MIN_LENGTH = 7;

export const PASSWORD_HINT = `At least ${PASSWORD_MIN_LENGTH} characters`;

export const PASSWORD_TOO_SHORT_MESSAGE = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;

/**
 * Evaluates whether a candidate password fails the minimum length requirement by unicode code points.
 * @param password The password candidate string.
 * @returns True if password code point count is strictly less than PASSWORD_MIN_LENGTH.
 */
export const isPasswordTooShort = (password: string) =>
  Array.from(password).length < PASSWORD_MIN_LENGTH;
