"use client";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import CreateFolderModal from "./CreateFolderModal";
import FolderList from "./FolderList";
import Header from "./header";
import DeleteFileModal from "./delete-file-modal";
import BulkDeleteModal from "./bulk-delete-modal";
import RenameFileModal from "./rename-file-modal";
import FileList from "./FileList";
import FileInfo, { FileDetails } from "./FileInfo";
import CreateShareModal from "./CreateShareModal";
import MoveFileModal, { FolderInfo } from "./MoveFile";
import { FilterOption } from "../sorting/sorting";
import FilterSection from "../../filter/filterSection";
import { useParams } from "next/navigation";
import {
  DeleteRequest,
  GetRequest,
  PostRequest,
  PutRequest,
} from "~/utils/new-request";
import FilePreview from "./FilePreview";
import Loading from "~/components/ui/loading";
import DeleteFolderModal from "./DeleteFolderModal";
import RenameFolderModal from "./RenameFolderModal";
import { Pin } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { uiAvatarUrl } from "~/lib/env-urls";
import FileListSkeleton from "./FileListSkeleton";
import { useDeleteFile } from "~/hooks/useDeleteFile";
import { showError, showSuccess, showWarning } from "~/components/toast/sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  mapApiFileToFileDetails,
  buildFileQuery,
  parseFilesListPagination,
  type FileListViewMode,
} from "~/utils/file-filters";

export type FileViewType = FileListViewMode;

interface FileExplorerProps {
  viewType: FileViewType;
  folderId?: string;
}
interface ModalState {
  type:
    | "create-folder"
    | "delete-file"
    | "rename-file"
    | "share-file"
    | "move-file"
    | "file-preview"
    | "rename-folder"
    | "delete-folder"
    | "bulk-delete"
    | null;
  data?: any;
}

const FilePaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="icon"
    className={cn(
      "h-8 w-8",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 cursor-pointer hover:bg-primary-50" />
  </PaginationLink>
);
const FilePaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="icon"
    className={cn(
      "h-8 w-8",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4 cursor-pointer hover:bg-primary-50" />
  </PaginationLink>
);

const FilePaginationLink = ({
  className,
  isActive,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { isActive?: boolean }) => (
  <PaginationLink
    size="icon"
    className={cn(
      "h-8 w-8 cursor-pointer",
      isActive
        ? "bg-[#5F5FE1] text-white hover:bg-primary-300 hover:text-white"
        : "text-gray-700 hover:bg-gray-100",
      className
    )}
    isActive={isActive}
    {...props}
  />
);

const FolderPaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="icon"
    className={cn(
      "h-8 w-8",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 cursor-pointer hover:bg-primary-50" />
  </PaginationLink>
);
const FolderPaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="icon"
    className={cn(
      "h-8 w-8",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4 cursor-pointer hover:bg-primary-50" />
  </PaginationLink>
);

const FolderPaginationLink = ({
  className,
  isActive,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { isActive?: boolean }) => (
  <PaginationLink
    size="icon"
    className={cn(
      "h-8 w-8 cursor-pointer",
      isActive
        ? "bg-[#5F5FE1] text-white hover:bg-primary-300 hover:text-white"
        : "text-gray-700 hover:bg-gray-100",
      className
    )}
    isActive={isActive}
    {...props}
  />
);

const FileExplorer: React.FC<FileExplorerProps> = ({ viewType, folderId }) => {
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [files, setFiles] = useState<FileDetails[]>([]);
  const [isFileInfoOpen, setIsFileInfoOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<FileDetails | null>(
    null
  );
  // Loading states
  const [isLoadingFiles, setIsLoadingFiles] = React.useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = React.useState(false);

  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = React.useState<
    string | undefined
  >(folderId);
  const [folderPath, setFolderPath] = React.useState<
    Array<{ id: string | undefined; name: string }>
  >([{ id: undefined, name: "All files" }]);

  // Filter state
  const [fileType, setFileType] = React.useState<string[]>([]);
  const [uploader, setUploader] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<string[]>([]);
  const [access, setAccess] = React.useState<string[]>([]);
  const [sortOrder, setSortOrder] = React.useState<string[]>([]);
  const [fileNameSearch, setFileNameSearch] = React.useState("");
  const [debouncedFileNameSearch, setDebouncedFileNameSearch] =
    React.useState("");

  const params = useParams();
  const { state } = useContext(DataContext);
  const { bulkDeleteFiles, isLoading: isDeletingFiles } = useDeleteFile();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilePages, setTotalFilePages] = useState(1);
  const [currentFolderPage, setCurrentFolderPage] = useState(1);

  // Bulk selection state
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    new Set()
  );
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Tab state for folders/files separation
  const [activeTab, setActiveTab] = useState<"folders" | "files">("files");

  // State for the raw member data and the formatted options
  const [uploaderOptions, setUploaderOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFileNameSearch(fileNameSearch.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [fileNameSearch]);

  interface OrgMember {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
  }

  interface Channel {
    id?: string;
    channels_id?: string;
    name?: string;
    channel_name?: string;
  }

  interface DmChannel {
    channel_id?: string;
    channels_id?: string;
    username?: string;
    channel_name?: string;
    name?: string;
    avatar_url?: string;
    profile_url?: string;
  }

  const channelLabelMap = useMemo(() => {
    const map = new Map<string, string>();

    if (state.channels) {
      for (const channel of state.channels as Channel[]) {
        const id = channel.channels_id || channel.id;
        const name = channel.name || channel.channel_name;
        if (id && name) {
          map.set(String(id), name.startsWith("#") ? name : `#${name}`);
        }
      }
    }

    if (state.dms) {
      for (const dm of state.dms as DmChannel[]) {
        const id = dm.channel_id || dm.channels_id;
        const name = dm.username || dm.channel_name || dm.name;
        if (id && name) {
          map.set(String(id), name);
        }
      }
    }

    return map;
  }, [state.channels, state.dms]);

  // Memoize the transformation of members to filter options
  useEffect(() => {
    if (state.orgMembers && state.orgMembers.length > 0) {
      const options = state.orgMembers.map((member: OrgMember) => ({
        id: member.id,
        label: member.name || member.username,
        value: member.name || member.username,
        imageUrl:
          member.avatar_url || uiAvatarUrl(member.name || member.username),
      }));
      setUploaderOptions(options);
    }
  }, [state.orgMembers]);

  const userProfileMap = useMemo(() => {
    interface UploaderInfo {
      name: string;
      username: string;
      profile_url: string;
    }

    const map = new Map<string, UploaderInfo>();
    if (state.orgMembers) {
      for (const member of state.orgMembers) {
        map.set(member.id, {
          name: member.name,
          username: member.username,
          profile_url: member.profile_url,
        });
      }
    }
    return map;
  }, [state.orgMembers]);

  const folderOwnerMap = useMemo(() => {
    const map = new Map<string, string>();
    if (state.orgMembers) {
      state.orgMembers.forEach((member: any) => {
        map.set(member.id, member.name || member.username || "Unknown");
      });
    }
    return map;
  }, [state.orgMembers]);

  const fileDetailsCache = useRef(new Map<string, FileDetails>());
  const [isLoadingFileDetails, setIsLoadingFileDetails] = useState(false);

  const fetchFileDetailsById = useCallback(async (fileId: string) => {
    const cached = fileDetailsCache.current.get(fileId);
    if (cached) return cached;

    const res = await GetRequest(`/files/file/${fileId}`);
    if (res?.data?.data) {
      const details = res.data.data as FileDetails;
      fileDetailsCache.current.set(fileId, details);
      return details;
    }
    return null;
  }, []);

  const displayFiles = useMemo(() => {
    return files.map((file) => {
      const uploaderInfo = userProfileMap.get(file.user_id);
      const userProfilePhoto =
        uploaderInfo?.profile_url ||
        uiAvatarUrl(uploaderInfo?.name || uploaderInfo?.username || "");
      const uploaderDisplayName =
        uploaderInfo?.name ||
        uploaderInfo?.username ||
        file.owner ||
        "Unknown User";

      return {
        ...file,
        user_profile_photo: userProfilePhoto,
        uploader_display_name: uploaderDisplayName,
        accessType: file.accessType || "Public",
      };
    });
  }, [files, userProfileMap]);

  const loadFileWithDetails = useCallback(
    async (fileId: string): Promise<FileDetails | null> => {
      const fileInfo = displayFiles.find((file) => file.id === fileId);
      if (!fileInfo) return null;

      setIsLoadingFileDetails(true);
      try {
        const fileDetails = await fetchFileDetailsById(fileId);
        if (!fileDetails) return null;
        return { ...fileInfo, ...fileDetails };
      } finally {
        setIsLoadingFileDetails(false);
      }
    },
    [displayFiles, fetchFileDetailsById]
  );

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      const queryString = buildFileQuery({
        viewType,
        fileType,
        dateRange,
        uploadedBy: uploader,
        fileNameSearch: debouncedFileNameSearch,
        folderId: currentFolderId,
        page: currentPage,
        limit: 10,
      });

      const [response, favoritesResponse] = await Promise.all([
        GetRequest(`/files?${queryString}`),
        GetRequest("/files/favorites"),
      ]);
      if (response?.status === 200) {
        const fetchedFiles = response.data?.data?.files || [];
        const pinnedIds = new Set<string>(
          favoritesResponse?.status === 200 &&
            Array.isArray(favoritesResponse.data?.data)
            ? favoritesResponse.data.data.map(
                (pinned: { file?: { id?: string } }) => String(pinned.file?.id)
              )
            : []
        );
        fileDetailsCache.current.clear();
        setFiles(
          fetchedFiles.map((file: Record<string, unknown>) => ({
            ...mapApiFileToFileDetails(file, channelLabelMap),
            pinned: pinnedIds.has(String(file.id)),
          }))
        );

        const pagination = parseFilesListPagination(
          response.data?.data?.pagination
        );
        setTotalFilePages(pagination ? Math.max(1, pagination.totalPages) : 1);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
      showError("Failed to load files");
    } finally {
      setIsLoadingFiles(false);
    }
  }, [
    viewType,
    fileType,
    dateRange,
    uploader,
    debouncedFileNameSearch,
    currentFolderId,
    currentPage,
    channelLabelMap,
  ]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const clientSortedFiles = useMemo(() => {
    let processedFiles = [...displayFiles];

    if (access.length > 0) {
      processedFiles = processedFiles.filter((file) =>
        access.includes(file.accessType)
      );
    }

    if (sortOrder.length > 0) {
      const [sortValue] = sortOrder;

      processedFiles.sort((a, b) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();

        return sortValue === "newest-to-oldest" ? dateB - dateA : dateA - dateB;
      });
    }

    return processedFiles;
  }, [displayFiles, access, sortOrder]);

  const fetchFolders = useCallback(async () => {
    try {
      setIsLoadingFolders(true);
      const queryParams = new URLSearchParams();

      const modeMapping = {
        "All files": "all",
        "My Files": "mine",
        "Shared with me": "shared",
        "Deleted Files": "trash",
      };
      queryParams.append("mode", modeMapping[viewType] || "all");

      if (currentFolderId) {
        queryParams.append("parent_id", currentFolderId);
      }
      const queryString = queryParams.toString();
      const endpoint = `/files/folders${queryString ? `?${queryString}` : ""}`;

      const response = await GetRequest(endpoint);
      if (response?.status === 200) {
        setFolders(
          Array.isArray(response.data.data.folders)
            ? response.data.data.folders
            : []
        );
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error);
      showError("Failed to load folders");
    } finally {
      setIsLoadingFolders(false);
    }
  }, [currentFolderId, viewType]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Handle folder navigation
  const handleFolderClick = (folderId: string) => {
    const folder = folders?.find((f) => f.id === folderId);
    if (folder) {
      setCurrentFolderId(folderId);
      setFolderPath((prev) => [...prev, { id: folderId, name: folder.name }]);
      setActiveTab("files");
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = folderPath.slice(0, index + 1);
    setFolderPath(newPath);
    const newFolderId = newPath[newPath.length - 1].id;
    setCurrentFolderId(newFolderId);
    if (!newFolderId) {
      setActiveTab("folders");
    }
  };

  // Bulk selection handlers
  const handleSelectFile = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedFileIds.size === clientSortedFiles.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(clientSortedFiles.map((f) => f.id)));
    }
  };

  const handleSelectAllPinned = () => {
    const allPinnedSelected = pinnedFiles.every((f) =>
      selectedFileIds.has(f.id)
    );
    if (allPinnedSelected && pinnedFiles.length > 0) {
      // Deselect all pinned files only
      const newSet = new Set(selectedFileIds);
      pinnedFiles.forEach((f) => newSet.delete(f.id));
      setSelectedFileIds(newSet);
    } else {
      // Select all pinned files
      const newSet = new Set(selectedFileIds);
      pinnedFiles.forEach((f) => newSet.add(f.id));
      setSelectedFileIds(newSet);
    }
  };

  const handleSelectAllRegular = () => {
    const allRegularSelected = regularFiles.every((f) =>
      selectedFileIds.has(f.id)
    );
    if (allRegularSelected && regularFiles.length > 0) {
      // Deselect all regular files only
      const newSet = new Set(selectedFileIds);
      regularFiles.forEach((f) => newSet.delete(f.id));
      setSelectedFileIds(newSet);
    } else {
      // Select all regular files
      const newSet = new Set(selectedFileIds);
      regularFiles.forEach((f) => newSet.add(f.id));
      setSelectedFileIds(newSet);
    }
  };

  const handleEnterBulkMode = (fileId: string) => {
    setIsBulkMode(true);
    setSelectedFileIds(new Set([fileId]));
  };

  const handleClearSelection = () => {
    setSelectedFileIds(new Set());
    setIsBulkMode(false);
  };

  const handleBulkDeleteClick = () => {
    if (selectedFileIds.size > 0) {
      setModalState({ type: "bulk-delete" });
    }
  };

  const handleBulkDeleteConfirm = async () => {
    const isPermanent = viewType === "Deleted Files";
    const fileIds = Array.from(selectedFileIds);
    const success = await bulkDeleteFiles(fileIds, isPermanent);
    if (success) {
      setSelectedFileIds(new Set());
      setIsBulkMode(false);
      fetchFiles();
    }
    setModalState({ type: null });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+A or Cmd+A to select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a" && isBulkMode) {
        e.preventDefault();
        setSelectedFileIds((prevSet) => {
          if (
            prevSet.size === clientSortedFiles.length &&
            clientSortedFiles.length > 0
          ) {
            return new Set();
          } else {
            return new Set(clientSortedFiles.map((f) => f.id));
          }
        });
      }
      // Delete key to trigger bulk delete
      if (e.key === "Delete" && selectedFileIds.size > 0 && isBulkMode) {
        e.preventDefault();
        handleBulkDeleteClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBulkMode, selectedFileIds, clientSortedFiles, handleBulkDeleteClick]);

  // Clear selections when view type changes
  useEffect(() => {
    setSelectedFileIds(new Set());
    setIsBulkMode(false);
  }, [viewType]);

  // Clear selections when tab changes
  useEffect(() => {
    setSelectedFileIds(new Set());
    setIsBulkMode(false);
  }, [activeTab]);

  const handleNewFolderClick = () => {
    setModalState({ type: "create-folder" });
  };

  const handleFileUpload = (file: FileDetails) => {
    fetchFiles();
  };
  const handleCreateFolder = async (folderName: string) => {
    try {
      const response = await PostRequest("/files/folders", {
        name: folderName,
        parent_id: currentFolderId || null,
        organisation_id: state.orgId,
      });
      if (response?.status === 201 || response?.status === 200) {
        await fetchFolders();
        setModalState({ type: null });
        showSuccess("Folder created successfully");
      } else {
        showError("Failed to create folder");
      }
    } catch (error) {
      showError("An error occurred while creating the folder");
    }
  };

  const handleRenameFolder = async (newName: string) => {
    if (!modalState.data?.id) return;

    try {
      const response = await PutRequest(
        `/files/folders/${modalState.data.id}`,
        {
          folder_name: newName,
        }
      );

      if (response?.status === 200 || response?.status === 201) {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === modalState.data.id
              ? { ...folder, name: newName }
              : folder
          )
        );
        setModalState({ type: null });
        showSuccess(`Folder renamed to "${newName}"`);
      } else {
        showError("Failed to rename folder");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "An error occurred while renaming the folder";
      showError(message);
    }
  };
  const handleFolderDelete = (folderId: string) => {
    const folderToDelete = Array.isArray(folders)
      ? folders?.find((folder) => folder.id === folderId)
      : null;
    if (folderToDelete) {
      setModalState({ type: "delete-folder", data: folderToDelete });
    }
  };

  const handleFolderEdit = (folderId: string) => {
    const folderToEdit = Array.isArray(folders)
      ? folders?.find((folder) => folder.id === folderId)
      : null;
    if (folderToEdit) {
      setModalState({ type: "rename-folder", data: folderToEdit });
    }
  };
  const pendingPinIds = useRef(new Set<string>());

  const handlePinClick = async (fileId: string) => {
    const fileInfo = files.find((file) => file.id === fileId);
    if (!fileInfo || pendingPinIds.current.has(fileId)) return;

    const wasPinned = Boolean(fileInfo.pinned);
    const setPinned = (pinned: boolean) =>
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId ? { ...file, pinned } : file
        )
      );

    pendingPinIds.current.add(fileId);
    setPinned(!wasPinned);
    try {
      const response = wasPinned
        ? await DeleteRequest(`/files/file/${fileId}/pin`)
        : await PostRequest(`/files/file/${fileId}/pin`);

      if (response?.status !== 200 && response?.status !== 201) {
        setPinned(wasPinned);
        // The request helpers already toast the backend message when present
        if (!response?.response?.data?.message) {
          showError(wasPinned ? "Failed to unpin file" : "Failed to pin file");
        }
      }
    } finally {
      pendingPinIds.current.delete(fileId);
    }
  };
  const handleShareClick = (fileId: string) => {
    const fileInfo = displayFiles.find((file) => file.id === fileId);
    if (fileInfo) {
      setModalState({ type: "share-file", data: fileInfo });
    } else {
      showError("File information not found for sharing.");
    }
  };

  const handleRestoreFile = async (fileId: string) => {
    try {
      const response = await PutRequest(`/files/file/${fileId}/restore`, {});

      if (response?.status === 200 || response?.status === 201) {
        showSuccess("File restored successfully");
        fetchFiles();
      } else {
        showError("Failed to restore file");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "An error occurred while restoring the file";
      showError(message);
    }
  };

  const handleRenameFile = async (fileId: string, newName: string) => {
    const fileInfo = files?.find((file) => file.id === fileId);
    if (fileInfo) {
      try {
        const response = await PutRequest(`/files/file/${fileId}`, {
          file_name: newName,
        });
        if (response?.status === 200 || response?.status === 201) {
          fileDetailsCache.current.delete(fileId);
          setModalState({ type: null });
          showSuccess(`File renamed successfully to "${newName}"`);
          fetchFiles();
        } else {
          showError("Failed to rename file");
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "An error occurred while renaming the file";
        showError(message);
      }
    }
  };

  const handleInfoClick = async (fileId: string) => {
    try {
      const merged = await loadFileWithDetails(fileId);
      if (merged) {
        setSelectedFile(merged);
        setIsFileInfoOpen(true);
      } else {
        showError("File not found");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Couldn't fetch file info";
      showError(message);
    }
  };

  const handleFilePreview = async (fileId: string) => {
    try {
      const merged = await loadFileWithDetails(fileId);
      if (merged) {
        setSelectedFile(merged);
        setModalState({ type: "file-preview", data: merged });
      } else {
        showError("File information not found.");
      }
    } catch {
      showError("Unable to preview file");
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    const fileInfo = displayFiles.find((info) => info.id === fileId);
    if (!fileInfo) return;

    try {
      let downloadUrl = fileInfo.file_link;
      if (!downloadUrl) {
        const fileDetails = await fetchFileDetailsById(fileId);
        downloadUrl = fileDetails?.file_link as string;
      }

      if (downloadUrl) {
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileInfo.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        showSuccess(`${fileInfo.file_name} downloaded successfully`);
      } else {
        showWarning(`No download URL available for ${fileInfo.file_name}`);
      }
    } catch {
      showError(`Failed to download ${fileInfo.file_name}. Please try again.`);
    }
  };

  const handleMoveFile = async (fileId: string, folderId: string) => {
    try {
      const response = await PutRequest(`/files/${fileId}/move`, {
        folder_id: folderId,
      });
      if (response?.status === 200 || response?.status === 201) {
        setModalState({ type: null });
        showSuccess("File moved successfully");
        fetchFiles();
        fetchFolders();
      } else {
        showError("Failed to move file");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "An error occurred while moving the file";
      showError(message);
    }
  };

  const fileForPreview = React.useMemo(() => {
    if (!selectedFile) return null;
    return {
      fileName:
        (selectedFile as any).file_name ?? (selectedFile as any).name ?? "",
      size: (selectedFile as any).size ?? "",
      type: (selectedFile as any).file_type ?? (selectedFile as any).type ?? "",
      previewUrl:
        (selectedFile as any).file_link ?? (selectedFile as any).previewUrl,
      pageCount: (selectedFile as any).pageCount,
      pages: (selectedFile as any).pages,
    };
  }, [selectedFile]);

  const pinnedFiles = useMemo(
    () => clientSortedFiles.filter((file) => file.pinned),
    [clientSortedFiles]
  );
  const regularFiles = useMemo(
    () => clientSortedFiles.filter((file) => !file.pinned),
    [clientSortedFiles]
  );

  const currentRegularFiles = regularFiles;
  const totalPages = totalFilePages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const foldersPerPage = 10;
  const lastFolderIndex = currentFolderPage * foldersPerPage;
  const firstFolderIndex = lastFolderIndex - foldersPerPage;
  const currentFolders = Array.isArray(folders)
    ? folders.slice(firstFolderIndex, lastFolderIndex)
    : [];
  const totalFolderPages = Math.ceil(
    (Array.isArray(folders) ? folders.length : 0) / foldersPerPage
  );

  const getFolderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalFolderPages <= maxVisible) {
      for (let i = 1; i <= totalFolderPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentFolderPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalFolderPages);
      } else if (currentFolderPage >= totalFolderPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalFolderPages - 3; i <= totalFolderPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentFolderPage - 1; i <= currentFolderPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalFolderPages);
      }
    }
    return pages;
  };

  useEffect(() => {
    setCurrentPage(1);
    setCurrentFolderPage(1);
  }, [
    viewType,
    fileType,
    dateRange,
    uploader,
    debouncedFileNameSearch,
    access,
    sortOrder,
    currentFolderId,
  ]);

  return (
    <main className="min-h-[80dvh] flex flex-col">
      <div className="flex-1 flex overflow-hidden ">
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isFileInfoOpen ? "mr-96" : "mr-0"
          }`}
        >
          <Header
            onNewFolderClick={handleNewFolderClick}
            onFileUpload={handleFileUpload}
            title={viewType}
            isBulkMode={isBulkMode}
            selectedCount={selectedFileIds.size}
            onBulkDelete={handleBulkDeleteClick}
            onClearSelection={handleClearSelection}
          />
          {/* Breadcrumb Navigation */}
          {folderPath.length > 1 && (
            <div className="px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                {folderPath.map((folder, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                    <button
                      onClick={() => handleBreadcrumbClick(index)}
                      className={`${
                        index === folderPath.length - 1
                          ? "text-[#5F5FE1] font-medium"
                          : "text-gray-600 hover:text-gray-900"
                      } transition-colors`}
                    >
                      {folder.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          <div className="px-6 pt-[20px] pb-[24px]">
            <FilterSection
              viewType={viewType}
              fileType={fileType}
              onFileTypeChange={setFileType}
              uploader={uploader}
              onUploaderChange={setUploader}
              uploaderOptions={uploaderOptions}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              fileNameSearch={fileNameSearch}
              onFileNameSearchChange={setFileNameSearch}
              access={access}
              onAccessChange={setAccess}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
          </div>

          {/* Tab Navigation */}
          {viewType !== "Shared with me" &&
            viewType !== "Deleted Files" &&
            !currentFolderId && (
              <div className="px-6 pb-4 flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("folders")}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === "folders"
                      ? "text-[#5F5FE1] border-b-2 border-[#5F5FE1]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Folders
                </button>
                <button
                  onClick={() => setActiveTab("files")}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === "files"
                      ? "text-[#5F5FE1] border-b-2 border-[#5F5FE1]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Files
                </button>
              </div>
            )}

          <section className=" w-full px-6 pb-6 flex flex-col">
            {/* Folders Tab Content - Only show when NOT inside a folder */}
            {activeTab === "folders" &&
              viewType !== "Shared with me" &&
              viewType !== "Deleted Files" &&
              !currentFolderId && (
                <>
                  {isLoadingFolders ? (
                    <div className="mb-6">
                      <p className="mb-4 font-semibold">Folders</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-[190px] h-[70px] bg-gray-100 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  ) : Array.isArray(folders) && folders.length > 0 ? (
                    <div className="mb-6">
                      <div className="mb-3">
                        <h2 className="font-semibold mt-5 text-[16px] text-[#344054]">
                          Folders
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-12 text-[#1F2937] font-semibold gap-4 px-6 py-3 border-b text-sm bg-gray-50/50">
                        <div className="md:col-span-6">Name</div>
                        <div className="hidden md:block md:col-span-2">
                          Owner
                        </div>
                        <div className="hidden md:block md:col-span-2">
                          Date Created
                        </div>
                        <div className="hidden md:block md:col-span-1">
                          Size
                        </div>
                        <div className="md:col-span-1 text-right">Actions</div>
                      </div>
                      <div className="divide-y border-b border-gray-100">
                        {currentFolders.map((folder) => (
                          <FolderList
                            key={folder.id}
                            id={folder.id}
                            name={folder.name}
                            user_id={folder.user_id}
                            item_count={folder.item_count}
                            created_at={folder.created_at || folder.dateCreated}
                            folder_owner_name={folderOwnerMap.get(
                              folder.user_id
                            )}
                            onEdit={() => handleFolderEdit(folder.id)}
                            onDelete={() => handleFolderDelete(folder.id)}
                            onClick={handleFolderClick}
                          />
                        ))}
                      </div>
                      {totalFolderPages > 1 && (
                        <div className="flex justify-center mt-4">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <FolderPaginationPrevious
                                  onClick={() =>
                                    setCurrentFolderPage((prev) =>
                                      Math.max(prev - 1, 1)
                                    )
                                  }
                                  disabled={currentFolderPage === 1}
                                />
                              </PaginationItem>
                              {getFolderPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                  {page === "ellipsis" ? (
                                    <PaginationEllipsis />
                                  ) : (
                                    <FolderPaginationLink
                                      onClick={() =>
                                        setCurrentFolderPage(page as number)
                                      }
                                      isActive={currentFolderPage === page}
                                    >
                                      {page}
                                    </FolderPaginationLink>
                                  )}
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <FolderPaginationNext
                                  onClick={() =>
                                    setCurrentFolderPage((prev) =>
                                      Math.min(prev + 1, totalFolderPages)
                                    )
                                  }
                                  disabled={
                                    currentFolderPage === totalFolderPages
                                  }
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 text-[#344054] justify-center items-center mt-40">
                      <p className="text-2xl">No folders yet</p>
                      <p>Create a folder to get started</p>
                    </div>
                  )}
                </>
              )}

            {/* Files Tab Content */}
            {(viewType === "Shared with me" ||
              viewType === "Deleted Files" ||
              activeTab === "files") && (
              <>
                {pinnedFiles.length > 0 && (
                  <div className="mb-6 mt-6">
                    <div className="flex text-[16px] items-center gap-2">
                      <Pin size={13} className="font-semibold text-[#344054]" />
                      <p className="text-[16px] font-semibold text-[#344054]">
                        Pinned Files
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-12 text-[#1F2937] font-semibold gap-4 px-6 py-3 border-b text-sm bg-gray-50/50">
                      <div className="md:col-span-6 flex items-center gap-3">
                        {isBulkMode && (
                          <input
                            type="checkbox"
                            checked={
                              pinnedFiles.length > 0 &&
                              pinnedFiles.every((f) =>
                                selectedFileIds.has(f.id)
                              )
                            }
                            onChange={handleSelectAllPinned}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        )}
                        Name
                      </div>
                      <div className="md:col-span-2">Owner</div>
                      <div className="md:col-span-2">Date Created</div>
                      <div className="md:col-span-1">Size</div>
                      <div className="md:col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y border-b border-gray-100">
                      {pinnedFiles.map((file) => (
                        <FileList
                          key={file.id}
                          {...file}
                          viewType={viewType}
                          onDelete={() =>
                            setModalState({ type: "delete-file", data: file })
                          }
                          onRename={() =>
                            setModalState({ type: "rename-file", data: file })
                          }
                          onInfo={() => handleInfoClick(file.id)}
                          onShare={() => handleShareClick(file.id)}
                          onPin={() => handlePinClick(file.id)}
                          onPreview={() => handleFilePreview(file.id)}
                          onDownload={() => handleDownloadFile(file.id)}
                          onMove={() =>
                            setModalState({ type: "move-file", data: file })
                          }
                          onRestore={() => handleRestoreFile(file.id)}
                          showCheckbox={isBulkMode}
                          isSelected={selectedFileIds.has(file.id)}
                          onSelect={handleSelectFile}
                          onEnterBulkMode={handleEnterBulkMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {isLoadingFiles && (
                  <div className="mt-6">
                    <FileListSkeleton />
                  </div>
                )}
                {!isLoadingFiles &&
                  regularFiles.length === 0 &&
                  pinnedFiles.length === 0 && (
                    <div className="flex flex-col gap-2 text-[#344054] justify-center items-center mt-40">
                      {(viewType === "All files" ||
                        viewType === "My Files") && (
                        <>
                          <p className="text-2xl">No files yet</p>
                          <p>Upload or drag & drop to get started</p>
                        </>
                      )}
                      {viewType === "Shared with me" && (
                        <>
                          <p className="text-2xl">No Files Shared Yet</p>
                          <p>Files shared with you will appear here</p>
                        </>
                      )}
                      {viewType === "Deleted Files" && (
                        <>
                          <p className="text-2xl">No deleted files</p>
                          <p>
                            Files you delete will be deleted permanently after
                            30 days
                          </p>
                        </>
                      )}
                    </div>
                  )}
              </>
            )}
          </section>

          <div className="text-[14px] px-6">
            {isLoadingFiles ? (
              <>{/* Skeleton loader */}</>
            ) : (
              regularFiles.length > 0 &&
              (viewType === "Shared with me" ||
                viewType === "Deleted Files" ||
                activeTab === "files") && (
                <>
                  <div className="mb-3">
                    <h2 className="font-semibold text-[16px] text-[#344054]">
                      Files
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-12 text-[#1F2937] font-semibold gap-4 px-6 py-3 border-b text-sm">
                    <div className="md:col-span-6 flex items-center gap-3">
                      {isBulkMode && (
                        <input
                          type="checkbox"
                          checked={
                            regularFiles.length > 0 &&
                            regularFiles.every((f) => selectedFileIds.has(f.id))
                          }
                          onChange={handleSelectAllRegular}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      )}
                      Name
                    </div>
                    {viewType === "Deleted Files" ? (
                      <>
                        <div className="md:col-span-2">Deleted By</div>
                        <div className="md:col-span-1">Size</div>
                        <div className="md:col-span-3 text-right">Actions</div>
                      </>
                    ) : (
                      <>
                        <div className="md:col-span-2">Owner</div>
                        <div className="md:col-span-2">Date Created</div>
                        <div className="md:col-span-1">Size</div>
                        <div className="md:col-span-1 text-right">Actions</div>
                      </>
                    )}
                  </div>

                  <div className="divide-y">
                    {currentRegularFiles.map((file) => (
                      <FileList
                        key={file.id}
                        {...file}
                        viewType={viewType}
                        onPreview={() => handleFilePreview(file.id)}
                        onDownload={() => handleDownloadFile(file.id)}
                        onDelete={() =>
                          setModalState({ type: "delete-file", data: file })
                        }
                        onRename={() =>
                          setModalState({ type: "rename-file", data: file })
                        }
                        onInfo={() => handleInfoClick(file.id)}
                        onShare={() => handleShareClick(file.id)}
                        onPin={() => handlePinClick(file.id)}
                        onMove={() => {
                          setModalState({ type: "move-file", data: file });
                        }}
                        onRestore={() => handleRestoreFile(file.id)}
                        showCheckbox={isBulkMode}
                        isSelected={selectedFileIds.has(file.id)}
                        onSelect={handleSelectFile}
                        onEnterBulkMode={handleEnterBulkMode}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center mb-10">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <FilePaginationPrevious
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                            />
                          </PaginationItem>
                          {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                              {page === "ellipsis" ? (
                                <PaginationEllipsis />
                              ) : (
                                <FilePaginationLink
                                  onClick={() => setCurrentPage(page as number)}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </FilePaginationLink>
                              )}
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <FilePaginationNext
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPages)
                                )
                              }
                              disabled={currentPage === totalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>

        <FileInfo
          file={selectedFile}
          isOpen={isFileInfoOpen}
          onClose={() => setIsFileInfoOpen(false)}
        />
      </div>

      {modalState.type === "create-folder" && (
        <CreateFolderModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          onCreate={handleCreateFolder}
        />
      )}
      {modalState.type === "delete-file" && (
        <DeleteFileModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          fileName={modalState.data.file_name}
          fileId={modalState.data.id}
          viewType={viewType}
          onDelete={(success) => {
            if (success) {
              fetchFiles();
            }
            setModalState({ type: null });
          }}
        />
      )}
      {modalState.type === "rename-file" && (
        <RenameFileModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          oldName={modalState.data.file_name}
          onRename={(newName) => handleRenameFile(modalState.data.id, newName)}
        />
      )}
      {modalState.type === "share-file" && (
        <CreateShareModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          fileToShare={modalState.data}
        />
      )}
      {modalState.type === "move-file" && (
        <MoveFileModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          fileToMove={modalState.data}
          onMove={(folderId) => handleMoveFile(modalState.data.id, folderId)}
          folders={folders}
          onFoldersChange={setFolders}
        />
      )}
      {modalState.type === "file-preview" && modalState.data && (
        <FilePreview
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          file={fileForPreview}
          onShare={() => handleShareClick(modalState.data.id)}
          onDownload={() => handleDownloadFile(modalState.data.id)}
        />
      )}
      {modalState.type === "rename-folder" && (
        <RenameFolderModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          oldName={modalState.data.name}
          onRename={handleRenameFolder}
        />
      )}
      {modalState.type === "delete-folder" && (
        <DeleteFolderModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          folderName={modalState.data.name}
          folderId={modalState.data.id}
          onDeleteSuccess={() => {
            setFolders((prevFolders) =>
              prevFolders.filter((folder) => folder.id !== modalState.data.id)
            );
            setModalState({ type: null });
          }}
        />
      )}
      {modalState.type === "bulk-delete" && (
        <BulkDeleteModal
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          onConfirm={handleBulkDeleteConfirm}
          fileCount={selectedFileIds.size}
          isLoading={isDeletingFiles}
          viewType={viewType}
        />
      )}
      {isLoadingFileDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow-lg">
            <Loading color="#7141f8" />
            <span className="text-sm text-gray-700">Loading file...</span>
          </div>
        </div>
      )}
    </main>
  );
};
export default FileExplorer;
