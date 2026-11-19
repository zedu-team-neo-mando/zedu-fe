"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  GitPullRequest,
  FileCheck2,
  Search,
  Eye,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  AgentRole,
  WorkflowState,
  ROLE_CONFIG,
  getRoleChecklist,
} from "~/lib/task-checklist";

export interface AssignedTaskNextActionChecklistProps {
  taskId?: string;
  taskTitle?: string;
  initialRole?: AgentRole;
  workflowState?: WorkflowState;
  deliverBy?: string; // ISO string or relative time
  isOwnerTask?: boolean; // When true, owner-independence excludes self-review
  className?: string;
}

const ROLE_ICONS: Record<
  AgentRole,
  React.ComponentType<{ className?: string }>
> = {
  contributor: GitPullRequest,
  reviewer: FileCheck2,
  triager: Search,
  observer: Eye,
};

export const AssignedTaskNextActionChecklist: React.FC<
  AssignedTaskNextActionChecklistProps
> = ({
  taskId,
  taskTitle,
  initialRole = "contributor",
  workflowState = "in_progress",
  deliverBy = "3 hours",
  isOwnerTask = false,
  className = "",
}) => {
  const [activeRole, setActiveRole] = useState<AgentRole>(initialRole);
  const [isExpanded, setIsExpanded] = useState(true);

  const roleMeta = ROLE_CONFIG[activeRole];
  const IconComponent = ROLE_ICONS[activeRole];
  const items = getRoleChecklist(activeRole, workflowState, isOwnerTask);

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden text-gray-900 ${className}`}
      data-testid="next-action-checklist"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/75 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <IconComponent className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Next-Action Checklist
              </span>
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 font-medium ${roleMeta.badgeColor}`}
              >
                {roleMeta.title}
              </Badge>
            </div>
            {taskTitle && (
              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                {taskTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {deliverBy && (
            <div
              className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200"
              data-testid="deadline-pill"
            >
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Due: {deliverBy}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-800"
            aria-label={isExpanded ? "Collapse checklist" : "Expand checklist"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Role Navigation Pills */}
      <div className="flex border-b border-gray-100 bg-white px-4 py-2 gap-1 overflow-x-auto">
        {(Object.keys(ROLE_CONFIG) as AgentRole[]).map((r) => {
          const isSelected = r === activeRole;
          return (
            <button
              key={r}
              onClick={() => setActiveRole(r)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              data-testid={`role-tab-${r}`}
            >
              {ROLE_CONFIG[r].title}
            </button>
          );
        })}
      </div>

      {/* Body content */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* Role guidance note */}
          <p className="text-xs text-gray-500">{roleMeta.description}</p>

          {/* Owner independence banner when applicable */}
          {activeRole === "reviewer" && isOwnerTask && (
            <div
              className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/70 p-3 text-xs text-red-900"
              data-testid="owner-independence-banner"
            >
              <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">
                  Owner-Independence Restriction
                </p>
                <p className="mt-0.5 text-red-700">
                  Agents owned by the claim holder cannot review tasks filed or
                  claimed by the same owner. Independent reviewers must evaluate
                  this fix.
                </p>
              </div>
            </div>
          )}

          {/* Checklist Items */}
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                  item.completed
                    ? "border-emerald-200 bg-emerald-50/40 text-gray-700"
                    : item.actionRequired
                      ? "border-purple-200 bg-purple-50/30 text-gray-900"
                      : "border-gray-100 bg-gray-50/50 text-gray-600"
                }`}
                data-testid={`checklist-item-${item.id}`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : item.actionRequired ? (
                    <div className="h-4 w-4 rounded-full border-2 border-purple-600 bg-white" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300 bg-gray-100" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-medium ${
                        item.completed
                          ? "text-emerald-900 line-through decoration-emerald-500/50"
                          : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.actionRequired && !item.completed && (
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 uppercase tracking-wider">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>

                  {item.disabledReason && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-700 font-medium">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                      <span>{item.disabledReason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Safety reminder */}
          <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-400 border-t border-gray-100">
            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            <span>
              Actions reflect current agent permissions. Checklist items are
              visual guidance and do not automatically submit bids or merge
              fixes.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedTaskNextActionChecklist;
