"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import Image from "next/image";
import {
  File as FileIcon,
  Film,
  Link as LinkIcon,
  Music,
  Play,
} from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { GetRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import UserAvatar from "~/components/layout/user-avatar";
import { cn } from "~/lib/utils";
import { Media } from "~/types/channel";
import ImageViewer from "../ChannelMessage/image-viewer";
import DocumentPreviewModal from "../ChannelMessage/document-preview-modal";
import {
  getDocumentCategory,
  isPreviewableDocument,
} from "~/utils/document-files";
import { getFileIconClass } from "../file-management/FileList";
import ChannelFileMediaPreview from "./channel-file-media-preview";
import { extractLinks } from "../ChannelMessage/preview-links";

export type ChannelFileFilter =
  | "all"
  | "images"
  | "videos"
  | "audio"
  | "documents"
  | "links";

type ChannelFileEntry = Media & {
  thread_id?: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
};

type MediaCategory = "image" | "video" | "audio" | "document" | "file" | "link";

const FILTER_OPTIONS: { id: ChannelFileFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "audio", label: "Audio" },
  { id: "documents", label: "Documents" },
  { id: "links", label: "Links" },
];

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "ico",
]);
const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "ogv",
  "m4v",
]);
const AUDIO_EXTENSIONS = new Set([
  "wav",
  "m4a",
  "mp3",
  "ogg",
  "aac",
  "flac",
  "opus",
  "weba",
]);

const normalizeExtension = (fileType: string, fileName: string): string => {
  const fromType = (fileType || "").toLowerCase().replace(/^\./, "");
  if (fromType && fromType !== "file") return fromType;
  const parts = (fileName || "").split(".");
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? "") : "";
};

export const getChannelFileCategory = (media: Media): MediaCategory => {
  if (media.file_type === "link") return "link";
  const mime = (media.mime_type || "").toLowerCase().split(";")[0].trim();
  const ext = normalizeExtension(media.file_type, media.file_name);

  if (mime.startsWith("audio/") || AUDIO_EXTENSIONS.has(ext)) return "audio";
  if (mime.startsWith("video/") || VIDEO_EXTENSIONS.has(ext)) return "video";
  if (mime.startsWith("image/") || IMAGE_EXTENSIONS.has(ext)) return "image";
  if (isPreviewableDocument(getDocumentCategory(media))) return "document";

  return "file";
};

const decodeFileName = (name: string) => {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

const DEFAULT_PROTOCOL = "https:";

const ensureScheme = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `${DEFAULT_PROTOCOL}//${url}`;

const isThreadFileBundle = (item: Record<string, unknown>) =>
  Array.isArray(item.media) &&
  (typeof item.thread_id === "string" ||
    typeof item.user_id === "string" ||
    typeof item.username === "string");

const isFlatChannelFile = (item: Record<string, unknown>) =>
  typeof item.file_link === "string" &&
  typeof item.file_name === "string" &&
  !isThreadFileBundle(item);

const mapThreadMediaToEntry = (
  thread: Record<string, unknown>,
  file: Record<string, unknown>
): ChannelFileEntry => ({
  ...(file as unknown as Media),
  file_name: decodeFileName(String(file.file_name ?? "")),
  thread_id: String(thread.thread_id ?? ""),
  user_id: String(thread.user_id ?? file.user_id ?? ""),
  username: String(thread.username ?? "Member"),
  avatar_url:
    (thread.avatar_url as string | undefined) ??
    (file.avatar_url as string | undefined),
  created_at: String(
    thread.created_at ?? file.created_at ?? file.updated_at ?? ""
  ),
});

const normalizeChannelFilesResponse = (data: unknown[]): ChannelFileEntry[] => {
  if (!Array.isArray(data)) return [];

  const entries: ChannelFileEntry[] = [];

  for (const raw of data) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;

    if (isThreadFileBundle(item)) {
      for (const media of item.media as unknown[]) {
        if (!media || typeof media !== "object") continue;
        entries.push(
          mapThreadMediaToEntry(item, media as Record<string, unknown>)
        );
      }
      continue;
    }

    if (isFlatChannelFile(item)) {
      entries.push({
        ...(item as unknown as Media),
        file_name: decodeFileName(String(item.file_name)),
        thread_id: (item.thread_id as string | undefined) ?? "",
        user_id: String(item.user_id ?? ""),
        username: String(item.username ?? "Member"),
        avatar_url: item.avatar_url as string | undefined,
        created_at: String(item.created_at ?? item.updated_at ?? ""),
      });
    }
  }

  return entries;
};

