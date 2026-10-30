"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { FileDetails } from "./FileInfo";
import { ChevronRightIcon, Folder, FolderPlus } from "lucide-react";

// Folder interface for static data
export interface FolderInfo {
  id: string;
  name: string;
  item_count: number;
  user_id: string;
  created_at?: string;
  dateCreated?: string;
  parentId?: number | null;
}

interface MoveFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileToMove: FileDetails | null;

  onMove: (folderId: string) => void;
  folders: FolderInfo[];
  currentFolderPage: number;
  totalFolderPages: number;
  isLoadingFolders: boolean;
  folderLoadError: boolean;
  onRetryFolders: () => void;

  onFolderPageChange: (page: number) => void;

  onFoldersChange: (folders: FolderInfo[]) => void;
}

const MoveFileModal: React.FC<MoveFileModalProps> = ({
  isOpen,
  onClose,
  fileToMove,
  onMove,
  folders: propFolders,
  currentFolderPage,
  totalFolderPages,
  isLoadingFolders,
  folderLoadError,
  onRetryFolders,
  onFolderPageChange,
  onFoldersChange,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<FolderInfo[]>(propFolders);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Sync local folders with prop folders
  useEffect(() => {
    setFolders(propFolders);
  }, [propFolders]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFolderId(null);
      setIsCreatingFolder(false);
      setNewFolderName("");
      onClose();
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderInfo = {
        id: `local-${Date.now()}`, // Generate a temporary unique string ID
        name: newFolderName.trim(),
        item_count: 0,
        user_id: "",
        dateCreated: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        parentId: null,
      };
      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      onFoldersChange(updatedFolders);
      setSelectedFolderId(newFolder.id);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleMove = () => {
    if (selectedFolderId) {
      onMove(selectedFolderId);
    }
    setSelectedFolderId(null);
    setIsCreatingFolder(false);
    setNewFolderName("");
    onClose();
  };

  const changeFolderPage = (page: number) => {
    setSelectedFolderId(null);
    onFolderPageChange(page);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="flex flex-row items-center -mx-6 px-6 justify-between border-b border-[#7141f8] pb-4">
          <DialogTitle className="font-semibold text-lg">
            Move {fileToMove ? fileToMove.file_name : "this file"}
          </DialogTitle>
        </DialogHeader>

        {/* Folders Section */}
        <div className="">
          <h3 className="text-sm font-semibold text-[#344054] mb-1">Folders</h3>

          {/* Scrollable folder list */}
          <div className="max-h-[300px] flex flex-col gap-3 overflow-y-auto">
            {folderLoadError && (
              <div className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-[#344054]">
                <span>Failed to load folders</span>
                <Button variant="outline" size="sm" onClick={onRetryFolders}>
                  Retry
                </Button>
              </div>
            )}
            {!isLoadingFolders &&
              folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`flex items-center hover:bg-gray-100 justify-between px-4 py-0.5 cursor-pointer transition-colors ${
                    selectedFolderId === folder.id && "bg-[#D0D0FD]"
                  }`}
                >
                  <div className="flex text-[#5F5FE1] items-center gap-3">
                    <Folder strokeWidth={3} fill="currentColor" size={20} />
                    <p className="text-sm  font-medium">{folder.name}</p>
                  </div>
                  <ChevronRightIcon
                    size={14}
                    className="text-[#344054] font-medium"
                  />
                </div>
              ))}

            {isLoadingFolders && (
              <p className="px-4 py-2 text-sm text-[#667085]">
                Loading folders…
              </p>
            )}

            {/* New folder input */}
            {isCreatingFolder && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t">
                <FolderPlus
                  strokeWidth={3}
                  fill="currentColor"
                  size={20}
                  className="text-[#5F5FE1]"
                />
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") {
                      setIsCreatingFolder(false);
                      setNewFolderName("");
                    }
                  }}
                  placeholder="Folder name"
                  autoFocus
                  className="flex-1 text-sm font-medium px-2 py-1 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#7141f8]"
                />
                <Button
                  size="sm"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="bg-[#7141f8] text-white px-3 py-1 text-xs hover:bg-[#7141f8]/90"
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }}
                  className="text-xs px-3 py-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {totalFolderPages > 1 && (
            <div className="mt-3 flex items-center justify-between text-sm text-[#344054]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeFolderPage(currentFolderPage - 1)}
                disabled={isLoadingFolders || currentFolderPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {currentFolderPage} of {totalFolderPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeFolderPage(currentFolderPage + 1)}
                disabled={
                  isLoadingFolders || currentFolderPage === totalFolderPages
                }
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row w-full !justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setIsCreatingFolder(true)}
            disabled={isCreatingFolder}
            className="text-[#5F5FE1] border border-[#D0D5DD] rounded-lg p-3 flex items-center gap-2 hover:text-[#7141f8] transition-colors disabled:opacity-50"
          >
            <FolderPlus size={16} />
            <span className="text-sm font-medium">New folder</span>
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border rounded-lg px-6 py-3 text-[#344054] border-[#D0D5DD] hover:bg-gray-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleMove}
              disabled={!selectedFolderId || isLoadingFolders}
              className="bg-[#7141f8] text-white px-6 py-2 hover:bg-[#7141f8]/90 disabled:bg-[#D0D5DD] disabled:text-[#98A2B3] disabled:cursor-not-allowed"
            >
              Move
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveFileModal;
