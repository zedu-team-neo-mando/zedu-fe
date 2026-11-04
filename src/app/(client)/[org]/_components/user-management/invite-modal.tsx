import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { X, LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import InviteFew from "./invite-few";
import InviteMany from "./invite-many";
import { DataContext } from "~/store/GlobalState";
import { GetRequest, PostRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import { showError, showSuccess } from "~/components/toast/sonner";
import { ACTIONS } from "~/store/Actions";

interface StorageOffloadModalProps {
  isOpen: boolean;
  onClose: () => void;

  onInviteSuccess: (invitedUsers: any[]) => void;
}
interface User {
  id: string;
  email: string;
  role: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  organisation_id: string | null;
  is_default: boolean;
  permissions: {
    id: string;
    role_id: string;
    permission_list: Record<string, boolean>;
    is_default: boolean;
  };
}

export interface InviteUser {
  email: string;
  role: string;
}

const InviteModal: React.FC<StorageOffloadModalProps> = ({
  isOpen,
  onClose,
  onInviteSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("invite-few");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([
    { id: "1", email: "", role: "" },
  ]);
  const [emails, setEmails] = useState<string[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [inviteFewUsers, setInviteFewUsers] = useState<InviteUser[]>([]);
  const [toggleLoading, setToggleLoading] = useState(false);

  const { state, dispatch } = useContext(DataContext);
  const { orgId, orgRoles, orgData } = state;
  const [isLinkEnabled, setIsLinkEnabled] = useState(
    orgData?.invite_link_status === "enabled" ? true : false
  );

  const createOptimisticInvites = (emails: string[], roleName: string) => {
    return emails.map((email) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      email,
      username: "",
      phone_number: "",
      profile_url: "",
      name: "",
      role: roleName,
      status: "invited" as const,
      created_at: new Date().toISOString(),
      entity_type: "user" as const,
    }));
  };

  const handleToggleInviteLink = async () => {
    if (!orgId) return;
    setToggleLoading(true);
    const payload = {
      status: !isLinkEnabled,
    };
    try {
      const res = await PostRequest("/invite/general/change-status", payload);
      if (res?.status === 200 || res?.status === 201) {
        dispatch({
          type: ACTIONS.PROFILE_CALLBACK,
          payload: !state?.profileCallback,
        });
        setIsLinkEnabled(!isLinkEnabled);
        showSuccess(
          `Invite link ${!isLinkEnabled ? "enabled" : "disabled"} successfully`
        );
      } else {
        showError("Failed to update invite link status");
      }
    } catch (error) {
      console.error(error);
      showError("An error occurred");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!orgId) return;
    if (!isLinkEnabled) {
      showError("The invite link is currently disabled");
      return;
    }

    const payload = {
      organisation_id: orgId,
      role_id: roleId,
    };

    try {
      const res = await PostRequest("/invite/general", payload);

      if (res?.status === 200 || res?.status === 201) {
        const link = res?.data?.data?.invitation_link;
        await navigator.clipboard.writeText(link);
        showSuccess("Invite link copied to clipboard");
      } else {
        showError("Failed to generate invite link");
      }
    } catch (error) {
      console.error(error);
      showError("An error occurred while copying the invite link");
    }
  };

  const handleSubmitFewInvite = async () => {
    if (!orgId || !roleId) return;

    setButtonLoading(true);

    const payload = {
      org_id: orgId,
      invitations: inviteFewUsers,
    };

    const res = await PostRequest("/invite/invite-few", payload);
    if (res?.status === 200 || res?.status === 201) {
      showSuccess(res?.data?.message);

      if (onInviteSuccess) {
        const optimisticInvites = inviteFewUsers.map((user) => {
          const matchedRole = roles?.find(
            (role) => role.id === user.role || role.name === user.role
          );
          const roleName = matchedRole?.name || user.role || "User";
          return {
            id: `temp-${Date.now()}-${Math.random()}`,
            email: user.email,
            username: "",
            phone_number: "",
            profile_url: "",
            name: "",
            role: roleName,
            status: "invited" as const,
            created_at: new Date().toISOString(),
            entity_type: "user" as const,
          };
        });
        onInviteSuccess(optimisticInvites);
      }

      onClose();
    }
    setButtonLoading(false);
  };

  const handleSubmitManyInvite = async () => {
    if (!orgId || !roleId) return;

    setButtonLoading(true);

    const payload = {
      org_id: orgId,
      emails: emails,
      role_id: roleId,
    };

    const res = await PostRequest("/invite", payload);
    if (res?.status === 200 || res?.status === 201) {
      showSuccess(res?.data?.message);

      if (onInviteSuccess) {
        const roleName =
          roles?.find((role) => role.id === roleId)?.name || "User";
        const optimisticInvites = createOptimisticInvites(emails, roleName);
        onInviteSuccess(optimisticInvites);
      }

      onClose();
    }

    setButtonLoading(false);
  };

  useEffect(() => {
    setRoles(orgRoles);
    const roleuser = orgRoles?.find((item: Role) => item?.name === "User");
    setRoleId(roleuser?.id);
    if (!isOpen) return;
    // Show the cached status straight away so the toggle does not flash off,
    // then confirm it with the server, since another admin may have changed it.
    setIsLinkEnabled(orgData?.invite_link_status === "enabled");
    if (!orgId) return;
    let active = true;
    GetRequest(`/invite/general/status/${orgId}`)
      .then((res) => {
        if (active && (res?.status === 200 || res?.status === 201)) {
          setIsLinkEnabled(res?.data?.data?.status);
        }
      })
      .catch((error) => console.error(error));
    return () => {
      active = false;
    };
  }, [orgId, isOpen, orgRoles, orgData?.invite_link_status]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-sm bg-black/10">
        <DialogContent className="sm:max-w-2xl bg-white rounded-lg shadow-xl border-0 p-0 overflow-hidden">
          <div className="relative">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Invite Your Team
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

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full mt-0"
            >
              <div className="border-b px-6 border-gray-200">
                <TabsList className="flex w-fit bg-white rounded-none h-auto p-0 space-x-10">
                  <TabsTrigger
                    value="invite-few"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-black rounded-none py-3 px-0 font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  >
                    Invite Few
                  </TabsTrigger>
                  <TabsTrigger
                    value="invite-many"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-black rounded-none py-3 px-0 font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                    data-testid="invite-many-tab"
                  >
                    Invite Many
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="invite-few" className="mt-6">
                <InviteFew
                  users={users}
                  setUsers={setUsers}
                  roles={roles}
                  onUsersChange={setInviteFewUsers}
                />
              </TabsContent>

              <TabsContent value="invite-many" className="mt-6">
                <div
                  style={{ maxHeight: 320, overflowY: "auto" }}
                  className="invite-many-scroll px-1"
                >
                  <InviteMany emails={emails} setEmails={setEmails} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex  justify-between items-center px-4 mt-4">
              <div className="w-full h-[0.5px] bg-[#D6DAE0] !mt-0" />
            </div>

            <div className="!mt-0 p-4">
              {activeTab === "invite-few" ? (
                <>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-black">Note:</span> You
                    can also copy the invite link to invite members of your team
                    as <span className="font-semibold text-black">"Users"</span>{" "}
                    and give them basic access.
                  </p>
                </>
              ) : (
                <>
                  {" "}
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-black">Note:</span> This
                    automatically invites all members as{" "}
                    <span className="font-semibold text-black">"Users"</span>{" "}
                    and gives them basic access. Copying the invite link to
                    share also does this.
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 !mt-0 px-4 pb-4">
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  className="h-9 border border-[#7141F8]/40 w-full sm:w-auto"
                  onClick={handleCopyInviteLink}
                  disabled={!isLinkEnabled}
                >
                  <LinkIcon
                    size={16}
                    color={isLinkEnabled ? "#7141F8" : "#98A2B3"}
                  />
                  <span
                    className={
                      isLinkEnabled
                        ? "ml-2 text-[#7141F8]"
                        : "ml-2 text-[#98A2B3]"
                    }
                  >
                    Copy invite link
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className={`h-9 border w-full sm:w-auto ${isLinkEnabled ? "border-red-500" : "border-green-500"}`}
                  onClick={handleToggleInviteLink}
                  disabled={toggleLoading}
                >
                  <LinkIcon size={16} color={isLinkEnabled ? "red" : "green"} />
                  <span
                    className={`ml-2 ${isLinkEnabled ? "text-red-500" : "text-green-500"}`}
                  >
                    {toggleLoading
                      ? "Processing..."
                      : isLinkEnabled
                        ? "Disable invite link"
                        : "Enable invite link"}
                  </span>
                </Button>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant={"outline"}
                  className="h-9 flex-1 sm:flex-none"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#7141F8] h-9 text-white px-7 gap-3 flex-1 sm:flex-none"
                  disabled={
                    (activeTab === "invite-few" &&
                      !users.some((user) => user.email && user.role)) ||
                    (activeTab === "invite-many" && emails.length === 0) ||
                    buttonLoading
                  }
                  onClick={
                    activeTab === "invite-few"
                      ? handleSubmitFewInvite
                      : handleSubmitManyInvite
                  }
                >
                  Send Invite{" "}
                  {buttonLoading && <Loading width="14" height="14" />}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default InviteModal;
