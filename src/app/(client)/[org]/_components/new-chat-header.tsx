"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import Image from "next/image";
import { X } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import images from "~/assets/images";
import { useOrganisationUsers } from "~/hooks/useOrganisationUsers";
import Loading from "~/components/ui/loading";

export interface User {
  id: string;
  name: string;
  username: string;
  profile_url: string;
  avatar_url: string;
  default_avatar_url: string;
}

const UserRow = React.memo(function UserRow({
  user,
  index,
  highlighted,
  onSelect,
  onHover,
}: {
  user: User;
  index: number;
  highlighted: boolean;
  onSelect: (user: User) => void;
  onHover: (index: number) => void;
}) {
  return (
    <div
      data-row-index={index}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => onHover(index)}
      onClick={() => onSelect(user)}
      className={`flex items-center gap-[10px] px-4 py-[10px] hover:bg-[#F1F1FE] cursor-pointer ${
        highlighted ? "bg-[#F1F1FE]" : ""
      }`}
    >
      <Image
        src={user?.avatar_url || user?.default_avatar_url || images?.user}
        alt={user?.name}
        width={20}
        height={20}
        className="rounded-[5px] size-6 object-cover border"
      />
      <div className="flex items-center gap-[6px]">
        <span className="text-[#101828] text-sm font-semibold">
          {user?.name}
        </span>
        {user?.username && (
          <>
            <div className="w-1 h-1 rounded-full bg-[#E4E7EC]" />
            <span className="text-[14px] text-[#344054]">{user?.username}</span>
          </>
        )}
      </div>
    </div>
  );
});

