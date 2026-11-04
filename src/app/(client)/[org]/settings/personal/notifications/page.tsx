"use client";

import React, { useEffect, useState } from "react";
import SettingsLabel from "../../components/settings-label";
import { GetRequest, PostRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import { NotificationPermissionHelp } from "~/app/(client)/[org]/_components/notification-permission-guidance";
import { buildTimeRange } from "./time-range";

type Preferences = {
  notificationType: "all" | "mentions" | "nothing";
  timeFrom: string;
  timeTo: string;
  infoMethod: "mobile" | "email";
};

const defaultPreferences: Preferences = {
  notificationType: "all",
  timeFrom: "00:00",
  timeTo: "00:00",
  infoMethod: "mobile",
};

const NotificationPage = () => {
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [initialPrefs, setInitialPrefs] =
    useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);

  const hasChanges = JSON.stringify(prefs) !== JSON.stringify(initialPrefs);

  useEffect(() => {
    const orgId = localStorage.getItem("orgId") || "";

    const fetchPreferences = async () => {
      setLoading(true);
      const res = await GetRequest(
        `/organisations/${orgId}/notification-preference?device_type=web`
      );
      if (res.status === 200 || res.status === 201) {
        const data = res.data.data;
        const [from, to] = data.time_range.split(" - ").map(convertTo24Hour);

        setPrefs({
          notificationType: getNotifyType(data.notify_about),
          timeFrom: from,
          timeTo: to,
          infoMethod: data.send_mail ? "email" : "mobile",
        });
        setInitialPrefs({
          notificationType: getNotifyType(data.notify_about),
          timeFrom: from,
          timeTo: to,
          infoMethod: data.send_mail ? "email" : "mobile",
        });
      }
      setLoading(false);
    };

    fetchPreferences();
  }, []);

  const getNotifyType = (
    notify_about: string
  ): Preferences["notificationType"] => {
    if (notify_about === "all_new_messages") return "all";
    if (notify_about === "mentions") return "mentions";
    return "nothing";
  };

  const convertTo24Hour = (time: string) => {
    const [t, suffix] = time.split(" ");
    let [h, m] = t.split(":").map(Number);
    if (suffix === "PM" && h !== 12) h += 12;
    if (suffix === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    const orgId = localStorage.getItem("orgId") || "";

    const timeRange = buildTimeRange(prefs.timeFrom, prefs.timeTo);
    if (timeRange === null) {
      setTimeError("Please set both the From and To times before saving.");
      return;
    }
    setTimeError(null);

    setSaving(true);

    const payload = {
      notify_about:
        prefs.notificationType === "all"
          ? "all_new_messages"
          : prefs.notificationType === "mentions"
            ? "mentions"
            : "nothing",
      send_mail: prefs.infoMethod === "email",
      time_range: timeRange,
      device_type: "web",
    };

    const res = await PostRequest(
      `/organisations/${orgId}/notification-preference?device_type=web`,
      payload
    );
    if (res.status === 200 || res.status === 201) {
      setInitialPrefs(prefs);
    }
    setSaving(false);
  };

  const handleRevert = () => {
    setPrefs(initialPrefs);
    setTimeError(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <NotificationPermissionHelp />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <SettingsLabel />
      <div className="p-4 lg:px-8">
        <NotificationPermissionHelp />
        <div className="mb-6">
          <h1 className="text-base font-semibold">
            Your Notification Preferences
          </h1>
          <p className="text-sm text-[#344054]">
            Manage when and why you get notified.
          </p>
        </div>

        {/* Notification Type */}
        <div className="max-w-2xl">
          <label className="block font-semibold text-sm mb-2">
            Send notifications for:
          </label>
          <div className="space-y-3">
            {["all", "mentions", "nothing"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="notificationType"
                  checked={prefs.notificationType === type}
                  onChange={() =>
                    setPrefs((prev) => ({
                      ...prev,
                      notificationType: type as Preferences["notificationType"],
                    }))
                  }
                />
                <span className="capitalize text-sm">
                  {type === "all" ? "All new messages" : type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="bg-[#E6EAEF] border my-4" />

        {/* Time Range */}
        <div className="max-w-2xl">
          <label className="block font-semibold text-sm mb-2">
            Receive notifications only within:
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-start gap-1 text-sm">
              <span className="font-medium">From</span>
              <input
                type="time"
                value={prefs.timeFrom}
                onChange={(e) => {
                  setTimeError(null);
                  setPrefs((prev) => ({ ...prev, timeFrom: e.target.value }));
                }}
                className="border rounded p-3"
              />
            </div>
            <div className="flex flex-col items-start gap-1 text-sm">
              <span className="font-medium">To</span>
              <input
                type="time"
                value={prefs.timeTo}
                onChange={(e) => {
                  setTimeError(null);
                  setPrefs((prev) => ({ ...prev, timeTo: e.target.value }));
                }}
                className="border rounded p-3"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-medium text-black">Note:</span> Outside this
            time, notifications are paused.
          </p>
          {timeError && (
            <p role="alert" className="text-xs text-red-600 mt-1">
              {timeError}
            </p>
          )}
        </div>

        <hr className="bg-[#E6EAEF] border my-4" />

        {/* Info Method */}
        <div className="mb-4 max-w-2xl">
          <label className="block font-semibold text-sm mb-2">
            To keep me informed:
          </label>
          <div className="space-y-2 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="infoMethod"
                checked={prefs.infoMethod === "mobile"}
                onChange={() =>
                  setPrefs((prev) => ({ ...prev, infoMethod: "mobile" }))
                }
              />
              <span>Use different settings for mobile devices</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="infoMethod"
                checked={prefs.infoMethod === "email"}
                onChange={() =>
                  setPrefs((prev) => ({ ...prev, infoMethod: "email" }))
                }
              />
              <span>Receive notifications via email</span>
            </label>
          </div>
        </div>

        {/* Save/Cancel */}
        {hasChanges && (
          <div className="flex justify-end space-x-3 pt-4 max-w-xl">
            <button
              onClick={handleRevert}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Revert Changes
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              {saving ? <Loading /> : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
