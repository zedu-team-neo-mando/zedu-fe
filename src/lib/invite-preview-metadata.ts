import type { Metadata } from "next";
import { siteUrl } from "~/lib/env-urls";
import {
  formatOrgName,
  invitePreviewCopy,
  isOrgId,
  memberCountFromOrgInfo,
} from "~/lib/invite-preview";

// Previews are fetched by link crawlers, so keep the lookup short and cached.
const PREVIEW_TIMEOUT_MS = 2500;
const PREVIEW_REVALIDATE_SECONDS = 600;

export type InvitePreview = {
  orgName: string;
  memberCount: number | null;
};

/**
 * Workspace name and member count for an invite link, or null when either
 * the id is invalid or the backend does not answer in time.
 * The invitation token is deliberately not sent: with it the backend also
 * returns the invitee's email, which must never reach a public preview.
 */
export async function fetchInvitePreview(
  orgId: unknown
): Promise<InvitePreview | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl || !isOrgId(orgId)) return null;

  try {
    const res = await fetch(
      `${baseUrl.replace(/\/$/, "")}/organisations/${orgId}/load-org-info`,
      {
        next: { revalidate: PREVIEW_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(PREVIEW_TIMEOUT_MS),
      }
    );
    if (!res.ok) return null;

    const data = (await res.json())?.data;
    const orgName = formatOrgName(data?.organisation_name);
    if (!orgName) return null;

    return {
      orgName,
      memberCount: memberCountFromOrgInfo(data?.org_user_info),
    };
  } catch {
    return null;
  }
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Metadata for an invitation page that names the workspace being joined.
 * Returns {} when the workspace cannot be loaded, so the layout's generic
 * preview is used instead.
 */
export async function invitePreviewMetadata(
  path: string,
  searchParams: SearchParams
): Promise<Metadata> {
  const orgId = (await searchParams).org_id;
  const preview = await fetchInvitePreview(orgId);
  if (!preview || typeof orgId !== "string") return {};

  const { title, description } = invitePreviewCopy(
    preview.orgName,
    preview.memberCount
  );
  const image = {
    url: siteUrl(
      `/accept_general_invitation/preview-image?org_id=${encodeURIComponent(orgId)}`
    ),
    width: 1200,
    height: 630,
    alt: title,
  };

  // openGraph and twitter replace the layout's objects rather than merging
  // with them, so every field the layout sets is repeated here.
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl(path),
      siteName: "Zedu",
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
