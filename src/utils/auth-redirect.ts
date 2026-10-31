import { isAutoCreatedOrg } from "~/utils/organisation";

/**
 * Resolves the logged-in destination path, preserving template query param for un-onboarded users
 * or users on an auto-created workspace.
 * @param orgSlugFromState Organization slug available in GlobalState context.
 * @param template Optional template slug passed in query parameters.
 * @returns Destination URL string or null if organization slug is unresolved.
 */
export function getLoggedInRedirectPath(
  orgSlugFromState?: string,
  template?: string | null
) {
  const storedOrgSlug = localStorage.getItem("orgSlug") || "";
  let user: {
    current_organisation_slug?: string;
    is_onboarded?: boolean;
    organisation?: { type?: string; slug?: string };
    organisations?: Array<{ slug?: string; type?: string }>;
  } | null = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  let organisations: Array<{ slug?: string; type?: string }> = [];
  try {
    const rawOrgs = localStorage.getItem("organisations");
    if (rawOrgs) {
      organisations = JSON.parse(rawOrgs);
    }
  } catch {
    organisations = [];
  }
  if (!organisations?.length && user?.organisations?.length) {
    organisations = user.organisations;
  }

  const orgSlug =
    orgSlugFromState || storedOrgSlug || user?.current_organisation_slug || "";

  if (!orgSlug) return null;

  const activeTemplate = template;

  const query = activeTemplate
    ? `?template=${encodeURIComponent(activeTemplate)}`
    : "";

  const matchingFromList = organisations?.find((o) => o?.slug === orgSlug);
  const resolvedOrg =
    matchingFromList ||
    (user?.organisation?.slug === orgSlug || !organisations?.length
      ? user?.organisation
      : undefined);

  const needsOnboarding =
    user?.is_onboarded === false ||
    (Boolean(activeTemplate) && isAutoCreatedOrg(resolvedOrg?.type));

  if (needsOnboarding) {
    return `/${orgSlug}/welcome${query}`;
  }

  return activeTemplate
    ? `/${orgSlug}/welcome/create-organization?template=${encodeURIComponent(activeTemplate)}`
    : `/${orgSlug}`;
}
