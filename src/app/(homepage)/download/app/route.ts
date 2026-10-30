import type { NextRequest } from "next/server";

import { appStoreUrl, playStoreUrl } from "~/lib/env-urls";

// Read the store URLs and the user agent on every request, not at build time.
export const dynamic = "force-dynamic";

// The download page QR code points here, so one code works on every phone:
// iOS goes to the App Store, Android to Google Play, and anything else (or a
// missing store URL) to the download page, which links to both stores.
export function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";

  let storeUrl = "";
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    storeUrl = appStoreUrl();
  } else if (/android/i.test(userAgent)) {
    storeUrl = playStoreUrl();
  }

  return new Response(null, {
    status: 307,
    headers: { Location: storeUrl || "/download" },
  });
}
