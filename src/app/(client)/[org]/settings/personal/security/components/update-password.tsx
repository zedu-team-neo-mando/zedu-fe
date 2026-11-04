"use client";
import React, { FormEvent, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PutRequest } from "~/utils/new-request";
import { showError, showSuccess } from "~/components/toast/sonner";
import Loading from "~/components/ui/loading";
import {
  PASSWORD_HINT,
  PASSWORD_TOO_SHORT_MESSAGE,
  isPasswordTooShort,
} from "~/lib/password";
const UpdatePassword = () => {
  const [open, setOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canSubmit =
    oldPassword !== "" && newPassword !== "" && confirmPassword !== "";

  const handleSaveNewPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (isPasswordTooShort(newPassword)) {
      setNewPasswordError(PASSWORD_TOO_SHORT_MESSAGE);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Password does not match");
      return;
    }

    setButtonLoading(true);

    const payload = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    const res = await PutRequest("/auth/change-password", payload);
    if (res.status === 200 || res.status === 201) {
      showSuccess(res?.data?.message);
      setOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setButtonLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="border px-4 py-2 rounded-md text-sm">
          Change Password
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between border-b p-4 text-[#1D2939] text-xl font-black">
            <h2 className="text-xl font-semibold ">Update password</h2>

            <X
              className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointers border"
              onClick={() => {
                setOpen(false);
              }}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="">
          <form className="space-y-5 p-6" onSubmit={handleSaveNewPassword}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  placeholder="*********"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide old password" : "Show old password"
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="new-password"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  placeholder="*********"
                  type={showNewPassword ? "text" : "password"}
                  aria-describedby="new-password-help"
                  aria-invalid={Boolean(newPasswordError)}
                  autoComplete="new-password"
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewPasswordError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p
                id="new-password-help"
                className={`mt-1 text-xs ${
                  newPasswordError ? "text-red-500" : "text-gray-500"
                }`}
              >
                {newPasswordError || PASSWORD_HINT}
              </p>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  placeholder="*********"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password confirmation"
                      : "Show password confirmation"
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              <strong>Note:</strong> You would need to login again to effect
              this change.{" "}
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`flex items-center gap-2 px-4 py-2 rounded-md  text-white ${
                  canSubmit
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Save Changes
                {buttonLoading && <Loading />}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePassword;
