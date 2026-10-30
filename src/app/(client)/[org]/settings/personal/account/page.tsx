"use client";
import { useContext, useMemo, useState } from "react";
import { Edit2Icon } from "lucide-react";
import SettingsLabel from "../../components/settings-label";
import DeleteAccount from "./components/delete-account";
import EditProfileDialog from "../../../_components/edit-profile-modal";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { getUserStatus } from "~/utils/user-status";
import images from "~/assets/images";
import Image from "next/image";

const AccountPage = () => {
  const [profileDialog, setProfileDialog] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const status = useMemo(() => getUserStatus(user), [user]);

  return (
    <div className="min-h-screen">
      <SettingsLabel />
      <div className="p-4 lg:px-8">
        <div className="mb-4">
          <h1 className="text-base font-semibold">Your Account Information</h1>
          <p className="text-sm text-[#344054]">
            Manage your account data with ease.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* first profile */}
          <div className="border rounded-xl p-4 w-full md:flex-1 relative">
            <div
              className="border absolute top-4 right-4 p-2 rounded-md cursor-pointer"
              onClick={() => setProfileDialog(true)}
            >
              <Edit2Icon className="w-5 h-5" />
            </div>
            <div className="mx-auto md:mx-0 h-28 w-28 md:h-36 md:w-36 border rounded-xl bg-[#F2F4F7] flex items-center justify-center">
              <Image
                src={user?.avatar_url || images?.user}
                alt="account logo"
                className="w-full h-full object-cover rounded-xl object-top"
                height={100}
                width={100}
              />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm text-[#475467]">Name</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="break-all capitalize">
                    {user?.display_name || user?.full_name}
                  </p>
                  {user?.username && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#D9D9D9]"></div>
                      <span className="text-[#667085] break-all">
                        @{user.username.replace(/\s/g, "_")}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {user?.title && (
                <div className="space-y-2">
                  <h3 className="text-sm text-[#475467]">Title</h3>
                  <p className="break-all">{user?.title}</p>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm text-[#475467]">Status</h3>
                {status ? (
                  <div className="flex items-center gap-2 break-all">
                    {status.emoji ? (
                      <span className="text-base leading-none">
                        {status.emoji}
                      </span>
                    ) : null}
                    {status.text ? <p>{status.text}</p> : null}
                  </div>
                ) : (
                  <p className="text-[#667085]">No status set</p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: ACTIONS.STATUS, payload: true })
                  }
                  className="text-sm font-medium text-[#6868F7] hover:underline"
                >
                  {status ? "Update status" : "Set a status"}
                </button>
              </div>

              {user?.timezone && (
                <div className="space-y-2">
                  <h3 className="text-sm text-[#475467]">Time Zone</h3>
                  <p className="break-all">{user?.timezone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Email and number section */}
          <div className="border rounded-xl p-4 w-full md:flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2 w-full">
                <h3 className="text-sm text-[#475467]">Email Address</h3>
                <p className="break-all">{user?.email}</p>
              </div>
            </div>

            {user?.phone && (
              <div className="flex items-center justify-between">
                <div className="space-y-2 w-full">
                  <h3 className="text-sm text-[#475467]">Phone Number</h3>
                  <p className="break-all">{user?.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DeleteAccount />
      </div>

      <EditProfileDialog
        isOpen={profileDialog}
        onClose={() => setProfileDialog(false)}
      />
    </div>
  );
};

export default AccountPage;
