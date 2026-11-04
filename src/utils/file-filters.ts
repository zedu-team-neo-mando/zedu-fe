import { FileDetails } from "~/app/(client)/[org]/_components/file-management/FileInfo";

export type FileListViewMode =
  | "All files"
  | "My Files"
  | "Shared with me"
  | "Deleted Files";

export const FILE_CATEGORY_UI_TO_API: Record<string, string> = {
  document: "documents",
  spreadsheet: "spreadsheets",
  presentation: "presentations",
  image: "images",
  videos: "videos",
  musics: "music",
  audio: "audio",
  archive: "archives",
  code: "code",
};

export interface BuildFileQueryArgs {
  viewType: FileListViewMode;
  fileType: string[];
  dateRange: string[];
  uploadedBy: string[];
  fileNameSearch?: string;
  folderId?: string;
  page?: number;
  limit?: number;
}

export const buildFileQuery = (args: BuildFileQueryArgs): string => {
  const {
    viewType,
    fileType,
    dateRange,
    uploadedBy,
    fileNameSearch,
    folderId,
    page = 1,
    limit = 10,
  } = args;

  const params = new URLSearchParams();

  const modeMapping: Record<FileListViewMode, string> = {
    "All files": "all",
    "My Files": "mine",
    "Shared with me": "shared",
    "Deleted Files": "trash",
  };
  params.append("mode", modeMapping[viewType] || "all");
  params.append("page", String(page));
  params.append("limit", String(limit));

  if (folderId) {
    params.append("folder_id", folderId);
  }

  if (fileType.length > 0) {
    const category = FILE_CATEGORY_UI_TO_API[fileType[0]];
    if (category) {
      params.append("file_category", category);
    }
  }

  if (dateRange.length > 0) {
    params.append("date_modified", dateRange[0].replace(/-/g, "_"));
  }

  if (uploadedBy.length > 0 && uploadedBy[0].trim()) {
    params.append("owner", uploadedBy[0].trim());
  }

  const search = fileNameSearch?.trim();
  if (search) {
    params.append("search", search);
  }

  return params.toString();
};

export const parseFilesListPagination = (pagination: unknown) => {
  if (!pagination || typeof pagination !== "object") return null;
  const p = pagination as Record<string, number>;
  return {
    currentPage: Number(p.current_page ?? 1),
    totalPages: Number(p.total_pages_count ?? p.total_pages ?? 1),
    totalItems: Number(p.total_items ?? 0),
  };
};

const startOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const endOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

export const matchesFileDateModifiedFilter = (
  updatedAt: string | undefined,
  filterValue: string
): boolean => {
  if (!updatedAt) return false;

  const modifiedAt = new Date(updatedAt);
  if (Number.isNaN(modifiedAt.getTime())) return false;

  const now = new Date();
  const normalizedFilter = filterValue.replace(/-/g, "_");

  switch (normalizedFilter) {
    case "today":
      return modifiedAt >= startOfDay(now) && modifiedAt <= endOfDay(now);
    case "last_7_days": {
      const from = startOfDay(now);
      from.setDate(from.getDate() - 7);
      return modifiedAt >= from && modifiedAt <= endOfDay(now);
    }
    case "last_30_days": {
      const from = startOfDay(now);
      from.setDate(from.getDate() - 30);
      return modifiedAt >= from && modifiedAt <= endOfDay(now);
    }
    case "this_year":
      return modifiedAt.getFullYear() === now.getFullYear();
    case "last_year":
      return modifiedAt.getFullYear() === now.getFullYear() - 1;
    default:
      return true;
  }
};

export const mapApiFileToFileDetails = (
  file: Record<string, unknown>,
  channelLabelMap: Map<string, string>
): FileDetails => {
  const channelId = String(file.channel_id ?? file.channels_id ?? "").trim();
  const channelLabel = channelId ? channelLabelMap.get(channelId) : undefined;

  const updatedAt =
    (file.updated_at as string | undefined) ??
    (file.dateModified as string | undefined) ??
    "";

  return {
    id: String(file.id ?? ""),
    file_name: String(file.file_name ?? ""),
    file_type: String(file.file_type ?? ""),
    mime_type: String(file.mime_type ?? ""),
    file_link: String(file.file_link ?? ""),
    size: Number(file.size ?? 0),
    organisation_id: String(file.organisation_id ?? ""),
    user_id: String(file.user_id ?? ""),
    folder_id: String(file.folder_id ?? ""),
    created_at: String(file.created_at ?? ""),
    updated_at: updatedAt || String(file.created_at ?? ""),
    channel_id: channelId || undefined,
    accessType:
      (file.accessType as string | undefined) ??
      (file.access_type as string | undefined) ??
      "Public",
    sharedIn:
      (file.sharedIn as string | undefined) ??
      (file.shared_in as string | undefined) ??
      channelLabel ??
      (file.channel_name as string | undefined) ??
      "—",
    location:
      (file.location as string | undefined) ??
      (file.folder_name as string | undefined) ??
      "All Files",
    owner:
      (file.owner as string | undefined) ??
      (file.uploader_display_name as string | undefined) ??
      "",
    dateModified:
      (file.dateModified as string | undefined) ??
      (updatedAt
        ? new Date(updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—"),
    status: (file.status as FileDetails["status"] | undefined) ?? "uploaded",
    previewUrl: file.previewUrl as string | undefined,
    pageCount: file.pageCount as number | undefined,
    pages: file.pages as string[] | undefined,
    pinned: file.pinned as boolean | undefined,
    deletedBy: file.deletedBy as string | undefined,
    dateDeleted: file.dateDeleted as string | undefined,
    backendId: file.backendId as string | undefined,
    user_profile_photo: file.user_profile_photo as string | undefined,
    uploader_display_name: file.uploader_display_name as string | undefined,
  };
};
