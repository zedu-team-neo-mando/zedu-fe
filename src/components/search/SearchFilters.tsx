import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface SearchFiltersProps {
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (filters: {
    type?: "messages" | "people";
    from?: string;
    channel?: string;
    date?: { type: string; value: string };
    sortBy: string;
  }) => void;
  channels?: Array<{
    id?: string;
    channel_id?: string;
    name?: string;
    channel_name?: string;
  }>;
  users?: {
    id?: string;
    user_id?: string;
    name?: string;
    user_name?: string;
    username?: string;
    email?: string;
    avatar_url?: string;
    profile_url?: string;
  }[];
  /** Channel name the In filter starts with (a search made inside a channel). */
  initialChannel?: string;
}

type ChannelOption = {
  id: string;
  channel_id: string;
  name: string;
};

type UserOption = {
  id: string;
  name: string;
  avatar_url?: string;
};

export const SearchFilters = ({
  onFilterChange,
  channels = [],
  users = [],
  initialChannel,
}: SearchFiltersProps) => {
  const [selectedType, setSelectedType] = useState<
    "messages" | "people" | null
  >("messages");
  const [selectedFrom, setSelectedFrom] = useState<UserOption | null>(null);
  // The filter sends the channel's name, so the name alone is enough; the id
  // comes from the channel list when it has already loaded.
  const [selectedChannel, setSelectedChannel] = useState<ChannelOption | null>(
    () => {
      if (!initialChannel) return null;
      const match = channels.find(
        (channel) =>
          (channel.name || channel.channel_name || "").toLowerCase() ===
          initialChannel.toLowerCase()
      );
      const id = match?.channel_id || match?.id || initialChannel;
      return { id, channel_id: id, name: initialChannel };
    }
  );
  const [selectedDate, setSelectedDate] = useState<{
    type: string;
    value: string;
  } | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [channelSearch, setChannelSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "last_7_days" },
    { label: "Last 30 days", value: "last_30_days" },
    { label: "Last 12 months", value: "last_12_months" },
  ];

  const sortOptions = [
    { label: "Most relevant", value: "relevance" },
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
  ];

  const normalizedChannels: ChannelOption[] = channels.map((channel) => {
    const fallbackChannelId =
      (channel as { channels_id?: string }).channels_id ||
      (channel as { channel_slug?: string }).channel_slug ||
      "";

    return {
      id: channel.id || channel.channel_id || fallbackChannelId,
      channel_id: channel.channel_id || channel.id || fallbackChannelId,
      name: channel.name || channel.channel_name || "",
    };
  });

  const filteredChannels = normalizedChannels.filter((channel) =>
    channel.name.toLowerCase().includes(channelSearch.toLowerCase())
  );

  const availableChannels = selectedChannel
    ? filteredChannels.filter(
        (channel) => channel.channel_id !== selectedChannel.channel_id
      )
    : filteredChannels;

  const normalizedUsers: UserOption[] = users.map((user) => ({
    id: user.id || user.user_id || user.email || user.username || "",
    name: user.name || user.user_name || user.username || user.email || "",
    avatar_url: user.avatar_url || user.profile_url,
  }));

  const filteredUsers = normalizedUsers.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleTypeSelect = (type: "messages" | "people") => {
    setSelectedType(type);
    if (type === "people") {
      setSelectedFrom(null);
      setSelectedChannel(null);
      setSelectedDate(null);
      onFilterChange({
        type,
        from: undefined,
        channel: undefined,
        date: undefined,
        sortBy,
      });
    } else {
      onFilterChange({
        type,
        from: selectedFrom?.name,
        channel: selectedChannel?.name,
        date: selectedDate || undefined,
        sortBy,
      });
    }
  };

  const handleFromSelect = (user: UserOption) => {
    setSelectedFrom(user);
    onFilterChange({
      type: selectedType || undefined,
      from: user.name,
      channel: selectedChannel?.name,
      date: selectedDate || undefined,
      sortBy,
    });
  };

  const handleChannelSelect = (channel: ChannelOption) => {
    setSelectedChannel(channel);
    onFilterChange({
      type: selectedType || undefined,
      from: selectedFrom?.name,
      channel: channel.name,
      date: selectedDate || undefined,
      sortBy,
    });
  };

  const handleDateSelect = (type: string, value: string) => {
    const newDate = { type, value };
    setSelectedDate(newDate);
    onFilterChange({
      type: selectedType || undefined,
      from: selectedFrom?.name,
      channel: selectedChannel?.name,
      date: newDate,
      sortBy,
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange({
      type: selectedType || undefined,
      from: selectedFrom?.name,
      channel: selectedChannel?.name,
      date: selectedDate || undefined,
      sortBy: value,
    });
  };

  const removeFilter = (filterType: string) => {
    const newType = filterType === "type" ? null : selectedType;
    const newFrom = filterType === "from" ? null : selectedFrom;
    const newChannel = filterType === "channel" ? null : selectedChannel;
    const newDate = filterType === "date" ? null : selectedDate;
    if (filterType === "type") setSelectedType(null);
    if (filterType === "from") setSelectedFrom(null);
    if (filterType === "channel") setSelectedChannel(null);
    if (filterType === "date") setSelectedDate(null);
    onFilterChange({
      type: newType || undefined,
      from: newFrom?.name,
      channel: newChannel?.name,
      date: newDate || undefined,
      sortBy,
    });
  };
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      {/* Type Filter - Messages/People */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`h-9 border-gray-300 ${selectedType ? "bg-purple-50 border-purple-300" : ""}`}
          >
            {selectedType === "messages"
              ? "Messages"
              : selectedType === "people"
                ? "People"
                : "Messages"}
            <ChevronDown className="ml-2 h-4 w-4" />
            {selectedType && (
              <X
                className="ml-1 h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter("type");
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <button
            onClick={() => handleTypeSelect("messages")}
            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 rounded"
          >
            Messages
            {selectedType === "messages" && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </button>
          <button
            onClick={() => handleTypeSelect("people")}
            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 rounded"
          >
            People
            {selectedType === "people" && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </button>
        </PopoverContent>
      </Popover>

      {/* From Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`h-9 border-gray-300 ${selectedFrom ? "bg-purple-50 border-purple-300" : ""}`}
            disabled={selectedType === "people"}
          >
            {selectedFrom ? `From: ${selectedFrom.name}` : "From"}
            <ChevronDown className="ml-2 h-4 w-4" />
            {selectedFrom && (
              <X
                className="ml-1 h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter("from");
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search name"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleFromSelect(user)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 text-left truncate">{user.name}</span>
                  {selectedFrom?.id === user.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400 px-3 py-2">No users found</p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* In (Channel) Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`h-9 border-gray-300 ${selectedChannel ? "bg-purple-50 border-purple-300" : ""}`}
            disabled={selectedType === "people"}
          >
            {selectedChannel ? `In: #${selectedChannel.name}` : "In"}
            <ChevronDown className="ml-2 h-4 w-4" />
            {selectedChannel && (
              <X
                className="ml-1 size-3"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter("channel");
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="e.g. #general"
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {availableChannels.length > 0 ? (
              availableChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  <span className="text-gray-400">#</span>
                  <span className="flex-1 text-left truncate">
                    {channel.name}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400 px-3 py-2">
                No channels found
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`h-9 border-gray-300 ${selectedDate ? "bg-purple-50 border-purple-300" : ""}`}
            disabled={selectedType === "people"}
          >
            {selectedDate ? selectedDate.type : "Date"}
            <ChevronDown className="ml-2 h-4 w-4" />
            {selectedDate && (
              <X
                className="ml-1 h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter("date");
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          {dateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDateSelect(option.label, option.value)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              {option.label}
              {selectedDate?.value === option.value && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Sort By */}
      <div className="ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-9 text-sm text-gray-600">
              Sort:{" "}
              {sortOptions?.find((opt) => opt.value === sortBy)?.label ||
                sortBy}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                {option.label}
                {sortBy === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
