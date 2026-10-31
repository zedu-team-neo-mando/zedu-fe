import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import ogs from "open-graph-scraper";

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 5000;
const MAX_HTML_BYTES = 1024 * 1024;
const BLOCKED_HOSTNAME_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".home.arpa",
];

function isBlockedIpv4(address: string): boolean {
  const parts = address.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return true;
  }

  const [a, b, c] = parts;

  return (
    a === 0 || // "this" network
    a === 10 || // RFC1918
    a === 127 || // loopback
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local and cloud metadata
    (a === 172 && b >= 16 && b <= 31) || // RFC1918
    (a === 192 && b === 168) || // RFC1918
    (a === 192 && b === 0 && c === 0) || // IETF protocol assignments
    (a === 192 && b === 0 && c === 2) || // TEST-NET-1
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    (a === 198 && b === 51 && c === 100) || // TEST-NET-2
    (a === 203 && b === 0 && c === 113) || // TEST-NET-3
    a >= 224 // multicast, reserved and broadcast
  );
}

function isBlockedIpv6(address: string): boolean {
  const normalized = address.toLowerCase().split("%")[0];

  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) {
    return isBlockedIpv4(mapped[1]);
  }

  const hexMapped = normalized.match(
    /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/
  );
  if (hexMapped) {
    const high = parseInt(hexMapped[1], 16);
    const low = parseInt(hexMapped[2], 16);
    return isBlockedIpv4(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`);
  }

  const compatible = normalized.match(/^::(\d+\.\d+\.\d+\.\d+)$/);
  if (compatible) {
    return isBlockedIpv4(compatible[1]);
  }

  if (normalized === "::" || normalized === "::1") {
    return true;
  }

  return (
    normalized.startsWith("fe80") || // link-local
    normalized.startsWith("fc") || // unique local
    normalized.startsWith("fd") || // unique local
    normalized.startsWith("ff") // multicast
  );
}

function isBlockedAddress(address: string): boolean {
  const family = isIP(address);

  if (family === 4) return isBlockedIpv4(address);
  if (family === 6) return isBlockedIpv6(address);

  // Anything that is not an IP literal cannot be trusted.
  return true;
}

async function isFetchableHost(hostname: string): Promise<boolean> {
  const host = hostname.replace(/\.$/, "").toLowerCase();

  if (!host) return false;
  if (isIP(host)) return !isBlockedAddress(host);

  if (
    host === "localhost" ||
    BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => host.endsWith(suffix))
  ) {
    return false;
  }

  try {
    const records = await lookup(host, { all: true, verbatim: true });

    if (records.length === 0) return false;

    return records.every((record) => !isBlockedAddress(record.address));
  } catch {
    // Unresolvable hosts are rejected rather than passed to the fetcher.
    return false;
  }
}

function parseTargetUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

async function readBodyWithLimit(response: Response): Promise<string | null> {
  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;
    if (!value) continue;

    total += value.byteLength;

    if (total > MAX_HTML_BYTES) {
      await reader.cancel();
      return null;
    }

    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder("utf-8").decode(body);
}

type FetchedPage = {
  html: string;
  url: string;
};

async function fetchPage(startUrl: URL): Promise<FetchedPage | null> {
  let currentUrl = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!(await isFetchableHost(currentUrl.hostname))) {
      return null;
    }

    const response = await fetch(currentUrl, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "ZeduLinkPreview/1.0",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");

      if (!location) return null;

      let nextUrl: URL;

      try {
        nextUrl = new URL(location, currentUrl);
      } catch {
        return null;
      }

      if (nextUrl.protocol !== "http:" && nextUrl.protocol !== "https:") {
        return null;
      }

      currentUrl = nextUrl;
      continue;
    }

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type");

    if (
      contentType &&
      !/text\/html|application\/xhtml\+xml/i.test(contentType)
    ) {
      return null;
    }

    const declaredLength = Number(response.headers.get("content-length"));

    if (Number.isFinite(declaredLength) && declaredLength > MAX_HTML_BYTES) {
      return null;
    }

    const html = await readBodyWithLimit(response);

    if (html === null) return null;

    return { html, url: currentUrl.toString() };
  }

  return null;
}

function resolveImageUrl(image: string | undefined, baseUrl: string): string {
  if (!image) return "";

  try {
    return new URL(image, baseUrl).toString();
  } catch {
    return "";
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const targetUrl = parseTargetUrl(rawUrl);

  if (!targetUrl) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const page = await fetchPage(targetUrl);

    if (!page) {
      return NextResponse.json(
        { error: "URL is not allowed" },
        { status: 400 }
      );
    }

    // open-graph-scraper rejects being given both `url` and `html`, and parsing
    // the HTML we already fetched is what keeps this request on the validated
    // origin instead of letting the parser fetch anything it likes.
    const { result } = await ogs({ html: page.html });

    return NextResponse.json({
      title: result.ogTitle || result.twitterTitle || "No Title",
      description: result.ogDescription || result.twitterDescription || "",
      image: resolveImageUrl(
        result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url,
        page.url
      ),
      siteName: result.ogSiteName || new URL(page.url).hostname,
      url: rawUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 400 }
    );
  }
}
