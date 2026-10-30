import { Upload, FileIcon, FolderUp, Plus } from "lucide-react";
import React, { useRef, ChangeEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { LucideProps } from "lucide-react";
import { AddFolderIcon } from "~/svgs";
import { UploadRequest } from "~/utils/new-request";
import { compressImage } from "~/utils/compress-image";
import { FileDetails } from "./FileInfo";
import { useUpload } from "~/store/UploadContext";
import UploadProgressPopover from "./UploadProgressPopover";
import UploadConfirmationModal from "./UploadConfirmationModal";
import { showError, showSuccess } from "~/components/toast/sonner";

interface ActionBtnsProps {
  icon:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
  text: string;
  onClick?: () => void;
  classname?: string;
  isPopoverOpen?: boolean;
}

interface HeaderProps {
  onNewFolderClick: () => void;
  title?: string;

  onFileUpload: (file: FileDetails) => void;
  // Bulk mode props
  isBulkMode?: boolean;
  selectedCount?: number;
  onBulkDelete?: () => void;
  onClearSelection?: () => void;
}

const Header = ({
  onNewFolderClick,
  onFileUpload,
  title,
  isBulkMode,
  selectedCount = 0,
  onBulkDelete,
  onClearSelection,
}: HeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addUploadingFile, updateUploadProgress, updateUploadStatus } =
    useUpload();
  const [isUploadPopoverOpen, setIsUploadPopoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("webkitdirectory");
      fileInputRef.current.click();
      setIsUploadPopoverOpen(false); // Close popover after selection
    }
  };

  const handleFolderUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("webkitdirectory", "");
      fileInputRef.current.click();
      setIsUploadPopoverOpen(false); // Close popover after selection
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
      setIsConfirmationOpen(true);
      // Reset input so the same file can be selected again if cancelled
      event.target.value = "";
    }
  };

  const handleConfirmUpload = async () => {
    setIsConfirmationOpen(false);

    let successCount = 0;
    let failCount = 0;

    for (const file of selectedFiles) {
      const tempId = Date.now() + Math.random();
      const localPreviewUrl = URL.createObjectURL(file);

      // Add file to upload progress tracker
      addUploadingFile({ id: tempId.toString(), name: file.name });

      // Immediately add file to display list with pending status
      const initialFileDetails: FileDetails = {
        id: tempId.toString(),
        file_name: file.name,
        file_type: file.name.split(".").pop()?.toLowerCase() || "file",
        mime_type: file.type,
        file_link: localPreviewUrl,
        size: file.size,
        organisation_id: "", // Will be set by backend
        user_id: "", // Will be set by backend
        folder_id: "", // Will be set by backend
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: "Me", // Placeholder
        accessType: "Public", // Placeholder
        dateModified: new Date().toLocaleDateString(),
        sharedIn: "Local", // Indicates local display
        location: "Local Uploads", // Indicates local display
        previewUrl: localPreviewUrl,
        status: "pending",
      };
      onFileUpload(initialFileDetails);

      // Simulate progress updates
      updateUploadProgress(tempId.toString(), 10);

      const formData = new FormData();
      const fileToUpload = await compressImage(file);
      formData.append("files", fileToUpload);

      updateUploadProgress(tempId.toString(), 30);
      const response = await UploadRequest("/files/upload-files", formData);
      updateUploadProgress(tempId.toString(), 80);

      if (response.status === 200) {
        updateUploadProgress(tempId.toString(), 100);
        updateUploadStatus(tempId.toString(), "completed");
        successCount++;
        const newFile = response.data.data[0];

        const updatedFileDetails: FileDetails = {
          ...initialFileDetails,
          id: tempId.toString(), // Keep the temp ID to update the existing file
          file_name: newFile.file_name,
          file_type: newFile.file_type,
          mime_type: newFile.mime_type || file.type,
          file_link: newFile.file_link,
          size: newFile.size || file.size,
          organisation_id: newFile.organisation_id || "",
          user_id: newFile.user_id || "",
          folder_id: newFile.folder_id || "",
          created_at: newFile.created_at || new Date().toISOString(),
          updated_at: newFile.updated_at || new Date().toISOString(),
          dateModified: new Date(
            newFile.updated_at || new Date()
          ).toLocaleDateString(),
          sharedIn: "#General", // Actual shared location
          location: "All Files", // Actual server location
          previewUrl: newFile.file_link,
          status: "uploaded",
          backendId: newFile.id, // Store the backend ID for future API calls
        };
        onFileUpload(updatedFileDetails); // Update the file in the list
        URL.revokeObjectURL(localPreviewUrl); // Clean up local URL
      } else {
        console.error("Upload failed", response);
        updateUploadStatus(tempId.toString(), "failed");
        failCount++;
        // showError(`Upload failed for ${file.name}: ${response.response?.data?.message || 'Backend error'}`);
        const failedFileDetails: FileDetails = {
          ...initialFileDetails,
          status: "failed",
        };
        onFileUpload(failedFileDetails); // Update the file in the list
        // Don't revoke localPreviewUrl if we want to display it with a "failed" status
      }
    }

    // Show a single success message after all uploads complete
    if (successCount > 0) {
      if (successCount === 1) {
        showSuccess("File uploaded successfully!");
      } else {
        showSuccess(`${successCount} files uploaded successfully!`);
      }
    }

    // Show error message if any uploads failed
    if (failCount > 0) {
      if (failCount === 1) {
        showError("1 file failed to upload");
      } else {
        showError(`${failCount} files failed to upload`);
      }
    }

    setSelectedFiles([]);
  };

  return (
    <>
      <header className="border-[#E6EAEF] border-b p-5 flex justify-between items-center gap-3">
        <p className="font-bold text-lg">{title}</p>
        <div className="flex gap-2 items-center">
          {/* Bulk Mode Controls */}
          {isBulkMode && selectedCount > 0 ? (
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-sm text-gray-600">
                {selectedCount} file{selectedCount > 1 ? "s" : ""} selected
              </span>
              <Button
                onClick={onBulkDelete}
                className="px-3 md:px-4 py-2 text-sm bg-[#D31103] text-white hover:bg-[#B20E02]"
              >
                Delete
              </Button>
              <Button
                onClick={onClearSelection}
                variant="outline"
                className="px-3 md:px-4 py-2 text-sm border-gray-300"
              >
                Clear
              </Button>
            </div>
          ) : isBulkMode ? (
            <Button
              onClick={onClearSelection}
              variant="outline"
              className="px-3 md:px-4 py-2 text-sm border-gray-300"
            >
              Exit Selection
            </Button>
          ) : (
            <>
              {/* Upload and New Folder Buttons */}
              {title !== "Shared with me" && title !== "Deleted Files" && (
                <>
                  {/* Mobile: Single plus icon with combined menu */}
                  <div className="md:hidden">
                    <Popover
                      open={isMobileMenuOpen}
                      onOpenChange={setIsMobileMenuOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          aria-label="Open upload menu"
                          className={`px-3 py-2 border border-[#BABAFB] flex items-center gap-2 hover:bg-[#F6F7F9] ${isMobileMenuOpen ? "bg-[#F6F7F9]" : "active:bg-[#F6F7F9]"}`}
                        >
                          <Plus className="text-[#8686F9] size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[180px] p-0">
                        <div className="flex flex-col gap-0">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-[15px] hover:bg-[#F6F7F9] h-[38px] rounded-none"
                            onClick={handleUploadClick}
                          >
                            <FileIcon
                              size={16}
                              className="mr-2 text-[#8686F9]"
                            />
                            Upload File
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-[15px] hover:bg-[#F6F7F9] h-[38px] rounded-none"
                            onClick={handleFolderUploadClick}
                          >
                            <FolderUp
                              size={16}
                              className="mr-2 text-[#8686F9]"
                            />
                            Upload Folder
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-[15px] hover:bg-[#F6F7F9] h-[38px] rounded-none"
                            onClick={() => {
                              onNewFolderClick();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <AddFolderIcon size={16} />
                            <span className="ml-2">New Folder</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Desktop: Separate buttons */}
                  <div className="hidden md:flex gap-2 items-center">
                    <Popover
                      open={isUploadPopoverOpen}
                      onOpenChange={setIsUploadPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <ActionBtns
                          icon={Upload}
                          text="Upload File"
                          isPopoverOpen={isUploadPopoverOpen}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-[150px] h-[76px] p-0">
                        <div className="flex flex-col gap-0">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-[15px] hover:bg-[#F6F7F9] h-[38px] rounded-none"
                            onClick={handleUploadClick}
                          >
                            <FileIcon size={16} className="mr-2" />
                            File
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-[15px] hover:bg-[#F6F7F9] h-[38px] rounded-none"
                            onClick={handleFolderUploadClick}
                          >
                            <FolderUp size={16} className="mr-2" />
                            Folder
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <ActionBtns
                      icon={AddFolderIcon}
                      text="New Folder"
                      onClick={onNewFolderClick}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </header>

      {/* Upload Progress Popover */}
      <UploadProgressPopover />

      <UploadConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmUpload}
        files={selectedFiles}
      />
    </>
  );
};

// Forwards the ref and extra props so it can be a Radix trigger's child
// (asChild) instead of a button nested inside the trigger's own button.
export const ActionBtns = React.forwardRef<
  HTMLButtonElement,
  ActionBtnsProps &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ActionBtnsProps>
>(
  (
    {
      icon: Icon,
      text,
      onClick,
      isPopoverOpen,
      classname: _classname,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        {...props}
        className={`px-3 py-2 border border-[#BABAFB] flex items-center gap-2 hover:bg-[#F6F7F9] ${isPopoverOpen ? "bg-[#F6F7F9]" : "active:bg-[#F6F7F9]"}`}
        onClick={onClick}
      >
        <Icon className="text-[#8686F9] size-4" />
        <span className="text-[#5F5FE1] font-semibold">{text}</span>
      </Button>
    );
  }
);
ActionBtns.displayName = "ActionBtns";
export default Header;
