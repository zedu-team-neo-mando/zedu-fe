"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  UserCheck,
  AlertCircle,
  Search,
  Filter,
  UserPlus,
  Sparkles,
  Inbox,
  CheckCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ReferralItem,
  ReferralStatus,
  formatRelativeTime,
} from "~/lib/referrals";

interface ReferralActivityTableProps {
  items: ReferralItem[];
  onAddInvite?: (email: string, name?: string) => void;
  onToggleEmptyState?: () => void;
  isEmptyView?: boolean;
}

export const ReferralActivityTable: React.FC<ReferralActivityTableProps> = ({
  items,
  onAddInvite,
  onToggleEmptyState,
  isEmptyView = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReferralStatus>(
    "all"
  );
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filteredItems = useMemo(() => {
    if (isEmptyView) return [];

    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter, isEmptyView]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) return;

    if (onAddInvite) {
      const namePart = newEmail.split("@")[0];
      const friendlyName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      onAddInvite(newEmail.trim(), friendlyName);
      setNewEmail("");
      setIsAdding(false);
    }
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case "active":
        return (
          <span
            data-testid="status-badge-active"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active</span>
          </span>
        );
      case "joined":
        return (
          <span
            data-testid="status-badge-joined"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 border border-primary-200/80"
          >
            <CheckCircle className="h-3 w-3 text-primary-500" />
            <span>Joined</span>
          </span>
        );
      case "pending":
      default:
        return (
          <span
            data-testid="status-badge-pending"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/80"
          >
            <Clock className="h-3 w-3 text-amber-500" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div
      data-testid="referral-activity-section"
      className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Table Header and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            <UserCheck className="h-3.5 w-3.5 text-primary-500" />
            <span>Live Referral Activity</span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Track your invited members
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Real-time status updates when invites sign up, complete onboarding,
            and become active.
          </p>
        </div>

        {/* Action Toggles for Testing & Quick Inviting */}
        <div className="flex flex-wrap items-center gap-2">
          {onToggleEmptyState && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-testid="toggle-empty-state-btn"
              onClick={onToggleEmptyState}
              className="text-xs border-neutral-300 text-neutral-600 hover:bg-neutral-100"
              aria-label="Toggle between empty and populated referral view"
            >
              {isEmptyView ? "Show Populated Demo" : "Simulate Empty State"}
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => setIsAdding((prev) => !prev)}
            className="bg-primary-500 hover:bg-primary-600 text-white text-xs gap-1.5"
            aria-label="Log or invite new member"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>{isAdding ? "Cancel" : "Add Invite"}</span>
          </Button>
        </div>
      </div>

      {/* Quick Add Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleQuickAdd}
          data-testid="quick-add-invite-form"
          className="mt-5 flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-primary-50/40 border border-primary-100 p-4"
        >
          <div className="relative flex-1 w-full">
            <Input
              type="email"
              required
              placeholder="teammate@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="h-10 text-xs bg-white"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-10 px-5 bg-primary-500 hover:bg-primary-600 text-white text-xs w-full sm:w-auto"
          >
            Send Invite & Track
          </Button>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search referral activity"
            className="h-9 pl-9 text-xs border-neutral-200 bg-neutral-50/50 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div
          role="radiogroup"
          aria-label="Filter referrals by status"
          className="flex flex-wrap items-center gap-1.5"
        >
          <button
            type="button"
            role="radio"
            aria-checked={statusFilter === "all"}
            data-testid="filter-all"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              statusFilter === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            All ({isEmptyView ? 0 : items.length})
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={statusFilter === "active"}
            data-testid="filter-active"
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              statusFilter === "active"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            Active (
            {isEmptyView
              ? 0
              : items.filter((i) => i.status === "active").length}
            )
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={statusFilter === "joined"}
            data-testid="filter-joined"
            onClick={() => setStatusFilter("joined")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              statusFilter === "joined"
                ? "bg-primary-600 text-white"
                : "bg-primary-50 text-primary-700 hover:bg-primary-100"
            }`}
          >
            Joined (
            {isEmptyView
              ? 0
              : items.filter((i) => i.status === "joined").length}
            )
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={statusFilter === "pending"}
            data-testid="filter-pending"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Pending (
            {isEmptyView
              ? 0
              : items.filter((i) => i.status === "pending").length}
            )
          </button>
        </div>
      </div>

      {/* Empty State View */}
      {filteredItems.length === 0 ? (
        <div
          data-testid="referral-empty-state"
          className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 py-12 px-4 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs border border-neutral-200/80">
            <Inbox className="h-7 w-7 text-neutral-400" />
          </div>
          <h3 className="mt-4 text-base font-bold text-neutral-900">
            No referral activity yet
          </h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm">
            {searchQuery || statusFilter !== "all"
              ? "No referrals match your current search or status filter. Try clearing your filters."
              : "Share your unique referral link to invite your first cohort member or collaborator and unlock milestone reward points!"}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-4 text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        /* Populated Table View */
        <div className="mt-4 overflow-x-auto">
          <table
            data-testid="referral-table"
            className="w-full text-left border-collapse"
            aria-label="Invited members list"
          >
            <thead>
              <tr className="border-b border-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <th scope="col" className="py-3.5 pl-2 pr-4">
                  Member
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Status
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Activity Timestamp
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-2">
                  Points Earned
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  data-testid={`referral-row-${item.id}`}
                  className="hover:bg-neutral-50/70 transition-colors"
                >
                  {/* Member Name and Email */}
                  <td className="py-3.5 pl-2 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            alt={`${item.name} avatar`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-xs text-neutral-600">
                            {item.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.role && (
                            <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                              {item.role}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          {item.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{formatRelativeTime(item.date)}</span>
                    </div>
                  </td>

                  {/* Points Earned */}
                  <td className="py-3.5 px-4 pr-2 text-right whitespace-nowrap font-mono text-xs font-bold">
                    {item.points > 0 ? (
                      <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60 inline-flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-amber-500" />+
                        {item.points} pts
                      </span>
                    ) : (
                      <span className="text-neutral-400 font-normal">
                        0 pts
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
