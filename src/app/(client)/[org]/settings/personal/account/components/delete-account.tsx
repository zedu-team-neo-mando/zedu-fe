"use client";
import React, { FormEvent, useContext, useState } from "react";
import { X, CircleCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { DeleteRequest, GetRequest, PutRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import { showError, showSuccess } from "~/components/toast/sonner";
import UseFirstChannel from "~/app/(client)/[org]/home/channels/hooks/first-channel";
import {
  redirectAfterOrgSwitch,
  resolveChannelIdForOrgSwitch,
} from "~/utils/org-switch";

const DeleteAccount = () => {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { firstChannel } = UseFirstChannel();

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    setButtonLoading(true);
    localStorage.removeItem("channelId");
    dispatch({ type: ACTIONS.LOADING, payload: true });

    try {
      const res = await DeleteRequest(`/users/me`);

      if (res?.status !== 200 && res?.status !== 201) {
        showError(res?.data?.message ?? "Failed to leave organisation");
        return;
      }

      showSuccess(res?.data?.message ?? "Left organisation successfully");

      let orgId = res?.data?.data?.user?.current_org;

      if (!orgId) {
        setTimeout(() => { window.location.href = "/"; }, 2500);
        return;
      }

      const slug = res.data.data.user.current_organisation_slug;

      localStorage.setItem("token", res?.data?.data?.access_token);
      localStorage.setItem("orgId", orgId);
      localStorage.setItem("orgSlug", slug);

      window.location.href = `/${slug}`;
    } catch {
      showError("Failed to leave organisation");
    } finally {
      setButtonLoading(false);
      dispatch({ type: ACTIONS.LOADING, payload: false });
    }
  };

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-block py-2 px-4 mt-6 border rounded-[4px] border-[#F81404] text-[#F81404] text-sm font-semibold hover:bg-[#F81404] hover:text-white transition-colors duration-200">
          Leave Organisation
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between border-b p-4 text-[#1D2939] text-xl font-black">
            <h2 className="text-xl font-semibold ">Leave Organisation</h2>

            <X
              className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointers border"
              onClick={handleClick}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-3 space-y-3">
          <h3 className="text-sm font-medium">
            Are you sure you want to leave{" "}
            <span className="text-blue-100 font-medium">
              {state?.orgData?.name}
            </span>
            ? You will lose:
          </h3>
          <div className="border-b pb-4 mb-4 space-y-2 text-sm">
            <p>
              <CircleCheck className="inline mr-2 text-green-500" size={18} />
              Access to this organisation.
            </p>
            <p>
              <CircleCheck className="inline mr-2 text-green-500" size={18} />
              All your chats history.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            <strong>Note:</strong> This action cannot be undone.{" "}
          </p>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClick}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={buttonLoading}
              className="flex items-center justify-center px-4 py-2 rounded text-white font-medium bg-red-600 hover:bg-red-700 disabled:opacity-70"
            >
              Leave Organisation {buttonLoading && <Loading />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccount;
