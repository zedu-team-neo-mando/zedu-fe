"use client";

import { useContext, useMemo, useState } from "react";
import moment from "moment";
import {
  AlertCircle,
  Archive,
  BellRing,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileArchive,
  Loader2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { cn } from "~/lib/utils";
import { DataContext } from "~/store/GlobalState";
import type { ChannelExport } from "~/types/channel";
import {
  getExportFilename,
  isExportCompleted,
  isExportFailed,
  isExportInProgress,
  useChannelExport,
} from "~/hooks/useChannelExport";
import { showError, showSuccess } from "~/components/toast/sonner";

interface ChannelExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string;
}

const downloadExportFile = (item: ChannelExport, channelName?: string) => {
  if (!item.file_url) {
    showError("This export does not have a downloadable file yet");
    return;
  }

  const fileUrl = new URL(item.file_url, window.location.origin);
  const link = document.createElement("a");
  link.href = fileUrl.toString();
  // Cross-origin file URLs can redirect, so let the browser follow them.
  if (fileUrl.origin === window.location.origin) {
    link.download = getExportFilename(item, channelName);
  }
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showSuccess("Download started");
};

const statusCopy = (status?: string | null) => {
  if (isExportCompleted(status)) return "Ready";
  if (isExportFailed(status)) return "Failed";
  if ((status || "").toLowerCase() === "pending") return "Pending";
  if (isExportInProgress(status)) return "In progress";
  return status ? status.replace(/_/g, " ") : "Unknown";
};

function StatusBadge({ status }: { status?: string | null }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold capitalize leading-none tracking-[0.01em]",
        isExportCompleted(status) &&
          "bg-[#ECFDF3] text-[#027A48] dark:bg-[#2B2D5A] dark:text-[#C3C5FF]",
        isExportFailed(status) &&
          "bg-[#FEF3F2] text-[#B42318] dark:bg-[#352323] dark:text-[#FDA29B]",
        isExportInProgress(status) &&
          "bg-[#EEF4FF] text-[#3538CD] dark:bg-[#2B2D5A] dark:text-[#C3C5FF]",
        !isExportCompleted(status) &&
          !isExportFailed(status) &&
          !isExportInProgress(status) &&
          "bg-[#F2F4F7] text-[#344054] dark:bg-[#2B2D5A] dark:text-[#C3C5FF]"
      )}
    >
      {statusCopy(status)}
    </span>
  );
}

