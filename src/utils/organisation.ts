/**
 * Checks whether an organisation type string represents the backend's
 * auto-created default organisation (`"user default org"`).
 * If no type parameter is provided, attempts to read the active organisation
 * type from the stored user object in localStorage.
 * @param type Optional organisation type string from user or organisation record.
 * @returns True if type matches the default auto-created indicator.
 */
export function isAutoCreatedOrg(type?: string | null): boolean {
  if (type !== undefined) {
    return type?.trim().toLowerCase() === "user default org";
  }
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return (
      user?.organisation?.type?.trim().toLowerCase() === "user default org"
    );
  } catch {
    return false;
  }
}
