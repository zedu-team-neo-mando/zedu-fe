"use client";
import { useState } from "react";
import { DeleteRequest } from "~/utils/new-request";
import { isAxiosError } from "axios";
import { showError, showSuccess } from "~/components/toast/sonner";

// DeleteRequest catches request errors and returns the AxiosError instead of
// throwing, and it already toasts the server's message. Only show our own
// toast when there is no server message to show (e.g. a network error).
const hasServerMessage = (response: unknown) =>
  isAxiosError<{ message?: string }>(response) &&
  Boolean(response.response?.data?.message);

export const useDeleteFolder = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteFolder = async (folderId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await DeleteRequest(`/files/folders/${folderId}`);

      if (response?.status === 200 || response?.status === 201) {
        showSuccess(response.data.message || "Folder deleted successfully");
        return true;
      }

      if (!hasServerMessage(response)) {
        showError("An error occurred while deleting the folder.");
      }
      return false;
    } catch {
      showError("An error occurred while deleting the folder.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteFolder, isLoading };
};
