import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Clock, Hash, Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { DataContext } from "~/store/GlobalState";
import { searchMessages, searchUsers } from "~/lib/search/api";
import { openSearchMessageResult } from "~/lib/search/navigate";
import type { MessageSearchResult, UserSearchResult } from "~/lib/search/types";
import { formatSearchTimestamp, stripHtmlAndDecode } from "~/lib/search/format";
import { GetRequest, PostRequest } from "~/utils/new-request";
import UserAvatar from "~/components/layout/user-avatar";
import { DeactivationBadge } from "~/components/layout/deactivation-badge";

const RECENT_SEARCHES_KEY = "recentSearches";
const PREVIEW_LIMIT = 4;
const MIN_QUERY_LENGTH = 2;

interface SearchInputProps {
  name?: string;
  orgId?: string;
}

type PreviewItem =
  | { type: "message"; data: MessageSearchResult }
  | { type: "person"; data: UserSearchResult };

export const SearchInput = ({ name, orgId }: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [messagePreview, setMessagePreview] = useState<MessageSearchResult[]>(
    []
  );
  const [peoplePreview, setPeoplePreview] = useState<UserSearchResult[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  // Query whose preview has finished loading, so an empty result still
  // opens the panel and shows "No matches found".
  const [previewQuery, setPreviewQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRequestRef = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  const { state, dispatch } = useContext(DataContext);
  const { orgSlug, orgData } = state;

  const resolvedOrgId = orgId || orgData?.id || "";
  const isChannelView = /\/home\/channels\/[^/]+/.test(pathname);
  const channelName = isChannelView && name ? name : undefined;

  const previewItems: PreviewItem[] = [
    ...messagePreview.map((data) => ({ type: "message" as const, data })),
    ...peoplePreview.map((data) => ({ type: "person" as const, data })),
  ];

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!saved) return;

    try {
      setRecentSearches(JSON.parse(saved));
    } catch (error) {
      console.error("Failed to parse recent searches:", error);
    }
  }, []);

  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } else {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, [recentSearches]);

  // Clear search when leaving/entering a channel (or any route change).
  // SearchInput stays mounted in the topbar, so state would otherwise persist.
  useEffect(() => {
    setSearchQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    setMessagePreview([]);
    setPeoplePreview([]);
    setIsLoadingPreview(false);
    setPreviewQuery("");
    previewRequestRef.current += 1;
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!isOpen || !resolvedOrgId || trimmedQuery.length < MIN_QUERY_LENGTH) {
      setMessagePreview([]);
      setPeoplePreview([]);
      setIsLoadingPreview(false);
      setPreviewQuery("");
      return;
    }

    const requestId = ++previewRequestRef.current;

    const fetchPreview = async () => {
      setIsLoadingPreview(true);

      try {
        const [messages, people] = await Promise.all([
          searchMessages(
            resolvedOrgId,
            trimmedQuery,
            { sortBy: "relevance" },
            {
              channelName,
            }
          ),
          searchUsers(resolvedOrgId, trimmedQuery),
        ]);

        if (requestId !== previewRequestRef.current) return;

        setMessagePreview(messages.slice(0, PREVIEW_LIMIT));
        setPeoplePreview(people.slice(0, PREVIEW_LIMIT));
        setPreviewQuery(trimmedQuery);
        setActiveIndex(-1);
      } catch (error) {
        if (requestId !== previewRequestRef.current) return;
        console.error("Search preview failed:", error);
        setMessagePreview([]);
        setPeoplePreview([]);
      } finally {
        if (requestId === previewRequestRef.current) {
          setIsLoadingPreview(false);
        }
      }
    };

    fetchPreview();
  }, [debouncedQuery, isOpen, resolvedOrgId, channelName]);

  const saveRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches((prev) =>
      [
        trimmed,
        ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, 5)
    );
  }, []);

  const navigateToSearchResults = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || !orgSlug) return;

      saveRecentSearch(trimmed);
      router.push(`/${orgSlug}/search?query=${encodeURIComponent(trimmed)}`);
      setIsOpen(false);
      setActiveIndex(-1);
      setSearchQuery("");
    },
    [orgSlug, router, saveRecentSearch]
  );

  const openMessageResult = useCallback(
    async (result: MessageSearchResult) => {
      await openSearchMessageResult({
        result,
        orgSlug,
        orgId: resolvedOrgId,
        dms: state.dms,
        channels: state.channels,
        getDmParticipants: GetRequest,
        router,
        dispatch,
      });
      saveRecentSearch(searchQuery);
      setIsOpen(false);
      setSearchQuery("");
    },
    [
      dispatch,
      orgSlug,
      resolvedOrgId,
      router,
      saveRecentSearch,
      searchQuery,
      state.channels,
      state.dms,
    ]
  );

  const openPersonResult = useCallback(
    async (person: UserSearchResult) => {
      if (!resolvedOrgId) return;

      localStorage.setItem("channelName", person.username);
      saveRecentSearch(searchQuery);

      const response = await PostRequest(
        `/organisations/${resolvedOrgId}/dms`,
        {
          chat_type: "user",
          participant_id: person.id,
        }
      );

      if (response?.status === 200 || response?.status === 201) {
        router.push(
          `/${orgSlug}/home/people/${response?.data?.data?.channel_id}/${response?.data?.data?.participant_id}/dm`
        );
        setIsOpen(false);
        setSearchQuery("");
      }
    },
    [orgSlug, resolvedOrgId, router, saveRecentSearch, searchQuery]
  );

  const handlePreviewSelect = useCallback(
    async (item: PreviewItem) => {
      if (item.type === "message") {
        await openMessageResult(item.data);
        return;
      }

      await openPersonResult(item.data);
    },
    [openMessageResult, openPersonResult]
  );

  const handleSearch = (query: string) => {
    navigateToSearchResults(query);
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== search));
  };

  const showPreviewPanel =
    isOpen &&
    searchQuery.trim().length >= MIN_QUERY_LENGTH &&
    (isLoadingPreview ||
      previewItems.length > 0 ||
      previewQuery === searchQuery.trim());

  const showRecentPanel =
    isOpen &&
    searchQuery.trim().length < MIN_QUERY_LENGTH &&
    recentSearches.length > 0;

  return (
    <div
      ref={searchRef}
      className="w-full max-w-xl mx-auto p-2 md:p-4 relative"
    >
      <div className="flex items-center w-full bg-blue-300 rounded-md relative">
        <Search className="text-white mx-1 md:mx-2 shrink-0" size={19} />
        {channelName && (
          <div className="flex items-center justify-center px-2 py-1 my-2 rounded-md bg-white shrink-0">
            <Hash className="text-black" size={16} />
            <p className="text-sm text-black truncate max-w-[120px]">
              {channelName}
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={
            channelName
              ? `Search in #${channelName}`
              : "Search messages and people..."
          }
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (activeIndex >= 0 && previewItems[activeIndex]) {
                e.preventDefault();
                void handlePreviewSelect(previewItems[activeIndex]);
                return;
              }

              if (searchQuery.trim()) {
                handleSearch(searchQuery);
              }
              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) =>
                previewItems.length === 0
                  ? -1
                  : Math.min(prev + 1, previewItems.length - 1)
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((prev) => Math.max(prev - 1, -1));
            }
          }}
          className="bg-transparent text-white text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm placeholder-white/90 pl-1 md:pl-2 pr-2 md:pr-4 py-1.5 md:py-2 rounded-md focus:outline-none focus:ring-0 w-28 sm:w-48 md:w-64 lg:w-80"
        />
        {searchQuery ? (
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveIndex(-1);
            }}
            className="p-1 hover:bg-white/10 rounded mr-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-flex shrink-0 whitespace-nowrap items-center rounded border border-white/30 px-1.5 py-0.5 text-[10px] text-white/80 mr-2">
            Ctrl K
          </kbd>
        )}
      </div>

      {(showPreviewPanel || showRecentPanel) && (
        <div className="absolute top-full mt-2 w-[min(100%,32rem)] left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          {showRecentPanel && (
            <div className="p-3">
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                Recent Searches
              </div>
              {recentSearches.map((search) => (
                <div
                  key={search}
                  className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded group"
                >
                  <button
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-2 flex-1 text-sm text-left"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-black">{search}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(search);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                    aria-label={`Remove ${search}`}
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showPreviewPanel && (
            <div className="max-h-[28rem] overflow-y-auto">
              {isLoadingPreview ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              ) : (
                <>
                  {messagePreview.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                        Messages
                      </div>
                      {messagePreview.map((result, index) => {
                        const itemIndex = index;
                        const preview = stripHtmlAndDecode(
                          result.messages[0]?.message || ""
                        );
                        const isActive = activeIndex === itemIndex;

                        return (
                          <button
                            key={
                              result.messages[0]?.message_id ||
                              `message-${index}`
                            }
                            onClick={() => openMessageResult(result)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                              isActive
                                ? "bg-purple-50 dark:bg-white/10"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900 truncate">
                                {result.user.user_name}
                              </span>
                              <span className="text-xs text-gray-400 inline-flex items-center gap-1 ml-auto shrink-0">
                                <Hash className="h-3 w-3" />
                                {result.channel.channel_name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {preview}
                            </p>
                            {result.messages[0]?.timestamp && (
                              <p className="text-xs text-gray-400 mt-1">
                                {formatSearchTimestamp(
                                  result.messages[0].timestamp
                                )}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {peoplePreview.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                        People
                      </div>
                      {peoplePreview.map((person, index) => {
                        const itemIndex = messagePreview.length + index;
                        const isActive = activeIndex === itemIndex;
                        const avatar = person.profile_url || person.avatar_url;

                        return (
                          <button
                            key={person.id}
                            onClick={() => void openPersonResult(person)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                              isActive
                                ? "bg-purple-50 dark:bg-white/10"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                item={person}
                                src={avatar}
                                size="sidebar"
                                alt={person.name}
                                imageClassName="rounded-full"
                                className="rounded-full"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate inline-flex items-center gap-1.5">
                                  {person.name}
                                  <DeactivationBadge user={person} size="sm" />
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  @{person.username}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!isLoadingPreview && previewItems.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No matches found
                    </div>
                  )}

                  {searchQuery.trim() && (
                    <button
                      onClick={() => handleSearch(searchQuery)}
                      className="w-full border-t border-gray-100 px-4 py-3 text-sm font-medium text-[#5F5FE1] hover:bg-gray-50 text-left"
                    >
                      View all results for &quot;{searchQuery.trim()}&quot;
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
