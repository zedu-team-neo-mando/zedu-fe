import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { X, Check } from "lucide-react";

interface StorageOffloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StorageOffloadModal: React.FC<StorageOffloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-sm bg-black/10">
        <DialogContent className="sm:max-w-2xl bg-white rounded-lg shadow-xl border-0 p-0 overflow-hidden">
          <div className="relative">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Offload Space to Cancel Zedu Starter Subscription
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className=" p-1 rounded-md border hover:bg-gray-100"
                >
                  <X size={20} color="#344054" />
                </Button>
              </div>
            </DialogHeader>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Before you can cancel your subscription, your used storage
                  space should be{" "}
                  <span className="font-semibold">under 10GB</span> as you will
                  be downgraded to the Zedu Starter Plan. Please clear out
                  unnecessary chats to offload your organisational space.
                </p>

                <div className="border-b pb-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Here is what your storage contains:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        your organisational biodata{" "}
                        <span className="text-gray-500">(1GB)</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        organisation-wide chat history{" "}
                        <span className="text-gray-500">(20GB)</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        files shared within your organisation{" "}
                        <span className="text-gray-500">(3.5GB)</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        agent data within your organisation{" "}
                        <span className="text-gray-500">(3.3GB)</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className=" rounded-md">
                  <p className="text-xs text-[#667085]">
                    <span className="font-medium text-black">Note:</span> This
                    is to ensure that you have what you need if you decide to
                    subscribe again.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="px-4 py-2 h-fit text-sm text-[#344054] font-medium border-gray-300 hover:bg-gray-50"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default StorageOffloadModal;
