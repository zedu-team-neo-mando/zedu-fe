import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ChannelDetailsContent } from "./channel-details-content";
import { X } from "lucide-react";

interface ChannelDetailsDialogProps {
  children: React.ReactNode;
  className?: string;
  // Accessible name for the trigger button, e.g. "1,909 members"
  triggerLabel?: string;
}

const ChannelDetailsDialog: React.FC<ChannelDetailsDialogProps> = ({
  children,
  className,
  triggerLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger
        aria-label={triggerLabel}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </DialogTrigger>

      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="p-0 rounded-[0.625rem] w-full sm:max-w-[550px]"
      >
        <DialogClose className="absolute right-5 top-4 text-[#344054] p-1 border border-input rounded-[0.3125rem]">
          <X className="size-5 text-[#344054]" />
        </DialogClose>

        <ChannelDetailsContent setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDetailsDialog;
