import {
  officeEmbedBaseUrl,
  officeEmbedUrl,
  resolveMediaFileUrl,
} from "~/lib/env-urls";

export type DocumentCategory =
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "file";

export const CHAT_FILE_ACCEPT =
  "image/*,video/*,audio/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";

const DOCUMENT_EXTENSIONS = new Set(["doc", "docx", "txt", "rtf", "odt"]);
const SPREADSHEET_EXTENSIONS = new Set(["xls", "xlsx", "csv", "ods"]);
const PRESENTATION_EXTENSIONS = new Set(["ppt", "pptx", "odp"]);

export const normalizeFileExtension = (
  fileType: string,
  fileName: string
): string => {
  const fromType = (fileType || "").toLowerCase().replace(/^\./, "");
  if (fromType && fromType !== "file") return fromType;
  const parts = (fileName || "").split(".");
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? "") : "";
};

export const getDocumentCategory = (media: {
  mime_type?: string;
  file_type?: string;
  file_name?: string;
}): DocumentCategory => {
  const mime = (media.mime_type || "").toLowerCase().split(";")[0].trim();
  const ext = normalizeFileExtension(
    media.file_type || "",
    media.file_name || ""
  );

  if (mime === "application/pdf" || ext === "pdf") return "pdf";

  if (
    mime.includes("wordprocessingml") ||
    mime.includes("msword") ||
    mime === "text/plain" ||
    DOCUMENT_EXTENSIONS.has(ext)
  ) {
    return "document";
  }

  if (
    mime.includes("spreadsheetml") ||
    mime.includes("ms-excel") ||
    mime === "text/csv" ||
    SPREADSHEET_EXTENSIONS.has(ext)
  ) {
    return "spreadsheet";
  }

  if (
    mime.includes("presentationml") ||
    mime.includes("ms-powerpoint") ||
    PRESENTATION_EXTENSIONS.has(ext)
  ) {
    return "presentation";
  }

  return "file";
};

export const isPreviewableDocument = (category: DocumentCategory): boolean =>
  category !== "file";

export const isOfficeEmbedConfigured = (): boolean =>
  Boolean(officeEmbedBaseUrl());

export const getOfficeEmbedUrl = (fileUrl: string): string | null =>
  officeEmbedUrl(fileUrl);

export const getPdfEmbedUrl = (fileUrl: string, page = 1): string | null => {
  const resolvedUrl = resolveMediaFileUrl(fileUrl);
  if (!resolvedUrl) return null;
  return `${resolvedUrl}#page=${page}&view=FitH&toolbar=0&navpanes=0`;
};

export const isValidPreviewSrc = (
  url: string | null | undefined
): url is string =>
  Boolean(
    url &&
    (/^https?:\/\//i.test(url) || url.startsWith("/api/document-preview"))
  );

export const getDocumentPreviewUrl = (
  category: DocumentCategory,
  fileUrl: string,
  fileName?: string
): string | null => {
  const resolvedUrl = resolveMediaFileUrl(fileUrl);
  if (!resolvedUrl) return null;

  if (category === "pdf" || usesOfficeEmbed(category)) {
    const params = new URLSearchParams({
      url: resolvedUrl,
      category,
    });
    if (fileName) {
      params.set("filename", fileName);
    }
    return `/api/document-preview?${params.toString()}`;
  }

  return null;
};

export const usesOfficeEmbed = (category: DocumentCategory): boolean =>
  category === "document" ||
  category === "spreadsheet" ||
  category === "presentation";

export const getDocumentTypeLabel = (
  category: DocumentCategory,
  ext: string
): string => {
  switch (category) {
    case "pdf":
      return "PDF";
    case "document":
      return ext.toUpperCase() || "DOC";
    case "spreadsheet":
      return ext.toUpperCase() || "SHEET";
    case "presentation":
      return ext.toUpperCase() || "PPT";
    default:
      return ext.toUpperCase() || "FILE";
  }
};

export const getDocumentAccentClass = (category: DocumentCategory): string => {
  switch (category) {
    case "pdf":
      return "bg-red-500";
    case "document":
      return "bg-blue-500";
    case "spreadsheet":
      return "bg-green-600";
    case "presentation":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, index);
  return `${Math.round(value * 10) / 10} ${units[index]}`;
};
