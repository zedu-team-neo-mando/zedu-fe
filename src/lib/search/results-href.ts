/** The search page's query parameter for the channel a search was made in. */
export const SEARCH_CHANNEL_PARAM = "in";

/**
 * The full search results page for a query. With a channel name, the page
 * opens with its In filter set to that channel, so a search made inside a
 * channel stays in that channel.
 */
export function searchResultsHref(
  orgSlug: string,
  query: string,
  channelName?: string | null
): string {
  const params = new URLSearchParams({ query: query.trim() });
  const channel = channelName?.trim().replace(/^#/, "");
  if (channel) params.set(SEARCH_CHANNEL_PARAM, channel);
  return `/${orgSlug}/search?${params.toString()}`;
}
