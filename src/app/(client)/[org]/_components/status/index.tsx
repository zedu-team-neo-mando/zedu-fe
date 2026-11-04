import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { X, Smile, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import EmojiPicker from "~/components/theme/themed-emoji-picker";
import data from "@emoji-mart/data";
import { PostRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";

type StatusPreset = {
  emoji: string;
  text: string;
  duration: string;
  section?: string;
};

const presets: StatusPreset[] = [
  {
    emoji: "📅",
    text: "In a meeting",
    duration: "1 hour",
  },
  {
    emoji: "🚗",
    text: "Commuting",
    duration: "30 minutes",
  },
  { emoji: "🤒", text: "Out sick", duration: "Today" },
  {
    emoji: "🌴",
    text: "Vacationing",
    duration: "Don’t clear",
  },
  {
    emoji: "🏡",
    text: "Working remotely",
    duration: "Today",
  },
  {
    emoji: "📅",
    text: "In a meeting",
    duration: "Based on your Google Calendar",
    section: "Automatically updates",
  },
];

const StatusModal = () => {
  const { state, dispatch } = useContext(DataContext);
  const { user, statusCallback, status, orgData } = state;

  const workspaceSection = `For ${orgData?.name || "your workspace"}`;

  const groupedPresets = useMemo(() => {
    return presets.reduce(
      (acc, preset) => {
        const section = preset.section || workspaceSection;
        if (!acc[section]) acc[section] = [];
        acc[section].push(preset);
        return acc;
      },
      {} as Record<string, StatusPreset[]>
    );
  }, [workspaceSection]);
  const [statusText, setStatusText] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [removeAfter, setRemoveAfter] = useState("Today");
  const [pauseNotifications, setPauseNotifications] = useState<boolean>(
    user?.pause_notification
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status) {
      setStatusText("");
      setEmoji("");
      setRemoveAfter("Today");
      setShowEmojiPicker(false);
      setPauseNotifications(user?.pause_notification);
    }

    if (statusCallback) {
      setStatusText("");
      setEmoji("");
    }

    const timer = setTimeout(() => {
      dispatch({ type: ACTIONS.STATUS_CALLBACK, payload: false });
    }, 2000);

    return () => clearTimeout(timer);
  }, [status, statusCallback, user?.pause_notification, dispatch]);

  const removeOptions = [
    "30 minutes",
    "1 hour",
    "Today",
    "This week",
    "dont-clear",
  ];

  const handleEmojiSelect = (emoji: any) => {
    setEmoji(emoji.native);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      icon: emoji,
      text: statusText,
      status_timeout: removeAfter,
      pause_notification: pauseNotifications,
      clear_status: false,
    };

    const res = await PostRequest("/profile/change-status", payload);
    if (res?.status === 200 || res?.status === 201) {
      dispatch({
        type: ACTIONS.PROFILE_CALLBACK,
        payload: !state?.profileCallback,
      });
      dispatch({ type: ACTIONS.STATUS, payload: false });
    }
    setLoading(false);
  };

  //

  return (
    <Dialog
      open={status}
      onOpenChange={() => dispatch({ type: ACTIONS.STATUS, payload: false })}
    >
      <DialogContent className="max-w-[500px] rounded-lg px-0">
        <DialogHeader className="flex px-5 flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Set a status
          </DialogTitle>
          <DialogClose asChild>
            <button
              onClick={() => dispatch({ type: ACTIONS.STATUS, payload: false })}
            >
              <X size={20} className="text-[#667085] -mt-1.5" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="flex mx-5 items-center gap-2 border rounded px-3 py-2 mb-3">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <button className="text-2xl hover:opacity-80">
                {emoji || <Smile />}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full max-w-xs">
              <EmojiPicker data={data} onEmojiSelect={handleEmojiSelect} />
            </PopoverContent>
          </Popover>

          <input
            type="text"
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            placeholder="What's your status?"
            className="flex-1 border-0 focus:outline-none"
          />

          {(statusText || emoji) && (
            <button
              type="button"
              aria-label="Clear selected status"
              onClick={() => {
                setEmoji("");
                setStatusText("");
              }}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Show Suggestions when no status */}
        {!emoji && !statusText && (
          <div className="space-y-2 text-sm">
            {Object.entries(groupedPresets).map(([section, items]) => (
              <div key={section}>
                <p className="text-xs m-5 text-gray-500 my-3">{section}</p>
                <div>
                  {items.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setEmoji(item.emoji);
                        setStatusText(item.text);
                        setRemoveAfter(item.duration);
                      }}
                      className="flex items-center gap-3 px-5 py-2 rounded hover:bg-blue-500 hover:text-white rounded-none cursor-pointer"
                    >
                      <span className="flex gap-2 items-center">
                        <span>{item.emoji}</span>
                        <span>{item.text}</span>
                      </span>
                      <span>-</span>
                      <span className="text-xs text-gray-400">
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {(emoji || statusText) && (
          <div className="px-5">
            <label className="text-sm text-gray-700 block mb-1">
              Remove status after...
            </label>
            <div className="relative">
              <select
                value={removeAfter}
                onChange={(e) => setRemoveAfter(e.target.value)}
                className="w-full border rounded px-3 py-2 appearance-none focus:outline-none"
              >
                {removeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-5">
          <label className="flex items-center text-sm gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={pauseNotifications}
              onChange={() => setPauseNotifications((prev) => !prev)}
            />
            Pause notifications
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6 px-5">
          <Button
            variant="outline"
            className="h-9 border border-[#101828]/40"
            onClick={() => dispatch({ type: ACTIONS.STATUS, payload: false })}
          >
            Cancel
          </Button>

          <Button
            className="bg-blue-300 h-9 text-white px-7 d-flex items-center gap-2"
            disabled={!emoji && !statusText}
            onClick={handleSubmit}
          >
            Save {loading && <Loading />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
