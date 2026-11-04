// Request URLs for the Organisation → User Management page.
// Query values are encoded with URLSearchParams so entered text reaches
// the API intact (plus-addressed emails, "&", "#", ...).

export function buildOrganisationUsersUrl(
  orgId: string,
  options: { page: number; limit: number; search: string; role?: string }
): string {
  const params = new URLSearchParams({
    page: String(options.page),
    limit: String(options.limit),
    search: options.search,
  });
  if (options.role) {
    params.set("role", options.role);
  }
  return `/organisations/${orgId}/users?${params.toString()}`;
}

export function buildOrganisationInvitesUrl(
  orgId: string,
  options: { page: number; limit: number; search: string; role?: string }
): string {
  const params = new URLSearchParams({
    page: String(options.page),
    limit: String(options.limit),
    search: options.search,
  });
  if (options.role) {
    params.set("role", options.role);
  }
  return `/organisations/${orgId}/invites?${params.toString()}`;
}
