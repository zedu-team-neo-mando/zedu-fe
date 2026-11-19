"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CombinedInviteInput from "../meeting/combineInput";
import { User, UserItem } from "../meeting/buzz-userItems";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { GetRequest, PostRequest } from "~/utils/new-request";
import { showSuccess, showError } from "~/components/toast/sonner";
import Loading from "~/components/ui/loading";
import { useOrganisationUsers } from "~/hooks/useOrganisationUsers";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  existingParticipants?: { user_id?: string | number }[];
}

const MAX_NEW_MEMBERS = 9;

const mapOrgMemberToUser = (member: any): User => ({
  id: String(member.id ?? member.user_id ?? ""),
  email: member.email ?? "",
  username: member.username ?? "",
  avatar_url: member.avatar_url ?? member.profile_url ?? "",
  default_avatar_url: member.default_avatar_url ?? "",
  name: member.name ?? member.username ?? member.email ?? "",
});

const normalizeParticipants = (
  participants: AddMembersModalProps["existingParticipants"]
): { user_id?: string | number; id?: string | number }[] => {
  if (Array.isArray(participants)) return participants;
  return [];
};

export const AddMembersModal: React.FC<AddMembersModalProps> = ({
  isOpen,
  onClose,
  channelId,
  existingParticipants,
}) => {
  const { state, dispatch } = useContext(DataContext);
  const orgId =
    state.orgId ||
    (typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "");

  const [selected, setSelected] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const submittingRef = useRef(false);

  const {
    loading: usersLoading,
    hasMore,
    loadMore,
    users,
  } = useOrganisationUsers(orgId, { enabled: isOpen, search });

  const orgMembers = useMemo<User[]>(
    () => (users ?? []).map(mapOrgMemberToUser),
    [users]
  );

  const participantList = useMemo(
    () => normalizeParticipants(existingParticipants),
    [existingParticipants]
  );

  const existingParticipantIds = useMemo(() => {
    const ids = new Set<string>();
    for (const p of participantList) {
      const id = p?.user_id ?? p?.id;
      if (id != null) ids.add(String(id));
    }
    return ids;
  }, [participantList]);

  useEffect(() => {
    if (!isOpen) {
      setSelected([]);
      setSearch("");
      setHighlightIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || usersLoading || !hasMore || search.trim()) return;

    const visibleCount = orgMembers.filter((user) => {
      const isSelf = String(user.id) === String(state?.user?.user_id);
      const isAlreadyInGroup = existingParticipantIds.has(String(user.id));
      return !isSelf && !isAlreadyInGroup;
    }).length;

    if (visibleCount === 0) {
      loadMore();
    }
  }, [
    isOpen,
    usersLoading,
    hasMore,
    search,
    orgMembers,
    existingParticipantIds,
    state?.user?.user_id,
    loadMore,
  ]);

  const filteredSuggested = useMemo(() => {
    return orgMembers.filter((user) => {
      const isSelf = String(user.id) === String(state?.user?.user_id);
      const isAlreadySelected = selected.some((s) => s.id === user.id);
      const isAlreadyInGroup = existingParticipantIds.has(String(user.id));
      return !isSelf && !isAlreadyInGroup && !isAlreadySelected;
    });
  }, [orgMembers, selected, existingParticipantIds, state?.user?.user_id]);

  const handleSelectUser = (user: User) => {
    if (selected.length >= MAX_NEW_MEMBERS) return;
    setSelected((prev) =>
      prev.length >= MAX_NEW_MEMBERS || prev.some((u) => u.id === user.id)
        ? prev
        : [...prev, user]
    );
    setSearch("");
  };

  const handleRemoveUser = (user: User) => {
    setSelected((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((i) => (i + 1 < filteredSuggested.length ? i + 1 : i));
    }
    if (e.key === "ArrowUp") {
      setHighlightIndex((i) => (i - 1 >= 0 ? i - 1 : 0));
    }
    if (e.key === "Enter") {
      const user = filteredSuggested[highlightIndex];
      if (user) handleSelectUser(user);
    }
  };

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const nearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 48;
    if (nearBottom && hasMore && !usersLoading) {
      loadMore();
    }
  };

  const refreshParticipants = async () => {
    if (!orgId || !channelId) return;
    const res = await GetRequest(
      `/organisations/${orgId}/dms/participants/${channelId}`
    );
    if (res?.status === 200 || res?.status === 201) {
      dispatch({
        type: ACTIONS.PARTICIPANTS,
        payload: res?.data?.data?.participants ?? [],
      });
    }
  };

  const handleAddMembers = async () => {
    if (
      !orgId ||
      !channelId ||
      selected.length === 0 ||
      selected.length > MAX_NEW_MEMBERS ||
      submittingRef.current
    )
      return;

    submittingRef.current = true;
    setSubmitLoading(true);
    try {
      const user_ids = selected.map((u) => u.id);
      const response = await PostRequest(
        `/organisations/group-dms/${channelId}/participants`,
        { user_ids }
      );

      if (response?.status === 200 || response?.status === 201) {
        showSuccess(response?.data?.message || "Members added");
        dispatch({
          type: ACTIONS.GROUP_CALLBACK,
          payload: !state?.groupCallback,
        });
        await refreshParticipants();
        setSelected([]);
        setSearch("");
        onClose();
      } else {
        showError(
          response?.data?.message || "Failed to add members. Please try again."
        );
      }
    } catch {
      showError("Failed to add members. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-[400px] md:w-[547px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold mb-4">Add members</h2>
          <p className="text-sm mb-4">
            Find people in your organisation and add them to this group
            conversation
          </p>
        </div>

        <div className="px-6 py-6">
          <CombinedInviteInput
            selected={selected}
            onKeyDown={handleKeyNav}
            onRemove={handleRemoveUser}
            search={search}
            onSearchChange={setSearch}
          />
          {selected.length >= MAX_NEW_MEMBERS && (
            <p className="mt-2 text-sm text-[#667085]" role="status">
              You can add up to 9 people at a time.
            </p>
          )}

          <div className="flex gap-6 border-b mb-3 pt-4">
            <button
              type="button"
              className="pb-2 border-b-2 border-[#5F5FE1] font-medium"
            >
              Suggested
            </button>
          </div>

          <div
            className="max-h-[260px] overflow-y-auto pr-2"
            onScroll={handleListScroll}
          >
            {usersLoading && filteredSuggested.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 gap-3">
                <Loading color="#5F5FE1" />
                <p className="text-sm">
                  {search.trim() ? "Searching members…" : "Loading members…"}
                </p>
              </div>
            ) : filteredSuggested.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
                <p className="text-sm">
                  {search.trim()
                    ? "No members found"
                    : hasMore
                      ? "Loading more members…"
                      : "No new suggestion available"}
                </p>
              </div>
            ) : (
              filteredSuggested.map((user, index) => (
                <UserItem
                  key={user.id}
                  user={user}
                  onClick={() => handleSelectUser(user)}
                  active={index === highlightIndex}
                />
              ))
            )}
            {usersLoading && filteredSuggested.length > 0 && (
              <div className="flex justify-center py-3">
                <Loading color="#5F5FE1" />
              </div>
            )}
            {!usersLoading && hasMore && filteredSuggested.length > 0 && (
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  className="text-sm text-[#5F5FE1] font-medium hover:underline"
                  onClick={() => loadMore()}
                >
                  Load more
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              type="button"
              className={`flex items-center gap-3 px-4 py-2 ${
                selected.length === 0
                  ? "bg-gray-300 text-black cursor-not-allowed"
                  : "bg-[#5F5FE1] text-white"
              } rounded-md`}
              disabled={selected.length === 0 || submitLoading}
              onClick={handleAddMembers}
            >
              {submitLoading && <Loading />}
              Add members
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
