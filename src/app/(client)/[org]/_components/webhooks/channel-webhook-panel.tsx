"use client";

import { useMemo, useState, useContext } from "react";
import Link from "next/link";
import moment from "moment";
import {
  CheckCircle2,
  Copy,
  Hash,
  History,
  Link2,
  Trash2,
  Webhook,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import Loading from "~/components/ui/loading";
import { cn } from "~/lib/utils";
import { useChannelWebhook } from "~/hooks/useChannelWebhook";
import { CopyToClipboardWithTooltip } from "../copy-to-clipboard";
import DeleteWebhookModal from "./delete-webhook-modal";
import { DataContext } from "~/store/GlobalState";

interface ChannelWebhookPanelProps {
  channelId: string;
  channelName: string;
  variant?: "full" | "compact";
}

export default function ChannelWebhookPanel({
  channelId,
  channelName,
  variant = "full",
}: ChannelWebhookPanelProps) {
  const { state } = useContext(DataContext);
  const { orgSlug } = state;

  const {
    webhook,
    loading,
    actionLoading,
    createWebhook,
    changeStatus,
    deleteWebhook,
  } = useChannelWebhook(channelId);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [webhookNameInput, setWebhookNameInput] = useState("");

  const historyHref = `/${orgSlug}/home/channels/${channelId}/settings/history`;

  const isActive = webhook?.status === "active";

  const statusLabel = useMemo(() => {
    if (!webhook) return "Not configured";
    return isActive ? "Active" : "Inactive";
  }, [webhook, isActive]);

  const handleCopyUrl = async () => {
    if (!webhook?.webhook_url) return;
    await navigator.clipboard.writeText(webhook.webhook_url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleToggleStatus = async (checked: boolean) => {
    await changeStatus(checked ? "active" : "inactive");
  };

  const handleCreate = async () => {
    const name =
      webhookNameInput.trim() ||
      `${channelName.replace(/^#/, "").trim()}'s webhook`;
    await createWebhook({ webhook_name: name });
    setWebhookNameInput("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading color="#5757CD" height="32px" width="32px" />
      </div>
    );
  }

  if (!webhook) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#E6EAEF] bg-white",
          variant === "compact" ? "p-5" : "p-8 lg:p-10"
        )}
      >
        <div className="flex flex-col items-center text-center max-w-lg mx-auto gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#5757CD]">
            <Webhook className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#101828]">
              No webhook for #{channelName}
            </h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Create a webhook to send messages into this channel from external
              tools. Each channel can have its own incoming endpoint.
            </p>
          </div>
          <div className="w-full space-y-3 text-left">
            <label
              htmlFor="webhook-name"
              className="text-sm font-medium text-[#344054]"
            >
              Webhook name (optional)
            </label>
            <Input
              id="webhook-name"
              placeholder={`${channelName}'s webhook`}
              value={webhookNameInput}
              onChange={(e) => setWebhookNameInput(e.target.value)}
              className="bg-white border-[#D0D5DD]"
            />
          </div>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={actionLoading}
            className="bg-[#5757CD] hover:bg-[#4545B0] text-white px-8 h-11 rounded-lg font-semibold"
          >
            {actionLoading ? (
              <Loading color="white" height="18px" width="18px" />
            ) : (
              "Create webhook"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", variant === "compact" && "space-y-4")}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Created",
            value: moment(webhook.created_at).format("MMM D, YYYY"),
          },
          {
            label: "Last updated",
            value: moment(webhook.updated_at).format("MMM D, YYYY"),
          },
          {
            label: "Slug",
            value: webhook.webhook_slug,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#E6EAEF] bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#667085] mb-1">
              {stat.label}
            </p>
            <p className="text-sm text-[#101828] truncate" title={stat.value}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E6EAEF] bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#E6EAEF] flex items-center justify-between gap-4 bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-[#5757CD]" />
            <h3 className="font-bold text-[#101828]">Webhook URL</h3>
          </div>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5757CD] hover:text-[#4545B0]"
          >
            {copiedUrl ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy URL
              </>
            )}
          </button>
        </div>
        <div className="p-5">
          <CopyToClipboardWithTooltip
            textToCopy={webhook.webhook_url}
            label="Copy webhook URL"
          >
            <code className="block w-full break-all rounded-xl bg-[#F2F4F7] border border-[#E6EAEF] px-4 py-3 text-sm text-[#344054] font-mono cursor-pointer hover:border-[#5757CD]/40 transition-colors">
              {webhook.webhook_url}
            </code>
          </CopyToClipboardWithTooltip>
          {webhook.event_name ? (
            <p className="mt-3 text-sm text-[#667085]">
              Event:{" "}
              <span className="font-medium text-[#344054]">
                {webhook.event_name}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6EAEF] bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-[#101828]">Webhook enabled</h3>
          <p className="text-sm text-[#667085] mt-0.5">
            When disabled, incoming requests to this URL are rejected.
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={handleToggleStatus}
          disabled={actionLoading}
        />
      </div>

      <div className="rounded-2xl border border-[#E6EAEF] bg-[#F9FAFB] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E6EAEF] text-[#5757CD]">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#101828]">Delivery history</h3>
            <p className="text-sm text-[#667085] mt-0.5">
              View webhook attempts, status codes, and retries for this channel.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-[#5757CD] hover:bg-[#4545B0] text-white shrink-0"
        >
          <Link href={historyHref}>View delivery history</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setDeleteOpen(true)}
          disabled={actionLoading}
          className="border-[#FECDCA] text-[#B42318] hover:bg-[#FEF3F2]"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete webhook
        </Button>
      </div>

      <DeleteWebhookModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        webhookName={webhook.webhook_name}
        isLoading={actionLoading}
        onConfirm={deleteWebhook}
      />
    </div>
  );
}
