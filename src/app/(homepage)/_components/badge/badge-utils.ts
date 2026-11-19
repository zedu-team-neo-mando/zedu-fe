const TRACKING_PARAMS = {
  utm_source: "badge",
  utm_medium: "referral",
  utm_campaign: "join_badge",
};

export function buildTrackedUrl(inviteUrl: string, siteBaseUrl: string) {
  if (!siteBaseUrl) {
    return { url: "", error: "Zedu's website address is unavailable." };
  }

  try {
    const siteUrl = new URL(siteBaseUrl);
    const destination = inviteUrl.trim()
      ? new URL(inviteUrl.trim())
      : new URL(siteUrl.href);

    if (
      !["http:", "https:"].includes(destination.protocol) ||
      destination.origin !== siteUrl.origin
    ) {
      return { url: "", error: "Enter a valid Zedu invitation link." };
    }

    Object.entries(TRACKING_PARAMS).forEach(([key, value]) => {
      destination.searchParams.set(key, value);
    });

    return { url: destination.toString(), error: "" };
  } catch {
    return { url: "", error: "Enter a valid Zedu invitation link." };
  }
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

export function buildSnippets(destinationUrl: string, imageUrl: string) {
  const alt = "Join us on Zedu";
  const html = `<a href="${escapeHtml(destinationUrl)}"><img src="${escapeHtml(imageUrl)}" alt="${alt}" /></a>`;
  const markdown = `[![${alt}](${imageUrl})](${destinationUrl})`;

  return { html, markdown };
}