const NewChatHeader = ({ onUsersSelected }: any) => {
  const { state } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  // Key repeat can outrun React renders; the ref keeps every press counted
  // even when several land between two renders.
  const highlightRef = useRef(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const orgId =
    state.orgId ||
    (typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "");

  const { users, loading, hasMore, loadMore } = useOrganisationUsers(orgId, {
    search: inputValue,
  });

  const filteredUsers = useMemo(() => {
    return ((users as User[]) || []).filter(
      (user) => !selectedUsers?.find((selected) => selected.id === user?.id)
    );
  }, [users, selectedUsers]);

  // The list shrinks when a user is picked and empties while the search
  // debounce is pending, so keep the keyboard highlight inside it.
  useEffect(() => {
    setHighlightIndex((prev) =>
      Math.min(prev, Math.max(filteredUsers.length - 1, 0))
    );
  }, [filteredUsers.length]);

  useEffect(() => {
    highlightRef.current = highlightIndex;

    // VS Code-style "minimal reveal": scroll only the list container (never
    // an ancestor), move just enough to bring the row into view, and animate
    // it — each new press retargets the same short ease instead of stacking
    // instant scrollIntoView jumps.
    const container = listRef.current;
    const row = container?.querySelector<HTMLElement>(
      `[data-row-index="${highlightIndex}"]`
    );
    if (!container || !row) return;

    const containerRect = container.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    let delta = 0;
    if (rowRect.top < containerRect.top) {
      delta = rowRect.top - containerRect.top;
    } else if (rowRect.bottom > containerRect.bottom) {
      delta = rowRect.bottom - containerRect.bottom;
    }
    if (delta === 0) return;

    const from = container.scrollTop;
    const to = Math.max(
      0,
      Math.min(from + delta, container.scrollHeight - container.clientHeight)
    );
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || Math.abs(to - from) < 2) {
      container.scrollTop = to;
      return;
    }

    const duration = 120;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      container.scrollTop = from + (to - from) * eased;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [highlightIndex]);

  useEffect(() => {
    onUsersSelected(selectedUsers);
  }, [selectedUsers, onUsersSelected]);

  const handleSearch = (search: string) => {
    setInputValue(search);
    highlightRef.current = 0;
    setHighlightIndex(0);
    if (!open) setOpen(true);
  };

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
    setInputValue("");
    highlightRef.current = 0;
    setHighlightIndex(0);
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  }, []);

  const handleHoverRow = useCallback((index: number) => {
    highlightRef.current = index;
    setHighlightIndex(index);
  }, []);

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user?.id !== userId));
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const nearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 48;
    if (nearBottom && hasMore && !loading) {
      loadMore();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }

      if (event.key === "ArrowDown") {
        const next = Math.max(
          Math.min(highlightRef.current + 1, filteredUsers.length - 1),
          0
        );
        highlightRef.current = next;
        setHighlightIndex(next);

        // Page more users in as the highlight reaches the last loaded row.
        if (
          filteredUsers.length > 0 &&
          next === filteredUsers.length - 1 &&
          hasMore &&
          !loading
        ) {
          loadMore();
        }
      } else {
        const next = Math.max(highlightRef.current - 1, 0);
        highlightRef.current = next;
        setHighlightIndex(next);
      }
      return;
    }

    if (!open) return;

    if (event.key === "Enter") {
      const user = filteredUsers[highlightRef.current];
      if (user) {
        event.preventDefault();
        handleSelectUser(user);
      }
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="p-5 border-b border-[#E6EAEF] shadow-[0px_3px_6px_0px_#DFDFDF]">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg text-[#1D2939] font-black">New Group Chat</h2>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[#344054]">With:</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              ref={triggerRef}
              className="flex-1 flex flex-wrap gap-2 items-center min-h-[40px] rounded-md px-2 cursor-text"
              onClick={() => {
                inputRef.current?.focus();
                setIsInputFocused(true);
                setOpen(true);
              }}
            >
              {isInputFocused ? (
                selectedUsers?.map((user) => (
                  <div
                    key={user?.id}
                    className="flex items-center gap-1 bg-[#F1F1FE] rounded-[3px] overflow-hidden"
                  >
                    <Image
                      src={
                        user?.avatar_url ||
                        user?.default_avatar_url ||
                        images?.user
                      }
                      alt={user?.name}
                      width={24}
                      height={24}
                      className="size-6 rounded-sm border object-cover"
                    />
                    <span className="text-sm font-semibold text-[#101828]">
                      {user?.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUser(user?.id);
                      }}
                      className="hover:bg-gray-200 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-[15px] text-[#344054] font-bold">
                  {selectedUsers.map((user) => user?.name).join(", ")}
                </span>
              )}
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => handleSearch(e.target.value)}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsInputFocused(true);
                }}
                onBlur={(e) => {
                  if (
                    popoverContentRef.current &&
                    !popoverContentRef.current.contains(e.relatedTarget)
                  ) {
                    setIsInputFocused(false);
                  }
                }}
                placeholder={
                  selectedUsers.length === 0
                    ? "#a-channel, @somebody, or somebody"
                    : ""
                }
                className="flex-1 outline-none text-[15px] placeholder:text-[#98A2B3] min-w-[200px]"
              />
            </div>
          </PopoverTrigger>

          <PopoverContent
            ref={popoverContentRef}
            className="p-0"
            align="start"
            sideOffset={5}
            style={{ width: triggerRef.current?.offsetWidth || "auto" }}
            onKeyDown={handleKeyDown}
            onInteractOutside={(e) => {
              if (inputRef.current?.contains(e.target as Node)) {
                e.preventDefault();
              }
            }}
          >
            <div
              ref={listRef}
              className="py-2 w-full max-h-[400px] overflow-auto"
              onScroll={handleListScroll}
            >
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <UserRow
                    key={user?.id}
                    user={user}
                    index={index}
                    highlighted={index === highlightIndex}
                    onSelect={handleSelectUser}
                    onHover={handleHoverRow}
                  />
                ))
              ) : (
                <div className="px-3 py-2 text-[#667085]">
                  {loading ? "Searching…" : "No users found"}
                </div>
              )}
              {loading && filteredUsers.length > 0 && (
                <div className="flex justify-center py-2">
                  <Loading />
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default NewChatHeader;
