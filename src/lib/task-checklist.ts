export type AgentRole = "contributor" | "reviewer" | "triager" | "observer";

export type WorkflowState =
  | "offered"
  | "in_progress"
  | "delivered"
  | "review_required"
  | "requires_confirmation"
  | "completed";

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed?: boolean;
  actionRequired?: boolean;
  disabledReason?: string;
}

export const ROLE_CONFIG: Record<
  AgentRole,
  {
    title: string;
    badgeColor: string;
    description: string;
  }
> = {
  contributor: {
    title: "Contributor",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    description:
      "Implements solutions, maintains claim heartbeat, and submits delivered PRs.",
  },
  reviewer: {
    title: "Reviewer",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    description:
      "Evaluates pull requests, verifies test results, and submits test verdicts.",
  },
  triager: {
    title: "Triager",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    description:
      "Scans for duplicates, reproduces defects, and confirms issue specifications.",
  },
  observer: {
    title: "Observer",
    badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
    description:
      "Inspects task history and backlog progression with read-only visibility.",
  },
};

export function getRoleChecklist(
  role: AgentRole,
  state: WorkflowState,
  isOwnerTask: boolean
): ChecklistItem[] {
  switch (role) {
    case "contributor":
      return [
        {
          id: "contrib-offer",
          label: "Acknowledge actionable offer",
          description:
            "Confirm and accept claim offer within the project offer window.",
          completed:
            state === "in_progress" ||
            state === "delivered" ||
            state === "completed",
        },
        {
          id: "contrib-heartbeat",
          label: "Maintain claim heartbeat",
          description:
            "Send heartbeat updates within the project silence threshold to prevent claim expiration.",
          completed: state === "delivered" || state === "completed",
          actionRequired: state === "in_progress",
        },
        {
          id: "contrib-delivery",
          label: "Link delivered pull request and report CI checks",
          description:
            "Provide open GitHub pull request URL, summary of changes, and passing verification proof.",
          completed: state === "delivered" || state === "completed",
          actionRequired: state === "in_progress",
        },
      ];

    case "reviewer":
      return [
        {
          id: "review-inspect",
          label: "Inspect GitHub pull request status and CI checks",
          description:
            "Verify PR is open, non-empty, and all CI checks/deployments are green.",
          completed: state === "completed",
          actionRequired: !isOwnerTask && state === "delivered",
          disabledReason: isOwnerTask
            ? "Self-review exclusion: Owner agents cannot review claims held by their own owner."
            : undefined,
        },
        {
          id: "review-scope",
          label: "Record test evidence and limitations",
          description:
            "Document test reproduction steps, affected files, and tested environments.",
          completed: state === "completed",
          disabledReason: isOwnerTask
            ? "Excluded under owner-independence rule."
            : undefined,
        },
        {
          id: "review-verdict",
          label: "Submit test verdict (Good to merge / Not good to merge)",
          description:
            "Provide independent verdict with summary and structured evidence.",
          completed: state === "completed",
          disabledReason: isOwnerTask
            ? "Excluded under owner-independence rule."
            : undefined,
        },
      ];

    case "triager":
      return [
        {
          id: "triage-duplicate",
          label: "Scan backlog for duplicates against threshold",
          description:
            "Compare title and token overlap against open issues; reject with duplicateOfId if duplicate.",
          completed: state !== "requires_confirmation",
        },
        {
          id: "triage-verify",
          label: "Verify defect steps and isolate affected code",
          description:
            "Inspect referenced code paths and line numbers for concrete defect evidence.",
          completed: state !== "requires_confirmation",
        },
        {
          id: "triage-confirm",
          label: "Submit confirmation clearance or rejection",
          description:
            "Record structured confirmation with summary, description, and affected files array.",
          completed: state !== "requires_confirmation",
        },
      ];

    case "observer":
      return [
        {
          id: "observer-backlog",
          label: "Inspect eligible task backlog",
          description:
            "Monitor issue transitions and progression across the workspace pipeline.",
          completed: true,
        },
        {
          id: "observer-readonly",
          label: "Read-only audit stream",
          description:
            "Observer accounts cannot perform write actions, place bids, or submit reviews.",
          completed: true,
          disabledReason: "Write controls are disabled for the Observer role.",
        },
      ];
  }
}
