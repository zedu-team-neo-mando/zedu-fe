"use client";

import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SearchCards } from "~/components/search/search-cards";
import { SearchCardsSkeleton } from "~/components/search/search-cards-skeleton";
import { SearchFilters } from "~/components/search/SearchFilters";
import { DataContext } from "~/store/GlobalState";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import { cn } from "~/lib/utils";
import { searchMessagePage, searchUsers } from "~/lib/search/api";
import { buildMessageSearchQuery } from "~/lib/search/query";
import { SEARCH_CHANNEL_PARAM } from "~/lib/search/results-href";
import type { MessageSearchResult, UserSearchResult } from "~/lib/search/types";

import { showError } from "~/components/toast/sonner";

type CombinedResult = MessageSearchResult | UserSearchResult;

const SearchPaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="icon"
    className={cn(
      "h-8 w-8",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 cursor-pointer hover:bg-primary-50" />
  </PaginationLink>
);

const SearchPaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="icon"
    className={cn(
      "h-8 w-8",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4 cursor-pointer hover:bg-primary-50" />
  </PaginationLink>
);

const SearchPaginationLink = ({
  className,
  isActive,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { isActive?: boolean }) => (
  <PaginationLink
    size="icon"
    className={cn(
      "h-8 w-8 cursor-pointer",
      isActive
        ? "bg-[#5F5FE1] text-white hover:bg-primary-300 hover:text-white"
        : "text-gray-700 hover:bg-gray-100",
      className
    )}
    isActive={isActive}
    {...props}
  />
);

const CARDS_PER_PAGE = 8;

export default function Search() {
  const searchParams = useSearchParams();
  const baseQuery = searchParams.get("query");
  // Set when the search was made from inside a channel (search-bar.tsx).
  const scopedChannel = searchParams.get(SEARCH_CHANNEL_PARAM) || undefined;
  const [results, setResults] = useState<CombinedResult[]>([]);
  const [messageResults, setMessageResults] = useState<MessageSearchResult[]>(
    []
  );
  const [messageTotalPages, setMessageTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "messages" as "messages" | "people" | undefined,
    from: undefined as string | undefined,
    channel: scopedChannel,
    date: undefined as { type: string; value: string } | undefined,
    sortBy: "relevance" as "relevance" | "newest" | "oldest" | string,
  });

  const { state } = useContext(DataContext);
  const { orgData, channels, orgMembers } = state;
  const [currentPage, setCurrentPage] = useState(1);
  const searchType = filters.type || "messages";
  const isMessageSearch = searchType === "messages";
  const lastCardIndex = currentPage * CARDS_PER_PAGE;
  const firstCardIndex = lastCardIndex - CARDS_PER_PAGE;
  // Message pages come from the API already page-sized; people are paged here.
  const currentCards: CombinedResult[] = isMessageSearch
    ? messageResults
    : results.slice(firstCardIndex, lastCardIndex);
  const totalPages = isMessageSearch
    ? messageTotalPages
    : Math.ceil(results.length / CARDS_PER_PAGE);
  const resultCount = isMessageSearch ? messageResults.length : results.length;
  const requestIdRef = useRef(0);

  const filterUsers = (orgMembers || []).map((member: any) => ({
    id: member.id || member.user_id || member.email || member.username || "",
    name: member.name || member.username || member.email || "",
    avatar_url: member.avatar_url || member.profile_url,
  }));

  const clearResults = useCallback(() => {
    setResults([]);
    setMessageResults([]);
    setMessageTotalPages(0);
  }, []);

  const fetchResults = useCallback(
    async (page: number) => {
      const requestId = ++requestIdRef.current;

      if (!baseQuery?.trim() || !orgData?.id) {
        clearResults();
        return;
      }

      setLoading(true);

      try {
        if (searchType === "messages") {
          const messagePage = await searchMessagePage(
            orgData.id,
            baseQuery,
            {
              from: filters.from,
              channel: filters.channel,
              date: filters.date,
              sortBy: filters.sortBy,
            },
            page,
            CARDS_PER_PAGE
          );

          if (requestId !== requestIdRef.current) return;

          setMessageResults(messagePage.results);
          setMessageTotalPages(messagePage.totalPages);
        } else {
          const userResults = await searchUsers(orgData.id, baseQuery);

          if (requestId !== requestIdRef.current) return;

          setResults(userResults);
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) return;

        console.error("Search failed:", error);
        showError("An error occurred while searching");
        clearResults();
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [
      baseQuery,
      orgData?.id,
      searchType,
      filters.from,
      filters.channel,
      filters.date,
      filters.sortBy,
      clearResults,
    ]
  );

  // A new search from another channel (or from outside one) while this page
  // is open starts again from that channel's scope. SearchFilters remounts
  // with the same key, so its chips match.
  const lastScopedChannel = useRef(scopedChannel);
  useEffect(() => {
    if (lastScopedChannel.current === scopedChannel) return;
    lastScopedChannel.current = scopedChannel;
    setResults([]);
    setFilters({
      type: "messages",
      from: undefined,
      channel: scopedChannel,
      date: undefined,
      sortBy: "relevance",
    });
    setCurrentPage(1);
  }, [scopedChannel]);

  useEffect(() => {
    if (baseQuery && orgData?.id) {
      setCurrentPage(1);
      void fetchResults(1);
    }
  }, [baseQuery, orgData?.id, fetchResults]);

  const goToPage = (page: number) => {
    if (page === currentPage) return;
    if (page < 1 || (totalPages > 0 && page > totalPages)) return;

    setCurrentPage(page);

    if (isMessageSearch) {
      void fetchResults(page);
    }
  };

  const handleFilterChange = (newFilters: {
    type?: "messages" | "people";
    from?: string;
    channel?: string;
    date?: { type: string; value: string };
    sortBy: "relevance" | "newest" | "oldest" | string;
  }) => {
    setResults([]);
    setFilters({
      type: newFilters.type || "messages",
      from: newFilters.from,
      channel: newFilters.channel,
      date: newFilters.date,
      sortBy: newFilters.sortBy,
    });
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  if (!baseQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-sm text-gray-500">
          Enter a search query to get started
        </p>
      </div>
    );
  }

  const resolvedQuery = buildMessageSearchQuery(baseQuery, filters);

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-zinc-950 w-full">
      <div className="w-full">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-6">
          Results for: &quot;{baseQuery}&quot;
        </h1>
        {resolvedQuery !== baseQuery.trim() && filters.type !== "people" && (
          <p className="text-sm text-gray-500 mb-4">
            Filtered query: <span className="font-mono">{resolvedQuery}</span>
          </p>
        )}

        <SearchFilters
          key={scopedChannel ?? ""}
          initialChannel={scopedChannel}
          onFilterChange={handleFilterChange}
          channels={channels || []}
          users={filterUsers}
        />

        {loading && (
          <div className="py-10">
            <SearchCardsSkeleton />
          </div>
        )}

        {!loading && resultCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-[28px] text-neutral-900 font-semibold dark:text-zinc-100">
              Couldn&apos;t find anything
            </p>
            <p className="text-lg text-neutral-600 text-center font-normal mt-2 dark:text-zinc-400">
              You may want to try adjusting your filters or searching
              <span className="block">with a different keyword.</span>
            </p>
          </div>
        ) : null}

        {!loading && resultCount > 0 && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                {resultCount} result{resultCount !== 1 ? "s" : ""}
              </p>
            </div>
            <SearchCards cardData={currentCards} query={baseQuery} />

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <SearchPaginationPrevious
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <SearchPaginationLink
                            onClick={() => goToPage(page as number)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </SearchPaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <SearchPaginationNext
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