function ExportStatusCard({
  currentExport,
  channelName,
  starting,
  downloadingId,
  onStart,
  onDownload,
  onClose,
}: {
  currentExport: ChannelExport | null;
  channelName: string;
  starting: boolean;
  downloadingId: string | null;
  onStart: () => void;
  onDownload: (item: ChannelExport) => void;
  onClose: () => void;
}) {
  const inProgress = isExportInProgress(currentExport?.status);
  const completed = isExportCompleted(currentExport?.status);
  const failed = isExportFailed(currentExport?.status);

  const startedLabel = currentExport?.created_at
    ? moment(currentExport.created_at).fromNow()
    : null;

  if (inProgress) {
    return (
      <div className="rounded-[12px] border border-[#D6D6F5] bg-[#F8F8FF] p-5 dark:border-[#3A3B44] dark:bg-[#2B2D5A]">
        <div className="flex items-start gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#5757CD] shadow-[0_1px_2px_rgba(16,24,40,0.06)] dark:border dark:border-[#3A3B5C] dark:bg-[#1A1B2E] dark:text-[#9A9CF8]">
            <BellRing className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5757CD] dark:border-[#292A31] dark:bg-[#6D6FF5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-5 text-[#101828] dark:text-[#F3F3F7]">
              We&apos;ll notify you when it&apos;s ready
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[#667085] dark:text-[#B4B6C0]">
              Your export of #{channelName} is queued. This can take a few
              minutes depending on the size of the channel. You can close this
              and keep working — we&apos;ll let you know when the ZIP is ready
              to download.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          {startedLabel ? (
            <p className="text-xs text-[#98A2B3]">Started {startedLabel}</p>
          ) : (
            <span />
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 rounded-lg border-[#D0D5DD] px-4 text-sm font-semibold text-[#344054] hover:bg-white"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="rounded-[12px] border border-[#FECDCA] bg-[#FFFBFA] p-5 dark:border-[#553532] dark:bg-[#2A2223]">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#B42318] shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[#101828] leading-5">
              Export failed
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[#667085] dark:text-[#B4B6C0]">
              {currentExport?.error_message ||
                "We couldn't generate this export. You can try again."}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={onStart}
            disabled={starting}
            className="h-9 gap-2 rounded-lg bg-[#5757CD] px-4 text-sm font-semibold text-white hover:bg-[#4545B0]"
          >
            Try again
            {starting ? (
              <Loading color="white" height="14px" width="14px" />
            ) : null}
          </Button>
        </div>
      </div>
    );
  }

  if (completed && currentExport?.file_url) {
    return (
      <div className="rounded-[12px] border border-[#A6F4C5] bg-[#F6FEF9] p-5 dark:border-[#3A3B44] dark:bg-[#292A31]">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#027A48] shadow-[0_1px_2px_rgba(16,24,40,0.06)] dark:border dark:border-[#3A3B5C] dark:bg-[#1A1B2E] dark:text-[#9A9CF8]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[#101828] leading-5">
              Your export is ready
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[#667085] dark:text-[#B4B6C0]">
              Download the ZIP, or generate a new export with the latest
              messages.
            </p>
            {currentExport.completed_at ? (
              <p className="mt-1.5 text-xs text-[#98A2B3]">
                Completed {moment(currentExport.completed_at).fromNow()}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onStart}
            disabled={starting}
            className="channel-export-new-button h-9 gap-2 rounded-lg border-[#D0D5DD] bg-white px-4 text-sm font-semibold text-[#344054]"
          >
            New export
            {starting ? (
              <Loading color="#344054" height="14px" width="14px" />
            ) : null}
          </Button>
          <Button
            type="button"
            onClick={() => onDownload(currentExport)}
            disabled={downloadingId === currentExport.id}
            className="h-9 gap-2 rounded-lg bg-[#5757CD] px-4 text-sm font-semibold text-white hover:bg-[#4545B0]"
          >
            <Download className="h-4 w-4" />
            Download ZIP
            {downloadingId === currentExport.id ? (
              <Loading color="white" height="14px" width="14px" />
            ) : null}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#E6EAEF] bg-[#F9FAFB] p-5 dark:border-[#3A3B44] dark:bg-[#292A31]">
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#5757CD] shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <Archive className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[#101828] leading-5">
            Export #{channelName}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-[#667085] dark:text-[#B4B6C0]">
            Download a ZIP of this channel&apos;s messages, files, and media.
            We&apos;ll notify you when the file is ready to download.
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          onClick={onStart}
          disabled={starting}
          className="h-9 gap-2 rounded-lg bg-[#5757CD] px-4 text-sm font-semibold text-white hover:bg-[#4545B0]"
        >
          Start export
          {starting ? (
            <Loading color="white" height="14px" width="14px" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}

function HistoryRow({
  item,
  downloadingId,
  onDownload,
}: {
  item: ChannelExport;
  downloadingId: string | null;
  onDownload: (item: ChannelExport) => void;
}) {
  const canDownload = isExportCompleted(item.status) && Boolean(item.file_url);

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F9FAFB] dark:hover:bg-[#303139]">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]",
          isExportFailed(item.status)
            ? "bg-[#FEF3F2] text-[#B42318] dark:bg-[#352323] dark:text-[#FDA29B]"
            : "bg-[#EEF4FF] text-[#5757CD] dark:border-[#3A3B5C] dark:bg-[#1A1B2E] dark:text-[#9A9CF8]"
        )}
      >
        {isExportInProgress(item.status) ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isExportFailed(item.status) ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <FileArchive className="h-4 w-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-semibold text-[#101828] dark:text-[#F3F3F7]">
            {moment(item.created_at).format("MMM D, YYYY")}
          </p>
          <StatusBadge status={item.status} />
        </div>
        <p className="mt-0.5 truncate text-xs text-[#667085] dark:text-[#B4B6C0]">
          {isExportFailed(item.status)
            ? item.error_message || "Could not generate this export"
            : isExportInProgress(item.status)
              ? "You'll be notified when this is ready"
              : `${moment(item.created_at).format("h:mm A")}${
                  item.completed_at
                    ? ` · Completed ${moment(item.completed_at).format("h:mm A")}`
                    : ""
                }`}
        </p>
      </div>

      {canDownload ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => onDownload(item)}
          disabled={downloadingId === item.id}
          className="h-8 shrink-0 gap-1 rounded-md border-[#D0D5DD] px-2.5 text-xs font-semibold text-[#344054]"
        >
          {downloadingId === item.id ? (
            <Loading color="#344054" height="13px" width="13px" />
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              ZIP
            </>
          )}
        </Button>
      ) : (
        <span className="w-[52px] shrink-0" />
      )}
    </div>
  );
}

export default function ChannelExportModal({
  open,
  onOpenChange,
  channelId,
}: ChannelExportModalProps) {
  const { state } = useContext(DataContext);
  const channelName =
    state?.channelDetails?.name ||
    (typeof window !== "undefined"
      ? localStorage.getItem("channelName")
      : null) ||
    "channel";

  const {
    currentExport,
    history,
    pagination,
    loading,
    historyLoading,
    starting,
    startExport,
    fetchHistory,
  } = useChannelExport(channelId, open);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const displayedExport =
    currentExport ??
    (isExportCompleted(history[0]?.status) ? history[0] : null);

  const handleDownload = (item: ChannelExport) => {
    setDownloadingId(item.id);
    downloadExportFile(item, channelName);
    window.setTimeout(() => setDownloadingId(null), 400);
  };

  const pageLabel = useMemo(() => {
    if (!pagination.total_items) return "No previous exports";
    const start = (pagination.current_page - 1) * pagination.page_size + 1;
    const end = Math.min(
      pagination.current_page * pagination.page_size,
      pagination.total_items
    );
    return `${start}–${end} of ${pagination.total_items}`;
  }, [pagination]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="gap-0 overflow-hidden rounded-[0.625rem] border-[#34353D] bg-white p-0 sm:max-w-[540px] dark:bg-[#1F2024]"
      >
        <DialogClose className="absolute right-5 top-4 rounded-[0.3125rem] border border-input p-1 text-[#344054] dark:border-[#44454E] dark:text-[#F3F3F7]">
          <X className="size-5" />
        </DialogClose>

        <DialogHeader className="space-y-1 border-b border-[#E6EAEF] px-6 py-5 pr-14 dark:border-[#34353D]">
          <DialogTitle className="text-lg font-bold leading-7 text-[#101828] dark:text-[#F3F3F7] lg:text-[1.25rem]">
            Export chat
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-5 text-[#667085] dark:text-[#B4B6C0]">
            Create a downloadable archive of #{channelName}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(72vh,640px)] overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loading color="#9A9CF8" height="32px" width="32px" />
            </div>
          ) : (
            <div className="space-y-6">
              <ExportStatusCard
                currentExport={displayedExport}
                channelName={channelName}
                starting={starting}
                downloadingId={downloadingId}
                onStart={startExport}
                onDownload={handleDownload}
                onClose={() => onOpenChange(false)}
              />

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#101828] dark:text-[#F3F3F7]">
                    Previous exports
                  </h3>
                  {pagination.total_items > 0 ? (
                    <p className="text-xs text-[#98A2B3]">{pageLabel}</p>
                  ) : null}
                </div>

                <div className="overflow-hidden rounded-[12px] border border-[#E6EAEF] bg-white dark:border-[#3A3B44] dark:bg-[#292A31]">
                  {historyLoading && history.length === 0 ? (
                    <div className="flex justify-center py-10">
                      <Loading color="#5757CD" height="24px" width="24px" />
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-10 text-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F2F4F7] text-[#667085] dark:bg-[#3A3B45] dark:text-[#B4B6C0]">
                        <FileArchive className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-[#344054] dark:text-[#F3F3F7]">
                        No exports yet
                      </p>
                      <p className="mt-1 max-w-[280px] text-[13px] leading-5 text-[#667085] dark:text-[#B4B6C0]">
                        Previous downloads for this channel will show up here.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E6EAEF] dark:divide-[#3A3B45]">
                      {history.map((item) => (
                        <HistoryRow
                          key={item.id}
                          item={item}
                          downloadingId={downloadingId}
                          onDownload={handleDownload}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {pagination.total_pages > 1 ? (
                  <div className="mt-3 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      disabled={pagination.current_page <= 1 || historyLoading}
                      onClick={() => fetchHistory(pagination.current_page - 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E6EAEF] text-[#344054] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="min-w-[64px] text-center text-xs font-medium text-[#667085] dark:text-[#B4B6C0]">
                      {pagination.current_page} / {pagination.total_pages}
                    </span>
                    <button
                      type="button"
                      disabled={
                        pagination.current_page >= pagination.total_pages ||
                        historyLoading
                      }
                      onClick={() => fetchHistory(pagination.current_page + 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E6EAEF] text-[#344054] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
