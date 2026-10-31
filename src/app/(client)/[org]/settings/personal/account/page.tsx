"use client";
import { useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Edit2Icon } from "lucide-react";
import SettingsLabel from "../../components/settings-label";
import DeleteAccount from "./components/delete-account";
import EditProfileDialog from "../../../_components/edit-profile-modal";
import StatusModal from "../../../_components/status";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { getUserStatus } from "~/utils/user-status";
import images from "~/assets/images";
import Image from "next/image";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5F5FE1] focus-visible:ring-offset-2";
const ACTION_LINK = `inline-flex min-h-10 items-center rounded-md px-2 text-sm font-medium text-[#5F5FE1] hover:underline ${FOCUS_RING}`;

interface DetailRowProps {
  label: string;
  children: ReactNode;
  action?: ReactNode;
}

const DetailRow = ({ label, children, action }: DetailRowProps) => (
  <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 px-4 py-2 sm:grid-cols-[160px_1fr_auto] sm:px-6">
    <dt className="col-span-2 text-sm font-medium text-[#475467] sm:col-span-1">
      {label}
    </dt>
    <dd className="flex min-h-10 min-w-0 items-center break-words">
      {children}
    </dd>
    {action ? <dd>{action}</dd> : null}
  </div>
);
const NotSet = () => <span className="text-[#667085]">Not set</span>;

const AccountPage = () => {
  const [profileDialog, setProfileDialog] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const status = useMemo(() => getUserStatus(user), [user]);
  const orgName = state?.orgData?.name;
  const displayName = user?.display_name || user?.full_name;
  const username = user?.username?.replace(/\s/g, "_");

  const openProfileDialog = () => setProfileDialog(true);
  const openStatusModal = () =>
    dispatch({ type: ACTIONS.STATUS, payload: true });

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <SettingsLabel />
      <div className="mx-auto w-full max-w-[800px] p-5 pb-8 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#020817]">Account</h2>
          <p className="mt-1 text-sm text-[#475467]">
            Manage how you appear to others and your sign-in details.
          </p>
        </div>

        {/* Profile card */}
        <section
          aria-labelledby="profile-heading"
          className="rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border bg-[#F2F4F7]">
              <Image
                src={user?.avatar_url || images?.user}
                alt="Your profile photo"
                className="h-full w-full object-cover object-top"
                height={100}
                width={100}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                id="profile-heading"
                className="break-words text-xl font-bold capitalize text-[#020817]"
              >
                {displayName || "Not set"}
              </h3>
              {username && (
                <p className="break-all text-sm text-[#667085]">@{username}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openProfileDialog}
                className={`min-h-[44px] rounded-md border border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#101828] hover:bg-[#F9FAFB] ${FOCUS_RING}`}
              >
                Change photo
              </button>
              <button
                type="button"
                onClick={openProfileDialog}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#5F5FE1] px-4 text-sm font-medium text-white hover:opacity-90 ${FOCUS_RING}`}
              >
                <Edit2Icon className="h-4 w-4" aria-hidden="true" />
                Edit profile
              </button>
            </div>
          </div>
        </section>

        {/* Personal details card */}
        <section
          aria-labelledby="details-heading"
          className="mt-4 overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white"
        >
          <h3
            id="details-heading"
            className="border-b border-[#E4E7EC] px-4 py-4 text-base font-bold text-[#020817] sm:px-6"
          >
            Personal details
          </h3>
          <dl className="divide-y divide-[#E4E7EC]">
            <DetailRow
              label="Display name"
              action={
                <button
                  type="button"
                  onClick={openProfileDialog}
                  aria-label="Edit display name"
                  className={ACTION_LINK}
                >
                  Edit
                </button>
              }
            >
              {displayName ? (
                <span className="capitalize">{displayName}</span>
              ) : (
                <NotSet />
              )}
            </DetailRow>

            {username && (
              <DetailRow label="Username">
                <span className="break-all">@{username}</span>
              </DetailRow>
            )}

            <DetailRow
              label="Title"
              action={
                <button
                  type="button"
                  onClick={openProfileDialog}
                  aria-label="Edit title"
                  className={ACTION_LINK}
                >
                  Edit
                </button>
              }
            >
              {user?.title ? (
                <span className="break-all">{user.title}</span>
              ) : (
                <NotSet />
              )}
            </DetailRow>

            <DetailRow label="Email address">
              {user?.email ? (
                <span className="break-all">{user.email}</span>
              ) : (
                <NotSet />
              )}
            </DetailRow>

            <DetailRow
              label="Phone number"
              action={
                <button
                  type="button"
                  onClick={openProfileDialog}
                  aria-label="Edit phone number"
                  className={ACTION_LINK}
                >
                  Edit
                </button>
              }
            >
              {user?.phone ? (
                <span className="break-all">{user.phone}</span>
              ) : (
                <NotSet />
              )}
            </DetailRow>

            <DetailRow
              label="Status"
              action={
                <button
                  type="button"
                  onClick={openStatusModal}
                  className={ACTION_LINK}
                >
                  {status ? "Update status" : "Set a status"}
                </button>
              }
            >
              {status ? (
                <span className="flex items-center gap-2 break-all">
                  {status.emoji ? (
                    <span className="text-base leading-none">
                      {status.emoji}
                    </span>
                  ) : null}
                  {status.text ? <span>{status.text}</span> : null}
                </span>
              ) : (
                <span className="text-[#667085]">No status set</span>
              )}
            </DetailRow>

            <DetailRow
              label="Time zone"
              action={
                <button
                  type="button"
                  onClick={openProfileDialog}
                  aria-label="Edit time zone"
                  className={ACTION_LINK}
                >
                  Edit
                </button>
              }
            >
              {user?.timezone ? (
                <span className="break-all">{user.timezone}</span>
              ) : (
                <NotSet />
              )}
            </DetailRow>
          </dl>
        </section>

        {/* Leave organisation card */}
        <section
          aria-labelledby="leave-heading"
          className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#F4C7C3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div>
            <h3
              id="leave-heading"
              className="text-base font-bold text-[#B42318]"
            >
              Leave organisation
            </h3>
            <p className="mt-1 text-sm text-[#475467]">
              You will lose access to the channels, messages and files in{" "}
              {orgName ?? "this organisation"}.
            </p>
          </div>
          <div className="[&>button]:mt-0">
            <DeleteAccount />
          </div>
        </section>
      </div>

      <EditProfileDialog
        isOpen={profileDialog}
        onClose={() => setProfileDialog(false)}
      />
      <StatusModal />
    </div>
  );
};

export default AccountPage;
