import type { PermissionKey } from "~/types/rbac";

export type PermissionRequirement =
  | PermissionKey
  | { anyOf: PermissionKey[] }
  | { allOf: PermissionKey[] };

export const ORG_SETTINGS_NAV_ITEMS: Array<{
  id: string;
  title: string;
  pathSegment: string;
  access: PermissionRequirement;
}> = [
  {
    id: "general",
    title: "General",
    pathSegment: "general",
    access: "manage:organization",
  },
  {
    id: "user-management",
    title: "User Management",
    pathSegment: "user-management",
    access: {
      anyOf: [
        "manage:members",
        "invite:members",
        "change:user_org_role",
        "remove:people",
      ],
    },
  },
  {
    id: "roles-permissions",
    title: "Roles & Permissions",
    pathSegment: "roles-permissions",
    access: { anyOf: ["manage:roles", "create:role"] },
  },
  {
    id: "webhooks",
    title: "Webhooks",
    pathSegment: "webhooks",
    access: "create:webhooks",
  },
  {
    id: "channel-management",
    title: "Channel Management",
    pathSegment: "channel-management",
    access: "manage:channels",
  },
  {
    id: "billing",
    title: "Billing",
    pathSegment: "billing",
    access: { anyOf: ["view:billing", "manage:billing"] },
  },
];

/** Resolve organisation settings segment from pathname (supports nested routes). */
export const getOrganisationSettingsSegment = (
  pathname: string
): string | null => {
  const match = pathname.match(/\/settings\/organisation\/([^/?#]+)/);
  return match?.[1] ?? null;
};

export const getOrganisationSettingsAccessRule = (
  segment: string | null
): PermissionRequirement | null => {
  if (!segment) return null;

  if (segment === "billing") {
    return { anyOf: ["view:billing", "manage:billing"] };
  }

  const item = ORG_SETTINGS_NAV_ITEMS.find(
    (entry) =>
      entry.pathSegment === segment ||
      segment.startsWith(`${entry.pathSegment}/`)
  );

  return item?.access ?? null;
};

export const ACCESS_DENIED_COPY = {
  title: "You don't have access",
  description:
    "Your role doesn't include permission to view this area. Contact an organisation administrator if you need access.",
};
