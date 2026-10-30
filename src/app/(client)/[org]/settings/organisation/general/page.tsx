"use client";
import { useContext, useState } from "react";
import { Edit2Icon } from "lucide-react";
import SettingsLabel from "../../components/settings-label";
import DeleteAccount from "./components/delete-account";
import { DataContext } from "~/store/GlobalState";
import { getInitials } from "~/utils/utils";
import { getCountryName } from "~/utils/country-name";
import EditOrganisationDialog from "../../../_components/edit-profile-modal/organisation";
import { RequirePermission } from "~/components/rbac/RequirePermission";

const AccountPage = () => {
  const [profileDialog, setProfileDialog] = useState(false);
  const { state } = useContext(DataContext);
  const { orgData } = state;

  return (
    <div className="">
      <SettingsLabel />
      <div className="p-4 lg:px-8">
        <div className="mb-4">
          <h1 className="text-base font-semibold">
            Your Organisation Information
          </h1>
          <p className="text-sm text-[#344054]">
            Manage your organisation's details.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* first profile */}
          <div className="border rounded-xl p-4 w-full md:flex-1 relative">
            <RequirePermission permission="manage:organization">
              <div
                className="border absolute top-4 right-4 p-2 rounded-md cursor-pointer"
                onClick={() => setProfileDialog(true)}
              >
                <Edit2Icon className="w-5 h-5" />
              </div>
            </RequirePermission>

            <div className="h-24 w-24 md:h-36 md:w-36 mx-auto md:mx-0 border rounded-xl bg-[#F2F4F7] flex items-center justify-center">
              {orgData?.logo_url ? (
                <img
                  src={orgData?.logo_url}
                  alt="organisation logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full object-cover rounded-xl flex items-center justify-center text-xl md:text-3xl text-blue-200 font-bold">
                  {getInitials(orgData?.name)}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm text-[#475467]">Name</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm md:text-[16px]">{orgData?.name}</p>
                  <div className="w-2 h-2 rounded-full bg-[#D9D9D9]"></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm text-[#475467]">Nature of Business</h3>
                <p className="capitalize text-sm md:text-base">
                  {orgData?.type}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm text-[#475467]">Country</h3>
                <p className="capitalize text-sm md:text-base">
                  {getCountryName(orgData?.country)}
                </p>
              </div>
            </div>
          </div>

          {/* Email and number section */}
          <div className="w-full md:flex-1"></div>
        </div>

        <RequirePermission permission="manage:organization">
          <DeleteAccount />
        </RequirePermission>
      </div>

      <EditOrganisationDialog
        isOpen={profileDialog}
        onClose={() => setProfileDialog(false)}
      />
    </div>
  );
};

export default AccountPage;
