"use client";

import Image from "next/image";
import { ExternalLink, Search, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { DataContext } from "~/store/GlobalState";
import { Member } from "~/types/people";
import images from "~/assets/images";
import { PostRequest } from "~/utils/new-request";
import { useRouter } from "next/navigation";
import { useOrganisationUsers } from "~/hooks/useOrganisationUsers";
import Tooltips from "~/app/(client)/[org]/_components/tooltip";

const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-lg overflow-hidden animate-pulse w-full">
    <div className="aspect-square bg-gray-200" />
    <div className="p-3 bg-white space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-50 rounded w-5/6" />
    </div>
  </div>
);

export default function PeopleTab() {
  const { state } = useContext(DataContext);
  const { channelloading, orgMembers, orgMembersTotal, orgSlug } = state;
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");

  const orgId =
    state.orgId ||
    (typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "");

  const { loading, hasMore, loadMore, totalItems, users, isSearching } =
    useOrganisationUsers(orgId, { search: searchInput });

  const members = (users as Member[]) || [];
  const memberTotal =
    totalItems ||
    (isSearching ? members.length : orgMembersTotal || orgMembers?.length) ||
    0;

  const handleRoute = async (data: any) => {
    localStorage.setItem("channelName", data?.name);

    const resolvedOrgId = localStorage.getItem("orgId") || "";

    const payload = {
      chat_type: data?.entity_type,
      participant_id: data?.id,
    };

    const res = await PostRequest(
      `/organisations/${resolvedOrgId}/dms`,
      payload
    );

    if (res?.status === 200 || res?.status === 201) {
      router.push(
        `/${orgSlug}/people/${res?.data?.data?.channel_id}/${res?.data?.data?.participant_id}`
      );
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const nearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 80;
    if (nearBottom && hasMore && !loading) {
      loadMore();
    }
  };

  if (channelloading || (!orgMembers && !isSearching)) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-5">
        {[...Array(12)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[78vh] p-5 pt-5 pb-0">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-gray-400 group-focus-within:text-black"
            />
          </div>
          <input
            type="text"
            placeholder="Search for people"
            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded focus:border-[#1264a3] focus:ring-1 focus:ring-blue-100 focus:outline-none text-[15px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-5" onScroll={handleScroll}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {members.length > 0 ? (
            members.map((user: Member, index: number) => {
              return (
                <div
                  key={user.id || index}
                  className="border border-gray-200 rounded-lg overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-shadow bg-white w-full min-w-0"
                  onClick={() => handleRoute(user)}
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <Image
                      src={
                        user.avatar_url ||
                        user.default_avatar_url ||
                        images?.user
                      }
                      alt={user.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 min-w-0">
                      <Tooltips text={user.name || ""}>
                        <span className="font-bold text-[15px] truncate">
                          {user.name}
                        </span>
                      </Tooltips>
                      <ExternalLink
                        size={12}
                        className="shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    {user.email && (
                      <Tooltips text={user.email}>
                        <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">
                          {user.email}
                        </p>
                      </Tooltips>
                    )}
                    {user.phone_number && (
                      <Tooltips text={user.phone_number}>
                        <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">
                          {user.phone_number}
                        </p>
                      </Tooltips>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          user.online ? "bg-green-500" : "bg-gray-300"
                        }`}
                        title={user.online ? "Online" : "Offline"}
                      />
                      <span className="text-[12px] text-gray-600">
                        {user.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 italic">
              {loading
                ? "Loading members…"
                : "No members found matching your search."}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center md:justify-between px-2 py-6 border-t border-gray-100 mt-6 flex-wrap gap-4">
          <span className="text-[13px] text-gray-500">
            Showing{" "}
            <span className="font-medium text-black">{members.length}</span> of{" "}
            <span className="font-medium text-black">{memberTotal}</span>{" "}
            members
          </span>
          {hasMore && (
            <button
              type="button"
              disabled={loading}
              onClick={() => loadMore()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-[13px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
