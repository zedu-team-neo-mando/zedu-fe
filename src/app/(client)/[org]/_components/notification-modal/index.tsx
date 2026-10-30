"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { GetRequest, PostRequest } from "~/utils/new-request";
import { useParams } from "next/navigation";
import Loading from "~/components/ui/loading";
import { DataContext } from "~/store/GlobalState";
import { NotificationPermissionHelp } from "~/app/(client)/[org]/_components/notification-permission-guidance";

export default function NotificationSettingsModal() {
  const [open, setOpen] = useState(false);
  const [notificationLevel, setNotificationLevel] = useState<
    "all" | "mentions" | "channels"
  >("all");
  const [threadReplies, setThreadReplies] = useState(false);
  const [muteChannel, setMuteChannel] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { state } = useContext(DataContext);
  const { channelDetails, orgSlug } = state;

  const params = useParams();
  const id = params.id as string;

  // Fetch user preferences on modal open
  useEffect(() => {
    const getNotification = async () => {
      const res = await GetRequest(
        `/channels/${id}/notification-preference?device_type=web`
      );
      if (res.status === 200 || res.status === 201) {
        const { at_channel, at_mentions, muted } = res.data.data;

        // Derive notification level from backend response
        if (at_channel && at_mentions) {
          setNotificationLevel("all");
        } else if (at_mentions && !at_channel) {
          setNotificationLevel("mentions");
        } else if (!at_mentions && at_channel) {
          setNotificationLevel("channels");
        } else {
          setNotificationLevel("channels");
        }

        setMuteChannel(!!muted);
        setThreadReplies(!!at_mentions);
      }
    };

    getNotification();
  }, [open, id]);

  const handleSave = async () => {
    setButtonLoading(true);

    const payload = {
      muted: muteChannel,
      at_mentions:
        notificationLevel === "all" || notificationLevel === "mentions",
      at_channel:
        notificationLevel === "all" || notificationLevel === "channels",
      device_type: "web",
    };

    await PostRequest(`/channels/${id}/notification-preference`, payload);
    setButtonLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="px-4 py-[10px] text-[15px] text-[#101828] hover:bg-[#F1F1FE] flex items-center justify-between cursor-pointer">
          Notification Settings
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-md px-6 py-5">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Notifications for #{channelDetails?.name}
          </DialogTitle>
          <button onClick={() => setOpen(false)}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <NotificationPermissionHelp />
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">
              Send a notification for
            </label>
            <RadioGroup
              value={notificationLevel}
              onValueChange={(val) =>
                setNotificationLevel(val as "all" | "mentions" | "channels")
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <label htmlFor="all" className="text-sm text-gray-700">
                  All new messages
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mentions" id="mentions" />
                <label htmlFor="mentions" className="text-sm text-gray-700">
                  Mentions
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="channels" id="channels" />
                <label htmlFor="channels" className="text-sm text-gray-700">
                  Channels
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 pt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="thread"
                checked={threadReplies}
                onCheckedChange={(v) => setThreadReplies(Boolean(v))}
              />
              <label htmlFor="thread" className="text-sm text-gray-700">
                Get notified about all thread replies in this channel
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mute"
                checked={muteChannel}
                onCheckedChange={(v) => setMuteChannel(Boolean(v))}
              />
              <label htmlFor="mute" className="text-sm text-gray-700">
                Mute channel
              </label>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-gray-500 mt-4 leading-tight">
          Note: You can set notification keywords and change your workspace-wide
          settings in your{" "}
          <Link
            href={`/${orgSlug}/settings/personal/notifications`}
            className="text-indigo-600 underline"
          >
            settings
          </Link>
          .
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            className="text-sm text-gray-700"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex gap-1 items-center bg-blue-500 text-white hover:bg-blue-700 text-sm"
            disabled={buttonLoading}
            onClick={handleSave}
          >
            Save Changes
            {buttonLoading && <Loading />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
