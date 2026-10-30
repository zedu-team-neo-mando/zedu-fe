export const buildWebhookUrl = (
  baseUrl: string,
  params: Record<string, unknown>
): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  return `${baseUrl}?${search.toString()}`;
};
