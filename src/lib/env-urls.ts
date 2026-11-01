function clean(value: string | undefined): string {
  return (value ?? "").replace(/\/$/, "");
}

function readEnv(name: string): string {
  return clean(process.env[name]);
}

// Next.js only inlines NEXT_PUBLIC_* values into browser code when they are
// written out in full. readEnv(name) returns "" in client components, so
// links rendered by client components must read process.env.NEXT_PUBLIC_* directly.

export function siteUrl(path = ""): string {
  const base = readEnv("NEXT_PUBLIC_CLIENT_URL");
  if (!path || path === "/") {
    return base;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function ogImageUrl(fileName: string): string {
  return `${readEnv("NEXT_PUBLIC_MEDIA_URL")}/telexprodbucket/public/og-images/${fileName}`;
}

export function contactSalesUrl(): string {
  return `${readEnv("NEXT_PUBLIC_BASE_URL")}/contact`;
}

type Store = "app" | "play";

type StoreLinkOptions = {
  /** The page the link is on, e.g. "download-page" or "home". */
  campaign: string;
  /** Which link on that page, e.g. "hero", "footer" or "qr-code". */
  content: string;
};

// Apple ignores campaign tokens longer than 40 characters.
const APP_STORE_CAMPAIGN_MAX = 40;

// readEnv reads the live value on the server (the QR route reads it per
// request); the values written out in full are what Next.js inlines into
// client components, where readEnv returns "".
function storeBaseUrl(store: Store): string {
  return store === "app"
    ? readEnv("NEXT_PUBLIC_APP_STORE_URL") ||
        clean(process.env.NEXT_PUBLIC_APP_STORE_URL)
    : readEnv("NEXT_PUBLIC_PLAY_STORE_URL") ||
        clean(process.env.NEXT_PUBLIC_PLAY_STORE_URL);
}

function appStoreProviderToken(): string {
  return (
    readEnv("NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN") ||
    clean(process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN)
  );
}

/** Bare store URLs, untagged — for metadata and ID extraction, not marketing links. */
export function appStoreUrl(): string {
  return storeBaseUrl("app");
}

export function playStoreUrl(): string {
  return storeBaseUrl("play");
}

/**
 * App Store or Google Play link tagged with where it was clicked, so the
 * store reports can credit installs to the page and placement.
 * - Google Play: a URL-encoded `referrer` with UTM tags (replaces
 *   `pcampaignid=web_share`, the tag Google adds to copied share links).
 * - App Store: `ct` (campaign), plus `pt` and `mt=8` when
 *   NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN is set.
 * Returns "" when the store URL is not configured.
 */
export function storeLink(
  store: Store,
  { campaign, content }: StoreLinkOptions
): string {
  const base = storeBaseUrl(store);
  if (!base) return "";

  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return base;
  }

  if (store === "play") {
    url.searchParams.delete("pcampaignid");
    url.searchParams.set(
      "referrer",
      new URLSearchParams({
        utm_source: "zedu.chat",
        utm_medium: "website",
        utm_campaign: campaign,
        utm_content: content,
      }).toString()
    );
  } else {
    url.searchParams.set(
      "ct",
      `${campaign}-${content}`.slice(0, APP_STORE_CAMPAIGN_MAX)
    );
    const providerToken = appStoreProviderToken();
    if (providerToken) {
      url.searchParams.set("pt", providerToken);
      url.searchParams.set("mt", "8");
    }
  }

  return url.toString();
}

/** Campaign name for a page path: "/" -> "home", "/solutions/bootcamps" -> "solutions-bootcamps". */
export function pageCampaign(pathname: string | null | undefined): string {
  const slug = (pathname ?? "")
    .toLowerCase()
    .split("/")
    .filter(Boolean)
    .join("-")
    .replace(/[^a-z0-9-]/g, "");
  return slug || "home";
}

/** Numeric App Store id from NEXT_PUBLIC_APP_STORE_URL (".../id1234567890"). */
export function appStoreAppId(): string {
  return appStoreUrl().match(/\/id(\d+)/)?.[1] ?? "";
}

/** Android package name from NEXT_PUBLIC_PLAY_STORE_URL ("...?id=net.example.app"). */
export function playStorePackageId(): string {
  return playStoreUrl().match(/[?&]id=([\w.]+)/)?.[1] ?? "";
}

export function gtmScriptUrl(): string {
  return readEnv("NEXT_PUBLIC_GTM_SCRIPT_URL");
}

export function ipifyUrl(): string {
  return readEnv("NEXT_PUBLIC_IPIFY_URL");
}

export function ipapiUrl(): string {
  return readEnv("NEXT_PUBLIC_IPAPI_URL");
}

export function mediaBaseUrl(): string {
  return readEnv("NEXT_PUBLIC_MEDIA_URL");
}

export function mediaStagingBaseUrl(): string {
  return readEnv("NEXT_PUBLIC_MEDIA_STAGING_URL");
}

export function resolveMediaFileUrl(fileUrl: string): string | null {
  if (!fileUrl) return null;

  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  const base = mediaBaseUrl() || mediaStagingBaseUrl();
  if (!base) return null;

  const path = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
  return `${base}${path}`;
}

export function isAllowedMediaFileUrl(fileUrl: string): boolean {
  try {
    const parsed = new URL(fileUrl);
    const allowedHosts = [mediaBaseUrl(), mediaStagingBaseUrl()]
      .filter(Boolean)
      .map((base) => new URL(base).hostname);

    return allowedHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function officeEmbedBaseUrl(): string {
  return readEnv("NEXT_PUBLIC_OFFICE_EMBED_URL");
}

export function officeEmbedUrl(fileUrl: string): string | null {
  const base = officeEmbedBaseUrl();
  if (!base || !fileUrl) return null;

  return `${base}?src=${encodeURIComponent(fileUrl)}`;
}

export function uiAvatarUrl(name: string): string {
  return `${readEnv("NEXT_PUBLIC_UI_AVATARS_URL")}?name=${encodeURIComponent(name)}`;
}

export function instagramUrl(): string {
  return clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL);
}

export function tiktokUrl(): string {
  return clean(process.env.NEXT_PUBLIC_TIKTOK_URL);
}

export function facebookUrl(): string {
  return clean(process.env.NEXT_PUBLIC_FACEBOOK_URL);
}

export function xUrl(): string {
  return clean(process.env.NEXT_PUBLIC_X_URL);
}

/** npm package root for emoji-datasource-apple (no trailing slash). */
export function appleEmojiDatasourceBaseUrl(): string {
  return readEnv("NEXT_PUBLIC_EMOJI_DATASOURCE_URL");
}

export function appleEmojiImageUrl(unified: string): string {
  const base = appleEmojiDatasourceBaseUrl();
  if (!base || !unified) return "";
  return `${base.replace(/\/$/, "")}/img/apple/64/${unified}.png`;
}
