import { NextRequest, NextResponse } from "next/server";
import { isAllowedMediaFileUrl, resolveMediaFileUrl } from "~/lib/env-urls";

const CONTENT_TYPES: Record<string, string> = {
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  pdf: "application/pdf",
  txt: "text/plain",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odp: "application/vnd.oasis.opendocument.presentation",
};

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { filename: rawFilename } = await context.params;
  const filename = decodeURIComponent(rawFilename || "document");

  // Reject filenames containing control characters (CRLF, etc.) to prevent
  // response header injection via the Content-Disposition header.
  if (/[\r\n\u0000-\u001f\u007f]/.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const rawUrl = request.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing file url" }, { status: 400 });
  }

  const fileUrl = resolveMediaFileUrl(rawUrl);

  if (!fileUrl || !isAllowedMediaFileUrl(fileUrl)) {
    return NextResponse.json({ error: "Invalid file url" }, { status: 400 });
  }

  try {
    const upstream = await fetch(fileUrl, {
      headers: {
        // Forward range requests when Office Online asks for partial content
        ...(request.headers.get("range")
          ? { Range: request.headers.get("range") as string }
          : {}),
      },
      cache: "no-store",
      redirect: "error",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: "Upstream file fetch failed" },
        { status: upstream.status }
      );
    }

    const ext = filename.includes(".")
      ? filename.split(".").pop()!.toLowerCase()
      : "";
    // Only trust our own allowlist of content types; never reflect the
    // upstream Content-Type, which could be text/html and turn this proxy
    // into a same-origin HTML delivery vector.
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      `inline; filename="${filename.replace(/"/g, "")}"`
    );
    headers.set("Cache-Control", "private, max-age=300");

    const contentLength = upstream.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    const contentRange = upstream.headers.get("content-range");
    if (contentRange) headers.set("Content-Range", contentRange);

    const acceptRanges = upstream.headers.get("accept-ranges");
    if (acceptRanges) headers.set("Accept-Ranges", acceptRanges);

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to proxy document" },
      { status: 502 }
    );
  }
}
