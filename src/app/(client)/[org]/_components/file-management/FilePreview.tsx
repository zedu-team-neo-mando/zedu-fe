import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ZoomIn,
  ZoomOut,
  MaximizeIcon,
  Download,
  Share2,
  File,
} from "lucide-react";
import FileViewer from "react-file-viewer";
import "./file-preview-viewer.css";
import { showError } from "~/components/toast/sonner";
interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    fileName: string;
    size: string;
    type: string;
    previewUrl?: string;
    pageCount?: number;
    pages?: string[];
  } | null;
  onDownload?: () => void;
  onShare?: () => void;
}
interface FileRenderProps {
  file: {
    fileName: string;
    size: string;
    type: string;
    previewUrl?: string;
    pageCount?: number;
    pages?: string[];
  };
  currentPage: number;
  pages: string[];
  zoom: number;

  setHasError: (_hasError: boolean) => void;
}
const getFileExtension = (filename: string) => {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
};

const FileRenderer: React.FC<FileRenderProps> = ({
  file,
  currentPage,
  pages,
  setHasError,
}) => {
  const fileExtension = getFileExtension(file.fileName);
  const supportedImageTypes = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
  const isImage = supportedImageTypes.includes(fileExtension.toLowerCase());
  if (isImage) {
    return (
      <div className="relative max-w-full max-h-full">
        <Image
          src={pages[currentPage] || ""}
          alt={`${file.fileName} - Page ${currentPage + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          onError={() => {
            setHasError(true);
            showError("Error loading image preview.");
          }}
        />
      </div>
    );
  }
  // Used iframe for PDFs instead of FileViewer
  if (fileExtension.toLowerCase() === "pdf") {
    return (
      <iframe
        src={`${pages[currentPage]}#page=${currentPage + 1}`}
        className="w-full h-full border-none rounded-lg shadow-lg"
        title={`${file.fileName} - Page ${currentPage + 1}`}
        onError={() => {
          setHasError(true);
          showError("Error loading PDF preview.");
        }}
      />
    );
  }
  // Used FileViewer for other file types
  return (
    <div className="file-preview-viewer w-full h-full min-h-[300px]">
      <FileViewer
        fileType={fileExtension.toLowerCase()}
        filePath={pages[currentPage] || ""}
        onError={() => {
          showError(`Unable to display .${fileExtension} file`);
          setHasError(true);
        }}
      />
    </div>
  );
};

const FilePreview: React.FC<FilePreviewProps> = ({
  isOpen,
  onClose,
  file,
  onDownload,
  onShare,
}) => {
  const [zoom, setZoom] = useState(100);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const fileExtension = file ? getFileExtension(file.fileName) : "";

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };
  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (file) {
      setHasError(false);
      setZoom(100);
      setCurrentPage(0);
    }
  }, [file]);
  if (!isOpen || !file) return null;
  const handleDownloadFile = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const pages = file.pages || (file.previewUrl ? [file.previewUrl] : []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] max-w-6xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center gap-1 sm:justify-between px-2 py-1 lg:px-6 lg:py-4 border-b border-gray-200 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 lg:gap-3">
            <div className="p-1 lg:p-2 bg-red-100 rounded flex items-center justify-center">
              <span className="text-red-600 text-xs lg:text-sm font-medium">
                {fileExtension.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xs lg:text-sm font-medium text-gray-900">
                {file.fileName}
              </h3>
              <p className="text-xs lg:text-sm text-gray-500">{file.size}</p>
            </div>
          </div>
          {/* Preview header controls */}
          <div className="flex items-center gap-1 lg:gap-2">
            <div className="bg-[#FAFBFC] border border-[#C1C6CE] flex p-1 lg:px-3 lg:py-2 rounded-lg">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={20} className="text-gray-600" />
              </button>
              <div className="hidden sm:block sm:px-3 sm:py-1 rounded-lg lg:min-w-[60px] text-center">
                <span className="sm:text-xs lg:text-sm font-medium text-gray-700">
                  {zoom}%
                </span>
              </div>
              <div className="block sm:hidden w-px h-6 items-center bg-gray-300 mx-2" />
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={20} className="text-gray-600" />
              </button>
              <div className="hidden sm:block w-px h-6 items-center bg-gray-300 mx-2" />
              <button
                onClick={() => setZoom(100)}
                className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="FullView"
              >
                <MaximizeIcon size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-2 p-2 lg:px-4 lg:py-3 bg-[#7141F8] text-white rounded-lg hover:bg-[#5F2FE6] transition-colors"
            >
              <Download size={18} />
              <span className="hidden lg:block lg:text-sm font-medium">
                Download
              </span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2  p-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 size={18} className="text-gray-600" />
              <span className="hidden lg:block lg:text-sm font-medium text-gray-700">
                Share
              </span>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={onClose}
              className="lg:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-hidden bg-gray-50 flex">
          {hasError || pages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <File size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-2">
                  .{fileExtension} files are supported but something went wrong.
                </p>
                <p className="text-sm text-gray-500">
                  Unable to load the preview. You can still download the file.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 relative overflow-auto flex items-center justify-center">
              <div
                className="w-full h-full p-8"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <FileRenderer
                  file={file}
                  currentPage={currentPage}
                  pages={pages}
                  zoom={zoom}
                  setHasError={setHasError}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500 text-center">
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-gray-700 font-mono">
              ESC
            </kbd>{" "}
            to close or click outside the preview
          </p>
        </div>
      </div>
    </div>
  );
};
export default FilePreview;
