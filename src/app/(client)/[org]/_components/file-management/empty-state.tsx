import React, { DragEvent, useState } from "react";
import { Folder, UploadCloud } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  heading: string;
  description: string;
  children?: React.ReactNode;
  helper?: string;
  className?: string;
}

const EmptyState = ({
  icon,
  heading,
  description,
  children,
  helper,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center mt-40 mb-8",
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F1F1FE] text-[#5F5FE1]">
        {icon}
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-[#344054]">{heading}</h2>
      <p className="mt-2 max-w-md text-sm text-[#667085]">{description}</p>
      {children && (
        <div className="mt-6 flex flex-col items-center gap-2">{children}</div>
      )}
      {helper && <p className="mt-3 text-xs text-[#98A2B3]">{helper}</p>}
    </div>
  );
};

interface FoldersEmptyStateProps {
  onCreateFolder: () => void;
}

export const FoldersEmptyState = ({
  onCreateFolder,
}: FoldersEmptyStateProps) => {
  return (
    <EmptyState
      icon={<Folder size={28} />}
      heading="No folders yet"
      description="Organize your files into folders so your team can find things faster"
      helper="Creates a folder in 'All files' — you can move files into it anytime."
    >
      <Button
        onClick={onCreateFolder}
        className="px-4 py-2 text-sm bg-[#5F5FE1] text-white hover:bg-[#4B4BC4]"
      >
        New Folder
      </Button>
    </EmptyState>
  );
};

interface FilesEmptyStateProps {
  onUploadClick: () => void;
  onFilesDropped: (files: File[]) => void;
}

export const FilesEmptyState = ({
  onUploadClick,
  onFilesDropped,
}: FilesEmptyStateProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const hasFiles = (event: DragEvent<HTMLDivElement>) =>
    event.dataTransfer?.types?.includes("Files") ?? false;

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      onFilesDropped(files);
    }
  };

  return (
    <EmptyState
      className="mt-0"
      icon={<UploadCloud size={28} />}
      heading="No files yet"
      description="Upload your first file or drag it here so your team can find it faster"
    >
      <Button
        onClick={onUploadClick}
        className="px-4 py-2 text-sm bg-[#5F5FE1] text-white hover:bg-[#4B4BC4]"
      >
        Upload File
      </Button>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "mt-2 flex items-center justify-center w-full max-w-md rounded-xl border-2 border-dashed px-8 py-8 text-sm transition-colors",
          isDragging
            ? "border-[#5F5FE1] bg-[#F1F1FE] text-[#5F5FE1]"
            : "border-[#BABAFB] bg-[#F9F9FF] text-[#667085]"
        )}
      >
        Drag &amp; drop files anywhere in this area
      </div>
    </EmptyState>
  );
};
