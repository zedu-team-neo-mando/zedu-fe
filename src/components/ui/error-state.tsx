"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type ErrorStateVariant =
  | "not-found"
  | "no-access"
  | "network"
  | "unexpected";

const SUPPORT_EMAIL = "support@zedu.chat";

const COPY: Record<ErrorStateVariant, { title: string; description: string }> =
  {
    "not-found": {
      title: "Page not found",
      description:
        "This link is broken, or the page or workspace it points to no longer exists.",
    },
    "no-access": {
      title: "You don't have access",
      description:
        "You aren't a member of this workspace or channel. Ask an admin to invite you.",
    },
    network: {
      title: "We couldn't reach Zedu",
      description:
        "Check your internet connection and try again. If the problem continues, our servers may be having trouble.",
    },
    unexpected: {
      title: "Something went wrong",
      description:
        "An unexpected error stopped this page from loading. Go back to your workspaces and try again.",
    },
  };

/** Statuses from a failed request mapped to the error screen that explains them. */
export const errorVariantFromStatus = (status?: number): ErrorStateVariant => {
  if (status === 404 || status === 400) return "not-found";
  if (status === 403) return "no-access";
  return "network";
};

const workspacesHref = () => {
  if (typeof window === "undefined") return "/client";
  const orgSlug = localStorage.getItem("orgSlug");
  return orgSlug && orgSlug !== "undefined" ? `/${orgSlug}` : "/client";
};

interface ErrorStateProps {
  variant: ErrorStateVariant;
  /** Only used by the network variant; defaults to reloading the page. */
  onRetry?: () => void;
  /** Overrides the variant's default copy, e.g. "Channel not found". */
  title?: string;
  description?: string;
  /** In-app primary action shown instead of "Go to my workspaces". */
  action?: { label: string; href: string };
  className?: string;
}

const ErrorState = ({
  variant,
  onRetry,
  title,
  description,
  action,
  className,
}: ErrorStateProps) => {
  const router = useRouter();
  const copy = COPY[variant];

  const handleRetry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  // Full navigation so a crashed or half-initialised app state is discarded.
  const goToWorkspaces = () => {
    window.location.href = workspacesHref();
  };

  return (
    <div
      role="alert"
      className={cn(
        "w-full min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center",
        className
      )}
    >
      <Image
        src="/images/error-img.svg"
        height="100"
        width="400"
        alt=""
        className="w-60 h-40"
      />
      <h1 className="text-xl font-semibold leading-6 text-slate-700">
        {title ?? copy.title}
      </h1>
      <p className="max-w-md text-sm leading-5 text-slate-600">
        {description ?? copy.description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        {variant === "network" && (
          <Button onClick={handleRetry} variant="outline">
            Retry
          </Button>
        )}
        <Button
          onClick={action ? () => router.push(action.href) : goToWorkspaces}
          className="bg-primary-500 text-white hover:bg-primary-500/90"
        >
          {action?.label ?? "Go to my workspaces"}
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        Still stuck?{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-primary-500 underline"
        >
          Contact support
        </a>
      </p>
    </div>
  );
};

export default ErrorState;
