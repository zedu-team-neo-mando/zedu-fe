/**
 * Reads a saved list of open accordion ids. Anything that is not a JSON array
 * of strings (missing, empty, not JSON, an object, a string) falls back to the
 * defaults, so a corrupt localStorage value can never break the sidebar.
 */
export const parseStoredAccordions = (
  saved: string | null | undefined,
  defaults: string[]
): string[] => {
  if (!saved) return defaults;
  try {
    const parsed: unknown = JSON.parse(saved);
    if (
      Array.isArray(parsed) &&
      parsed.every((value) => typeof value === "string")
    ) {
      return parsed;
    }
    return defaults;
  } catch {
    return defaults;
  }
};
