import React, { useEffect, useRef, useState } from "react";
import { useInChatView } from "~/hooks/use-in-chat-view";

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
}

interface MediaItem {
  id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  file_link: string;
}

const previewCache = new Map<string, LinkPreview | null>();
const inFlightPreviews = new Map<string, Promise<LinkPreview | null>>();

const cacheKeyForUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return url;
  }
};

const assemblePreviews = (urls: string[]): LinkPreview[] => {
  const seen = new Set<string>();
  const previews: LinkPreview[] = [];

  for (const url of urls) {
    const key = cacheKeyForUrl(url);
    if (seen.has(key)) continue;

    const cached = previewCache.get(key);
    if (cached) {
      seen.add(key);
      previews.push(cached);
    }
  }

  return previews;
};

const previewsFromMessage = (message: string): LinkPreview[] =>
  assemblePreviews(extractLinks(message));

const getOrFetchLinkPreview = async (
  url: string
): Promise<LinkPreview | null> => {
  const key = cacheKeyForUrl(url);

  if (previewCache.has(key)) {
    return previewCache.get(key) ?? null;
  }

  const pending = inFlightPreviews.get(key);
  if (pending) {
    return pending;
  }

  const request = (async () => {
    try {
      const response = await fetch(
        `/api/link-preview?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        previewCache.set(key, null);
        return null;
      }

      const data: LinkPreview = await response.json();
      const preview = data.title ? data : null;
      previewCache.set(key, preview);
      return preview;
    } catch {
      return null;
    } finally {
      inFlightPreviews.delete(key);
    }
  })();

  inFlightPreviews.set(key, request);
  return request;
};

export const extractLinks = (text: string) => {
  const urlRegex =
    /((?:https?:\/\/|www\.)[^\s<"]+|\b\w+\.(?:com|co|ng|net|org|io|dev|ai|app|cc)\b)/gi;

  return Array.from(
    new Set(
      (text.match(urlRegex) || []).map((url) => {
        let cleanedUrl = url.replace(/['">,.;!]+$/, "");
        if (cleanedUrl.startsWith("www.")) {
          cleanedUrl = `http://${cleanedUrl}`;
        }
        return cleanedUrl;
      })
    )
  );
};

const PreviewLinks = ({
  item,
}: {
  item: { id?: string; message: string; media?: MediaItem[] };
}) => {
  const [previews, setPreviews] = useState<LinkPreview[]>(() =>
    previewsFromMessage(item.message)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInChatView(containerRef);

  useEffect(() => {
    const urls = extractLinks(item.message);
    if (urls.length === 0) {
      setPreviews([]);
      return;
    }

    setPreviews(assemblePreviews(urls));

    if (!isInView) return;

    const missingUrls = urls.filter(
      (url) => !previewCache.has(cacheKeyForUrl(url))
    );
    if (missingUrls.length === 0) return;

    let cancelled = false;

    void (async () => {
      await Promise.all(missingUrls.map((url) => getOrFetchLinkPreview(url)));
      if (cancelled) return;
      setPreviews(assemblePreviews(urls));
    })();

    return () => {
      cancelled = true;
    };
  }, [isInView, item.message]);

  return (
    <div ref={containerRef} className="contents">
      {previews.length > 0 ? (
        <div className="mt-2">
          {previews.map((preview, index) => (
            <a
              key={index}
              href={preview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border w-full rounded-md p-3 mb-2 hover:bg-gray-100 transition"
            >
              <div className="mb-2">
                <div className="text-sm font-semibold text-gray-800">
                  {preview.siteName}
                </div>
                <div className="text-blue-600 font-medium">{preview.title}</div>
                <div className="text-gray-600 text-sm">
                  {preview.description}
                </div>
              </div>

              {preview.image && (
                <img
                  src={preview.image}
                  alt={preview.title}
                  className="w-80 h-40 object-cover rounded-md mt-2"
                />
              )}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PreviewLinks;
