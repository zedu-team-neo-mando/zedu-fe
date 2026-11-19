import { GetRequest } from "~/utils/new-request";
import { buildMessageSearchQuery } from "~/lib/search/query";
import type {
  MessageSearchFilters,
  MessageSearchPage,
  MessageSearchResult,
  SearchSortKey,
  UserSearchResult,
} from "~/lib/search/types";

type ApiResponse = {
  status?: number;
  response?: { status?: number };
  data?: {
    data?: unknown;
    pagination?: { current_page?: unknown; total_pages_count?: unknown };
  };
};

export const getResponseStatus = (response: unknown): number | undefined => {
  const value = response as ApiResponse;
  return value?.status ?? value?.response?.status;
};

export const isSuccessResponse = (response: unknown): boolean => {
  const status = getResponseStatus(response);
  return status === 200 || status === 201;
};

const normalizeSearchResults = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
};

/** Hits per request; also the backend's own default when neither is sent. */
export const MESSAGE_SEARCH_PAGE_SIZE = 20;

const SORT_KEYS: SearchSortKey[] = ["relevance", "newest", "oldest"];

/**
 * The API validates `sortby` against relevance | newest | oldest and answers
 * 400 for anything else, so an unknown value falls back instead of failing the
 * whole search.
 */
export const normalizeSortKey = (sortBy?: string): SearchSortKey => {
  const normalized = (sortBy || "").trim().toLowerCase();
  return SORT_KEYS.find((key) => key === normalized) ?? "relevance";
};

const toPageNumber = (value: unknown): number | undefined => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0
    ? Math.trunc(parsed)
    : undefined;
};

/**
 * One page of workspace search. The endpoint reads `sortby`, `page` and
 * `limit` (not `sortBy`), and answers with `data` holding that page's hits
 * and `pagination` holding `current_page` and `total_pages_count`.
 */
export async function searchMessagePage(
  orgId: string,
  baseQuery: string,
  filters: MessageSearchFilters = {},
  page = 1,
  limit = MESSAGE_SEARCH_PAGE_SIZE,
  options?: { channelName?: string }
): Promise<MessageSearchPage> {
  const resolvedPage = Math.max(1, Math.trunc(page) || 1);
  const resolvedLimit = Math.max(
    1,
    Math.trunc(limit) || MESSAGE_SEARCH_PAGE_SIZE
  );
  const query = buildMessageSearchQuery(baseQuery, filters, options);

  if (!orgId || !query.trim()) {
    return { results: [], currentPage: resolvedPage, totalPages: 0 };
  }

  const params = new URLSearchParams({
    query,
    sortby: normalizeSortKey(filters.sortBy),
    page: String(resolvedPage),
    limit: String(resolvedLimit),
  });

  const response = await GetRequest(
    `/search/organisation/${orgId}?${params.toString()}`
  );

  if (isSuccessResponse(response)) {
    const body = (response as ApiResponse).data;
    const results = normalizeSearchResults<MessageSearchResult>(body?.data);
    const pagination = body?.pagination;

    return {
      results,
      currentPage: toPageNumber(pagination?.current_page) ?? resolvedPage,
      totalPages:
        toPageNumber(pagination?.total_pages_count) ??
        (results.length > 0 ? resolvedPage : 0),
    };
  }

  const status = getResponseStatus(response);
  if (status === 404) {
    return { results: [], currentPage: resolvedPage, totalPages: 0 };
  }

  throw response;
}

/** The first page only, for callers that show a short list. */
export async function searchMessages(
  orgId: string,
  baseQuery: string,
  filters: MessageSearchFilters = {},
  options?: { channelName?: string }
): Promise<MessageSearchResult[]> {
  const firstPage = await searchMessagePage(
    orgId,
    baseQuery,
    filters,
    1,
    MESSAGE_SEARCH_PAGE_SIZE,
    options
  );

  return firstPage.results;
}

export async function searchChannelMessages(
  channelId: string,
  query: string,
  sortBy: MessageSearchFilters["sortBy"] = "relevance"
): Promise<MessageSearchResult[]> {
  const trimmed = query.trim();
  if (!channelId || !trimmed) {
    return [];
  }

  const params = new URLSearchParams({
    query: trimmed,
    sortby: normalizeSortKey(sortBy),
  });

  const response = await GetRequest(
    `/search/channel/${channelId}?${params.toString()}`
  );

  if (isSuccessResponse(response)) {
    return normalizeSearchResults<MessageSearchResult>(
      (response as ApiResponse).data?.data
    );
  }

  const status = getResponseStatus(response);
  if (status === 404) {
    return [];
  }

  throw response;
}

export async function searchUsers(
  orgId: string,
  query: string
): Promise<UserSearchResult[]> {
  const trimmedQuery = query.trim().toLowerCase();

  if (!orgId || !trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({ query: trimmedQuery });
  const response = await GetRequest(
    `/organisations/${orgId}/users/search?${params.toString()}`
  );

  if (isSuccessResponse(response)) {
    return normalizeSearchResults<UserSearchResult>(
      (response as ApiResponse).data?.data
    );
  }

  const status = getResponseStatus(response);
  if (status === 404) {
    return [];
  }

  throw response;
}