const extractChannelFilesFromResponse = (res: {
  status?: number;
  data?: {
    status_code?: number;
    data?: unknown;
    pagination?: unknown;
  };
}) => {
  const body = res?.data;
  const items = Array.isArray(body?.data) ? body.data : [];
  return {
    items,
    pagination: body?.pagination,
    ok: res?.status === 200 || res?.status === 201 || body?.status_code === 200,
  };
};

const mergeFileEntries = (
  existing: ChannelFileEntry[],
  incoming: ChannelFileEntry[]
) => {
  const seen = new Set(existing.map((f) => f.id));
  const merged = [...existing];
  for (const file of incoming) {
    if (seen.has(file.id)) continue;
    seen.add(file.id);
    merged.push(file);
  }
  return merged;
};

const getDateGroupLabel = (iso: string) => {
  const date = moment(iso);
  if (!date.isValid()) return "Unknown date";
  if (date.isSame(moment(), "day")) return "Today";
  if (date.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
  if (date.isSame(moment(), "year")) return date.format("MMMM D");
  return date.format("MMMM YYYY");
};

const PAGE_LIMIT = 20;

const parsePagination = (raw: unknown) => {
  const pagination = Array.isArray(raw) ? raw[0] : raw;
  if (!pagination || typeof pagination !== "object") return null;
  const p = pagination as Record<string, number>;
  const currentPage = Number(p.current_page ?? 1);
  const totalPages = Number(
    p.total_pages_count ?? p.total_pages ?? p.total_page ?? 1
  );
  return {
    currentPage: Number.isFinite(currentPage) ? currentPage : 1,
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
  };
};

const resolveHasMore = (
  incomingCount: number,
  parsed: ReturnType<typeof parsePagination> | null,
  requestedPage: number
): boolean => {
  if (incomingCount === 0) return false;
  if (incomingCount < PAGE_LIMIT) return false;

  if (parsed) {
    return parsed.currentPage < parsed.totalPages;
  }

  return requestedPage >= 1 && incomingCount >= PAGE_LIMIT;
};

export function FilesTabContainer() {
  const { state } = useContext(DataContext);
  const params = useParams();
  const channelId =
    (params?.id as string) ||
    state?.channelDetails?.channels_id ||
    state?.channelDetails?.id;

  const channelName = state?.channelDetails?.name ?? "channel";

  const [filter, setFilter] = useState<ChannelFileFilter>("all");
  const [files, setFiles] = useState<ChannelFileEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [previewImage, setPreviewImage] = useState<ChannelFileEntry | null>(
    null
  );
  const [previewDocument, setPreviewDocument] =
    useState<ChannelFileEntry | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{
    file: ChannelFileEntry;
    category: "video" | "audio";
  } | null>(null);

  const fetchInFlightRef = useRef(false);

  const fetchPage = useCallback(
    async (pageNumber: number, replace: boolean) => {
      if (!channelId) return;

      if (filter === "links") {
        setFiles([]);
        setHasMore(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      if (fetchInFlightRef.current) return;

      fetchInFlightRef.current = true;
      setLoading(true);

      try {
        const search = new URLSearchParams({
          page: String(pageNumber),
          limit: String(PAGE_LIMIT),
        });
        if (filter !== "all") {
          search.set("type", filter);
        }

        const res = await GetRequest(
          `/channels/${channelId}/files?${search.toString()}`
        );

        const { ok, items, pagination } = extractChannelFilesFromResponse(res);

        if (ok) {
          const incoming = normalizeChannelFilesResponse(items);
          setFiles((prev) =>
            replace ? incoming : mergeFileEntries(prev, incoming)
          );

          const parsed = parsePagination(pagination);
          setHasMore(resolveHasMore(incoming.length, parsed, pageNumber));
          setPage(parsed?.currentPage ?? pageNumber);
        } else if (replace) {
          setFiles([]);
          setHasMore(false);
        }
      } finally {
        fetchInFlightRef.current = false;
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [channelId, filter]
  );

  useEffect(() => {
    if (!channelId) {
      setInitialLoading(false);
      return;
    }
    setFiles([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    fetchPage(1, true);
  }, [channelId, filter, fetchPage]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, false);
  };

  const extractedLinks = useMemo<ChannelFileEntry[]>(() => {
    if (filter !== "links") return [];
    const links: ChannelFileEntry[] = [];
    for (const thread of state.messages || []) {
      // state.messages is replaced on channel change, guard the stale window
      if (
        String(thread?.channels_id ?? thread?.channel_id ?? "") !==
        String(channelId)
      )
        continue;
      const urls = extractLinks(thread?.message || "");
      urls.forEach((url, index) => {
        const href = ensureScheme(url);
        links.push({
          id: `link-${thread.thread_id}-${index}`,
          file_name: href,
          file_type: "link",
          mime_type: "text/uri-list",
          file_link: href,
          size: 0,
          organisation_id: "",
          user_id: String(thread.user_id ?? ""),
          folder_id: null,
          channel_id: channelId ?? null,
          message_id: String(thread.thread_id ?? ""),
          created_at: String(thread.created_at ?? ""),
          updated_at: String(thread.created_at ?? ""),
          last_accessed_at: String(thread.created_at ?? ""),
          deleted_at: null,
          access_type: "link",
          is_shareable: true,
          thread_id: String(thread.thread_id ?? ""),
          username: String(thread.username ?? "Member"),
          avatar_url: thread.avatar_url,
        });
      });
    }
    links.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return links;
  }, [filter, state.messages, channelId]);

  const groupedFiles = useMemo(() => {
    const source = filter === "links" ? extractedLinks : files;
    const groups = new Map<string, ChannelFileEntry[]>();
    const sorted = [...source].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (const file of sorted) {
      const label = getDateGroupLabel(file.created_at);
      const list = groups.get(label) ?? [];
      list.push(file);
      groups.set(label, list);
    }

    return Array.from(groups.entries());
  }, [files, extractedLinks, filter]);

  const openPreview = (file: ChannelFileEntry) => {
    const category = getChannelFileCategory(file);
    if (category === "image") {
      setPreviewImage(file);
      return;
    }
    if (category === "document") {
      setPreviewDocument(file);
      return;
    }
    if (category === "video" || category === "audio") {
      setPreviewMedia({ file, category });
      return;
    }
    window.open(file.file_link, "_blank", "noopener,noreferrer");
  };

  const messageContext = (file: ChannelFileEntry) => ({
    message: "",
    media: [file],
    type: "message",
    username: file.username,
    created_at: file.created_at,
    channel_name: channelName,
    thread_id: file.thread_id,
  });

  if (!channelId) {
    return (
      <p className="py-8 text-center text-sm text-[#667085]">
        Open a channel to view files.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-[13px] font-semibold transition-colors",
              filter === option.id
                ? "border-[#5F5FE1] bg-[#F1F1FE] text-[#4B4BB4]"
                : "border-[#E6EAEF] text-[#344054] hover:bg-[#F6F7F9]"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        id="channel-files-scroll"
        className="max-h-[420px] min-h-[200px] overflow-y-auto pr-1"
      >
        {initialLoading ? (
          <div className="flex justify-center py-16">
            <Loading color="#1264A3" />
          </div>
        ) : (
            filter === "links"
              ? extractedLinks.length === 0
              : files.length === 0
          ) ? (
          <p className="py-12 text-center text-sm text-[#667085]">
            {filter === "links"
              ? "No links shared in this channel yet."
              : "No files shared in this channel yet."}
          </p>
        ) : (
          <InfiniteScroll
            dataLength={
              filter === "links" ? extractedLinks.length : files.length
            }
            next={filter === "links" ? () => {} : loadMore}
            hasMore={filter === "links" ? false : hasMore && !loading}
            loader={
              <div className="flex justify-center py-4">
                <Loading color="#1264A3" />
              </div>
            }
            scrollableTarget="channel-files-scroll"
          >
            <div className="space-y-6">
              {groupedFiles.map(([label, groupFiles]) => (
                <section key={label}>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#667085]">
                    {label}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {groupFiles
                      .filter((f) => {
                        const cat = getChannelFileCategory(f);
                        return cat === "image" || cat === "video";
                      })
                      .map((file) => {
                        const category = getChannelFileCategory(file);
                        return (
                          <button
                            key={file.id}
                            type="button"
                            onClick={() => openPreview(file)}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-[#E6EAEF] bg-[#F6F7F9]"
                          >
                            {category === "image" ? (
                              <img
                                src={file.file_link}
                                alt={file.file_name}
                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                              />
                            ) : (
                              <>
                                <video
                                  src={file.file_link}
                                  muted
                                  playsInline
                                  preload="metadata"
                                  className="h-full w-full object-cover"
                                />
                                <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                                  <Play
                                    className="text-white drop-shadow"
                                    size={28}
                                    fill="white"
                                  />
                                </span>
                              </>
                            )}
                          </button>
                        );
                      })}
                  </div>

                  <ul className="mt-2 space-y-1">
                    {groupFiles
                      .filter((f) => {
                        const cat = getChannelFileCategory(f);
                        return (
                          cat === "audio" ||
                          cat === "document" ||
                          cat === "file" ||
                          cat === "link"
                        );
                      })
                      .map((file) => {
                        const category = getChannelFileCategory(file);
                        const iconSrc = getFileIconClass(file.file_name);

                        return (
                          <li key={file.id}>
                            <button
                              type="button"
                              onClick={() => openPreview(file)}
                              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-[#F1F1FE]"
                            >
                              <UserAvatar
                                src={file.avatar_url}
                                alt={file.username}
                                size="2xs"
                                className="shrink-0 rounded-[5px]"
                              />
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#E6EAEF] bg-white">
                                  {category === "audio" ? (
                                    <Music
                                      size={18}
                                      className="text-[#667085]"
                                    />
                                  ) : category === "link" ? (
                                    <LinkIcon
                                      size={18}
                                      className="text-[#667085]"
                                    />
                                  ) : category === "document" ||
                                    category === "file" ? (
                                    iconSrc.startsWith("/") ? (
                                      <Image
                                        src={iconSrc}
                                        alt=""
                                        width={20}
                                        height={20}
                                      />
                                    ) : (
                                      <FileIcon
                                        size={18}
                                        className="text-[#667085]"
                                      />
                                    )
                                  ) : (
                                    <Film
                                      size={18}
                                      className="text-[#667085]"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[14px] font-semibold text-[#101828]">
                                    {file.file_name}
                                  </p>
                                  <p className="truncate text-xs text-[#667085]">
                                    {file.username} ·{" "}
                                    {moment(file.created_at).format("h:mm A")}
                                  </p>
                                </div>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </section>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>

      {previewImage && (
        <ImageViewer
          item={messageContext(previewImage)}
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}

      {previewDocument && (
        <DocumentPreviewModal
          mediaItem={previewDocument}
          item={messageContext(previewDocument)}
          onClose={() => setPreviewDocument(null)}
        />
      )}

      {previewMedia && (
        <ChannelFileMediaPreview
          file={previewMedia.file}
          category={previewMedia.category}
          channelName={channelName}
          onClose={() => setPreviewMedia(null)}
        />
      )}
    </div>
  );
}

export default FilesTabContainer;
