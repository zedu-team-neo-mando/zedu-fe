import { NextRequest, NextResponse } from "next/server";
import ogs from "open-graph-scraper";
import dns from "node:dns/promises";
import net from "node:net";

// Verifies whether an IP address is private, loopback, link-local, or cloud metadata
function isPrivateOrInternalIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4) return true;

    // 0.0.0.0/8 (Current network)
    if (parts[0] === 0) return true;

    // 10.0.0.0/8 (Private RFC1918)
    if (parts[0] === 10) return true;

    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;

    // 169.254.0.0/16 (Link-local / Cloud metadata, e.g. 169.254.169.254)
    if (parts[0] === 169 && parts[1] === 254) return true;

    // 172.16.0.0/12 (Private RFC1918: 172.16.0.0 - 172.31.255.255)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16 (Private RFC1918)
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 255.255.255.255 (Broadcast)
    if (parts.every((p) => p === 255)) return true;

    return false;
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    // ::1 (Loopback)
    if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;
    // :: (Unspecified)
    if (normalized === "::" || normalized === "0:0:0:0:0:0:0:0") return true;
    // fe80::/10 (Link-local)
    if (
      normalized.startsWith("fe80:") ||
      /^fe[89ab][0-9a-f]:/i.test(normalized)
    )
      return true;
    // fc00::/7 (Unique local / private IPv6)
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    // IPv4-mapped IPv6 (::ffff:127.0.0.1, etc.)
    if (normalized.includes("::ffff:")) {
      const ipv4Part = normalized.split("::ffff:")[1];
      if (ipv4Part && net.isIPv4(ipv4Part)) {
        return isPrivateOrInternalIp(ipv4Part);
      }
    }
    return false;
  }

  return true;
}

// Validates URL scheme and resolves hostname through DNS to reject internal/private destinations
async function validateUrlSafety(url: URL): Promise<boolean> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return false;
  }

  const hostname = url.hostname;
  if (!hostname) {
    return false;
  }

  if (net.isIP(hostname)) {
    return !isPrivateOrInternalIp(hostname);
  }

  const lowerHost = hostname.toLowerCase();
  if (
    lowerHost === "localhost" ||
    lowerHost.endsWith(".localhost") ||
    lowerHost.endsWith(".local") ||
    lowerHost.endsWith(".internal")
  ) {
    return false;
  }

  try {
    const lookupResults = await dns.lookup(hostname, { all: true });
    if (!lookupResults || lookupResults.length === 0) {
      return false;
    }
    for (const entry of lookupResults) {
      if (isPrivateOrInternalIp(entry.address)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

// Safely fetches HTML while following redirects manually and re-validating destination safety on every hop
async function fetchSafeHtml(
  initialUrl: URL,
  maxRedirects = 5,
  timeoutMs = 5000
): Promise<{ html: string; finalUrl: string } | null> {
  let currentUrl = initialUrl;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const isSafe = await validateUrlSafety(currentUrl);
    if (!isSafe) {
      return null;
    }

    try {
      const response = await fetch(currentUrl.toString(), {
        method: "GET",
        redirect: "manual",
        headers: {
          "User-Agent": "ZeduLinkPreviewBot/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      // Handle redirect status codes (301, 302, 303, 307, 308)
      if (
        response.status === 301 ||
        response.status === 302 ||
        response.status === 303 ||
        response.status === 307 ||
        response.status === 308
      ) {
        const locationHeader = response.headers.get("location");
        if (!locationHeader) {
          return null;
        }

        try {
          currentUrl = new URL(locationHeader, currentUrl);
        } catch {
          return null;
        }
        continue;
      }

      if (!response.ok) {
        return null;
      }

      // Read response body up to 1MB to avoid memory exhaustion
      const htmlText = await response.text();
      const truncatedHtml = htmlText.slice(0, 1024 * 1024);
      return { html: truncatedHtml, finalUrl: currentUrl.toString() };
    } catch {
      return null;
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Malformed URL" }, { status: 400 });
  }

  const fetchResult = await fetchSafeHtml(parsedUrl);
  if (!fetchResult) {
    return NextResponse.json(
      { error: "Failed to fetch metadata or forbidden destination" },
      { status: 400 }
    );
  }

  try {
    const { result } = await ogs({
      html: fetchResult.html,
    });

    const finalParsed = new URL(fetchResult.finalUrl);

    return NextResponse.json({
      title: result.ogTitle || result.twitterTitle || "No Title",
      description: result.ogDescription || result.twitterDescription || "",
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || "",
      siteName: result.ogSiteName || finalParsed.hostname,
      url: fetchResult.finalUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse metadata" },
      { status: 400 }
    );
  }
}
