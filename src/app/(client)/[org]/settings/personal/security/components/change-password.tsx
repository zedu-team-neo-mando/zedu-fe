import { Eye, EyeOff, X } from "lucide-react";
import React, { FormEvent, useState } from "react";
// import {useRouter} from 'next/navigation'

const ChangePassword = ({
  setChangePasswordDialog,
}: {
  setChangePasswordDialog: Function;
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isContinue, setIsContinue] = useState(false);
  // const router = useRouter();

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = password.length > 0;
  const canSubmit =
    newPassword !== "" && confirmPassword !== "" && passwordsMatch;

  const handlePasswordValidity = (e: FormEvent) => {
    e.preventDefault();

    setIsContinue(true);
  };

  const handleSaveNewPassword = (e: FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      // Logic to change the password
      // Redirect to login page or show success message
      // router.push('/login');
    } else {
      console.error("Passwords do not match or are invalid");
    }
  };

  return (
    <div className="max-w-lg min-w-[450px] mx-auto bg-white shadow-lg rounded-xl border border-purple-300 mt-10 relative">
      <X
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
        onClick={() => setChangePasswordDialog(false)}
      />

      {!isContinue ? (
        <div className="">
          <h2 className="text-xl font-semibold border-b p-4">
            Confirm Current Password
          </h2>

          <form className="space-y-5 p-6" onSubmit={handlePasswordValidity}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  placeholder="*********"
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              <strong>Note:</strong> This helps us confirm your identity.{" "}
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setChangePasswordDialog(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`px-4 py-2 rounded-md  text-white ${
                  isValid
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="">
          <h2 className="text-xl font-semibold border-b p-4">
            Set New Password
          </h2>
          <form className="space-y-5 p-6" onSubmit={handleSaveNewPassword}>
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
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                onClick={() => setChangePasswordDialog(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`px-4 py-2 rounded-md  text-white ${
                  canSubmit
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
