"use client";

import { Hash, Users, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import ChannelsTab from "../../_components/channels/tabs/channels-tab";
import PeopleTab from "../../_components/channels/tabs/peoples-tab";

type TabType = "people" | "channels" | "user_groups";

export default function DirectoriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("channels");

  useEffect(() => {
    localStorage.removeItem("channelName");
  }, []);

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#1A1D21] text-[#1d1c1d] dark:text-zinc-100 overflow-hidden border-none">
      <div className="flex-none px-5 pt-5 border-b border-gray-200 dark:border-white/10 overflow-hidden">
        <h1 className="text-[22px] font-black mb-5 text-[#1d1c1d] dark:text-zinc-100">
          Directories
        </h1>
        <div className="flex gap-8 text-[13px] font-medium text-gray-600 dark:text-zinc-400">
          <TabButton
            active={activeTab === "channels"}
            onClick={() => setActiveTab("channels")}
            icon={<Hash size={16} />}
            label="Channels"
          />
          <TabButton
            active={activeTab === "people"}
            onClick={() => setActiveTab("people")}
            icon={<Users size={16} />}
            label="People"
          />
          {/* <TabButton
            active={activeTab === "user_groups"}
            onClick={() => setActiveTab("user_groups")}
            icon={<UserPlus size={16} />}
            label="User Groups"
          /> */}
        </div>
      </div>

      {/* This container will contain the scroll locally IF content exists */}
      {activeTab === "channels" && <ChannelsTab />}

      {activeTab === "people" && <PeopleTab />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 pb-2.5 transition-all outline-none ${
        active
          ? "border-b-2 border-[#1264a3] text-black dark:text-zinc-100"
          : "hover:text-black dark:hover:text-zinc-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}
