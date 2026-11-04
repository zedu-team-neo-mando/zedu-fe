"use client";
import React, { useEffect, useState, useContext, useCallback } from "react";
import SettingsLabel from "../../components/settings-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import InviteModal from "../../../_components/user-management/invite-modal";
import MembersTable from "../../../_components/user-management/members-table";
import InviteTable from "../../../_components/user-management/invite-table";
import { DataContext } from "~/store/GlobalState";
import { GetRequest } from "~/utils/new-request";
import { RequirePermission } from "~/components/rbac/RequirePermission";
import {
  buildOrganisationInvitesUrl,
  buildOrganisationUsersUrl,
} from "./search-urls";

const Page = () => {
  const { state } = useContext(DataContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [membersData, setMembersData] = useState<any[]>([]);
  const [membersPage, setMembersPage] = useState(1);
  const [membersTotalPages, setMembersTotalPages] = useState(0);
  const [membersTotalItems, setMembersTotalItems] = useState(0);
  const [membersSearch, setMembersSearch] = useState("");
  const [membersRole, setMembersRole] = useState("");
  const [isMembersLoading, setIsMembersLoading] = useState(false);

  const [invitesData, setInvitesData] = useState<any[]>([]);
  const [invitesPage, setInvitesPage] = useState(1);
  const [invitesTotalPages, setInvitesTotalPages] = useState(0);
  const [invitesTotalItems, setInvitesTotalItems] = useState(0);
  const [invitesSearch, setInvitesSearch] = useState("");
  const [invitesRole, setInvitesRole] = useState("");
  const [isInvitesLoading, setIsInvitesLoading] = useState(false);

  const limit = 20;

  const getOrganisationUsers = useCallback(async () => {
    const orgId = localStorage.getItem("orgId");
    if (!orgId) return;
    setIsMembersLoading(true);

    const url = buildOrganisationUsersUrl(orgId, {
      page: membersPage,
      limit,
      search: membersSearch,
      role: membersRole || undefined,
    });

    const response = await GetRequest(url);
    if (response?.status === 200 || response?.status === 201) {
      setMembersData(response?.data?.data);
      setMembersTotalPages(response?.data?.pagination?.total_pages || 0);
      setMembersTotalItems(response?.data?.pagination?.total_items || 0);
    }
    setIsMembersLoading(false);
  }, [membersPage, membersSearch, membersRole]);

  const getOrganisationInvites = useCallback(async () => {
    const orgId = localStorage.getItem("orgId");
    if (!orgId) return;
    setIsInvitesLoading(true);

    const url = buildOrganisationInvitesUrl(orgId, {
      page: invitesPage,
      limit,
      search: invitesSearch,
      role: invitesRole || undefined,
    });

    const response = await GetRequest(url);
    if (response?.status === 200 || response?.status === 201) {
      const allInvites = response?.data?.data || [];
      const invitedOnly = allInvites.filter(
        (item: any) => item.status === "invited"
      );
      setInvitesData(invitedOnly);
      setInvitesTotalPages(response?.data?.pagination?.total_pages || 0);
      setInvitesTotalItems(invitedOnly.length);
    }
    setIsInvitesLoading(false);
  }, [invitesPage, invitesSearch, invitesRole]);

  useEffect(() => {
    getOrganisationUsers();
  }, [getOrganisationUsers, state.orgCallback]);

  useEffect(() => {
    getOrganisationInvites();
  }, [getOrganisationInvites, state.orgCallback]);

  const handleInviteSuccess = (newInvites: any[]) => {
    setInvitesData((prev) => [...newInvites, ...prev]);
  };

  const handleMemberRoleUpdated = (memberId: string, roleName: string) => {
    setMembersData((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role: roleName } : member
      )
    );
  };

  return (
    <div>
      <SettingsLabel />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSuccess={handleInviteSuccess}
      />
      <div className="p-4 lg:px-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-base font-semibold">Your Team</h1>
            <p className="text-sm text-[#344054]">
              Manage all members of your team.
            </p>
          </div>
          <RequirePermission permission="invite:members">
            <Button
              className="px-4 py-2 bg-[#7141F8] text-white rounded-md hover:bg-[#7141F8]/80 transition-colors"
              onClick={() => setIsInviteModalOpen(true)}
            >
              Invite People
            </Button>
          </RequirePermission>
        </div>

        <Tabs defaultValue="members" className="w-full mt-6">
          <div className="border-b border-gray-200">
            <TabsList className="flex w-fit bg-transparent rounded-none h-auto p-0 space-x-10">
              <TabsTrigger
                value="members"
                className="bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none py-3 px-0 flex items-center gap-2"
              >
                Members
                <div className="rounded-full bg-[#F2F4F7] text-[#5757CD] text-xs px-2 py-1">
                  {membersTotalItems}
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="invites"
                className="bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none py-3 px-0 flex items-center gap-2"
              >
                Invites
                <div className="rounded-full bg-[#F2F4F7] text-[#5757CD] text-xs px-2 py-1">
                  {invitesTotalItems}
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="members" className="mt-6">
            <MembersTable
              membersData={membersData}
              isLoading={isMembersLoading}
              onSearchChange={(val) => {
                setMembersSearch(val);
                setMembersPage(1);
              }}
              onRoleChange={(val) => {
                setMembersRole(val);
                setMembersPage(1);
              }}
              onMemberRoleUpdated={handleMemberRoleUpdated}
              pagination={{
                pageIndex: membersPage - 1,
                pageSize: limit,
                pageCount: membersTotalPages,
                setPage: (i) => setMembersPage(i + 1),
                setPageSize: () => {},
              }}
            />
          </TabsContent>

          <TabsContent value="invites" className="mt-6">
            <InviteTable
              invitesData={invitesData}
              isLoading={isInvitesLoading}
              onSearchChange={(val) => {
                setInvitesSearch(val);
                setInvitesPage(1);
              }}
              onRoleChange={(val) => {
                setInvitesRole(val);
                setInvitesPage(1);
              }}
              pagination={{
                pageIndex: invitesPage - 1,
                pageSize: limit,
                pageCount: invitesTotalPages,
                setPage: (i) => setInvitesPage(i + 1),
                setPageSize: () => {},
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
