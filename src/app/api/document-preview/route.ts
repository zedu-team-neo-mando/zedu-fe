import { NextRequest, NextResponse } from "next/server";
import {
  isAllowedMediaFileUrl,
  officeEmbedUrl,
  resolveMediaFileUrl,
  siteUrl,
} from "~/lib/env-urls";

const OFFICE_EXTENSIONS = /\.(docx?|xlsx?|pptx?|csv|od[tsp])(?:$|[?#])/i;
const PDF_EXTENSION = /\.pdf(?:$|[?#])/i;

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
};

const extensionFromName = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? "") : "";
};

const isPdfRequest = (
  fileUrl: string,
  category: string | null,
  fileName: string
) => {
  if (category === "pdf") return true;
  if (PDF_EXTENSION.test(fileUrl)) return true;
  return extensionFromName(fileName) === "pdf";
};

const isOfficeRequest = (
  fileUrl: string,
  category: string | null,
  fileName: string
) => {
  if (
    category === "document" ||
    category === "spreadsheet" ||
    category === "presentation"
  ) {
    return true;
  }
  if (OFFICE_EXTENSIONS.test(fileUrl)) return true;
  return OFFICE_EXTENSIONS.test(`.${extensionFromName(fileName)}`);
};

/**
 * Office Online needs a URL whose path ends with a recognizable extension.
 * When the media URL is extension-less, proxy through our app with the
 * filename in the path so the viewer can detect the file type.
 */
const buildOfficeSourceUrl = (fileUrl: string, fileName: string): string => {
  if (OFFICE_EXTENSIONS.test(fileUrl)) {
    return fileUrl;
  }

  const safeName =
    (fileName || "document.docx").replace(/[^\w.\-()+ ]+/g, "_") ||
    "document.docx";

  const base = siteUrl();
  if (!base || /localhost|127\.0\.0\.1/i.test(base)) {
    return fileUrl;
  }

  return `${base}/api/document-preview/file/${encodeURIComponent(safeName)}?url=${encodeURIComponent(fileUrl)}`;
};

async function proxyFile(
  request: NextRequest,
  fileUrl: string,
  fileName: string,
  fallbackType: string
) {
  const upstream = await fetch(fileUrl, {
    headers: {
      ...(request.headers.get("range")
        ? { Range: request.headers.get("range") as string }
        : {}),
    },
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: "Upstream file fetch failed" },
      { status: upstream.status }
    );
  }

  const ext = extensionFromName(fileName);
  const contentType =
    CONTENT_TYPES[ext] || upstream.headers.get("content-type") || fallbackType;

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set(
    "Content-Disposition",
    `inline; filename="${(fileName || "document").replace(/"/g, "")}"`
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
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  const category = request.nextUrl.searchParams.get("category");
  const fileName = request.nextUrl.searchParams.get("filename") || "";

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing file url" }, { status: 400 });
  }

  const fileUrl = resolveMediaFileUrl(rawUrl);

  if (!fileUrl || !isAllowedMediaFileUrl(fileUrl)) {
    return NextResponse.json({ error: "Invalid file url" }, { status: 400 });
  }

  // PDFs must use the native viewer — Office Online does not support PDF
  // and shows "File not found" if we send them there.
  if (isPdfRequest(fileUrl, category, fileName)) {
    try {
      return await proxyFile(
        request,
        fileUrl,
        fileName || "document.pdf",
        "application/pdf"
      );
    } catch {
      return NextResponse.json(
        { error: "Failed to load PDF" },
        { status: 502 }
      );
    }
  }

  if (isOfficeRequest(fileUrl, category, fileName)) {
    const officeSrc = buildOfficeSourceUrl(fileUrl, fileName);
    const officePreview = officeEmbedUrl(officeSrc);
    if (officePreview) {
      return NextResponse.redirect(officePreview);
    }
  }

  return new NextResponse(
    `<html lang="en"><body style="margin:0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;color:#475467"><p>Document preview is not configured.</p></body></html>`,
    {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}
