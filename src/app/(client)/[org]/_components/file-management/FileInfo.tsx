import Image from "next/image";
import React from "react";
import { File, Folder, X } from "lucide-react";
import { InfoIcon } from "lucide-react";
import { formatFileSize, getFileIconClass } from "./FileList";

export interface FileDetails {
  id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  file_link: string;
  size: number;
  organisation_id: string;
  user_id: string;
  folder_id: string;
  created_at: string;
  updated_at: string;
  owner: string;
  accessType: string;
  dateModified: string;
  sharedIn: string;
  location: string;
  previewUrl?: string; // This is the image/video preview URL
  pageCount?: number;
  pages?: string[];
  pinned?: boolean;
  deletedBy?: string;
  dateDeleted?: string;
  status: "uploaded" | "failed" | "pending"; // Added status field
  backendId?: string; // Store the actual backend ID for API calls
  user_profile_photo?: string;
  uploader_display_name?: string;
  channel_id?: string;
}

interface FileInfoProps {
  file: FileDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const FileInfo = ({ file, isOpen, onClose }: FileInfoProps) => {
  if (!isOpen || !file) {
    return null;
  }
  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col transition-all duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <InfoIcon size={20} />
          </div>
          <h2 className="text-base font-medium text-gray-700">Info</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-[#667085] transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mx-4 my-6 pt-4 border rounded-lg border-gray-200 h-[340px] flex flex-col">
        <div className="flex items-center gap-3 mb-3 px-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src={getFileIconClass(
                file.file_name,
                file.mime_type,
                file.file_type
              )}
              width={30}
              height={30}
              alt=""
            />
          </div>
          <div>
            <p className="text-sm font-medium text-[#667085]">
              {file.file_name}
            </p>
            <p className="text-xs text-gray-500">
              {file.file_type.toUpperCase()}
            </p>
          </div>
        </div>

        {file.file_link && (
          <div className="w-full h-full bg-gray-100 overflow-hidden rounded-b-lg">
            {["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(
              file.file_name.split(".").pop()?.toLowerCase() || ""
            ) ? (
              <Image
                src={file.file_link}
                alt={file.file_name}
                width={400}
                height={200}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-50 text-gray-400">
                <File size={40} strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm">No preview available</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-base font-semibold text-[#344054] mb-3">
            Details
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#667085]">Owner</span>
              <span className="text-sm text-[#667085] font-medium">
                {file.uploader_display_name || file.owner}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#667085]">Access Type</span>
              <span className="text-xs px-2 py-1 rounded-full font-medium text-white bg-[#00AD51]">
                {file.accessType}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-[#667085]">Date Uploaded</span>
              <span className="text-sm text-[#667085]">
                {new Date(file.created_at).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-[#667085]">Shared In</span>
              <span className="text-sm text-[#667085]">{file.sharedIn}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-[#667085]">File Size</span>
              <span className="text-sm text-[#667085]">
                {formatFileSize(file.size)}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-[#667085]">Location</span>
              <div className="flex items-center gap-2 border px-2 py-1 rounded-sm">
                <Folder strokeWidth={1} size={20} />
                <span className="text-sm text-[#667085]">{file.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInfo;
