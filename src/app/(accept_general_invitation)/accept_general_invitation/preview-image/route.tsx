import { ImageResponse } from "next/og";
import { fetchInvitePreview } from "~/lib/invite-preview-metadata";
import { invitePreviewCopy, truncateName } from "~/lib/invite-preview";

// Share image for workspace invite links (both general and organisation
// invites point here). It shows only the workspace name and member count:
// never member names, photos or emails, because previews travel beyond
// the people being invited.

const WIDTH = 1200;
const HEIGHT = 630;
const BRAND = "#7141F8";
const CACHE_HEADER = "public, max-age=600, s-maxage=600";

export async function GET(request: Request) {
  const orgId = new URL(request.url).searchParams.get("org_id");
  const preview = await fetchInvitePreview(orgId);

  // An unknown workspace gets a 404, so the crawler keeps the text preview.
  if (!preview) {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }

  const name = truncateName(preview.orgName);
  const { countLine } = invitePreviewCopy(name, preview.memberCount);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: BRAND,
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 28,
          background: "#ffffff",
          color: BRAND,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        {name.charAt(0)}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 30, opacity: 0.85 }}>
          You&apos;re invited to join
        </div>
        <div
          style={{
            fontSize: name.length > 28 ? 60 : 76,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 36, opacity: 0.92 }}>{countLine}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 26,
        }}
      >
        <div style={{ opacity: 0.85 }}>
          Channels, files and voice calls for your class.
        </div>
        <div style={{ fontSize: 44, fontWeight: 700 }}>Zedu</div>
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT, headers: { "Cache-Control": CACHE_HEADER } }
  );
}
