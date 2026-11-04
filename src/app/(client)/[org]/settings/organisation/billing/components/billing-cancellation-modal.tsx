import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface BillingCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;

  onCancel: (password: string, isAdminConfirmed: boolean) => void;
  isUnSubscribing: boolean;
}

const BillingCancellationModal: React.FC<BillingCancellationModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  isUnSubscribing,
}) => {
  const [step, setStep] = useState<"initial" | "confirmation">("initial");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminConfirmed, setIsAdminConfirmed] = useState(false);

  const handleNext = () => {
    setStep("confirmation");
  };

  const handleCancel = () => {
    if (password && isAdminConfirmed) {
      onCancel(password, isAdminConfirmed);
      // Reset state
      setStep("initial");
      setPassword("");
      setIsAdminConfirmed(false);
      setShowPassword(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state when closing
    setStep("initial");
    setPassword("");
    setIsAdminConfirmed(false);
    setShowPassword(false);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-sm bg-black/10">
        <DialogContent className="sm:max-w-2xl p-0 space-0 gap-0">
          <DialogHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Cancel Zedu Starter Subscription
              </DialogTitle>
              <DialogClose className="text-gray-400 hover:text-gray-600 transition-colors border p-1 rounded-md">
                <X size={20} color="#344054" />
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="px-6 py-4">
            {step === "initial" ? (
              <>
                <p className="text-gray-700 text-sm leading-relaxed mb-8">
                  You are about to cancel your subscription to Zedu Starter.
                  Please note that you will be moved to the Zedu Starter Plan
                  after your billing period expires on{" "}
                  {new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  .
                </p>
                <div className="w-full h-10"></div>
                <div className="border-t pt-4">
                  <p className="text-gray-500 text-sm">
                    <span className="font-medium text-black">Note:</span> You
                    can always come back when you need more space.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isAdminConfirmed}
                      onChange={(e) => setIsAdminConfirmed(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 text-sm mt-1">
                      I confirm that this action is being carried out by an
                      admin.
                    </span>
                  </label>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-500 text-sm">
                    <span className="font-medium">Note:</span> You can always
                    come back when you need more space.
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex justify-end space-x-3 pb-6 px-6">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-6 py-2 h-fit"
            >
              Close
            </Button>
            {step === "initial" ? (
              <Button
                onClick={handleNext}
                className="px-6 py-2 h-fit w-fit bg-gradient-to-b from-[#8860f8] to-[#7141f8] hover:opacity-90 text-white rounded-sm font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCancel}
                disabled={!password || !isAdminConfirmed || isUnSubscribing}
                variant="destructive"
                className="px-6 py-2"
              >
                {isUnSubscribing
                  ? "Cancelling"
                  : "Cancel Zedu Starter Subscription"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default BillingCancellationModal;
