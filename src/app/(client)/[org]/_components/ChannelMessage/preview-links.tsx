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

const previewCache = new Map<string, LinkPreview[]>();

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
  const [previews, setPreviews] = useState<LinkPreview[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInChatView(containerRef);

  useEffect(() => {
    if (!isInView) return;

    const message = item.message;
    const urls = extractLinks(message);
    if (urls.length === 0) {
      setPreviews([]);
      return;
    }

    const cached = previewCache.get(message);
    if (cached) {
      setPreviews(cached);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const fetchPreview = async (url: string) => {
      try {
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`,
          { signal: controller.signal }
        );
        if (!response.ok) return null;
        const data: LinkPreview = await response.json();
        return data.title ? data : null;
      } catch {
        return null;
      }
    };

    const timeoutId = window.setTimeout(() => {
      const loadPreviews = async () => {
        const previewData = await Promise.all(urls.map(fetchPreview));
        if (cancelled) return;

        const uniquePreviews = Array.from(
          new Map(
            previewData
              .filter((p): p is LinkPreview => Boolean(p))
              .map((p) => [p.url, p])
          ).values()
        );

        previewCache.set(message, uniquePreviews);
        setPreviews(uniquePreviews);
      };

      void loadPreviews();
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
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
