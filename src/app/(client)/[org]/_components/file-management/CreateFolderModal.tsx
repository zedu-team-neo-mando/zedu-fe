"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { FolderPlus, X } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [folderName, setFolderName] = useState("");
  const trimmedName = folderName.trim();
  const canCreate = trimmedName.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;

    onCreate(trimmedName);
    setFolderName("");
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFolderName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-6 sm:max-w-[512px]">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f3f1ff]">
            <FolderPlus className="size-5 text-[#7141f8]" strokeWidth={2} />
          </div>
          <DialogTitle className="flex-1 text-lg font-semibold tracking-[-0.01em] text-[#101828]">
            Create new folder
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Close"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141f8]"
            >
              <X className="size-[18px]" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="mt-5">
          <label
            htmlFor="folderName"
            className="mb-2 block text-sm font-medium text-[#344054]"
          >
            Folder name
          </label>
          <Input
            id="folderName"
            placeholder="e.g. Course materials"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreate();
              }
            }}
            autoFocus
            aria-describedby="create-folder-helper"
            className="h-10 border-[#d0d5dd] px-3 focus-visible:border-[#7141f8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7141f8]/10"
          />
          <DialogDescription
            id="create-folder-helper"
            className="mt-1.5 text-xs leading-[17px] text-[#667085]"
          >
            Use a short, descriptive name. You can rename it later.
          </DialogDescription>
        </div>

        <DialogFooter className="mt-6 gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[#d0d5dd] text-[#344054]"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={!canCreate}
            className="h-10 bg-[#7141f8] text-white hover:bg-[#7141f8]/90"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderModal;
